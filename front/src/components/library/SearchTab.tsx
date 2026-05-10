import { useState } from "react";
import { LuSearch } from "react-icons/lu";
import { libraryApi, type SearchResultBook } from "../../services/libraryApi";
import SearchResultCard from "./SearchResultCard";

type SearchTabProps = {
  onBookAdded: () => void;
};

export default function SearchTab({ onBookAdded }: SearchTabProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultBook[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setError("Saisis au moins 2 caractères");
      return;
    }

    setIsSearching(true);
    setError(null);
    setHasSearched(true);

    try {
      const books = await libraryApi.searchBooks(trimmed);
      setResults(books);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la recherche";
      setError(message);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  async function handleAdd(book: SearchResultBook) {
    if (book.page_count === null) return;

    setAddingId(book.google_books_id);
    setError(null);

    try {
      await libraryApi.addBook({
        google_books_id: book.google_books_id,
        title: book.title,
        authors: book.authors,
        page_count: book.page_count,
        isbn_13: book.isbn_13,
        thumbnail: book.thumbnail,
        categories: book.categories,
      });
      onBookAdded();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de l'ajout";
      setError(message);
    } finally {
      setAddingId(null);
    }
  }

  return (
    <div>
      {/* Barre de recherche */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un livre..."
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            aria-label="Rechercher un livre"
          />
        </div>
      </form>

      {/* Erreur */}
      {error && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}

      {/* État de chargement */}
      {isSearching && (
        <p className="text-sm text-gray-500" role="status">
          Recherche en cours...
        </p>
      )}

      {/* Résultats */}
      {!isSearching && results.length > 0 && (
        <div className="space-y-2">
          {results.map((book) => (
            <SearchResultCard
              key={book.google_books_id}
              book={book}
              onAdd={handleAdd}
              isAdding={addingId === book.google_books_id}
            />
          ))}
        </div>
      )}

      {/* État vide après recherche */}
      {!isSearching && hasSearched && results.length === 0 && !error && (
        <p className="text-sm text-gray-500 text-center py-8">
          Aucun résultat pour "{query}"
        </p>
      )}

      {/* État initial avant recherche */}
      {!hasSearched && (
        <p className="text-sm text-gray-400 text-center py-8">
          Saisis le titre ou l'auteur d'un livre pour commencer
        </p>
      )}
    </div>
  );
}