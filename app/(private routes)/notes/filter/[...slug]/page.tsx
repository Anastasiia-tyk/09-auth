// app/notes/page.tsx

import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/serverApi";
import NotesClient from "./Notes.client";
import { Metadata } from "next";

interface Props {
    params: Promise<{
        slug: string[];
    }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const rawTag = resolvedParams.slug?.[0] || "all";
    
    const formattedTag = rawTag.charAt(0).toUpperCase() + rawTag.slice(1);
    const pageTitle = `${formattedTag} Notes | NoteHub`;
    const pageDescription = `${formattedTag}`;

    return {
        title: pageTitle,
        description: pageDescription,
        openGraph: {
            title: pageTitle,
            description: pageDescription,
            url: `https://notehub.com/notes/filter/${rawTag}`,
            images: [
                {
                    url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
                    width: 1200,
                    height: 630,
                    alt: `${formattedTag} Notes Category`,
                },
            ],
        },
    };
}

export default async function NotesPage({ params }: Props) {
    const resolvedParams = await params;

    const currentTag = resolvedParams.slug?.[0] || "all";

    const queryClient = new QueryClient();
    const defaultPage = 1;
    const defaultPerPage = 12;
    const defaultSearch = "";

    await queryClient.prefetchQuery({
        queryKey: ["notes", defaultPage, defaultSearch, currentTag],
        queryFn: () => fetchNotes(defaultPage, defaultPerPage, defaultSearch, currentTag),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NotesClient tag={currentTag} />
        </HydrationBoundary>
    );
}