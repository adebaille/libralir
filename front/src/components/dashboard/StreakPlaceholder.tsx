import { LuFlame } from "react-icons/lu";

export default function StreakPlaceholder() {
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
          <p className="font-serif text-xl font-semibold mt-0.5">
            Bientôt disponible
          </p>
        </div>
      </div>
    </section>
  );
}