import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com/users';

export const useGitHubStore = create(
    persist(
        (set, get) => ({
            profile: null,
            repos: [],
            profileETag: null,
            reposETag: null,
            lastChecked: 0,
            loading: false,
            error: null,

            fetchGitHubData: async (username) => {
                const { lastChecked, profileETag, reposETag } = get();
                const now = Date.now();
                const THROTTLE_PERIOD = 5 * 60 * 1000; // 5 minutes

                // 1. Throttle Check: Don't even ask GitHub if checked < 5 mins ago
                if (now - lastChecked < THROTTLE_PERIOD) {
                    console.log('GitHub Sync: Throttled (Recently checked). Skipping.');
                    return;
                }

                set({ loading: true, error: null });

                try {
                    console.log('GitHub Sync: Checking for updates...');

                    const [profileRes, reposRes] = await Promise.all([
                        axios.get(`${GITHUB_API_BASE}/${username}`, {
                            validateStatus: (status) => status < 400, // Handle 304 manually
                            headers: profileETag ? { 'If-None-Match': profileETag } : {}
                        }),
                        axios.get(`${GITHUB_API_BASE}/${username}/repos?sort=updated&per_page=6`, {
                            validateStatus: (status) => status < 400,
                            headers: reposETag ? { 'If-None-Match': reposETag } : {}
                        })
                    ]);

                    const newProfile = profileRes.status === 304 ? get().profile : profileRes.data;
                    const newRepos = reposRes.status === 304 ? get().repos : reposRes.data;

                    const newProfileETag = profileRes.headers['etag'] || profileETag;
                    const newReposETag = reposRes.headers['etag'] || reposETag;

                    if (profileRes.status === 304 && reposRes.status === 304) {
                        console.log('GitHub Sync: 304 Not Modified. Data is up to date.');
                    } else {
                        console.log('GitHub Sync: Data updated from GitHub.');
                    }

                    set({
                        profile: newProfile,
                        repos: newRepos,
                        profileETag: newProfileETag,
                        reposETag: newReposETag,
                        lastChecked: now,
                        loading: false,
                        error: null
                    });

                } catch (err) {
                    console.warn('GitHub Sync Error:', err);

                    set((state) => ({
                        loading: false,
                        error: err.response?.status === 403
                            ? 'Rate limit exceeded. Using cached data.'
                            : 'Sync failed. Using cached data.',
                        // Fallback to existing data
                        profile: state.profile,
                        repos: state.repos
                    }));
                }
            }
        }),
        {
            name: 'github-raw-storage', // Updated key to avoid conflicts
            partialize: (state) => ({
                profile: state.profile,
                repos: state.repos,
                profileETag: state.profileETag,
                reposETag: state.reposETag,
                lastChecked: state.lastChecked
            }),
        }
    )
);
