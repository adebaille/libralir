import { LuCheck, LuX } from "react-icons/lu";
import type { Challenge } from "../../services/challengeApi";
import {
  CHALLENGE_TYPE_LABELS,
  CHALLENGE_TYPE_UNITS,
} from "../../constants/challengeTypes";

type ChallengeHistoryItemProps = {
  challenge: Challenge;
};

// Nom du mois en français
function getMonthName(month: number, year: number): string {
  return new Date(year, month - 1, 1).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
}

export default function ChallengeHistoryItem({
  challenge,
}: ChallengeHistoryItemProps) {
  const label = CHALLENGE_TYPE_LABELS[challenge.challenge_type];
  const unit = CHALLENGE_TYPE_UNITS[challenge.challenge_type];
  const monthName = getMonthName(challenge.month, challenge.year);

  const percentage = Math.round(
    (challenge.current_value / challenge.target_value) * 100
  );
  const isSuccess = challenge.is_completed;

  return (
    <article className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3">
      {/* Icône statut */}
      <div
        className={`flex items-center justify-center w-11 h-11 rounded-full shrink-0 ${
          isSuccess
            ? "bg-violet-100 text-violet-700"
            : "bg-gray-100 text-gray-400"
        }`}
      >
        {isSuccess ? (
          <LuCheck className="text-xl" strokeWidth={2.5} />
        ) : (
          <LuX className="text-xl" strokeWidth={2.5} />
        )}
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <h4 className="font-serif text-sm font-medium text-gray-900 truncate">
            {label} ({challenge.target_value} {unit})
          </h4>
          <span className="text-xs text-gray-400 capitalize shrink-0">
            {monthName}
          </span>
        </div>
        <p className="text-xs mt-1">
          <span
            className={`font-medium ${
              isSuccess ? "text-gold-deep" : "text-gray-400"
            }`}
          >
            {isSuccess ? "Réussi" : "Échoué"}
          </span>
          <span className="text-gray-500"> · {Math.min(percentage, 100)}% complété</span>
        </p>
      </div>
    </article>
  );
}