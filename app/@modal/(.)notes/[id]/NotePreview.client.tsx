// app/@modal/(.)notes/[id]/NotePreview.client.tsx

"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNotesById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import css from "./NotePreview.module.css"; 

interface NotePreviewClientProps {
    id: string;
}

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
    const router = useRouter();

    const { data: note, isLoading, isError } = useQuery({
        queryKey: ["note", id],
        queryFn: () => fetchNotesById(id),
        refetchOnMount: false,
    });

    const handleClose = () => {
        router.back();
    };

    if (isLoading) {
        return (
            <Modal onClose={handleClose}>
                <p>Loading, please wait...</p>
            </Modal>
        );
    }

    if (isError || !note) {
        return (
            <Modal onClose={handleClose}>
                <p>Something went wrong.</p>
            </Modal>
        );
    }

    return (
        <Modal onClose={handleClose}>
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
        </Modal>
    );
}