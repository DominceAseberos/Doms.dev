import { supabase } from '../lib/supabaseClient';

export const projectService = {
    getProjects: async () => {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('display_order', { ascending: true });
        if (error) throw error;
        return data;
    },

    getProjectById: async (id) => {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    createProject: async (projectData) => {
        const { data, error } = await supabase
            .from('projects')
            .insert([projectData])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    updateProject: async (id, projectData) => {
        const { data, error } = await supabase
            .from('projects')
            .update(projectData)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    deleteProject: async (id) => {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    uploadProjectImage: async (file, fileName) => {
        const fileExt = file.name.split('.').pop();
        const filePath = `projects/${fileName || Math.random()}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('project-images')
            .upload(filePath, file, {
                cacheControl: '31536000',
                upsert: false,
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('project-images')
            .getPublicUrl(filePath);

        return publicUrl;
    },
};
