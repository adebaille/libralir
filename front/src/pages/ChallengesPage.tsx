import { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import {
  challengeApi,
  type Challenge,
  type ChallengeType,
} from "../services/challengeApi";
import MainChallengeCard from "../components/challenges/MainChallengeCard";
import ChallengeCard from "../components/challenges/ChallengeCard";
import SuggestionCard, {
  type ChallengeSuggestion,
} from "../components/challenges/SuggestionCard";
import ChallengeHistoryItem from "../components/challenges/ChallengeHistoryItem";
import OrnateSeparator from "../components/ui/OrnateSeparator";
import CreateChallengeModal from "../components/challenges/CreateChallengeModal";
import { getChallengeSuggestions } from "../constants/challengeSuggestions";

export default function ChallengesPage() {
  // Mois et année courants
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const [currentChallenges, setCurrentChallenges] = useState<Challenge[]>([]);
  const [historyChallenges, setHistoryChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // État de la modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prefilledSuggestion, setPrefilledSuggestion] = useState<ChallengeSuggestion | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // État de suppression
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Charge les défis du mois + historique
  function loadAll() {
    setIsLoading(true);
    setError(null);

    Promise.all([
      challengeApi.getChallengesByMonth(currentMonth, currentYear),
      challengeApi.getHistory(),
    ])
      .then(([current, history]) => {
        setCurrentChallenges(current);
        setHistoryChallenges(history);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Erreur de chargement";
        setError(message);
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Le premier défi créé est mis en card principale
  const [mainChallenge, ...otherChallenges] = currentChallenges;

  // Types déjà créés ce mois (pour griser les suggestions)
  const existingTypes: ChallengeType[] = currentChallenges.map((c) => c.challenge_type);

  // Suggestions adaptées au mois
  const suggestions = getChallengeSuggestions(currentMonth, currentYear);

  function handleOpenEmpty() {
    setPrefilledSuggestion(undefined);
    setModalError(null);
    setIsModalOpen(true);
  }

  function handleSelectSuggestion(suggestion: ChallengeSuggestion) {
    setPrefilledSuggestion(suggestion);
    setModalError(null);
    setIsModalOpen(true);
  }

  async function handleConfirmCreate(type: ChallengeType, targetValue: number) {
    setIsSubmitting(true);
    setModalError(null);

    try {
      await challengeApi.createChallenge({
        month: currentMonth,
        year: currentYear,
        challenge_type: type,
        target_value: targetValue,
      });
      setIsModalOpen(false);
      loadAll();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la création";
      setModalError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(challengeId: number) {
    setDeletingId(challengeId);
    try {
      await challengeApi.deleteChallenge(challengeId);
      loadAll();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la suppression";
      setError(message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      {/* Header */}
      <h1 className="font-serif text-3xl md:text-4xl font-semibold text-gray-900 mb-1">
        Défis mensuels
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Un objectif par mois, ni plus ni moins.
      </p>

      {/* Loading */}
      {isLoading && (
        <p className="text-gray-500" role="status">
          Chargement...
        </p>
      )}

      {/* Erreur */}
      {error && (
        <p className="text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}

      {/* Contenu */}
      {!isLoading && !error && (
        <>
          {/* Card principale (premier défi en cours) */}
          {mainChallenge && <MainChallengeCard challenge={mainChallenge} />}

          {/* État vide : pas de défi en cours */}
          {!mainChallenge && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 text-center mb-6">
              <p className="text-sm text-gray-500 mb-3">
                Pas encore de défi ce mois-ci.
              </p>
              <button
                type="button"
                onClick={handleOpenEmpty}
                className="inline-flex items-center gap-2 bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
              >
                <LuPlus className="text-lg" />
                Créer un défi
              </button>
            </div>
          )}

          {/* Autres défis du mois (si plusieurs) */}
          {otherChallenges.length > 0 && (
            <section aria-label="Mes autres défis du mois" className="mb-6">
              <h2 className="font-serif text-lg font-semibold text-gray-900 mb-3">
                Mes autres défis du mois
              </h2>
              <div className="space-y-3">
                {otherChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onDelete={handleDelete}
                    isDeleting={deletingId === challenge.id}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Suggestions */}
          <section aria-label="Suggestions de défis" className="mb-6">
            <h2 className="font-serif text-lg font-semibold text-gray-900 mb-3">
              Suggestions pour vous
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {suggestions.map((suggestion, index) => (
                <SuggestionCard
                  key={index}
                  suggestion={suggestion}
                  isDisabled={existingTypes.includes(suggestion.challenge_type)}
                  onAccept={handleSelectSuggestion}
                />
              ))}
            </div>
          </section>

          {/* Historique */}
          {historyChallenges.length > 0 && (
            <>
              <OrnateSeparator label="historique" />
              <section aria-label="Historique des défis" className="space-y-2">
                {historyChallenges.map((challenge) => (
                  <ChallengeHistoryItem key={challenge.id} challenge={challenge} />
                ))}
              </section>
            </>
          )}
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <CreateChallengeModal
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmCreate}
          isSubmitting={isSubmitting}
          error={modalError}
          prefilledSuggestion={prefilledSuggestion}
          existingTypes={existingTypes}
        />
      )}
    </div>
  );
}