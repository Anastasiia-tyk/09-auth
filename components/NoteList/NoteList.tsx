// src/components/NoteList/NoteList.tsx

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Note } from '../../types/note';
import { deleteNote } from '../../lib/api';
import Link from 'next/link';

import css from './NoteList.module.css';

interface NoteListProps {
    notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteNote(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
        onError: (error) => {
            console.error("Error deleting note:", error);
        }
    });

    return (
        <ul className={css.list}>
            {notes.map(({ id, title, content, tag }) => (
                <li key={id} className={css.listItem}>
                    <h2 className={css.title}>{title}</h2>
                    <p className={css.content}>{content}</p>
                    <div className={css.footer}>
                        <span className={css.tag}>{tag}</span>
                        <Link href={`/notes/${id}`} className={css.link}>
                            View details
                        </Link>
                        <button 
                            className={css.button} 
                            onClick={() => deleteMutation.mutate(id)}
                            disabled={deleteMutation.isPending}
                        >
                            Delete
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}