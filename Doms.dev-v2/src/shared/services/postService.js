import { supabase } from '@shared/lib/supabaseClient';

/**
 * Service for managing posts/feed operations.
 * Centralizes all database queries related to the posts table.
 */
export const postService = {
    /**
     * Fetch all posts ordered by creation date (newest first)
     * @returns {Promise<Array>} Array of post objects
     */
    getAllPosts: async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Fetch the most recent post
     * @returns {Promise<Object|null>} Latest post object or null
     */
    getLatestPost: async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error) {
            // If no posts exist, return null instead of throwing
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        return data;
    },

    /**
     * Create a new post
     * @param {string} content - Post content text
     * @param {string|null} imageUrl - Optional image URL
     * @param {string} userId - User ID of the post creator
     * @returns {Promise<Object>} Created post object
     */
    createPost: async (content, imageUrl = null, userId) => {
        const { data, error } = await supabase
            .from('posts')
            .insert([{
                content,
                image_url: imageUrl,
                user_id: userId
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Delete a post by ID
     * @param {string} id - Post ID to delete
     * @returns {Promise<void>}
     */
    deletePost: async (id) => {
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    /**
     * Subscribe to real-time profile changes
     * @param {Function} callback - Callback function to handle profile updates
     * @returns {Object} Subscription object with unsubscribe method
     */
    subscribeToProfileChanges: (callback) => {
        const subscription = supabase
            .channel('public:profiles')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'profiles'
            }, payload => {
                callback(payload.new);
            })
            .subscribe();

        return {
            unsubscribe: () => supabase.removeChannel(subscription)
        };
    }
};
