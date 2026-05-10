import { Link } from "react-router-dom";
import { LuTarget, LuArrowRight } from "react-icons/lu";

export default function GoalCallToAction() {
  return (
    <Link
      to="/profile"
      className="bg-violet-50 border border-violet-200 rounded-xl p-4 hover:bg-violet-100 transition-colors group"
    >
      <div className="flex items-center gap-2 text-violet-700 mb-2">
        <LuTarget className="text-lg" />
        <span className="text-xs font-medium uppercase tracking-wide">
          Objectif
        </span>
      </div>
      <div className="flex items-center justify-between">
        <p className="font-serif text-sm font-semibold text-violet-900">
          Définis ton objectif annuel
        </p>
        <LuArrowRight className="text-violet-700 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}