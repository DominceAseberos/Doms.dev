import React from 'react';
import {
    SiReact, SiNextdotjs, SiTypescript, SiNodedotjs, SiFastapi, SiFlutter,
    SiSupabase, SiPrisma, SiVercel, SiFigma, SiRedux, SiTailwindcss, SiHuggingface,
    SiGithubactions, SiFirebase, SiAngular, SiVuedotjs, SiAstro, SiVite, SiWordpress,
    SiShopify, SiJupyter, SiTurborepo, SiPython, SiPostgresql, SiGreensock, SiScikitlearn,
    SiDocker, SiFramer, SiSvg
} from 'react-icons/si';
import { Database, Layout, Webhook, Box, Code, Layers, Droplet } from 'lucide-react';
import { FaHeart, FaRobot, FaPaw, FaEnvelope } from 'react-icons/fa6';

export const GithubIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
);

export const LinkedInIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

export const getTechIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('react native')) return <SiReact />;
    if (n.includes('react')) return <SiReact />;
    if (n.includes('next.js')) return <SiNextdotjs />;
    if (n.includes('typescript')) return <SiTypescript />;
    if (n.includes('node.js')) return <SiNodedotjs />;
    if (n.includes('fastapi')) return <SiFastapi />;
    if (n.includes('flutter')) return <SiFlutter />;
    if (n.includes('supabase')) return <SiSupabase />;
    if (n.includes('prisma')) return <SiPrisma />;
    if (n.includes('vercel')) return <SiVercel />;
    if (n.includes('figma')) return <SiFigma />;
    if (n.includes('redux')) return <SiRedux />;
    if (n.includes('tailwind')) return <SiTailwindcss />;
    if (n.includes('hugging')) return <SiHuggingface />;
    if (n.includes('github action')) return <SiGithubactions />;
    if (n.includes('firebase')) return <SiFirebase />;
    if (n.includes('angular')) return <SiAngular />;
    if (n.includes('vue')) return <SiVuedotjs />;
    if (n.includes('astro')) return <SiAstro />;
    if (n.includes('vite')) return <SiVite />;
    if (n.includes('wordpress')) return <SiWordpress />;
    if (n.includes('shopify')) return <SiShopify />;
    if (n.includes('ipynb') || n.includes('jupyter')) return <SiJupyter />;
    if (n.includes('turbopack')) return <SiTurborepo />;
    if (n.includes('rest api')) return <Webhook />;
    if (n.includes('zod')) return <Code />;
    if (n.includes('tanstack')) return <Database />;
    if (n.includes('shadcn') || n.includes('base ui')) return <Layout />;
    if (n.includes('zustand')) return <FaPaw />;
    if (n.includes('riverpod')) return <Droplet />;
    if (n.includes('lenis')) return <Code />;
    if (n.includes('python')) return <SiPython />;
    if (n.includes('postgres')) return <SiPostgresql />;
    if (n.includes('gsap')) return <SiGreensock />;
    if (n.includes('scikit-learn') || n.includes('scikitlearn')) return <SiScikitlearn />;
    if (n.includes('docker')) return <SiDocker />;
    if (n.includes('framer')) return <SiFramer />;
    if (n.includes('svg')) return <SiSvg />;
    if (n.includes('emailjs')) return <FaEnvelope />;
    if (n.includes('lovable')) return <FaHeart />;
    if (n.includes('uptimerobot')) return <FaRobot />;
    if (n.includes('lottiefiles')) return <Layers />;
    return null;
};
