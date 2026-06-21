// app/notes/[id]/NoteDetails.client/tsx

"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNotesById } from "@/lib/api";

import css from "./NoteDetails.module.css";

export default function NoteDetailsClient() {
    const params = useParams();
    const id = params?.id as string;

    const { data: note, isLoading, isError } = useQuery({
        queryKey: ["note", id],
        queryFn: () => fetchNotesById(id),
        refetchOnMount: false,
        enabled: !!id,
    });
    
    if (isLoading) { 
        return <p>Loading, please wait...</p>;
    }

    if (isError || !note) {
        return <p>Something went wrong.</p>;
    }

    return (
        <main className={css.main}>
            <div className={css.container}>
                <div className={css.item}>
                    <div className={css.header}>
                        <h2>{note.title}</h2>
                    </div>
                    <p className={css.tag}>{note.tag}</p>
                    <p className={css.content}>{note.content}</p>
                    <p className={css.date}>
                        {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : "Created date"}
                    </p>
                </div>
            </div>
        </main>
    );
}

