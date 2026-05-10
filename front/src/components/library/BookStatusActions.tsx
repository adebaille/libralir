import { LuPlay, LuCheck, LuPause, LuX, LuRotateCcw } from "react-icons/lu";
import type { BookStatus } from "../../services/libraryApi";

type StatusAction = {
  label: string;
  icon: typeof LuPlay;
  targetStatus: BookStatus;
  variant: "primary" | "secondary" | "danger";
};

type BookStatusActionsProps = {
  currentStatus: BookStatus;
  isUpdating: boolean;
  onStatusChange: (newStatus: BookStatus) => void;
};

// Détermine quelles actions afficher selon le statut actuel
function getActionsForStatus(status: BookStatus): StatusAction[] {
  switch (status) {
    case "to_read":
      return [
        { label: "Démarrer la lecture", icon: LuPlay, targetStatus: "in_progress", variant: "primary" },
      ];

    case "in_progress":
      return [
        { label: "Marquer comme terminé", icon: LuCheck, targetStatus: "completed", variant: "primary" },
        { label: "Mettre en pause", icon: LuPause, targetStatus: "paused", variant: "secondary" },
        { label: "Abandonner", icon: LuX, targetStatus: "abandoned", variant: "danger" },
      ];

    case "completed":
      return [
        { label: "Reprendre la lecture", icon: LuRotateCcw, targetStatus: "in_progress", variant: "primary" },
      ];

    case "paused":
      return [
        { label: "Reprendre la lecture", icon: LuRotateCcw, targetStatus: "in_progress", variant: "primary" },
        { label: "Abandonner", icon: LuX, targetStatus: "abandoned", variant: "danger" },
      ];

    case "abandoned":
      return [
        { label: "Reprendre la lecture", icon: LuRotateCcw, targetStatus: "in_progress", variant: "primary" },
      ];
  }
}

// Classes Tailwind selon le variant
function getButtonClasses(variant: StatusAction["variant"]): string {
  const base = "flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-full text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

  switch (variant) {
    case "primary":
      return `${base} bg-violet-500 hover:bg-violet-600 text-white`;
    case "secondary":
      return `${base} bg-white border border-gray-200 text-gray-700 hover:bg-gray-50`;
    case "danger":
      return `${base} bg-white border border-red-200 text-red-700 hover:bg-red-50`;
  }
}

// Mapping statut → libellé pour l'affichage du badge
const STATUS_LABELS: Record<BookStatus, string> = {
  to_read:     "À lire",
  in_progress: "En cours de lecture",
  completed:   "Terminé",
  paused:      "En pause",
  abandoned:   "Abandonné",
};

export default function BookStatusActions({
  currentStatus,
  isUpdating,
  onStatusChange,
}: BookStatusActionsProps) {
  const actions = getActionsForStatus(currentStatus);

  return (
    <section
      aria-label="Statut et actions"
      className="bg-white rounded-xl p-4 border border-gray-100 mb-6"
    >
      <div className="mb-4">
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
          Statut
        </p>
        <p className="font-serif text-lg font-semibold text-gray-900">
          {STATUS_LABELS[currentStatus]}
        </p>
      </div>

      <div className="space-y-2">
        {actions.map((action) => (
          <button
            key={action.targetStatus}
            type="button"
            onClick={() => onStatusChange(action.targetStatus)}
            disabled={isUpdating}
            className={getButtonClasses(action.variant)}
          >
            <action.icon className="text-lg" />
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}