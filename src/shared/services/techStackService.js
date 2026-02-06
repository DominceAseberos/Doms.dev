import { supabase } from '@shared/lib/supabaseClient';

/**
 * Service for managing tech stack operations.
 * Centralizes all database queries related to the tech_stacks table.
 */
export const techStackService = {
    /**
     * Fetch all tech stacks ordered by display order
     * @returns {Promise<Array>} Array of tech stack objects
     */
    getTechStacks: async () => {
        const { data, error } = await supabase
            .from('tech_stacks')
            .select('*')
            .order('display_order');

        if (error) throw error;
        return data || [];
    }
};
