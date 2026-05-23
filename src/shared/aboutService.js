import staticAboutData from '../data/aboutData.json';

const ABOUT_JSON_URL = '/src/data/aboutData.json';
const WRITE_API_URL = '/__write-json?file=aboutData.json';

export const fetchAboutData = async () => {
    try {
        const res = await fetch(ABOUT_JSON_URL);
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
            return await res.json();
        }

        return staticAboutData;
    } catch (err) {
        console.warn('Falling back to static about data:', err);
        return staticAboutData;
    }
};

export const saveAboutData = async (data) => {
    try {
        const res = await fetch(WRITE_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(`Failed to save about data: ${res.status}`);
        return true;
    } catch (err) {
        console.error("Error saving about data:", err);
        throw err;
    }
};
