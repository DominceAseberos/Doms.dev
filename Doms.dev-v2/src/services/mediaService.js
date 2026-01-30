import { supabase } from '../lib/supabaseClient';

export const mediaService = {
    async getFiles() {
        const buckets = ['project-images', 'avatars'];
        let allFiles = [];

        for (const bucket of buckets) {
            const { data, error } = await supabase.storage
                .from(bucket)
                .list('', {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'name', order: 'desc' },
                });

            if (data) {
                const filesWithUrls = data.map(file => {
                    const { data: { publicUrl } } = supabase.storage
                        .from(bucket)
                        .getPublicUrl(file.name);

                    return {
                        ...file,
                        url: publicUrl,
                        bucket: bucket, // Store bucket name for future operations
                        type: file.metadata?.mimetype?.startsWith('image/') ? 'image' : 'file'
                    };
                });
                allFiles = [...allFiles, ...filesWithUrls];
            }
        }

        // Sort merged list by created_at desc
        return allFiles.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
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

    async deleteFile(fileName, bucketName = 'project-images') {
        const { error } = await supabase.storage
            .from(bucketName)
            .remove([fileName]); // Remove from root

        if (error) throw error;
        return true;
    }
};

export default mediaService;
