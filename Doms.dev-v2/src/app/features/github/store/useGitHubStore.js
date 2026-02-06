import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com/users';

export const useGitHubStore = create(
    persist(
        (set, get) => ({
            profile: null,
            events: [], // Add events state
            profileETag: null,
            reposETag: null,
            eventsETag: null, // Add events ETag
            lastChecked: 0,
            loading: false,
            error: null,

            fetchGitHubData: async (username) => {
                const { lastChecked, profileETag, reposETag, eventsETag, loading } = get(); // Check loading
                if (loading) return; // Prevent race conditions/double invocations

                const now = Date.now();
                const THROTTLE_PERIOD = 5 * 60 * 1000; // 5 minutes

                // 1. Throttle Check: Don't even ask GitHub if checked < 5 mins ago
                if (now - lastChecked < THROTTLE_PERIOD) {
                    if (import.meta.env.DEV) console.log('GitHub Sync: Throttled (Recently checked). Skipping.');
                    return;
                }

                set({ loading: true, error: null });

                try {
                    if (import.meta.env.DEV) console.log('GitHub Sync: Checking for updates...');

                    const [profileRes, reposRes, eventsRes] = await Promise.all([
                        axios.get(`${GITHUB_API_BASE}/${username}`, {
                            validateStatus: (status) => status < 400,
                            headers: profileETag ? { 'If-None-Match': profileETag } : {}
                        }),
                        axios.get(`${GITHUB_API_BASE}/${username}/repos?sort=updated&per_page=15`, { // Increased to 15 to match FocusCard needs
                            validateStatus: (status) => status < 400,
                            headers: reposETag ? { 'If-None-Match': reposETag } : {}
                        }),
                        axios.get(`${GITHUB_API_BASE}/${username}/events/public`, { // Fetch events
                            validateStatus: (status) => status < 400,
                            headers: eventsETag ? { 'If-None-Match': eventsETag } : {}
                        })
                    ]);

                    const newProfile = profileRes.status === 304 ? get().profile : profileRes.data;
                    const newRepos = reposRes.status === 304 ? get().repos : reposRes.data;
                    const newEvents = eventsRes.status === 304 ? get().events : eventsRes.data;

                    const newProfileETag = profileRes.headers['etag'] || profileETag;
                    const newReposETag = reposRes.headers['etag'] || reposETag;
                    const newEventsETag = eventsRes.headers['etag'] || eventsETag;

                    if (profileRes.status === 304 && reposRes.status === 304 && eventsRes.status === 304) {
                        if (import.meta.env.DEV) console.log('GitHub Sync: 304 Not Modified. Data is up to date.');
                    } else {
                        if (import.meta.env.DEV) console.log('GitHub Sync: Data updated from GitHub.');
                    }

                    set({
                        profile: newProfile,
                        repos: newRepos,
                        events: newEvents,
                        profileETag: newProfileETag,
                        reposETag: newReposETag,
                        eventsETag: newEventsETag,
                        lastChecked: now,
                        loading: false,
                        error: null
                    });

                } catch (err) {
                    if (err.response?.status !== 403) {
                        console.warn('GitHub Sync Error:', err.message);
                    }

                    set((state) => ({
                        loading: false,
                        lastChecked: now, // CRITICAL: Update throttle timestamp even on error to prevent infinite retry loop
                        error: err.response?.status === 403
                            ? 'Rate limit exceeded. Using cached data.'
                            : 'Sync failed. Using cached data.',
                        // Fallback to existing data
                        profile: state.profile,
                        repos: state.repos,
                        events: state.events
                    }));
                }
            }
        }),
        {
            name: 'github-raw-storage', // Updated key to avoid conflicts
            partialize: (state) => ({
                profile: state.profile,
                repos: state.repos,
                events: state.events,
                profileETag: state.profileETag,
                reposETag: state.reposETag,
                eventsETag: state.eventsETag,
                lastChecked: state.lastChecked
            }),
        }
    )
);
