import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LuTrash2, LuArrowLeft } from "react-icons/lu";
import {
  libraryApi,
  type LibraryBook,
  type BookStatus,
} from "../services/libraryApi";
import {
  readingSessionApi,
  type ReadingSession,
} from "../services/readingSessionApi";
import BookHeader from "../components/library/BookHeader";
import BookProgress from "../components/library/BookProgress";
import BookStatusActions from "../components/library/BookStatusActions";
import SessionsList from "../components/library/SessionsList";
import AddSessionModal from "../components/library/AddSessionModal";
import SuccessToast from "../components/ui/SuccessToast";

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userBookId = id ? parseInt(id, 10) : null;

  const [book, setBook] = useState<LibraryBook | null>(null);
  const [sessions, setSessions] = useState<ReadingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

 // Charge le livre + ses sessions en parallèle
  // useCallback pour stabilité de la référence (utilisée dans handleStatusChange et handleSessionAdded)
  const loadData = useCallback(() => {
    if (userBookId === null || isNaN(userBookId)) {
      setError("Identifiant invalide");
      setIsLoading(false);
      return;
    }

    Promise.all([
      libraryApi.getBook(userBookId),
      readingSessionApi.getSessionsForBook(userBookId),
    ])
      .then(([bookData, sessionsData]) => {
        setBook(bookData);
        setSessions(sessionsData);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Erreur de chargement";
        setError(message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [userBookId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  async function handleStatusChange(newStatus: BookStatus) {
    if (!book) return;

    setIsUpdatingStatus(true);
    try {
      await libraryApi.updateBook(book.user_book_id, { status: newStatus });
      await loadData();
      setSuccessMessage("Statut mis à jour");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la mise à jour";
      setError(message);
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  async function handleDelete() {
    if (!book) return;
    if (!window.confirm("Retirer ce livre de votre bibliothèque ?")) return;

    try {
      await libraryApi.deleteBook(book.user_book_id);
      navigate("/library");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la suppression";
      setError(message);
    }
  }

  function handleSessionAdded() {
    setIsSessionModalOpen(false);
    setSuccessMessage("Session enregistrée");
    loadData();
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <p className="text-gray-500" role="status">
          Chargement...
        </p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <p className="text-red-600 mb-4" role="alert">
          {error || "Livre introuvable"}
        </p>
        <button
          type="button"
          onClick={() => navigate("/library")}
          className="flex items-center gap-1 text-sm text-violet-700 hover:text-violet-900"
        >
          <LuArrowLeft className="text-base" />
          Retour à la bibliothèque
        </button>
      </div>
    );
  }

  const remainingPages = book.total_pages - book.current_page;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      {/* Lien retour */}
      <button
        type="button"
        onClick={() => navigate("/library")}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors"
      >
        <LuArrowLeft className="text-base" />
        Retour à la bibliothèque
      </button>

      <BookHeader book={book} />
      <BookProgress book={book} />
      <BookStatusActions
        currentStatus={book.status}
        isUpdating={isUpdatingStatus}
        onStatusChange={handleStatusChange}
      />
      <SessionsList
        sessions={sessions}
        onAddSession={() => setIsSessionModalOpen(true)}
      />

      {/* Action de suppression en bas */}
      <button
        type="button"
        onClick={handleDelete}
        className="flex items-center justify-center gap-2 w-full bg-white border border-red-200 text-red-700 hover:bg-red-50 px-4 py-2.5 rounded-full text-sm font-medium transition-colors"
      >
        <LuTrash2 className="text-lg" />
        Retirer de la bibliothèque
      </button>

      {/* Modal d'ajout de session */}
      {isSessionModalOpen && book && (
        <AddSessionModal
          userBookId={book.user_book_id}
          remainingPages={remainingPages}
          onClose={() => setIsSessionModalOpen(false)}
          onSessionAdded={handleSessionAdded}
        />
      )}

      {/* Toast de succès */}
      {successMessage && (
        <SuccessToast
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
    </div>
  );
}