import {
    Code2,
    Layers,
    Cpu,
    Globe,
    Database,
    BookOpen,
    FileText,
    Smartphone,
    Server,
    Terminal,
    Palette,
    Layout,
    Search,
    Settings,
    Shield,
    Zap,
    Github,
    Youtube,
    Linkedin,
    Mail,
    ExternalLink,
    MessageCircle,
    Facebook,
    Monitor,
    Cloud,
    Lock,
    Box,
    Binary,
    Bot,
    Hash,
    Command,
    Workflow,
    Webhook,
    AppWindow,
    Braces,
    Bug,
    TerminalSquare
} from 'lucide-react';
import { ReactIcon, NextJsIcon, TailwindIcon, GSAPIcon, FigmaIcon, SupabaseIcon, FlutterIcon, RustIcon, DockerIcon, NodeIcon } from './BrandIcons';

/**
 * Universal Icon Registry
 * Maps string identifiers to Lucide React components.
 * This allows us to store the string "React" or "Code2" in our database/JSON
 * and render the corresponding dynamic icon component in the UI.
 */
export const IconRegistry = {
    // Technology & General
    'Code2': Code2,
    'Layers': Layers,
    'Cpu': Cpu,
    'Globe': Globe,
    'Database': Database,
    'BookOpen': BookOpen,
    'FileText': FileText,
    'Smartphone': Smartphone,
    'Server': Server,
    'Terminal': Terminal,
    'Palette': Palette,
    'Layout': Layout,
    'Search': Search,
    'Settings': Settings,
    'Shield': Shield,
    'Zap': Zap,
    'Monitor': Monitor,
    'Cloud': Cloud,
    'Lock': Lock,
    'Box': Box,
    'Binary': Binary,
    'Bot': Bot,

    // Social & Links
    'Github': Github,
    'Youtube': Youtube,
    'Linkedin': Linkedin,
    'Mail': Mail,
    'ExternalLink': ExternalLink,
    'MessageCircle': MessageCircle,
    'Facebook': Facebook,

    // Custom mappings for tech stack with Real Brand Icons
    'React': ReactIcon,
    'Next.js': NextJsIcon,
    'Tailwind': TailwindIcon,
    'GSAP': GSAPIcon,
    'Figma': FigmaIcon,
    'Supabase': SupabaseIcon,

    'Flutter': FlutterIcon,
    'Rust': RustIcon,
    'Docker': DockerIcon,
    'Node.js': NodeIcon,

    // Fallbacks or others still using Lucide
    'Python': Binary,
    'Flask': Server,
    'OpenCV': Cpu,
    'Firebase': Cloud,
    'Lucide': Layers,
    'Vite': Zap,
    'NLP': Bot,
    'API': Terminal,
    'Shell': TerminalSquare,
    'Command': Command,
    'Hash': Hash,
    'Workflow': Workflow,
    'Webhook': Webhook,
    'App': AppWindow,
    'JSON': Braces,
    'Debug': Bug
};

/**
 * Official Brand Colors Mapping
 * Pairs icon names with their official hex colors for the "Vibrant Neon" styling.
 */
export const BrandColors = {
    'React': '#61DAFB',
    'Next.js': '#FFFFFF',
    'Tailwind': '#06B6D4',
    'GSAP': '#88CE02',
    'Figma': '#F24E1E',
    'Supabase': '#3ECF8E',
    'Python': '#3776AB',
    'Flask': '#FFFFFF',
    'OpenCV': '#5C3EE8',
    'Firebase': '#FFCA28',
    'Vite': '#646CFF',
    'Github': '#FFFFFF',
    'Lucide': '#F59E0B',
    'Linkedin': '#0A66C2',
    'Mail': '#EA4335',
    'Code2': '#7C3AED',
    'Database': '#3B82F6',
    'Terminal': '#10B981',
    'Smartphone': '#F472B6',
    'Server': '#6366F1',
    'Flutter': '#02569B',
    'Rust': '#000000',
    'Docker': '#2496ED',
    'Node.js': '#339933'
};

/**
 * Sound Category Mapping
 * Associates tech stack items with specific audio frequency bands
 * for real-time reactivity in the UI.
 */
export const TechSoundMapping = {
    // Core / Foundation (Bass/Kick)
    'React': 'foundation',
    'Next.js': 'foundation',
    'Supabase': 'foundation',
    'Database': 'foundation',

    // Creativity / Melody (Mids/Vocals)
    'GSAP': 'creativity',
    'Figma': 'creativity',
    'Palette': 'creativity',

    // Interaction / Detail (High-Mids)
    'Tailwind': 'interaction',
    'Lucide': 'interaction',
    'Layers': 'interaction',

    // Activity / Logic (Busy-Mids)
    'Python': 'activity',
    'Code2': 'activity',
    'NLP': 'activity',
    'API': 'activity',

    // Sparkle / Feedback (Highs)
    'Vite': 'sparkle',
    'Zap': 'sparkle',
    'Globe': 'sparkle',
    'Flutter': 'creativity',
    'Rust': 'foundation',
    'Docker': 'foundation',
    'Node.js': 'activity'
};

/**
 * Helper to get sound category for a given tech name.
 */
export const getSoundCategoryByName = (name) => {
    return TechSoundMapping[name] || 'presence'; // fallback to general presence
};

/**
 * Helper to get a brand color by name.
 * Fallback to a neutral white/gray if not specified.
 */
export const getBrandColorByName = (name) => {
    return BrandColors[name] || '#94a3b8'; // default to slate-400
};

/**
 * Helper to get an icon component by its registry name.
 * Fallback to Code2 if name is not found.
 */
export const getIconByName = (name) => {
    return IconRegistry[name] || Code2;
};

/**
 * Returns a list of all available icon names for the Admin Picker.
 */
export const getAvailableIconNames = () => {
    return Object.keys(IconRegistry);
};
