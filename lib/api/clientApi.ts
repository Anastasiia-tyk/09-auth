// lib/api/clientApi.ts

import { api } from "@/lib/api/api";
import { User } from "@/types/user";
import { NoteTag } from "@/types/note";

export const fetchNotes = async (page = 1, perPage = 12, search = "", tag = "") => {
    const { data } = await api.get("/notes", { params: { page, perPage, search, tag } });
    return data;
};

export const fetchNoteById = async (id: string) => {
    const { data } = await api.get(`/notes/${id}`);
    return data;
};

export const createNote = async (note: { title: string; content: string; tag: NoteTag }) => {
    const { data } = await api.post("/notes", note);
    return data;
};

export const deleteNote = async (id: string) => {
    const { data } = await api.delete(`/notes/${id}`);
    return data;
};

export const register = async (body: Record<string, string>): Promise<User> => {
    const { data } = await api.post("/auth/register", body);
    return data;
};

export const login = async (body: Record<string, string>): Promise<User> => {
    const { data } = await api.post("/auth/login", body);
    return data;
};

export const logout = async (): Promise<void> => {
    await api.post("/auth/logout");
};

export const checkSession = async (): Promise<User | null> => {
    const { data } = await api.get("/auth/session");
    return data || null;
};

export const getMe = async (): Promise<User> => {
    const { data } = await api.get("/users/me");
    return data;
};

export const updateMe = async (body: { username: string }): Promise<User> => {
    const { data } = await api.patch("/users/me", body);
    return data;
};