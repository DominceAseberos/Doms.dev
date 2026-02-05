/**
 * Markdown parsing utilities for project documentation
 */

/**
 * Parse markdown documentation and extract sections
 * @param {string} documentation - Full markdown documentation string
 * @returns {Array<{title: string, content: string}>} Array of sections
 */
export const parseDocumentationSections = (documentation) => {
    if (!documentation) return [];

    // Split by ## headers
    const sections = documentation.split(/(?=##\s)/);

    return sections
        .filter(section => section.trim())
        .map(section => {
            const lines = section.trim().split('\n');
            const titleMatch = lines[0].match(/^##\s+(.+)$/);
            const title = titleMatch ? titleMatch[1] : 'Section';
            const content = lines.slice(1).join('\n').trim();

            return { title, content };
        });
};

/**
 * Extract specific sections from documentation
 * @param {string} documentation - Full markdown documentation
 * @param {string[]} sectionTitles - Array of section titles to extract
 * @returns {Array<{title: string, content: string}>} Filtered sections
 */
export const extractSections = (documentation, sectionTitles) => {
    const allSections = parseDocumentationSections(documentation);
    return allSections.filter(section =>
        sectionTitles.some(title => section.title.includes(title))
    );
};

/**
 * Get overview sections (Overview and Technical Architecture)
 * @param {string} documentation - Full markdown documentation
 * @returns {Array<{title: string, content: string}>} Overview sections
 */
export const getOverviewSections = (documentation) => {
    return extractSections(documentation, ['Overview', 'Technical Architecture', 'Technical Stack']);
};

/**
 * Get detail sections (everything except Overview and Technical Architecture)
 * @param {string} documentation - Full markdown documentation
 * @returns {Array<{title: string, content: string}>} Detail sections
 */
export const getDetailSections = (documentation) => {
    const allSections = parseDocumentationSections(documentation);
    const overviewTitles = ['Overview', 'Technical Architecture', 'Technical Stack'];

    return allSections.filter(section =>
        !overviewTitles.some(title => section.title.includes(title))
    );
};
