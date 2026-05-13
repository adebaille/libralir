import { useState } from "react";
import { LuPencil, LuCheck, LuX } from "react-icons/lu";
import { userApi, type UserProfile } from "../../services/userApi";

type ProfileHeaderProps = {
  user: UserProfile;
  onDisplayNameUpdated: (newName: string) => void;
};

export default function ProfileHeader({
  user,
  onDisplayNameUpdated,
}: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(user.display_name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Date d'inscription formatée en français
  const joinedDate = new Date(user.created_at).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  function startEditing() {
    setInputValue(user.display_name);
    setError(null);
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = inputValue.trim();
    if (trimmed.length < 2 || trimmed.length > 50) {
      setError("Le nom doit contenir entre 2 et 50 caractères");
      return;
    }

    if (trimmed === user.display_name) {
      setIsEditing(false);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await userApi.updateDisplayName(trimmed);
      onDisplayNameUpdated(response.display_name);
      setIsEditing(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la mise à jour";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <header className="flex items-start gap-4 mb-8">
      {/* Avatar avec initiale */}
      <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-violet-500 text-white font-medium rounded-full text-2xl md:text-3xl shrink-0">
        {user.display_name.charAt(0).toUpperCase()}
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                minLength={2}
                maxLength={50}
                autoFocus
                disabled={isSubmitting}
                className="flex-1 min-w-0 font-serif text-xl md:text-2xl font-semibold text-gray-900 px-2 py-1 border border-violet-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                aria-label="Enregistrer"
                className="flex items-center justify-center w-9 h-9 bg-violet-500 hover:bg-violet-600 text-white rounded-full transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shrink-0"
              >
                <LuCheck className="text-lg" />
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                disabled={isSubmitting}
                aria-label="Annuler"
                className="flex items-center justify-center w-9 h-9 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full transition-colors disabled:cursor-not-allowed shrink-0"
              >
                <LuX className="text-lg" />
              </button>
            </div>
            {error && (
              <p className="text-xs text-red-600 mt-2" role="alert">
                {error}
              </p>
            )}
          </form>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl md:text-3xl font-semibold text-gray-900 truncate">
              {user.display_name}
            </h1>
            <button
              type="button"
              onClick={startEditing}
              aria-label="Modifier mon nom"
              className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-violet-700 hover:bg-violet-50 rounded-full transition-colors shrink-0"
            >
              <LuPencil className="text-base" />
            </button>
          </div>
        )}

        <p className="text-sm text-gray-500 truncate">{user.email}</p>
        <p className="text-xs text-gray-400 mt-1">
          Membre depuis {joinedDate}
        </p>
      </div>
    </header>
  );
}