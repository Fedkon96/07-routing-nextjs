import axios from 'axios';
import { Note } from '../types/note';

const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${myKey}`,
    Accept: 'application/json',
  },
});

interface FetchNotesParams {
  page: number;
  search: string;
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNoteCreate {
  title: string;
  content: string;
  tag: string;
}

// ! GET
export async function fetchNotes({
  search,
  page,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params: { search, page, perPage: 6 },
  });
  return data;
}

export async function fetchNoteId(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

// ! POST
export async function createNote(newNote: FetchNoteCreate): Promise<Note> {
  const { data } = await api.post<Note>('/notes', newNote);
  return data;
}

// ! DELETE
export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}
