// src/store/navigationStore.js
import { create } from 'zustand';

export const useNavigationStore = create((set) => ({
    dashboardVisited: false,
    setDashboardVisited: (visited) => set({ dashboardVisited: visited })
}));
