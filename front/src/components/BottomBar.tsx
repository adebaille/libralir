import { NavLink } from "react-router-dom";
import { LuPlus } from "react-icons/lu";
import { mobileNavItems } from "../config/navConfig";

export default function BottomBar() {
  // On split les items pour insérer le FAB au milieu
  // mobileNavItems = [Accueil, Bibliothèque, Défis, Profil]
  // → [Accueil, Bibliothèque] + FAB + [Défis, Profil]
  const leftItems  = mobileNavItems.slice(0, 2);
  const rightItems = mobileNavItems.slice(2);

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"
      aria-label="Navigation principale"
    >
      <ul className="flex items-center justify-around h-16 relative">
        {/* Items de gauche */}
        {leftItems.map((item) => (
          <li key={item.path} className="flex-1">
            <NavLink
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2 transition-colors ${
                  isActive ? "text-violet-700" : "text-gray-600"
                }`
              }
            >
              <item.icon className="text-xl" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          </li>
        ))}

        {/* FAB centré (déborde au-dessus de la bottom bar) */}
        <li className="flex-1 flex justify-center">
          <NavLink
            to="/library/add"
            className="flex items-center justify-center w-14 h-14 bg-violet-500 hover:bg-violet-600 text-white rounded-full shadow-lg -translate-y-4 transition-colors"
            aria-label="Ajouter un livre"
          >
            <LuPlus className="text-2xl" />
          </NavLink>
        </li>

        {/* Items de droite */}
        {rightItems.map((item) => (
          <li key={item.path} className="flex-1">
            <NavLink
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2 transition-colors ${
                  isActive ? "text-violet-700" : "text-gray-600"
                }`
              }
            >
              <item.icon className="text-xl" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}