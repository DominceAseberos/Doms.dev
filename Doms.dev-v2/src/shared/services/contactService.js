import { supabase } from '@shared/lib/supabaseClient';

/**
 * Service for managing contact operations.
 * Centralizes all database queries related to the contacts table.
 */
export const contactService = {
    /**
     * Fetch all contacts ordered by display order
     * @returns {Promise<Array>} Array of contact objects
     */
    getContacts: async () => {
        const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .order('display_order');

        if (error) throw error;
        return data || [];
    }
};
