import type { BookStatus } from "../../services/libraryApi";
import { STATUS_LABELS } from "../../constants/bookStatus";

// "all" pour afficher tous les livres, ou un BookStatus pour filtrer
export type StatusFilter = "all" | BookStatus;

type LibraryStatusTabsProps = {
  activeFilter: StatusFilter;
  onChange: (filter: StatusFilter) => void;
};

// Ordre d'affichage des tabs
const TAB_ORDER: StatusFilter[] = [
  "all",
  "to_read",
  "in_progress",
  "completed",
  "paused",
  "abandoned",
];

// Label spécial pour "all", sinon on utilise les STATUS_LABELS
function getTabLabel(filter: StatusFilter): string {
  if (filter === "all") return "Tous";
  return STATUS_LABELS[filter];
}

export default function LibraryStatusTabs({
  activeFilter,
  onChange,
}: LibraryStatusTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Filtrer par statut"
      className="flex gap-1 overflow-x-auto border-b border-gray-200 mb-4 -mx-4 px-4 md:mx-0 md:px-0"
    >
      {TAB_ORDER.map((filter) => {
        const isActive = filter === activeFilter;
        return (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(filter)}
            className={`
              shrink-0 py-2 px-3 text-sm font-medium transition-colors
              border-b-2 -mb-px whitespace-nowrap
              ${
                isActive
                  ? "border-violet-500 text-violet-700"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }
            `}
          >
            {getTabLabel(filter)}
          </button>
        );
      })}
    </div>
  );
}