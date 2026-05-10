import { api } from "./api";

// Une session de lecture (forme retournée par l'API)
export type ReadingSession = {
  id: number;
  user_book_id: number;
  pages_read: number;
  session_date: string;
  duration_minutes: number | null;
  created_at: string;
};

// Payload pour créer une session
export type CreateSessionPayload = {
  pages_read: number;
  duration_minutes?: number;
  session_date?: string;
};

export const readingSessionApi = {
  // Récupère les sessions d'un livre précis
  getSessionsForBook: async (userBookId: number) => {
    const response = await api.get<{ sessions: ReadingSession[] }>(
      `/library/${userBookId}/sessions`
    );
    return response.sessions;
  },

  // Crée une nouvelle session de lecture
  createSession: (userBookId: number, payload: CreateSessionPayload) =>
    api.post<{ message: string; session_id: number; current_page: number; status: string }>(
      `/library/${userBookId}/sessions`,
      payload
    ),
};