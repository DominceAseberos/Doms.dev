const FEED_JSON_URL = '/src/data/feedPosts.json';
const WRITE_API_URL = '/__write-json?file=feedPosts.json';

export const fetchFeedPosts = async () => {
    try {
        const res = await fetch(FEED_JSON_URL);
        if (res.ok) return await res.json();
        throw new Error(`Failed to fetch feed posts: ${res.status}`);
    } catch (err) {
        console.error("Error fetching feed posts:", err);
        throw err;
    }
};

export const saveFeedPosts = async (posts) => {
    try {
        const res = await fetch(WRITE_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(posts)
        });
        if (!res.ok) throw new Error(`Failed to save feed posts: ${res.status}`);
        return true;
    } catch (err) {
        console.error("Error saving feed posts:", err);
        throw err;
    }
};
