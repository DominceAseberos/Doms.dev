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
        const { error } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', id);
        if (error) throw error;
        return true;
    },
};
