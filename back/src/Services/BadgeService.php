<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\BadgeModel;
use App\Database\Connection;
use PDO;

// BadgeService gère la logique d'attribution des badges
// Appelé après chaque événement pertinent (ajout livre, fin de lecture, session...)
// Évalue les badges éligibles et insère dans user_badges les nouveaux gagnés
class BadgeService
{
    private BadgeModel $badgeModel;
    private PDO $pdo;

    public function __construct()
    {
        $this->badgeModel = new BadgeModel();
        $this->pdo        = Connection::getInstance();
    }

    // -------------------------------------------------------------------------
    // CHECK AND AWARD BADGES
    // Méthode principale appelée après un événement
    // Retourne la liste des badges nouvellement obtenus
    // -------------------------------------------------------------------------
    public function checkAndAwardBadges(int $userId): array
    {
        $allBadges    = $this->badgeModel->findAllActive();
        $obtainedIds  = $this->badgeModel->findObtainedBadgeIds($userId);
        $newlyAwarded = [];

        foreach ($allBadges as $badge) {
            // Skip si déjà obtenu
            if (in_array((int) $badge['id'], $obtainedIds, true)) {
                continue;
            }

            // Évaluer la condition
            if ($this->isBadgeEarned($userId, $badge)) {
                $this->badgeModel->awardBadge($userId, (int) $badge['id']);
                $newlyAwarded[] = $badge;
            }
        }

        return $newlyAwarded;
    }

    // -------------------------------------------------------------------------
    // GET USER BADGES
    // Retourne tous les badges obtenus par l'user
    // -------------------------------------------------------------------------
    public function getUserBadges(int $userId): array
    {
        return $this->badgeModel->findObtainedByUser($userId);
    }

    // -------------------------------------------------------------------------
    // Évalue si un badge est gagné selon son type de condition
    // -------------------------------------------------------------------------
    private function isBadgeEarned(int $userId, array $badge): bool
    {
        $currentValue = match ($badge['condition_type']) {
            'books_added'     => $this->countBooksAdded($userId),
            'books_completed' => $this->countBooksCompleted($userId),
            'total_pages'     => $this->sumTotalPages($userId),
            'sessions_count'  => $this->countSessions($userId),
            default           => 0,
        };

        return $currentValue >= (int) $badge['condition_value'];
    }

    // Nombre de livres dans la bibliothèque
    private function countBooksAdded(int $userId): int
    {
        $stmt = $this->pdo->prepare('
            SELECT COUNT(*) FROM user_books WHERE user_id = :user_id
        ');
        $stmt->execute([':user_id' => $userId]);
        return (int) $stmt->fetchColumn();
    }

    // Nombre de livres terminés
    private function countBooksCompleted(int $userId): int
    {
        $stmt = $this->pdo->prepare("
            SELECT COUNT(*) FROM user_books
            WHERE user_id = :user_id AND status = 'completed'
        ");
        $stmt->execute([':user_id' => $userId]);
        return (int) $stmt->fetchColumn();
    }

    // Somme totale des pages lues (toutes sessions confondues)
    private function sumTotalPages(int $userId): int
    {
        $stmt = $this->pdo->prepare('
            SELECT COALESCE(SUM(rs.pages_read), 0)
            FROM reading_sessions rs
            INNER JOIN user_books ub ON ub.id = rs.user_book_id
            WHERE ub.user_id = :user_id
        ');
        $stmt->execute([':user_id' => $userId]);
        return (int) $stmt->fetchColumn();
    }

    // Nombre total de sessions enregistrées
    private function countSessions(int $userId): int
    {
        $stmt = $this->pdo->prepare('
            SELECT COUNT(*)
            FROM reading_sessions rs
            INNER JOIN user_books ub ON ub.id = rs.user_book_id
            WHERE ub.user_id = :user_id
        ');
        $stmt->execute([':user_id' => $userId]);
        return (int) $stmt->fetchColumn();
    }
}