import { LuFileText, LuBookOpen, LuShapes } from "react-icons/lu";
import type { IconType } from "react-icons";
import type { ChallengeType } from "../services/challengeApi";

// Labels FR des types de défis
export const CHALLENGE_TYPE_LABELS: Record<ChallengeType, string> = {
  pages_read:      "Pages lues",
  books_completed: "Livres terminés",
  genres_read:     "Genres explorés",
};

// Unités d'affichage
export const CHALLENGE_TYPE_UNITS: Record<ChallengeType, string> = {
  pages_read:      "pages",
  books_completed: "livres",
  genres_read:     "genres",
};

// Icônes associées
export const CHALLENGE_TYPE_ICONS: Record<ChallengeType, IconType> = {
  pages_read:      LuFileText,
  books_completed: LuBookOpen,
  genres_read:     LuShapes,
};