import { LuClock } from "react-icons/lu";
import type { Challenge } from "../../services/challengeApi";
import {
  CHALLENGE_TYPE_LABELS,
  CHALLENGE_TYPE_UNITS,
} from "../../constants/challengeTypes";
import { getChallengeReward } from "../../constants/challengeRewards";

type MainChallengeCardProps = {
  challenge: Challenge;
};

// Calcule le nombre de jours restants dans le mois du défi
function getDaysLeft(month: number, year: number): number {
  const today = new Date();
  // Dernier jour du mois = jour 0 du mois suivant
  const lastDay = new Date(year, month, 0);
  const diffMs = lastDay.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

// Nom du mois en français
function getMonthName(month: number, year: number): string {
  return new Date(year, month - 1, 1).toLocaleDateString("fr-FR", {
    month: "long",
  });
}

// Texte motivant en fonction de la progression
function getMotivationMessage(remaining: number, unit: string, reward: string): string {
  if (remaining <= 0) {
    return `Défi accompli ! Tu as décroché ${reward}.`;
  }
  return `Encore ${remaining} ${unit} pour décrocher le ${reward}.`;
}

export default function MainChallengeCard({ challenge }: MainChallengeCardProps) {
  const label = CHALLENGE_TYPE_LABELS[challenge.challenge_type];
  const unit = CHALLENGE_TYPE_UNITS[challenge.challenge_type];
  const reward = getChallengeReward(challenge.challenge_type, challenge.target_value);
  const monthName = getMonthName(challenge.month, challenge.year);
  const daysLeft = getDaysLeft(challenge.month, challenge.year);

  // Cap visuel à 100% pour la barre
  const progress = Math.min(
    Math.round((challenge.current_value / challenge.target_value) * 100),
    100
  );
  const remaining = Math.max(0, challenge.target_value - challenge.current_value);

  return (
    <article className="relative overflow-hidden bg-violet-600 text-white rounded-xl p-6 md:p-8 mb-6">
      {/* Effet décoratif radial discret */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 90% 0%, white, transparent 50%)",
        }}
      />

      <div className="relative">
        {/* Header : pill + jours restants */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <span className="inline-block text-xs px-3 py-1 rounded-full bg-white/15 border border-white/25 capitalize">
            Défi en cours · {monthName}
          </span>
          <span className="flex items-center gap-1 text-xs text-white/85">
            <LuClock className="text-sm" />
            {daysLeft} jour{daysLeft > 1 ? "s" : ""} restant{daysLeft > 1 ? "s" : ""}
          </span>
        </div>

        {/* Titre du défi en italique */}
        <h2 className="font-serif text-2xl md:text-3xl italic font-normal mb-4 leading-tight">
          {label} ({challenge.target_value} {unit})
        </h2>

        {/* Chiffre énorme + cible */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-serif text-5xl md:text-7xl font-medium leading-none text-gold-light">
            {challenge.current_value}
          </span>
          <span className="text-base md:text-lg text-white/85">
            / {challenge.target_value} {unit}
          </span>
        </div>

        {/* Barre de progression dorée */}
        <div className="h-2.5 bg-white/20 rounded-full overflow-hidden mb-4">
          <div
            className="h-full rounded-full bg-linear-to-r from-gold-light to-gold-deep transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Message motivant */}
        <p className="text-sm text-white/85 leading-relaxed">
          {getMotivationMessage(remaining, unit, reward).split(reward).map((part, i, arr) =>
            i < arr.length - 1 ? (
              <span key={i}>
                {part}
                <strong className="text-gold-light">{reward}</strong>
              </span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </p>
      </div>
    </article>
  );
}