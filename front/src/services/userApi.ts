import { api } from "./api";

// Profil de l'utilisateur connecté (retour de GET /api/me)
export type UserProfile = {
  id: number;
  email: string;
  display_name: string;
  yearly_goal_books: number;
  created_at: string;
};

// Payload pour supprimer le compte
export type DeleteAccountPayload = {
  password: string;
};

export const userApi = {
  // Récupère le profil de l'user connecté
  getProfile: () => api.get<UserProfile>("/me"),

  // Met à jour l'objectif annuel de livres
  updateYearlyGoal: (yearlyGoalBooks: number) =>
    api.put<{ message: string }>("/me/yearly-goal", {
      yearly_goal_books: yearlyGoalBooks,
    }),

    // Met à jour le nom de lecteur
  updateDisplayName: (displayName: string) =>
    api.put<{ message: string; display_name: string }>("/me/display-name", {
      display_name: displayName,
    }),

  // Supprime le compte de l'utilisateur (nécessite le mot de passe)
  deleteAccount: (payload: DeleteAccountPayload) =>
    api.delete<{ message: string }>("/account", payload),
};