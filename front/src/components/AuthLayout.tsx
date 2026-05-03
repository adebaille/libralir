import { Link, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

// Layout partagé pour les pages Login et Register
// Affiche le panneau gauche avec dégradé violet/or, et le formulaire à droite
export default function AuthLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <main className="min-h-screen flex items-center justify-center bg-cream p-4">
      <article className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2">
        
        {/* Panneau gauche : présentation de la marque */}
        <aside className="hidden md:flex flex-col justify-between min-h-150 p-12 bg-linear-to-br from-violet-600 via-violet-500 to-gold-400 text-white">
          <header>
            <p className="flex items-center gap-2 mb-12 font-serif text-xl">
              <span aria-hidden="true">📖</span>
              <span>LibrAlir</span>
            </p>
            
            <h1 className="font-serif italic text-4xl leading-snug mb-6">
              Une bibliothèque qui se souvient de vous.
            </h1>
            
            <p className="text-sm leading-relaxed">
              Suivez votre progression, gagnez des badges, relevez des défis mensuels — sans jamais perdre le plaisir de tourner les pages.
            </p>
          </header>

          <footer>
            <p className="font-serif italic text-xs">
              ✦ Votre carnet de lecture vous attend.
            </p>
          </footer>
        </aside>

        {/* Section formulaire */}
        <section className="p-8 md:p-12 flex flex-col justify-center">
          
          {/* Navigation entre Connexion et Inscription */}
          <nav className="bg-cream rounded-full p-1 mb-8 grid grid-cols-2 max-w-md mx-auto w-full" aria-label="Choix entre connexion et inscription">
            <Link
              to="/login"
              className={`text-center py-2 rounded-full text-sm font-medium transition-colors ${
                isLogin
                  ? "bg-white shadow-sm text-violet-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              aria-current={isLogin ? "page" : undefined}
            >
              Connexion
            </Link>
            <Link
              to="/register"
              className={`text-center py-2 rounded-full text-sm font-medium transition-colors ${
                !isLogin
                  ? "bg-white shadow-sm text-violet-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              aria-current={!isLogin ? "page" : undefined}
            >
              Inscription
            </Link>
          </nav>

          {children}
        </section>
      </article>
    </main>
  );
}