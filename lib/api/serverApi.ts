// lib/api/serverApi.ts

import "server-only";

import { cookies } from "next/headers";
import { api } from "./api";
import { User } from "@/types/user";
import { Note } from "@/types/note";
import { AxiosResponse } from "axios";
import { FetchNotesResponse } from "./clientApi";

async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.toString();
}

export const fetchNotes = async (
  page: number = 1,
  perPage: number = 12,
  search: string = "",
  tag: string = ""
): Promise<FetchNotesResponse> => {
  const cookie = await getCookieHeader();
  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: { page, perPage, search, tag },
    headers: { Cookie: cookie },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookie = await getCookieHeader();
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookie },
  });
  return data;
};

export const getMe = async (): Promise<User> => {
  const cookie = await getCookieHeader();
  const { data } = await api.get<User>("/users/me", {
    headers: { Cookie: cookie },
  });
  return data;
};

export const checkSession = async (): Promise<AxiosResponse<User | null>> => {
  const cookie = await getCookieHeader();
  const response = await api.get<User | null>("/auth/session", {
    headers: { Cookie: cookie },
  });
  return response;
};