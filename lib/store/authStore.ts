// lib/store/authStore.ts

import { create } from "zustand";
import { User } from "@/types/user";

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    clearIsAuthenticated: () => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
    user: null,
    isAuthenticated: false,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    clearIsAuthenticated: () => set({ user: null, isAuthenticated: false }),
}));