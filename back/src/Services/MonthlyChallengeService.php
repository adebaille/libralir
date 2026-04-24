<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\MonthlyChallengeModel;
use App\Database\Connection;
use PDO;

// MonthlyChallengeService gère la logique des défis mensuels
// La progression est calculée à la volée depuis les données existantes
// (pas stockée en BDD, toujours à jour)
class MonthlyChallengeService
{
    private MonthlyChallengeModel $challengeModel;
    private PDO $pdo;

    // Types de défis supportés
    private const VALID_TYPES = ['pages_read', 'books_completed', 'genres_read'];

    public function __construct()
    {
        $this->challengeModel = new MonthlyChallengeModel();
        $this->pdo            = Connection::getInstance();
    }

    // Crée un nouveau défi
    public function createChallenge(int $userId, array $data): array
    {
        $month         = (int) ($data['month'] ?? 0);
        $year          = (int) ($data['year'] ?? 0);
        $challengeType = $data['challenge_type'] ?? '';
        $targetValue   = (int) ($data['target_value'] ?? 0);

        // Validations
        if ($month < 1 || $month > 12) {
            return ['error' => 'Mois invalide'];
        }

        if ($year < 2020 || $year > 2100) {
            return ['error' => 'Année invalide'];
        }

        if (!in_array($challengeType, self::VALID_TYPES, true)) {
            return ['error' => 'Type de défi invalide'];
        }

        if ($targetValue <= 0) {
            return ['error' => 'Objectif invalide'];
        }

        // Vérifier qu'il n'existe pas déjà
        $existing = $this->challengeModel->findByUserAndMonth($userId, $month, $year);
        foreach ($existing as $challenge) {
            if ($challenge['challenge_type'] === $challengeType) {
                return ['error' => 'Un défi de ce type existe déjà pour ce mois'];
            }
        }

        $challengeId = $this->challengeModel->create($userId, $month, $year, $challengeType, $targetValue);

        return [
            'message'      => 'Défi créé',
            'challenge_id' => $challengeId,
        ];
    }

    // Récupère les défis d'un mois avec la progression calculée à la volée
    public function getChallengesByMonth(int $userId, int $month, int $year): array
    {
        $challenges = $this->challengeModel->findByUserAndMonth($userId, $month, $year);

        return array_map(
            fn($c) => $this->enrichWithProgress($c),
            $challenges
        );
    }

    // Modifie l'objectif d'un défi
    public function updateChallenge(int $userId, int $challengeId, array $data): array
    {
        $challenge = $this->challengeModel->findByIdAndUser($challengeId, $userId);

        if (!$challenge) {
            return ['error' => 'Défi introuvable'];
        }

        $targetValue = (int) ($data['target_value'] ?? 0);

        if ($targetValue <= 0) {
            return ['error' => 'Objectif invalide'];
        }

        $this->challengeModel->updateTarget($challengeId, $targetValue);

        return ['message' => 'Défi mis à jour'];
    }

    // Supprime un défi
    public function deleteChallenge(int $userId, int $challengeId): array
    {
        $challenge = $this->challengeModel->findByIdAndUser($challengeId, $userId);

        if (!$challenge) {
            return ['error' => 'Défi introuvable'];
        }

        $this->challengeModel->delete($challengeId);

        return ['message' => 'Défi supprimé'];
    }

    // -------------------------------------------------------------------------
    // Enrichit un défi avec sa progression calculée
    // Délègue au bon calculateur selon le type
    // -------------------------------------------------------------------------
    private function enrichWithProgress(array $challenge): array
    {
        $currentValue = match ($challenge['challenge_type']) {
            'pages_read'      => $this->calculatePagesRead($challenge),
            'books_completed' => $this->calculateBooksCompleted($challenge),
            'genres_read'     => 0, // à implémenter plus tard
            default           => 0,
        };

        $challenge['current_value'] = $currentValue;
        $challenge['is_completed']  = $currentValue >= (int) $challenge['target_value'];

        return $challenge;
    }

    // Somme des pages lues dans les sessions du mois
    private function calculatePagesRead(array $challenge): int
    {
        $stmt = $this->pdo->prepare('
            SELECT COALESCE(SUM(rs.pages_read), 0) AS total
            FROM reading_sessions rs
            INNER JOIN user_books ub ON ub.id = rs.user_book_id
            WHERE ub.user_id = :user_id
              AND EXTRACT(MONTH FROM rs.session_date) = :month
              AND EXTRACT(YEAR FROM rs.session_date) = :year
        ');
        $stmt->execute([
            ':user_id' => $challenge['user_id'],
            ':month'   => $challenge['month'],
            ':year'    => $challenge['year'],
        ]);

        return (int) $stmt->fetchColumn();
    }

    // Compte les livres passés à 'completed' dans le mois
    private function calculateBooksCompleted(array $challenge): int
    {
        $stmt = $this->pdo->prepare("
            SELECT COUNT(*) AS total
            FROM user_books
            WHERE user_id = :user_id
              AND status = 'completed'
              AND EXTRACT(MONTH FROM updated_at) = :month
              AND EXTRACT(YEAR FROM updated_at) = :year
        ");
        $stmt->execute([
            ':user_id' => $challenge['user_id'],
            ':month'   => $challenge['month'],
            ':year'    => $challenge['year'],
        ]);

        return (int) $stmt->fetchColumn();
    }
}