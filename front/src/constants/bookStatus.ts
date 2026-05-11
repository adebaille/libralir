import type { BookStatus } from "../services/libraryApi";

// Labels FR des statuts de livre
// Source de vérité unique, utilisée partout dans l'app
export const STATUS_LABELS: Record<BookStatus, string> = {
  to_read:     "À lire",
  in_progress: "En cours de lecture",
  completed:   "Terminé",
  paused:      "En pause",
  abandoned:   "Abandonné",
};

// Couleurs Tailwind des badges de statut
export const STATUS_COLORS: Record<BookStatus, string> = {
  to_read:     "bg-gray-100 text-gray-700",
  in_progress: "bg-violet-100 text-violet-700",
  completed:   "bg-green-100 text-green-700",
  paused:      "bg-amber-100 text-amber-700",
  abandoned:   "bg-red-100 text-red-700",
};