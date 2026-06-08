/**
 * Landing Data Service
 * Single responsibility module for managing landingData.json.
 * Mirrors the pattern of portfolioService.js.
 */

import staticLandingData from '../data/landingData.json';

const LANDING_JSON_URL = '/src/data/landingData.json';

/**
 * Fetches the latest landing data from the server.
 * Falls back to static import in production (Vercel).
 */
export const fetchLandingData = async () => {
    try {
        const fetchUrl = `${LANDING_JSON_URL}?t=${new Date().getTime()}`;
        const res = await fetch(fetchUrl);

        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
            return await res.json();
        }

        return staticLandingData;
    } catch {
        return staticLandingData;
    }
};

/**
 * Returns the socials array from landing data.
 * This is the single source of truth for all social links.
 */
export const fetchSocials = async () => {
    const data = await fetchLandingData();
    return data.socials || [];
};
