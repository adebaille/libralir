import type { ChallengeType } from "../services/challengeApi";

// Calcule le texte de récompense d'un défi selon son type et sa cible
// V1 : texte purement décoratif, pas de vrai badge attribué
export function getChallengeReward(
  type: ChallengeType,
  targetValue: number
): string {
  if (type === "pages_read") {
    return targetValue >= 1000 ? "Badge Marathonien" : "Badge Régulier";
  }
  if (type === "books_completed") {
    return targetValue >= 5 ? "Badge Dévoreur" : "Badge Régulier";
  }
  // genres_read
  return targetValue >= 3 ? "Badge Explorateur" : "Badge Curieux";
}