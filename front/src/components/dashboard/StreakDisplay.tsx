import { LuFlame } from "react-icons/lu";

type StreakDisplayProps = {
  currentStreak: number;
};

export default function StreakDisplay({ currentStreak }: StreakDisplayProps) {
  // Pluralisation simple : "jour" si 0 ou 1, "jours" sinon
  const dayLabel = currentStreak <= 1 ? "jour" : "jours";

  // Message contextuel selon la situation
  const message =
    currentStreak === 0
      ? "Commence ta série aujourd'hui"
      : `${currentStreak <= 1 ? "Bien joué" : "Continue comme ça"} !`;

  return (
    <section
      className="bg-linear-to-br from-violet-500 to-violet-700 rounded-xl p-5 mb-6 text-white"
      aria-label="Série de lecture"
    >
      <div className="flex items-center gap-3">
        <div className="bg-white/20 rounded-full p-3">
          <LuFlame className="text-2xl" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide opacity-80">
            Série de lecture
          </p>
          {currentStreak > 0 ? (
            <p className="font-serif text-2xl font-semibold mt-0.5">
              {currentStreak} {dayLabel} consécutif{currentStreak > 1 ? "s" : ""}
            </p>
          ) : (
            <p className="font-serif text-xl font-semibold mt-0.5">
              Pas encore de série
            </p>
          )}
          <p className="text-xs opacity-80 mt-1">{message}</p>
        </div>
      </div>
    </section>
  );
}