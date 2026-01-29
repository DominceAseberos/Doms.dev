import { supabase } from '../lib/supabaseClient';

export const mediaService = {
    async getFiles() {
        // We primarily use 'project-images' bucket for assets
        const { data, error } = await supabase.storage
            .from('project-images')
            .list('', { // List root instead of 'projects' folder
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'desc' },
            });

        if (error) throw error;

        // Map files to include public URLs
        const filesWithUrls = data.map(file => {
            const { data: { publicUrl } } = supabase.storage
                .from('project-images')
                .getPublicUrl(file.name); // Remove projects/ prefix

            return {
                ...file,
                url: publicUrl,
                type: file.metadata?.mimetype?.startsWith('image/') ? 'image' : 'file'
            };
        });

        return filesWithUrls;
    },

    async uploadFile(file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = fileName; // Upload to root

        const { error } = await supabase.storage
            .from('project-images')
            .upload(filePath, file, {
                cacheControl: '31536000',
                upsert: false,
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('project-images')
            .getPublicUrl(filePath);

        return { name: fileName, url: publicUrl };
    },

    async deleteFile(fileName) {
        const { error } = await supabase.storage
            .from('project-images')
            .remove([fileName]); // Remove from root

        if (error) throw error;
        return true;
    }
};

export default mediaService;
