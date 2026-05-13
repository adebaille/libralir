import { useState } from "react";
import { LuTriangleAlert } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../services/userApi";
import { useAuth } from "../../hooks/useAuth";
import DeleteAccountModal from "../profile/DeleteAccountModal";

export default function DeleteAccountSection() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirmDelete(password: string) {
    setIsDeleting(true);
    setError(null);

    try {
      await userApi.deleteAccount({ password });
      // Suppression réussie : on logout (clear le token) et on redirige
      logout();
      navigate("/login");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la suppression";
      setError(message);
      setIsDeleting(false);
    }
  }

  return (
    <section
      aria-label="Zone dangereuse"
      className="bg-white rounded-xl p-5 border border-red-200 mb-6"
    >
      <div className="flex items-center gap-2 mb-2">
        <LuTriangleAlert className="text-red-600 text-xl" />
        <h2 className="font-serif text-lg font-semibold text-gray-900">
          Supprimer mon compte
        </h2>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Cette action est <strong>irréversible</strong>. Tous tes livres,
        sessions et badges seront définitivement supprimés.
      </p>

      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="bg-white border border-red-200 text-red-700 hover:bg-red-50 px-4 py-2 rounded-full text-sm font-medium transition-colors"
      >
        Supprimer mon compte
      </button>

      {isModalOpen && (
        <DeleteAccountModal
          onClose={() => {
            setIsModalOpen(false);
            setError(null);
          }}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
          error={error}
        />
      )}
    </section>
  );
}