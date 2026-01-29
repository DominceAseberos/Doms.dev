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

    resequenceProjects: async (targetProjectId, newOrder) => {
        // Fetch all projects ordered by display_order
        const { data: projects, error } = await supabase
            .from('projects')
            .select('id, display_order')
            .order('display_order', { ascending: true });

        if (error) throw error;

        // Separate the target project from others
        const otherProjects = projects.filter(p => p.id !== targetProjectId);

        // Split others into those before and after the new position
        // Since we want to insert at newOrder, we find the index
        // This logic assumes orders are 1, 2, 3...

        const updatedList = [];
        let orderTracker = 1;

        // Insert projects into the new list based on the new order
        for (let i = 0; i <= otherProjects.length; i++) {
            if (orderTracker === newOrder) {
                updatedList.push({ id: targetProjectId, display_order: orderTracker });
                orderTracker++;
            }
            if (i < otherProjects.length) {
                updatedList.push({ id: otherProjects[i].id, display_order: orderTracker });
                orderTracker++;
            }
        }

        // Handle case where newOrder > total projects
        if (newOrder >= orderTracker) {
            // Find if target is already in list
            if (!updatedList.some(p => p.id === targetProjectId)) {
                updatedList.push({ id: targetProjectId, display_order: orderTracker });
            }
        }

        // Perform batch update
        const updates = updatedList.map(p =>
            supabase.from('projects').update({ display_order: p.display_order }).eq('id', p.id)
        );

        await Promise.all(updates);
        return updatedList;
    },

    uploadProjectImage: async (file, fileName) => {
        const fileExt = file.name.split('.').pop();
        const filePath = `${fileName || Math.random()}.${fileExt}`;

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

        return publicUrl;
    },
};
