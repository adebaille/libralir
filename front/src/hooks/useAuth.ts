import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

// Hook personnalisé pour accéder au contexte d'authentification
// Lance une erreur claire si on l'utilise en dehors d'un AuthProvider
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }

  return context;
}