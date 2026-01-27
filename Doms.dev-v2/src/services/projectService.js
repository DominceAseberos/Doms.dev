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
        // Shift existing projects if needed
        if (projectData.display_order !== undefined) {
            await supabase.rpc('shift_project_orders', {
                new_order: projectData.display_order,
                project_id: null // null indicates a new project
            });
        }

        const { data, error } = await supabase
            .from('projects')
            .insert([projectData])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    updateProject: async (id, projectData) => {
        // If display_order is being updated, shift others
        if (projectData.display_order !== undefined) {
            const { data: current } = await supabase
                .from('projects')
                .select('display_order')
                .eq('id', id)
                .single();

            if (current && current.display_order !== projectData.display_order) {
                await supabase.rpc('shift_project_orders', {
                    new_order: projectData.display_order,
                    target_project_id: id
                });
            }
        }

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
