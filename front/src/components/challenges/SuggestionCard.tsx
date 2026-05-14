import type { ChallengeType } from "../../services/challengeApi";
import { getChallengeReward } from "../../constants/challengeRewards";

// Une suggestion = un défi pré-rempli mais pas encore créé
export type ChallengeSuggestion = {
  title: string;
  description: string;
  challenge_type: ChallengeType;
  target_value: number;
};

type SuggestionCardProps = {
  suggestion: ChallengeSuggestion;
  isDisabled: boolean;
  onAccept: (suggestion: ChallengeSuggestion) => void;
};

export default function SuggestionCard({
  suggestion,
  isDisabled,
  onAccept,
}: SuggestionCardProps) {
  const reward = getChallengeReward(
    suggestion.challenge_type,
    suggestion.target_value
  );

  return (
    <article className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col">
      {/* Header : pill "Suggéré" + récompense */}
      <div className="flex items-center justify-between mb-3">
        <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
          Suggéré
        </span>
        <span className="text-xs text-gold-deep flex items-center gap-1">
          ✦ {reward}
        </span>
      </div>

      {/* Titre */}
      <h4 className="text-base font-semibold text-gray-900 mb-1">
        {suggestion.title}
      </h4>

      {/* Description en italique */}
      <p className="font-serif text-sm italic text-gray-600 leading-relaxed mb-4 flex-1">
        {suggestion.description}
      </p>

      {/* Bouton doré */}
      <button
        type="button"
        onClick={() => onAccept(suggestion)}
        disabled={isDisabled}
        className="w-full bg-gold-deep hover:bg-gold-deep/90 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isDisabled ? "Déjà créé" : "Accepter le défi"}
      </button>
    </article>
  );
}