import type { Challenge } from "../../services/challengeApi";
import ChallengeCard from "./ChallengeCard";

type MyChallengesSectionProps = {
  challenges: Challenge[];
  onDelete: (challengeId: number) => void;
  deletingId: number | null;
};

export default function MyChallengesSection({
  challenges,
  onDelete,
  deletingId,
}: MyChallengesSectionProps) {
  return (
    <section aria-label="Mes défis du mois" className="mb-6">
      <h2 className="font-serif text-lg font-semibold text-gray-900 mb-3">
        Mes défis du mois
      </h2>

      {challenges.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-500">
            Tu n'as pas encore de défi pour ce mois.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Choisis une suggestion ci-dessous ou crée le tien.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onDelete={onDelete}
              isDeleting={deletingId === challenge.id}
            />
          ))}
        </div>
      )}
    </section>
  );
}