import { create } from 'zustand';

export const useAdminStore = create((set) => ({
    isAdminLoading: false,
    loadingText: 'updating.. ..',
    successMessage: null,
    setAdminLoading: (isLoading, text = 'updating.. ..') => set({
        isAdminLoading: isLoading,
        loadingText: text
    }),
    setSuccessMessage: (message) => {
        set({ successMessage: message });
        if (message) {
            setTimeout(() => set({ successMessage: null }), 3000); // Auto-dismiss after 3s
        }
    },
}));
