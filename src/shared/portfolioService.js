/**
 * Portfolio Data Service
 * Single responsibility module for managing portfolioData.json persistence.
 */

import staticPortfolioData from '../data/portfolioData.json';

const PORTFOLIO_JSON_URL = '/src/data/portfolioData.json';
const WRITE_API_URL = '/__write-json?file=portfolioData.json';

/**
 * Fetches the latest portfolio data from the server.
 * Ensures we aren't working with stale imported data in dev.
 * Falls back to static data in production (Vercel) since /src/ is not served.
 */
export const fetchPortfolioData = async () => {
    try {
        const res = await fetch(PORTFOLIO_JSON_URL);
        
        // In Vercel, a missing file might return the index.html with a 200 OK.
        // We ensure it actually returns JSON content type before parsing.
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
            return await res.json();
        }
        
        console.warn(`[portfolioService] Fallback to static JSON because fetch returned non-JSON or failed.`);
        return staticPortfolioData;
    } catch (err) {
        console.warn(`[portfolioService] Network error fetching portfolio data, falling back to static JSON:`, err);
        return staticPortfolioData;
    }
};

/**
 * Saves the entire portfolio data object to disk.
 */
export const savePortfolioData = async (fullData) => {
    try {
        const res = await fetch(WRITE_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fullData)
        });
        
        if (!res.ok) {
            throw new Error(`Failed to save portfolio data: ${res.status}`);
        }
        return true;
    } catch (err) {
        console.error("Error saving portfolio data:", err);
        throw err;
    }
};

/**
 * Updates a single project within the portfolio and saves it.
 * @param {string} projectId 
 * @param {object} projectData 
 */
export const saveProjectContent = async (projectId, projectData) => {
    try {
        // 1. Get fresh data
        const fullData = await fetchPortfolioData();
        
        // 2. Locate and update
        const idx = fullData.projects.findIndex(p => p.id === projectId);
        if (idx !== -1) {
            fullData.projects[idx] = projectData;
        } else {
            fullData.projects.push(projectData);
        }
        
        // 3. Persist
        return await savePortfolioData(fullData);
    } catch (err) {
        console.error(`Error updating project ${projectId}:`, err);
        throw err;
    }
};
