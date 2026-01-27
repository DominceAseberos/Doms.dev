import { supabase } from '../lib/supabaseClient';

export const profileService = {
    getProfile: async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .single();
        if (error) throw error;
        return data;
    },

    updateProfile: async (id, profileData) => {
        const { data, error } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },
};
