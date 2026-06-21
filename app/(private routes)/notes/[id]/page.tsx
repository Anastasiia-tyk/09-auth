// app/notes/[id]/page.tsx

import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next"; 
import { fetchNotesById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

interface PageProps {
    params: Promise<{ id: string }>;
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const notes = await fetchNotesById(id);
    return {
        title: notes.title,
        description: notes.content.slice(0, 30),
        openGraph: {
            title: notes.title,
            description: notes.content.slice(0, 100),
            url: `https://notehub.com/notes/${id}`,
            images: [
                {
                    url: `https://ac.goit.global/fullstack/react/notehub-og-meta.jpg`,
                    width: 1200,
                    height: 630,
                    alt: notes.title,
                },
            ],
            type: 'article',
        },
    }
}

export default async function NoteDetailsPage({ params }: PageProps) {
    const { id } = await params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["note", id],
        queryFn: () => fetchNotesById(id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NoteDetailsClient />
        </HydrationBoundary>
    );
}