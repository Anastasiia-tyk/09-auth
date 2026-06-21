// store/NoteStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DraftObject {
    title: string;
    content: string;
    tag: string;
}

interface NoteStore {
    draft: DraftObject;
    setDraft: (note: Partial<DraftObject>) => void;
    clearDraft: () => void;
}

const initialDraft: DraftObject = {
    title: "",
    content: "",
    tag: "Todo",
};

export const useNoteStore = create<NoteStore>()(
    persist(
        (set) => ({
            draft: initialDraft,
            setDraft: (note) =>
                set((state) => ({
                    draft: { ...state.draft, ...note },
                })),
            clearDraft: () => set({ draft: initialDraft }),
        }),
        {
            name: "note-draft-storage",
            partialize: (state) => ({ draft: state.draft }),
        }
    )
);