// Service centralisé pour tous les appels à l'API back
// Gère automatiquement : URL de base, JWT, parsing JSON, erreurs

const API_URL = import.meta.env.VITE_API_URL;

// Récupère le JWT stocké (s'il existe)
function getToken(): string | null {
  return localStorage.getItem("token");
}

// Construit les headers HTTP avec le JWT si l'user est connecté
function buildHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

// Wrapper autour de fetch qui gère tout pour nous
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...buildHeaders(),
      ...options.headers,
    },
  });

  // Parse la réponse JSON
  const data = await response.json();

  // Si erreur HTTP (4xx, 5xx), on lance une exception
  if (!response.ok) {
    throw new Error(data.error || "Une erreur est survenue");
  }

  return data as T;
}

// Méthodes publiques exposées
export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: "GET" }),

  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: "DELETE",
      body: body ? JSON.stringify(body) : undefined,
    }),
};