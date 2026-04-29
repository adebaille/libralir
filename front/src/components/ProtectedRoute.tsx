import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { ReactNode } from "react";

// Composant qui protège l'accès à une route
// Si l'user n'est pas connecté, redirige vers /login
// Pendant le check initial du token, affiche un loader simple
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  // Pendant qu'on vérifie le token au démarrage, on attend
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  // Pas connecté → redirection vers login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Connecté → affiche le contenu protégé
  return <>{children}</>;
}