// lib/api/serverApi.ts

import { cookies } from "next/headers";
import { api } from "./api";
import { User } from "@/types/user";

async function getCookieHeader() {
    const cookieStore = await cookies();
    return cookieStore.toString();
}

export const fetchNotes = async (page = 1, perPage = 12, search = "", tag = "") => {
    const cookie = await getCookieHeader();
    const { data } = await api.get("/notes", {
        params: { page, perPage, search, tag },
        headers: { Cookie: cookie },
    });
    return data;
};

export const fetchNoteById = async (id: string) => {
    const cookie = await getCookieHeader();
    const { data } = await api.get(`/notes/${id}`, {
        headers: { Cookie: cookie },
    });
    return data;
};

export const getMe = async (): Promise<User> => {
    const cookie = await getCookieHeader();
    const { data } = await api.get("/users/me", {
        headers: { Cookie: cookie },
    });
    return data;
};

export const checkSession = async (): Promise<User | null> => {
    try {
        const cookie = await getCookieHeader();
        const { data } = await api.get("/auth/session", {
            headers: { Cookie: cookie },
        });
        return data || null;
    } catch {
        return null;
    }
};