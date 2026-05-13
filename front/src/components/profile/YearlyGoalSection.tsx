import { useState } from "react";
import { LuTarget, LuCheck } from "react-icons/lu";
import { userApi } from "../../services/userApi";

type YearlyGoalSectionProps = {
  currentGoal: number;
  onGoalUpdated: (newGoal: number) => void;
};

export default function YearlyGoalSection({
  currentGoal,
  onGoalUpdated,
}: YearlyGoalSectionProps) {
  const [inputValue, setInputValue] = useState(String(currentGoal));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Le bouton n'est actif que si la valeur a changé
  const parsedValue = parseInt(inputValue, 10);
  const hasChanged = !isNaN(parsedValue) && parsedValue !== currentGoal;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isNaN(parsedValue) || parsedValue < 0) {
      setError("L'objectif doit être un nombre positif");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setShowSuccess(false);

    try {
      await userApi.updateYearlyGoal(parsedValue);
      onGoalUpdated(parsedValue);
      setShowSuccess(true);
      // Le message disparaît après 3 secondes
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la mise à jour";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      aria-label="Objectif annuel de lecture"
      className="bg-white rounded-xl p-5 border border-gray-100 mb-6"
    >
      <div className="flex items-center gap-2 mb-2">
        <LuTarget className="text-violet-600 text-xl" />
        <h2 className="font-serif text-lg font-semibold text-gray-900">
          Objectif annuel
        </h2>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Définis combien de livres tu veux lire cette année.
        {currentGoal === 0 && " Mets 0 si tu préfères ne pas avoir d'objectif."}
      </p>

      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1">
          <label
            htmlFor="yearly-goal-input"
            className="block text-xs font-medium text-gray-700 mb-1.5"
          >
            Livres par an
          </label>
          <input
            id="yearly-goal-input"
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            min={0}
            max={500}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={!hasChanged || isSubmitting}
          className="bg-violet-500 hover:bg-violet-600 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "..." : "Enregistrer"}
        </button>
      </form>

      {/* Feedback de succès */}
      {showSuccess && (
        <p
          className="flex items-center gap-1 text-sm text-green-700 mt-3"
          role="status"
        >
          <LuCheck className="text-base" />
          Objectif enregistré
        </p>
      )}

      {/* Erreur */}
      {error && (
        <p className="text-sm text-red-600 mt-3" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}