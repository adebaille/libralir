import { useState, useEffect } from "react";
import { LuX, LuTriangleAlert } from "react-icons/lu";

type DeleteAccountModalProps = {
  onClose: () => void;
  onConfirm: (password: string) => void;
  isDeleting: boolean;
  error: string | null;
};

export default function DeleteAccountModal({
  onClose,
  onConfirm,
  isDeleting,
  error,
}: DeleteAccountModalProps) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");

  // Ferme la modal sur Échap
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape" && !isDeleting) onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose, isDeleting]);

  // L'user doit taper "SUPPRIMER" exactement pour activer le bouton
  const isConfirmationValid = confirmation === "SUPPRIMER";
  const canSubmit = password.length > 0 && isConfirmationValid && !isDeleting;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onConfirm(password);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-account-title"
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50"
      onClick={isDeleting ? undefined : onClose}
    >
      <div
        className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-md p-6 animate-slide-up md:animate-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <LuTriangleAlert className="text-red-600 text-xl" />
            <h2
              id="delete-account-title"
              className="font-serif text-xl font-semibold text-gray-900"
            >
              Supprimer mon compte
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Fermer"
            className="text-gray-400 hover:text-gray-700 transition-colors disabled:cursor-not-allowed"
          >
            <LuX className="text-2xl" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Cette action est définitive. Tous tes livres, sessions et badges
          seront supprimés.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Confirmation textuelle */}
          <div>
            <label
              htmlFor="delete-confirmation"
              className="block text-xs font-medium text-gray-700 mb-1.5"
            >
              Tape <strong>SUPPRIMER</strong> pour confirmer
            </label>
            <input
              id="delete-confirmation"
              type="text"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              disabled={isDeleting}
              autoComplete="off"
              autoFocus
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label
              htmlFor="delete-password"
              className="block text-xs font-medium text-gray-700 mb-1.5"
            >
              Mot de passe <span className="text-red-500">*</span>
            </label>
            <input
              id="delete-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isDeleting}
              required
              autoComplete="current-password"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
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
              disabled={isDeleting}
              className="flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 py-2.5 rounded-full text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-full text-sm font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}