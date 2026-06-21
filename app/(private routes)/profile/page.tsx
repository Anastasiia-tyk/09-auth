// app/(private routes)/profile/page.tsx

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getMe } from "@/lib/api/serverApi";
import css from "./ProfilePage.module.css";

export const metadata: Metadata = {
    title: "Your Profile | NoteHub",
    description: "View your personal account dashboard information.",
};

export default async function ProfilePage() {
    const user = await getMe();

    return (
        <main className={css.mainContent}>
            <div className={css.profileCard}>
                <div className={css.header}>
                    <h1 className={css.formTitle}>Profile Page</h1>
                    <Link href="/profile/edit" className={css.editProfileButton}>
                        Edit Profile
                    </Link>
                </div>
            <div className={css.avatarWrapper}>
                <Image
                    src={user.avatar}
                    alt="User Avatar"
                    width={120}
                    height={120}
                    className={css.avatar}
                    priority
                />
            </div>
            <div className={css.profileInfo}>
                <p>Username: {user.username}</p>
                <p>Email: {user.email}</p>
            </div>
        </div>
        </main>
    );
}