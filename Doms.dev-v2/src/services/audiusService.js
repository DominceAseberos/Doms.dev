import axios from 'axios';

const APP_NAME = 'MyPortfolio';
const API_BASE = 'https://api.audius.co';

export const audiusService = {
    /**
     * Search for tracks on Audius
     * @param {string} query - Search term
     * @returns {Promise<Array>} List of tracks
     */
    async searchTracks(query) {
        try {
            const res = await axios.get(`${API_BASE}/v1/tracks/search?query=${query}&app_name=${APP_NAME}`);
            return this._formatTracks(res.data.data);
        } catch (error) {
            console.error('Audius search error:', error);
            return [];
        }
    },

    /**
     * Get trending tracks
     * @returns {Promise<Array>} List of tracks
     */
    async getTrending() {
        try {
            const res = await axios.get(`${API_BASE}/v1/tracks/trending?app_name=${APP_NAME}`);
            return this._formatTracks(res.data.data);
        } catch (error) {
            console.error('Audius trending error:', error);
            return [];
        }
    },

    /**
     * Get a single track by ID
     * @param {string} trackId - Audius track ID
     * @returns {Promise<Object|null>} Track metadata
     */
    async getTrackById(trackId) {
        try {
            const res = await axios.get(`${API_BASE}/v1/tracks/${trackId}?app_name=${APP_NAME}`);
            const track = res.data.data;
            if (!track) return null;

            return {
                id: track.id,
                title: track.title || 'Untitled Track',
                artist: track.user?.name || 'Unknown Artist',
                cover_url: track.artwork?.['480x480'] || track.artwork?.['150x150'] || null,
                duration: this._formatDuration(track.duration),
                genre: track.genre || 'Unknown',
                external_id: track.id.toString()
            };
        } catch (error) {
            console.error(`Audius fetch track ${trackId} error:`, error);
            return null;
        }
    },

    /**
     * Get Stream URL for a track
     * @param {string} trackId 
     */
    getStreamUrl(trackId) {
        return `${API_BASE}/v1/tracks/${trackId}/stream?app_name=${APP_NAME}`;
    },

    /**
     * Format API response to our app's structure
     */
    _formatTracks(apiTracks) {
        if (!apiTracks) return [];
        return apiTracks.map(track => ({
            id: track.id, // Audius ID
            title: track.title,
            artist: track.user?.name || 'Unknown',
            cover_url: track.artwork?.['480x480'] || track.artwork?.['150x150'] || null,
            duration: this._formatDuration(track.duration),
            genre: track.genre,
            external_id: track.id.toString(),
            duration_seconds: track.duration
        }));
    },

    _formatDuration(seconds) {
        if (!seconds) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }
};
