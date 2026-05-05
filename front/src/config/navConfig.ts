import {
  LuHouse,
  LuLibrary,
  LuChartBar,
  LuAward,
  LuTarget,
  LuClock,
  LuSparkles,
  LuUser,
} from "react-icons/lu";
import type { IconType } from "react-icons";

export type NavItem = {
  label: string;
  icon: IconType;
  path: string;
};

// Navigation desktop : visible dans la sidebar (hors profil qui est traité à part)
export const desktopNavItems: NavItem[] = [
  { label: "Accueil",         icon: LuHouse,    path: "/" },
  { label: "Bibliothèque",    icon: LuLibrary,  path: "/library" },
  { label: "Stats",           icon: LuChartBar, path: "/stats" },
  { label: "Badges",          icon: LuAward,    path: "/badges" },
  { label: "Défis",           icon: LuTarget,   path: "/challenges" },
  { label: "Sessions",        icon: LuClock,    path: "/sessions" },
  { label: "Recommandations", icon: LuSparkles, path: "/recommendations" },
];

// Navigation mobile : visible dans la bottom bar (4 items, FAB centré géré à part)
export const mobileNavItems: NavItem[] = [
  { label: "Accueil",      icon: LuHouse,    path: "/" },
  { label: "Bibliothèque", icon: LuLibrary,  path: "/library" },
  { label: "Défis",        icon: LuTarget,   path: "/challenges" },
  { label: "Profil",       icon: LuUser,     path: "/profile" },
];