import type { ChallengeSuggestion } from "../components/challenges/SuggestionCard";

// Génère les 3 suggestions adaptées au mois courant
// "Lire X pages/jour" dépend du nombre de jours du mois
export function getChallengeSuggestions(
  month: number,
  year: number
): ChallengeSuggestion[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const dailyTarget = 20 * daysInMonth;

  return [
    {
      title: "Lire 1000 pages",
      description: "Un objectif solide pour le mois, à ton rythme.",
      challenge_type: "pages_read",
      target_value: 1000,
    },
    {
      title: "Découvrir 3 genres",
      description: "Sors de ta zone de confort et explore de nouveaux univers.",
      challenge_type: "genres_read",
      target_value: 3,
    },
    {
      title: `Lire ${dailyTarget} pages`,
      description: "Soit environ 20 pages par jour, pour ancrer une habitude.",
      challenge_type: "pages_read",
      target_value: dailyTarget,
    },
  ];
}