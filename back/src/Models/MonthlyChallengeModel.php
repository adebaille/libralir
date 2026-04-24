<?php

declare(strict_types=1);

namespace App\Models;

// MonthlyChallengeModel gère les défis mensuels personnels des users
// Un user peut avoir plusieurs défis par mois (un par type)
// Types supportés : 'pages_read', 'books_completed', 'genres_read'
class MonthlyChallengeModel extends BaseModel
{
    protected string $table = 'user_monthly_challenges';

    // -------------------------------------------------------------------------
    // FIND BY USER AND MONTH
    // Récupère tous les défis d'un user pour un mois/année précis
    // -------------------------------------------------------------------------
    public function findByUserAndMonth(int $userId, int $month, int $year): array
    {
        $stmt = $this->db->prepare('
            SELECT * FROM user_monthly_challenges
            WHERE user_id = :user_id AND month = :month AND year = :year
            ORDER BY challenge_type
        ');
        $stmt->execute([
            ':user_id' => $userId,
            ':month'   => $month,
            ':year'    => $year,
        ]);
        return $stmt->fetchAll();
    }

    // -------------------------------------------------------------------------
    // FIND BY ID AND USER
    // Récupère un défi précis en vérifiant la propriété
    // -------------------------------------------------------------------------
    public function findByIdAndUser(int $challengeId, int $userId): array|false
    {
        $stmt = $this->db->prepare('
            SELECT * FROM user_monthly_challenges
            WHERE id = :id AND user_id = :user_id
        ');
        $stmt->execute([
            ':id'      => $challengeId,
            ':user_id' => $userId,
        ]);
        return $stmt->fetch();
    }

    // -------------------------------------------------------------------------
    // CREATE
    // Crée un nouveau défi pour un user
    // -------------------------------------------------------------------------
    public function create(
        int $userId,
        int $month,
        int $year,
        string $challengeType,
        int $targetValue
    ): int {
        $stmt = $this->db->prepare('
            INSERT INTO user_monthly_challenges
                (user_id, month, year, challenge_type, target_value)
            VALUES
                (:user_id, :month, :year, :challenge_type, :target_value)
            RETURNING id
        ');
        $stmt->execute([
            ':user_id'        => $userId,
            ':month'          => $month,
            ':year'           => $year,
            ':challenge_type' => $challengeType,
            ':target_value'   => $targetValue,
        ]);
        return (int) $stmt->fetchColumn();
    }

    // -------------------------------------------------------------------------
    // UPDATE TARGET
    // Modifie l'objectif d'un défi existant
    // -------------------------------------------------------------------------
    public function updateTarget(int $challengeId, int $targetValue): bool
    {
        $stmt = $this->db->prepare('
            UPDATE user_monthly_challenges
            SET target_value = :target_value,
                updated_at   = CURRENT_TIMESTAMP
            WHERE id = :id
        ');
        return $stmt->execute([
            ':id'           => $challengeId,
            ':target_value' => $targetValue,
        ]);
    }

    // -------------------------------------------------------------------------
    // FIND ALL BY USER
    // Récupère tout l'historique des défis d'un user
    // -------------------------------------------------------------------------
    public function findAllByUser(int $userId): array
    {
        $stmt = $this->db->prepare('
            SELECT * FROM user_monthly_challenges
            WHERE user_id = :user_id
            ORDER BY year DESC, month DESC, challenge_type
        ');
        $stmt->execute([':user_id' => $userId]);
        return $stmt->fetchAll();
    }

    // -------------------------------------------------------------------------
    // DELETE
    // Supprime un défi
    // -------------------------------------------------------------------------
    public function delete(int $challengeId): bool
    {
        $stmt = $this->db->prepare('DELETE FROM user_monthly_challenges WHERE id = :id');
        return $stmt->execute([':id' => $challengeId]);
    }
}