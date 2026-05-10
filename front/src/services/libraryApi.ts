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
  completed_at: string | null;
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

// Réponse d'un résultat de recherche Google Books
export type SearchResultBook = {
  google_books_id: string;
  title: string;
  authors: string[];
  page_count: number | null;
  isbn_13: string | null;
  thumbnail: string | null;
  categories: string[];
};

// Payload pour ajouter un livre via Google Books
export type AddBookFromGoogle = {
  google_books_id: string;
  title: string;
  authors: string[];
  page_count: number;
  isbn_13?: string | null;
  thumbnail?: string | null;
  categories?: string[];
};

// Payload pour ajouter un livre en saisie manuelle
export type AddBookManual = {
  title: string;
  author?: string;
  page_count: number;
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

  // Recherche dans Google Books
  searchBooks: async (query: string) => {
    const response = await api.get<{ books: SearchResultBook[] }>(
      `/books/search?q=${encodeURIComponent(query)}`
    );
    return response.books;
  },

  // Ajoute un livre à la bibliothèque (Google Books ou manuel)
  addBook: (payload: AddBookFromGoogle | AddBookManual) =>
    api.post<{ message: string }>("/library", payload),

  // Récupère un livre précis de la bibliothèque
  getBook: async (userBookId: number) => {
    const response = await api.get<{ book: LibraryBook }>(`/library/${userBookId}`);
    return response.book;
  },

  // Met à jour le statut et/ou la progression
  updateBook: (userBookId: number, payload: { status?: BookStatus; current_page?: number }) =>
    api.put<{ message: string }>(`/library/${userBookId}`, payload),

  // Retire un livre de la bibliothèque
  deleteBook: (userBookId: number) =>
    api.delete<{ message: string }>(`/library/${userBookId}`),
};