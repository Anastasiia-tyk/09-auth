// components/AuthNavigation/AuthNavigation.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { logout } from "@/lib/api/clientApi";

import css from "./AuthNavigation.module.css";

export default function AuthNavigation() {
    const { user, isAuthenticated, clearIsAuthenticated } = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            clearIsAuthenticated();
            router.push("/sign-in");
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    if (isAuthenticated && user) {
        return (
        <>
            <li className={css.navigationItem}>
                <Link href="/profile" className={css.navigationLink}>
                    Profile
                </Link>
            </li>
            <li className={css.navigationItem}>
                <p className={css.userEmail}>{user.email}</p>
                <button onClick={handleLogout} className={css.logoutButton}>
                    Logout
                </button>
            </li>
        </>
        );
    }

    return (
    <>
        <li className={css.navigationItem}>
            <Link href="/sign-in" className={css.navigationLink}>
                Login
            </Link>
        </li>
        <li className={css.navigationItem}>
            <Link href="/sign-up" className={css.navigationLink}>
                Sign up
            </Link>
        </li>
    </>
    );
}