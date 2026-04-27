<?php

declare(strict_types=1);

namespace App\Models;

// BadgeModel gère la table badges (catalogue des badges) et user_badges (qui a quoi)
class BadgeModel extends BaseModel
{
    protected string $table = 'badges';

    // -------------------------------------------------------------------------
    // FIND ALL ACTIVE
    // Récupère tous les badges existants
    // -------------------------------------------------------------------------
    public function findAllActive(): array
    {
        $stmt = $this->db->query('SELECT * FROM badges ORDER BY condition_type, condition_value');
        return $stmt->fetchAll();
    }

    // -------------------------------------------------------------------------
    // FIND OBTAINED BY USER
    // Liste les badges déjà obtenus par un user
    // Retourne la définition du badge + la date d'obtention
    // -------------------------------------------------------------------------
    public function findObtainedByUser(int $userId): array
    {
        $stmt = $this->db->prepare('
            SELECT
                b.id,
                b.name,
                b.description,
                b.condition_type,
                b.condition_value,
                ub.obtained_at
            FROM user_badges ub
            INNER JOIN badges b ON b.id = ub.badge_id
            WHERE ub.user_id = :user_id
            ORDER BY ub.obtained_at DESC
        ');
        $stmt->execute([':user_id' => $userId]);
        return $stmt->fetchAll();
    }

    // -------------------------------------------------------------------------
    // FIND OBTAINED BADGE IDS
    // Renvoie juste les ids des badges obtenus par un user
    // Plus léger pour vérifier ce qu'il manque à attribuer
    // -------------------------------------------------------------------------
    public function findObtainedBadgeIds(int $userId): array
    {
        $stmt = $this->db->prepare('
            SELECT badge_id FROM user_badges WHERE user_id = :user_id
        ');
        $stmt->execute([':user_id' => $userId]);
        return array_column($stmt->fetchAll(), 'badge_id');
    }

    // -------------------------------------------------------------------------
    // AWARD BADGE
    // Attribue un badge à un user
    // Utilise ON CONFLICT DO NOTHING au cas où le badge serait déjà attribué
    // -------------------------------------------------------------------------
    public function awardBadge(int $userId, int $badgeId): bool
    {
        $stmt = $this->db->prepare('
            INSERT INTO user_badges (user_id, badge_id)
            VALUES (:user_id, :badge_id)
            ON CONFLICT DO NOTHING
        ');
        return $stmt->execute([
            ':user_id'  => $userId,
            ':badge_id' => $badgeId,
        ]);
    }
}