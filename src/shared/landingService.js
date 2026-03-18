/**
 * Landing Page Data Service
 * Single responsibility module for managing landingData.json persistence.
 */

const LANDING_JSON_URL = '/src/data/landingData.json';
const WRITE_API_URL = '/__write-json?file=landingData.json';

/**
 * Fetches the latest landing data from the server.
 */
export const fetchLandingData = async () => {
    try {
        const res = await fetch(LANDING_JSON_URL);
        if (res.ok) {
            return await res.json();
        }
        throw new Error(`Failed to fetch landing data: ${res.status}`);
    } catch (err) {
        console.error("Error fetching landing data:", err);
        throw err;
    }
};

/**
 * Saves the entire landing data object to disk.
 */
export const saveLandingData = async (data) => {
    try {
        const res = await fetch(WRITE_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!res.ok) {
            throw new Error(`Failed to save landing data: ${res.status}`);
        }
        return true;
    } catch (err) {
        console.error("Error saving landing data:", err);
        throw err;
    }
};
