import { supabase } from '../lib/supabaseClient';

export const dashboardService = {
    // GENERIC CRUD
    async getAll(table) {
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
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

    // SPECIALIZED
    async syncTechStacks() {
        // Stacks usually need a specific sync if we want to reorder or replace all
        // But for now, we'll use individual CRUD in the UI
    },

    async updateContact(id, payload) {
        return this.update('contacts', id, payload);
    }
};
