import { supabase } from '@shared/lib/supabaseClient';

export const educationService = {
    getEducation: async () => {
        const { data, error } = await supabase
            .from('education')
            .select('*')
            .single();
        if (error) throw error;
        return data;
    },

    updateEducation: async (id, educationData) => {
        const { data, error } = await supabase
            .from('education')
            .update(educationData)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },
};
