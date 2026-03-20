const ABOUT_JSON_URL = '/src/data/aboutData.json';
const WRITE_API_URL = '/__write-json?file=aboutData.json';

export const fetchAboutData = async () => {
    try {
        const res = await fetch(ABOUT_JSON_URL);
        if (res.ok) return await res.json();
        throw new Error(`Failed to fetch about data: ${res.status}`);
    } catch (err) {
        console.error("Error fetching about data:", err);
        throw err;
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
