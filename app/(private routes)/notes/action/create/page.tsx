// app/notes/action/create/page.tsx

import type { Metadata } from "next";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";

export const metadata: Metadata = {
    title: "Create Note | NoteHub",
    description: "Create a new personal note to keep track of your tasks.",
    openGraph: {
        title: "Create Note | NoteHub",
        description: "Create a new personal note to keep track of your tasks.",
        url: "https://notehub.com/notes/action/create",
        images: [
            {
                url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
                width: 1200,
                height: 630,
                alt: "Create Note Dashboard",
            },
        ],
    },
};

export default function CreateNote() {
    return (
        <main className={css.main}>
            <div className={css.container}>
                <h1 className={css.title}>Create note</h1>
                <NoteForm />
            </div>
        </main>
    );
}