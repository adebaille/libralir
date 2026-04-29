import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Accueil</h1>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Déconnexion
          </button>
        </div>

        <p>Connecté en tant que <strong>{user?.email}</strong></p>
      </div>
    </div>
  );
}