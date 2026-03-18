/**
 * Portfolio Data Service
 * Single responsibility module for managing portfolioData.json persistence.
 */

const PORTFOLIO_JSON_URL = '/src/data/portfolioData.json';
const WRITE_API_URL = '/__write-json?file=portfolioData.json';

/**
 * Fetches the latest portfolio data from the server.
 * Ensures we aren't working with stale imported data.
 */
export const fetchPortfolioData = async () => {
    try {
        const res = await fetch(PORTFOLIO_JSON_URL);
        if (res.ok) {
            return await res.json();
        }
        throw new Error(`Failed to fetch portfolio data: ${res.status}`);
    } catch (err) {
        console.error("Error fetching portfolio data:", err);
        throw err;
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
