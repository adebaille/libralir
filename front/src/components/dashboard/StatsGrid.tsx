import { LuBookOpen, LuClock, LuFileText, LuTarget } from "react-icons/lu";
import StatCard from "./StatCard";
import type { DashboardStats } from "../../services/statsApi";
import GoalCallToAction from "./GoalCallToAction";

type StatsGridProps = {
  stats: DashboardStats;
};

export default function StatsGrid({ stats }: StatsGridProps) {
  // Conversion des minutes en heures (arrondi à 1 décimale)
  const hoursRead = (stats.minutes_read / 60).toFixed(1);

  return (
    <section aria-label="Statistiques annuelles">
      <h2 className="font-serif text-xl font-semibold text-gray-900 mb-4">
        Cette année
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={LuBookOpen}
          label="Livres lus"
          value={stats.books_read}
        />
        <StatCard icon={LuClock} label="Heures lues" value={hoursRead} />
        <StatCard
          icon={LuFileText}
          label="Pages lues"
          value={stats.pages_read}
        />
        {stats.yearly_goal_books > 0 ? (
          <StatCard
            icon={LuTarget}
            label="Objectif"
            value={stats.books_read}
            goal={stats.yearly_goal_books}
          />
        ) : (
          <GoalCallToAction />
        )}
      </div>
    </section>
  );
}
