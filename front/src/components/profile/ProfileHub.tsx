import { Link } from "react-router-dom";
import {
  LuChartBar,
  LuAward,
  LuClock,
  LuSparkles,
  LuChevronRight,
} from "react-icons/lu";
import type { IconType } from "react-icons";

type HubItem = {
  label: string;
  description: string;
  icon: IconType;
  path: string;
};

// Items du hub : pages secondaires accessibles depuis le profil sur mobile
const HUB_ITEMS: HubItem[] = [
  {
    label: "Statistiques",
    description: "Tes chiffres de lecture",
    icon: LuChartBar,
    path: "/stats",
  },
  {
    label: "Badges",
    description: "Tes accomplissements",
    icon: LuAward,
    path: "/badges",
  },
  {
    label: "Sessions",
    description: "Historique de tes lectures",
    icon: LuClock,
    path: "/sessions",
  },
  {
    label: "Recommandations",
    description: "Suggestions pour toi",
    icon: LuSparkles,
    path: "/recommendations",
  },
];

export default function ProfileHub() {
  return (
    <section
      aria-label="Plus de fonctionnalités"
      className="mb-6 md:hidden"
    >
      <h2 className="font-serif text-lg font-semibold text-gray-900 mb-3">
        Plus
      </h2>

      <ul className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {HUB_ITEMS.map((item, index) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                index < HUB_ITEMS.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-violet-50 text-violet-700 rounded-lg shrink-0">
                <item.icon className="text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {item.label}
                </p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
              <LuChevronRight className="text-gray-400 text-xl shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}