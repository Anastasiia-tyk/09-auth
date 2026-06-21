// app/(auth routes)/sign-in/page.tsx
"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./SignInPage.module.css";

export default function SignInPage() {
    const [error, setError] = useState<string | null>(null);
    const setUser = useAuthStore((state) => state.setUser);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

    try {
        const user = await login({ email, password });
        setUser(user);
        router.push("/profile");
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || "Something went wrong");
        } else {
            setError("An unexpected error occurred");
        }
    }
};

return (
    <main className={css.mainContent}>
        <form onSubmit={handleSubmit} className={css.form}>
            <h1 className={css.formTitle}>Sign in</h1>

            <div className={css.formGroup}>
                <label htmlFor="email">Email</label>
                <input id="email" type="email" name="email" className={css.input} required />
            </div>

            <div className={css.formGroup}>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" name="password" className={css.input} required />
            </div>

            <div className={css.actions}>
                <button type="submit" className={css.submitButton}>
                    Log in
                </button>
            </div>

            {error && <p className={css.error}>{error}</p>}
        </form>
    </main>
    );
}