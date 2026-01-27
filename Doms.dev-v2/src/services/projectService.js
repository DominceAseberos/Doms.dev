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
        // Shift existing projects
        const order = projectData.display_order || 999;
        await supabase.rpc('reorder_projects', {
            p_id: 'TEMP_NEW', // Placeholder for shift logic
            p_new_order: order
        });

        const { data, error } = await supabase
            .from('projects')
            .insert([projectData])
            .select()
            .single();
        if (error) throw error;

        // Clean up sequence
        await supabase.rpc('fix_project_sequence');
        return data;
    },

    updateProject: async (id, projectData) => {
        if (projectData.display_order !== undefined) {
            await supabase.rpc('reorder_projects', {
                p_id: id,
                p_new_order: projectData.display_order
            });
            // Sequence fix handles consolidation after shift
            await supabase.rpc('fix_project_sequence');
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

    fixProjectSequence: async () => {
        const { error } = await supabase.rpc('fix_project_sequence');
        if (error) throw error;
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
