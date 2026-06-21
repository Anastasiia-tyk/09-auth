// components/AuthProvider/AuthProvider.tsx
"use client";

import { useEffect, ReactNode } from "react";
import { checkSession } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthProvider({ children }: { children: ReactNode }) {
    const setUser = useAuthStore((state) => state.setUser);
    const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const user = await checkSession();
                if (user) {
                    setUser(user);
                } else {
                    clearIsAuthenticated();
                }
            } catch {
                clearIsAuthenticated();
            }
        };
        initAuth();
    }, [setUser, clearIsAuthenticated]);
    
    return <>{children}</>;
}