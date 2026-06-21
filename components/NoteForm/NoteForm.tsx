// components/NoteFrom/NoteFrom.tsx

"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import { useNoteStore } from "@/lib/store/noteStore";
import type { NoteTag } from "@/types/note";

import css from "./NoteForm.module.css";

const tags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function NoteForm() {
    const router = useRouter();
    const queryClient = useQueryClient();
    
    const draft = useNoteStore((state) => state.draft);
    const setDraft = useNoteStore((state) => state.setDraft);
    const clearDraft = useNoteStore((state) => state.clearDraft);

    const mutation = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            clearDraft();
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            router.push("/notes/filter/all");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!draft.title.trim() || !draft.content.trim()) return;

        mutation.mutate({
            title: draft.title,
            content: draft.content,
            tag: draft.tag as NoteTag,
        });
    };

    return (
        <form onSubmit={handleSubmit} className={css.form}>
            <div className={css.field}>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    value={draft.title}
                    onChange={(e) => setDraft({ title: e.target.value })}
                    required
                />
            </div>
            
            <div className={css.field}>
                <label htmlFor="tag">Tag</label>
                <select
                    id="tag"
                    value={draft.tag}
                    onChange={(e) => setDraft({ tag: e.target.value })}
                >
                    {tags.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>
            </div>

            <div className={css.field}>
                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    value={draft.content}
                    onChange={(e) => setDraft({ content: e.target.value })}
                    required
                />
            </div>
            
            <div className={css.actions}>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className={css.cancelButton}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className={css.submitButton}
                >
                    {mutation.isPending ? "Saving..." : "Create Note"}
                </button>
            </div>
        </form>
    );
}