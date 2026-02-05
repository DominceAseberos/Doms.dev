import { supabase } from '@shared/lib/supabaseClient';

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

    /**
     * Get the first profile (used for single-user portfolio)
     * @returns {Promise<Object|null>} First profile object or null
     */
    getFirstProfile: async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .limit(1)
            .single();

        if (error) {
            // If no profile exists, return null instead of throwing
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        return data;
    },

    /**
     * Update the live feed status for a profile
     * @param {string} profileId - Profile ID to update
     * @param {string} status - New live status text
     * @returns {Promise<Object>} Updated profile object
     */
    updateLiveStatus: async (profileId, status) => {
        const { data, error } = await supabase
            .from('profiles')
            .update({ live_feed_status: status })
            .eq('id', profileId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
