// app/(auth routes)/sign-up/page.tsx

"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./SignUpPage.module.css"; 

export default function SignUpPage() {
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
            const user = await register({ email, password });
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
            <h1 className={css.formTitle}>Sign up</h1>
            <form onSubmit={handleSubmit} className={css.form}>
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
                        Register
                    </button>
                </div>
                
                {error && <p className={css.error}>{error}</p>}
            </form>
        </main>
    );
}