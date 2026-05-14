import { api } from "./api";

// Types de défis supportés par le back
export type ChallengeType = "pages_read" | "books_completed" | "genres_read";

// Un défi avec sa progression (forme retournée par GET /api/challenges)
export type Challenge = {
  id: number;
  user_id: number;
  month: number;
  year: number;
  challenge_type: ChallengeType;
  target_value: number;
  current_value: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
};

// Payload pour créer un défi
export type CreateChallengePayload = {
  month: number;
  year: number;
  challenge_type: ChallengeType;
  target_value: number;
};

export const challengeApi = {
  // Récupère les défis d'un mois
  getChallengesByMonth: async (month: number, year: number) => {
    const response = await api.get<{ challenges: Challenge[] }>(
      `/challenges?month=${month}&year=${year}`
    );
    return response.challenges;
  },

  // Récupère l'historique des défis passés (mois antérieurs au mois courant)
  getHistory: async () => {
    const response = await api.get<{ challenges: Challenge[] }>("/challenges/history");
    return response.challenges;
  },

  // Crée un nouveau défi
  createChallenge: (payload: CreateChallengePayload) =>
    api.post<{ message: string; challenge_id: number }>("/challenges", payload),

  // Met à jour la cible d'un défi
  updateChallenge: (challengeId: number, targetValue: number) =>
    api.put<{ message: string }>(`/challenges/${challengeId}`, {
      target_value: targetValue,
    }),

  // Supprime un défi
  deleteChallenge: (challengeId: number) =>
    api.delete<{ message: string }>(`/challenges/${challengeId}`),
};