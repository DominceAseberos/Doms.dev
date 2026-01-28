import { create } from 'zustand';

export const useAdminStore = create((set) => ({
    isAdminLoading: false,
    loadingText: 'updating.. ..',
    setAdminLoading: (isLoading, text = 'updating.. ..') => set({
        isAdminLoading: isLoading,
        loadingText: text
    }),
}));
