import { supabase } from '../lib/supabaseClient';

export const dashboardService = {
    // GENERIC CRUD
    async getAll(table, orderCol = null, ascending = false) {
        let query = supabase.from(table).select('*');

        // Smarter default ordering
        if (import.meta.env.DEV) console.log(`[dashboardService] Fetching ${table}...`);
        if (orderCol) {
            query = query.order(orderCol, { ascending });
        } else {
            // Fallback strategy based on table name if orderCol is not provided
            if (table === 'projects' || table === 'profiles' || table === 'education' || table === 'contacts') {
                // Use updated_at for most content tables to show newest edits first
                // contacts and education DEFINITELY have updated_at (verified via SQL)
                query = query.order('updated_at', { ascending: false });
            } else if (table === 'tech_stacks' || table === 'tracks') {
                query = query.order('display_order', { ascending: true });
            } else {
                // Safe fallback for anything else
                query = query.order('id', { ascending: true });
            }
        }

        const { data, error } = await query;
        if (error) {
            console.error(`Error fetching from ${table}:`, error);
            // If the fallback order failed (e.g. 'id' doesn't exist), try one more time without ordering
            if (error.code === '42703' || error.status === 400) {
                const { data: retryData, error: retryError } = await supabase.from(table).select('*');
                if (retryError) throw retryError;
                return retryData;
            }
            throw error;
        }
        return data;
    },

    async create(table, payload) {
        const { data, error } = await supabase
            .from(table)
            .insert([payload])
            .select();
        if (error) throw error;
        return data[0];
    },

    async update(table, id, payload) {
        const { data, error } = await supabase
            .from(table)
            .update(payload)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data[0];
    },

    async delete(table, id) {
        const { error } = await supabase
            .from(table)
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    },

    async updateContact(id, payload) {
        return this.update('contacts', id, payload);
    }
};
