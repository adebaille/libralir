import { useState, useEffect } from "react";
import { LuX } from "react-icons/lu";
import type { ChallengeType } from "../../services/challengeApi";
import { CHALLENGE_TYPE_LABELS, CHALLENGE_TYPE_UNITS } from "../../constants/challengeTypes";
import type { ChallengeSuggestion } from "./SuggestionCard";

type CreateChallengeModalProps = {
  onClose: () => void;
  onConfirm: (type: ChallengeType, targetValue: number) => void;
  isSubmitting: boolean;
  error: string | null;
  // Si fourni, pré-remplit le formulaire avec une suggestion
  prefilledSuggestion?: ChallengeSuggestion;
  // Types déjà créés ce mois, pour griser les options
  existingTypes: ChallengeType[];
};

const ALL_TYPES: ChallengeType[] = ["pages_read", "books_completed", "genres_read"];

export default function CreateChallengeModal({
  onClose,
  onConfirm,
  isSubmitting,
  error,
  prefilledSuggestion,
  existingTypes,
}: CreateChallengeModalProps) {
  const [selectedType, setSelectedType] = useState<ChallengeType>(
    prefilledSuggestion?.challenge_type ?? "pages_read"
  );
  const [targetValue, setTargetValue] = useState(
    String(prefilledSuggestion?.target_value ?? "")
  );

  // Ferme la modal sur Escape
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape" && !isSubmitting) onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose, isSubmitting]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedValue = parseInt(targetValue, 10);
    if (isNaN(parsedValue) || parsedValue <= 0) return;
    onConfirm(selectedType, parsedValue);
  }

  const parsedValue = parseInt(targetValue, 10);
  const canSubmit =
    !isNaN(parsedValue) &&
    parsedValue > 0 &&
    !existingTypes.includes(selectedType) &&
    !isSubmitting;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-challenge-title"
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50"
      onClick={isSubmitting ? undefined : onClose}
    >
      <div
        className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2
            id="create-challenge-title"
            className="font-serif text-xl font-semibold text-gray-900"
          >
            Nouveau défi
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Fermer"
            className="text-gray-400 hover:text-gray-700 transition-colors disabled:cursor-not-allowed"
          >
            <LuX className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type de défi */}
          <div>
            <label
              htmlFor="challenge-type"
              className="block text-xs font-medium text-gray-700 mb-1.5"
            >
              Type de défi
            </label>
            <select
              id="challenge-type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ChallengeType)}
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {ALL_TYPES.map((type) => (
                <option
                  key={type}
                  value={type}
                  disabled={existingTypes.includes(type)}
                >
                  {CHALLENGE_TYPE_LABELS[type]}
                  {existingTypes.includes(type) ? " (déjà créé)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Valeur cible */}
          <div>
            <label
              htmlFor="challenge-target"
              className="block text-xs font-medium text-gray-700 mb-1.5"
            >
              Objectif ({CHALLENGE_TYPE_UNITS[selectedType]})
            </label>
            <input
              id="challenge-target"
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              min={1}
              autoFocus
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>

          {/* Erreur */}
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          {/* Boutons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 py-2.5 rounded-full text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex-1 bg-violet-500 hover:bg-violet-600 text-white py-2.5 rounded-full text-sm font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Création..." : "Créer le défi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}