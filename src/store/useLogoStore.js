import { create } from 'zustand';

const useLogoStore = create((set) => ({
    isLogoFullView: false,
    setLogoFullView: (value) => set({ isLogoFullView: value }),
}));

export default useLogoStore;
