import { useState, useEffect } from "react";
import { LuX } from "react-icons/lu";
import { readingSessionApi } from "../../services/readingSessionApi";

type AddSessionModalProps = {
  userBookId: number;
  remainingPages: number;
  onClose: () => void;
  onSessionAdded: () => void;
};

export default function AddSessionModal({
  userBookId,
  remainingPages,
  onClose,
  onSessionAdded,
}: AddSessionModalProps) {
  const [pagesRead, setPagesRead] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ferme la modal sur la touche Échap
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const pagesNumber = parseInt(pagesRead, 10);
    if (isNaN(pagesNumber) || pagesNumber <= 0) {
      setError("Le nombre de pages doit être supérieur à 0");
      return;
    }

    if (pagesNumber > remainingPages) {
      setError(`Il ne reste que ${remainingPages} pages dans ce livre`);
      return;
    }

    let durationNumber: number | undefined;
    if (durationMinutes.trim().length > 0) {
      durationNumber = parseInt(durationMinutes, 10);
      if (isNaN(durationNumber) || durationNumber <= 0) {
        setError("La durée doit être supérieure à 0");
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await readingSessionApi.createSession(userBookId, {
        pages_read: pagesNumber,
        duration_minutes: durationNumber,
      });
      onSessionAdded();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de l'ajout";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-session-title"
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-md p-6 animate-slide-up md:animate-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2
            id="add-session-title"
            className="font-serif text-xl font-semibold text-gray-900"
          >
            Ajouter une session
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <LuX className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pages lues */}
          <div>
            <label
              htmlFor="session-pages"
              className="block text-xs font-medium text-gray-700 mb-1.5"
            >
              Pages lues <span className="text-red-500">*</span>
            </label>
            <input
              id="session-pages"
              type="number"
              value={pagesRead}
              onChange={(e) => setPagesRead(e.target.value)}
              required
              min={1}
              max={remainingPages}
              autoFocus
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">
              Il reste {remainingPages} pages dans ce livre
            </p>
          </div>

          {/* Durée (optionnelle) */}
          <div>
            <label
              htmlFor="session-duration"
              className="block text-xs font-medium text-gray-700 mb-1.5"
            >
              Durée (minutes)
            </label>
            <input
              id="session-duration"
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              min={1}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
              disabled={isSubmitting}
              className="flex-1 bg-violet-500 hover:bg-violet-600 text-white py-2.5 rounded-full text-sm font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Ajout..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}