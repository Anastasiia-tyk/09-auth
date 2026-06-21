// app/notes/Notes.client.tsx

"use client";

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import Link from "next/link";

import css from "./NotesPage.module.css";

import { fetchNotes } from "@/lib/api/clientApi";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";


interface NotesClientProps {
    tag: string;
}

export default function Notes({ tag }: NotesClientProps) {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    
    const perPage = 12;

    const { data } = useQuery({
        queryKey: ["notes", currentPage, searchQuery, tag],
        queryFn: () => fetchNotes(currentPage, perPage, searchQuery, tag),
        placeholderData: keepPreviousData,
    });

    const notes = data?.notes || [];
    const totalPages = data?.totalPages || 0;

    const updateSearchQuery = useDebouncedCallback((value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    },
        300
    );

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSearchQuery(e.target.value)} />

                {totalPages > 1 && (
                    <Pagination
                        pageCount={totalPages}
                        forcePage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                )}
                
                <Link href="/notes/action/create" className={css.button}>
                    Create note +
                </Link>
            </header>
            
            {notes.length > 0 && (
                <NoteList notes={notes} />
            )}
        </div>
    );
}