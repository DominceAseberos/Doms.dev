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
    Bot
} from 'lucide-react';

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

    // Custom mappings for tech stack
    'React': Globe,
    'Tailwind': Palette,
    'GSAP': Zap,
    'Python': Binary,
    'Flask': Server,
    'OpenCV': Cpu,
    'Firebase': Cloud,
    'Lucide': Layers,
    'Vite': Zap,
    'NLP': Bot,
    'API': Terminal,
    'Supabase': Database
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
