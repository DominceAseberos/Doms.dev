import portfolioData from '../data/portfolioData.json';

/**
 * Hook to access centralized portfolio data.
 * This pattern makes it easy to switch to a database later.
 */
export const usePortfolioData = () => {
    return {
        profile: portfolioData.profile,
        education: portfolioData.education,
        contacts: portfolioData.contacts,
        techStack: portfolioData.techStack,
        experience: portfolioData.experience,
        interests: portfolioData.interests,
        projects: portfolioData.projects,
        trackList: portfolioData.trackList,
        uiConfig: portfolioData.uiConfig,
        chatbotConfig: portfolioData.chatbotConfig,
        chatSuggestions: portfolioData.chatSuggestions
    };
};

export default portfolioData;
