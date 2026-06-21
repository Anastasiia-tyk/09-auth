// app/@modal/(.)notes/[id]/page.tsx

import { fetchNotesById } from "@/lib/api";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import NotePreviewClient from "./NotePreview.client"

type Props = {
    params: Promise<{
        id: string;
    }>;
}

const NotePreview = async ({ params }: Props) => {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["note", id],
        queryFn: () => fetchNotesById(id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NotePreviewClient id={id} />
        </HydrationBoundary>
    );
}

export default NotePreview;