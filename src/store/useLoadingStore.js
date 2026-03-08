import { create } from 'zustand';

// Global loading state manager
const useLoadingStore = create((set) => ({
    isLoading: true, // Start true for initial app load
    setLoading: (loading) => set({ isLoading: loading }),
}));

export default useLoadingStore;
