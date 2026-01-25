/**
 * Stack technology icon mapping
 * Maps technology names to emoji icons for visual representation
 */
export const stackIcons = {
    'React': '⚛️',
    'Python': '🐍',
    'Flask': '🌶️',
    'OpenCV': '👁️',
    'Tailwind CSS': '🎨',
    'Tailwind': '🎨',
    'GSAP': '🎬',
    'Supabase': '🔥',
    'Lucide': '🔷',
    'Vite': '⚡',
    'NLP': '🧠',
    'API': '🔌'
};

/**
 * Get icon for a given stack technology
 * @param {string} stack - Technology name
 * @returns {string} Emoji icon or default gear icon
 */
export const getStackIcon = (stack) => {
    return stackIcons[stack] || '⚙️';
};
