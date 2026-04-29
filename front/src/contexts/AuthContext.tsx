/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */

import { createContext, useState, useEffect, type ReactNode } from "react";
import { api } from "../services/api";

// Type de l'utilisateur connecté
type User = {
  user_id: number;
  email: string;
};

// Type de la valeur exposée par le contexte
type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

// Création du contexte (le "câble")
// La valeur par défaut est null — on imposera un Provider qui fournit la vraie valeur
export const AuthContext = createContext<AuthContextValue | null>(null);

// Le composant Provider qui enveloppe l'app et fournit la valeur du contexte
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Au démarrage, on vérifie si un token est déjà stocké
  // Si oui, on récupère les infos de l'user via /api/me
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    api
      .get<User>("/me")
      .then((data) => setUser(data))
      .catch(() => {
        // Token invalide ou expiré : on nettoie
        localStorage.removeItem("token");
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const data = await api.post<{ token: string }>("/auth/login", {
      email,
      password,
    });
    localStorage.setItem("token", data.token);

    // Récupère les infos de l'user après connexion
    const userData = await api.get<User>("/me");
    setUser(userData);
  }

  async function register(email: string, password: string) {
    await api.post("/auth/register", { email, password });
    // Auto-login après inscription
    await login(email, password);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}