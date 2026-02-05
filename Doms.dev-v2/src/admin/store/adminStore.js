import { create } from 'zustand';

export const useAdminStore = create((set) => ({
    isAdminLoading: false,
    loadingText: 'updating.. ..',
    notification: null, // { type: 'success'|'error', message: string }
    setAdminLoading: (isLoading, text = 'updating.. ..') => set({
        isAdminLoading: isLoading,
        loadingText: text
    }),
    setSuccessMessage: (message) => {
        set({ notification: { type: 'success', message } });
        if (message) {
            setTimeout(() => set({ notification: null }), 3000);
        }
    },
    setErrorMessage: (message) => {
        set({ notification: { type: 'error', message } });
        if (message) {
            setTimeout(() => set({ notification: null }), 4000);
        }
    },
}));
