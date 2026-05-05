import { NavLink } from "react-router-dom";
import { GiSpellBook } from "react-icons/gi";
import { LuPlus, LuLogOut } from "react-icons/lu";
import { desktopNavItems } from "../config/navConfig";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-gray-200 sticky top-0">
      {/* Logo + nom de l'app */}
      <div className="flex items-baseline gap-2 px-6 py-6 border-b border-gray-200">
        <GiSpellBook className="text-3xl text-violet-600 translate-y-1" />
        <h1 className="font-serif text-2xl font-semibold text-gray-900">
          LibrAlir
        </h1>
      </div>

      {/* Bouton "Ajouter un livre" */}
      <div className="px-4 py-4">
        <NavLink
          to="/library/add"
          className="flex items-center justify-center gap-2 w-full bg-violet-500 hover:bg-violet-600 text-white px-4 py-2.5 rounded-full text-sm font-medium transition-colors"
        >
          <LuPlus className="text-lg" />
          Ajouter un livre
        </NavLink>
      </div>

      {/* Items de navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto" aria-label="Navigation principale">
        <ul className="space-y-1">
          {desktopNavItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-violet-50 text-violet-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                <item.icon className="text-xl" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer : card profil + bouton déconnexion */}
      <div className="border-t border-gray-200 px-3 py-3 space-y-2">
        {/* Card profil cliquable */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              isActive
                ? "bg-violet-50"
                : "hover:bg-gray-50"
            }`
          }
        >
          {/* Avatar : initiale du display_name dans un cercle */}
          <div className="flex items-center justify-center w-10 h-10 bg-violet-500 text-white font-medium rounded-full shrink-0">
            {user?.display_name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500">Mon profil</p>
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.display_name}
            </p>
          </div>
        </NavLink>

        {/* Bouton déconnexion */}
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <LuLogOut className="text-lg" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}