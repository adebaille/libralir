import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  libraryApi,
  type LibraryBook,
  type LibraryOrderBy,
  type BookStatus,
} from "../services/libraryApi";
import LibraryStatusTabs, {
  type StatusFilter,
} from "../components/library/LibraryStatusTabs";
import LibraryFilters, {
  type ViewMode,
} from "../components/library/LibraryFilters";
import LibraryGrid from "../components/library/LibraryGrid";
import LibraryList from "../components/library/LibraryList";

export default function LibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // État des filtres (initialisés depuis l'URL si présents)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    (searchParams.get("status") as StatusFilter) || "all"
  );
  const [searchValue, setSearchValue] = useState("");
  const [orderBy, setOrderBy] = useState<LibraryOrderBy>("created_at_desc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // État des données
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Synchronise le filtre statut dans l'URL (pour le partage et le retour)
  useEffect(() => {
    if (statusFilter === "all") {
      searchParams.delete("status");
    } else {
      searchParams.set("status", statusFilter);
    }
    setSearchParams(searchParams, { replace: true });
  }, [statusFilter, searchParams, setSearchParams]);

  // Charge les livres à chaque changement de filtre
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError(null);

    libraryApi
      .getLibrary({
        status: statusFilter === "all" ? undefined : (statusFilter as BookStatus),
        title: searchValue || undefined,
        order_by: orderBy,
      })
      .then((data) => {
        setBooks(data);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Erreur de chargement";
        setError(message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [statusFilter, searchValue, orderBy]);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <h1 className="font-serif text-3xl font-semibold text-gray-900 mb-6">
        Bibliothèque
      </h1>

      <LibraryStatusTabs
        activeFilter={statusFilter}
        onChange={setStatusFilter}
      />

      <LibraryFilters
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        orderBy={orderBy}
        onOrderByChange={setOrderBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {isLoading && (
        <p className="text-gray-500" role="status">
          Chargement...
        </p>
      )}

      {error && (
        <p className="text-red-600" role="alert">
          {error}
        </p>
      )}

      {!isLoading && !error && books.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          Aucun livre {statusFilter !== "all" ? "pour ce filtre" : "pour le moment"}
        </p>
      )}

      {!isLoading && !error && books.length > 0 && (
        viewMode === "grid" ? (
          <LibraryGrid books={books} />
        ) : (
          <LibraryList books={books} />
        )
      )}
    </div>
  );
}