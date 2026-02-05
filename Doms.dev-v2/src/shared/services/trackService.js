import { supabase } from '@shared/lib/supabaseClient';

/**
 * Service for managing music track operations.
 * Centralizes all database queries related to the tracks table.
 */
export const trackService = {
    /**
     * Fetch all tracks ordered by display order
     * @returns {Promise<Array>} Array of track objects
     */
    getTracks: async () => {
        const { data, error } = await supabase
            .from('tracks')
            .select('*')
            .order('display_order');

        if (error) throw error;
        return data || [];
    },

    /**
     * Fetch tracks grouped by category
     * @returns {Promise<Object>} Object with categories as keys and arrays of tracks as values
     */
    getTracksByCategory: async () => {
        const tracks = await trackService.getTracks();

        const trackList = {};
        tracks.forEach(track => {
            if (!trackList[track.category]) {
                trackList[track.category] = [];
            }
            trackList[track.category].push({
                id: track.id,
                imgSrc: track.img_src
            });
        });

        return trackList;
    }
};
