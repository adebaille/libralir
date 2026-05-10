import { useState } from "react";
import { libraryApi } from "../../services/libraryApi";

type ManualTabProps = {
  onBookAdded: () => void;
};

export default function ManualTab({ onBookAdded }: ManualTabProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setTitle("");
    setAuthor("");
    setPageCount("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (trimmedTitle.length === 0) {
      setError("Le titre est requis");
      return;
    }

    const pageCountNumber = parseInt(pageCount, 10);
    if (isNaN(pageCountNumber) || pageCountNumber <= 0) {
      setError("Le nombre de pages doit être supérieur à 0");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await libraryApi.addBook({
        title: trimmedTitle,
        author: author.trim() || undefined,
        page_count: pageCountNumber,
      });
      resetForm();
      onBookAdded();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de l'ajout";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Titre (obligatoire) */}
      <div>
        <label
          htmlFor="manual-title"
          className="block text-xs font-medium text-gray-700 mb-1.5"
        >
          Titre <span className="text-red-500">*</span>
        </label>
        <input
          id="manual-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={255}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
      </div>

      {/* Auteur (optionnel) */}
      <div>
        <label
          htmlFor="manual-author"
          className="block text-xs font-medium text-gray-700 mb-1.5"
        >
          Auteur
        </label>
        <input
          id="manual-author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          maxLength={255}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
      </div>

      {/* Nombre de pages (obligatoire) */}
      <div>
        <label
          htmlFor="manual-pages"
          className="block text-xs font-medium text-gray-700 mb-1.5"
        >
          Nombre de pages <span className="text-red-500">*</span>
        </label>
        <input
          id="manual-pages"
          type="number"
          value={pageCount}
          onChange={(e) => setPageCount(e.target.value)}
          required
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

      {/* Bouton d'envoi */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="block mx-auto bg-violet-500 hover:bg-violet-600 text-white px-8 py-3 rounded-full text-sm font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Ajout en cours..." : "Ajouter le livre"}
      </button>
    </form>
  );
}