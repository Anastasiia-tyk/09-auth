// app/(private routes)/profile/edit/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/lib/store/authStore";
import { updateMe } from "@/lib/api/clientApi";
import css from "./EditProfile.module.css";

export default function EditProfilePage() {
    const { user, setUser } = useAuthStore();
    const router = useRouter();
    const [username, setUsername] = useState(user?.username || "");
    const [isSaving, setIsSaving] = useState(false);

    if (!user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || isSaving) return;

        setIsSaving(true);
        try {
            const updatedUser = await updateMe({ username });
            setUser(updatedUser);
            router.push("/profile");
        } catch (err) {
            console.error("Failed to update profile", err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className={css.mainContent}>
            <div className={css.profileCard}>
                <h1 className={css.formTitle}>Edit Profile</h1>

                <Image
                    src={user.avatar}
                    alt="User Avatar"
                    width={120}
                    height={120}
                    className={css.avatar}
                />

                <form onSubmit={handleSubmit} className={css.profileInfo}>
                    <div className={css.usernameWrapper}>
                        <label htmlFor="username">Username:</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={css.input}
                            required
                        />
                    </div>
                    
                    <p>Email: {user.email}</p>
                    
                    <div className={css.actions}>
                        <button type="submit" disabled={isSaving} className={css.saveButton}>
                            {isSaving ? "Saving..." : "Save"}
                        </button>
                        <button type="button" onClick={() => router.push("/profile")} className={css.cancelButton}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}