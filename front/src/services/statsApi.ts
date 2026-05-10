import { api } from "./api";

// Réponse de GET /api/stats/dashboard
export type DashboardStats = {
  year: number;
  books_read: number;
  pages_read: number;
  minutes_read: number;
  yearly_goal_books: number;
};

export const statsApi = {
  // Récupère les stats annuelles agrégées pour le dashboard
  getDashboardStats: () => api.get<DashboardStats>("/stats/dashboard"),
};