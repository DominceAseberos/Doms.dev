import { create } from 'zustand';

const THEME_STORAGE_KEY = 'doms-dev-theme';

const applyThemeToDocument = (theme) => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    if (document.body) {
        document.body.dataset.theme = theme;
    }
};

const resolveInitialTheme = () => {
    if (typeof window === 'undefined') return 'dark';

    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

const useThemeStore = create((set, get) => ({
    theme: 'dark',
    initialized: false,
    initTheme: () => {
        const theme = resolveInitialTheme();
        applyThemeToDocument(theme);
        set({ theme, initialized: true });
    },
    setTheme: (theme) => {
        applyThemeToDocument(theme);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(THEME_STORAGE_KEY, theme);
        }
        set({ theme, initialized: true });
    },
    toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
        get().setTheme(nextTheme);
    },
}));

export default useThemeStore;
