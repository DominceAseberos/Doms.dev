
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import portfolioData from '../data/portfolioData.json';

/**
 * Fetch all data from Supabase in parallel.
 */
const fetchSupabaseData = async () => {
    console.log('Fetching portfolio data from Supabase...');

    const [
        { data: profile },
        { data: education },
        { data: contacts },
        { data: techStack },
        { data: projects },
        { data: tracks }
    ] = await Promise.all([
        supabase.from('profiles').select('*').single(),
        supabase.from('education').select('*').single(),
        supabase.from('contacts').select('*').single(),
        supabase.from('tech_stacks').select('*').order('display_order'),
        supabase.from('projects').select('*').order('display_order'),
        supabase.from('tracks').select('*').order('display_order')
    ]);

    // Format tracks into categories to match JSON structure
    const trackList = {};
    if (tracks) {
        tracks.forEach(track => {
            if (!trackList[track.category]) {
                trackList[track.category] = [];
            }
            trackList[track.category].push({
                id: track.id,
                imgSrc: track.img_src
            });
        });
    }

    // Transform Projects (snake_case DB -> camelCase Frontend)
    const formattedProjects = projects?.map(p => ({
        id: p.id,
        title: p.title,
        projectType: p.project_type,
        dateCreated: p.date_created,
        image: p.image_url, // Critical: Map image_url to image
        images: p.images || [],
        stacks: p.stacks || [],
        shortDescription: p.short_description,
        livePreviewLink: p.live_preview_link, // Critical: Map to camelCase
        githubLink: p.github_link,
        fullDocumentation: p.full_documentation,
        displayOrder: p.display_order
        // documentationFiles missing in DB currently, falling back if needed
    })) || [];

    // Transform Tech Stack
    const formattedTechStack = techStack?.map(t => ({
        ...t,
        iconName: t.icon_name // Map icon_name -> iconName
    })) || [];

    // Transform Profile
    const formattedProfile = profile ? {
        ...profile,
        githubUsername: profile.github_username,
        avatar: profile.avatar_url,
        cv: profile.cv_url
    } : null;

    return {
        profile: formattedProfile || portfolioData.profile,
        education: education || portfolioData.education,
        contacts: contacts || portfolioData.contacts,
        techStack: formattedTechStack.length > 0 ? formattedTechStack : portfolioData.techStack,
        projects: formattedProjects.length > 0 ? formattedProjects : portfolioData.projects,
        trackList: Object.keys(trackList).length > 0 ? trackList : portfolioData.trackList,
        // Configs
        experience: portfolioData.experience,
        interests: portfolioData.interests,
        uiConfig: portfolioData.uiConfig,
        chatbotConfig: portfolioData.chatbotConfig,
        chatSuggestions: portfolioData.chatSuggestions
    };
};

/**
 * Hook to access centralized portfolio data.
 * Fetches from Supabase and falls back to local JSON if error or loading.
 */
export const usePortfolioData = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['portfolioData'],
        queryFn: fetchSupabaseData,
        staleTime: 1000 * 60 * 60, // 1 hour cache
        retry: 1
    });

    // If loading or error, return local JSON data immediately (Strategy: Stale-While-Revalidate essentially)
    // Actually, useQuery will return undefined 'data' while loading. 
    // We want to show local data *while* loading remote data.

    return data || {
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
