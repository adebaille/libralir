import { api } from "./api";

// Statuts possibles pour un livre dans la bibliothèque
export type BookStatus =
  | "to_read"
  | "in_progress"
  | "completed"
  | "paused"
  | "abandoned";

// Un livre dans la bibliothèque d'un user (forme retournée par l'API)
export type LibraryBook = {
  user_book_id: number;
  status: BookStatus;
  current_page: number;
  created_at: string;
  book_id: number;
  title: string;
  author: string | null;
  total_pages: number;
  thumbnail_url: string | null;
  categories: string[];
};

// Filtres optionnels pour la requête /api/library
export type LibraryFilters = {
  status?: BookStatus;
  author?: string;
  title?: string;
  category?: string;
  order_by?: string;
};

export const libraryApi = {
  // Récupère la bibliothèque de l'user, avec filtres optionnels
 getLibrary: async (filters: LibraryFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });
    const query = params.toString() ? `?${params.toString()}` : "";

    const response = await api.get<{ books: LibraryBook[] }>(`/library${query}`);
    return response.books;
  },
};