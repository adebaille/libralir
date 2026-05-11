import { LuSearch, LuLayoutGrid, LuList } from "react-icons/lu";
import type { LibraryOrderBy } from "../../services/libraryApi";

export type ViewMode = "grid" | "list";

type LibraryFiltersProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  orderBy: LibraryOrderBy;
  onOrderByChange: (value: LibraryOrderBy) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
};

// Options de tri proposées dans le dropdown
const ORDER_OPTIONS: { value: LibraryOrderBy; label: string }[] = [
  { value: "created_at_desc", label: "Ajout récent" },
  { value: "created_at_asc",  label: "Ajout ancien" },
  { value: "title_asc",       label: "Titre A→Z" },
  { value: "author_asc",      label: "Auteur A→Z" },
];

export default function LibraryFilters({
  searchValue,
  onSearchChange,
  orderBy,
  onOrderByChange,
  viewMode,
  onViewModeChange,
}: LibraryFiltersProps) {
  return (
    <div className="space-y-3 mb-4">
      {/* Barre de recherche */}
      <div className="relative">
        <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
        <input
          type="search"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher par titre ou auteur..."
          className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          aria-label="Rechercher un livre"
        />
      </div>

      {/* Tri + toggle vue */}
      <div className="flex items-center justify-between gap-3">
        <select
          value={orderBy}
          onChange={(e) => onOrderByChange(e.target.value as LibraryOrderBy)}
          aria-label="Trier par"
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          {ORDER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Toggle Grille / Liste */}
        <div
          role="group"
          aria-label="Mode d'affichage"
          className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden"
        >
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            aria-label="Vue grille"
            aria-pressed={viewMode === "grid"}
            className={`p-2 transition-colors ${
              viewMode === "grid"
                ? "bg-violet-100 text-violet-700"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <LuLayoutGrid className="text-lg" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            aria-label="Vue liste"
            aria-pressed={viewMode === "list"}
            className={`p-2 transition-colors ${
              viewMode === "list"
                ? "bg-violet-100 text-violet-700"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <LuList className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}