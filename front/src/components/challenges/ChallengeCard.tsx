import { LuTrash2, LuCheck } from "react-icons/lu";
import type { Challenge } from "../../services/challengeApi";
import {
  CHALLENGE_TYPE_LABELS,
  CHALLENGE_TYPE_UNITS,
  CHALLENGE_TYPE_ICONS,
} from "../../constants/challengeTypes";

type ChallengeCardProps = {
  challenge: Challenge;
  onDelete: (challengeId: number) => void;
  isDeleting: boolean;
};

export default function ChallengeCard({
  challenge,
  onDelete,
  isDeleting,
}: ChallengeCardProps) {
  const Icon = CHALLENGE_TYPE_ICONS[challenge.challenge_type];
  const label = CHALLENGE_TYPE_LABELS[challenge.challenge_type];
  const unit = CHALLENGE_TYPE_UNITS[challenge.challenge_type];

  // Pourcentage capé à 100 pour l'affichage de la barre
  const progress =
    challenge.target_value > 0
      ? Math.min(
          Math.round((challenge.current_value / challenge.target_value) * 100),
          100
        )
      : 0;

  return (
    <article
      className={`bg-white rounded-xl p-4 border ${
        challenge.is_completed ? "border-green-200" : "border-gray-100"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${
              challenge.is_completed
                ? "bg-green-50 text-green-700"
                : "bg-violet-50 text-violet-700"
            }`}
          >
            {challenge.is_completed ? (
              <LuCheck className="text-xl" />
            ) : (
              <Icon className="text-xl" />
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              {label}
            </p>
            <p className="font-serif text-lg font-semibold text-gray-900">
              {challenge.current_value} / {challenge.target_value} {unit}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDelete(challenge.id)}
          disabled={isDeleting}
          aria-label="Supprimer ce défi"
          className="text-gray-400 hover:text-red-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LuTrash2 className="text-lg" />
        </button>
      </div>

      {/* Barre de progression */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            challenge.is_completed ? "bg-green-500" : "bg-violet-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {challenge.is_completed && (
        <p className="text-xs text-green-700 mt-2">Défi accompli !</p>
      )}
    </article>
  );
}