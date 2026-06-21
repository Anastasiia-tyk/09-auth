// lib/api/clientApi.ts
import { api } from "./api";
import { User } from "@/types/user";
import { Note, NoteTag } from "@/types/note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  currentPage: number;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  tag: NoteTag;
}


export const fetchNotes = async (
  page: number = 1,
  perPage: number = 12,
  search: string = "",
  tag: NoteTag | "all" | "" = ""
): Promise<FetchNotesResponse> => {
  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: { page, perPage, search, tag: tag === "all" ? "" : tag },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (note: CreateNoteInput): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const register = async (body: AuthCredentials): Promise<User> => {
  const { data } = await api.post<User>("/auth/register", body);
  return data;
};

export const login = async (body: AuthCredentials): Promise<User> => {
  const { data } = await api.post<User>("/auth/login", body);
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post<void>("/auth/logout");
};

export const checkSession = async (): Promise<User | null> => {
  const { data } = await api.get<User | null>("/auth/session");
  return data || null;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>("/users/me");
  return data;
};

export const updateMe = async (body: { username: string }): Promise<User> => {
  const { data } = await api.patch<User>("/users/me", body);
  return data;
};