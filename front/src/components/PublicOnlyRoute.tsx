import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { ReactNode } from "react";

// Inverse de ProtectedRoute
// Empêche un user déjà connecté d'accéder à /login ou /register
export default function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  // Déjà connecté → redirection vers l'accueil
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Pas connecté → affiche login/register
  return <>{children}</>;
}