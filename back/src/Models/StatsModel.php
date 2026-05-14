<?php

declare(strict_types=1);

namespace App\Models;

// StatsModel agrège les données de lecture pour les vues stats/dashboard
// Pas d'héritage de BaseModel : ce modèle ne représente pas une table mais des agrégations
class StatsModel
{
    private \PDO $db;

    public function __construct()
    {
        $this->db = \App\Database\Connection::getInstance();
    }

    // -------------------------------------------------------------------------
    // GET YEARLY DASHBOARD STATS
    // Retourne les stats annuelles pour le dashboard :
    // - books_read   : nombre de livres complétés cette année
    // - pages_read   : pages lues via les sessions cette année
    // - minutes_read : minutes lues via les sessions cette année
    // -------------------------------------------------------------------------
    public function getYearlyDashboardStats(int $userId, int $year): array
    {
        // Livres complétés cette année (basé sur completed_at)
        $stmtBooks = $this->db->prepare('
            SELECT COUNT(*) AS books_read
            FROM user_books
            WHERE user_id = :user_id
              AND status = \'completed\'
              AND EXTRACT(YEAR FROM completed_at) = :year
        ');
        $stmtBooks->execute([
            ':user_id' => $userId,
            ':year'    => $year,
        ]);
        $booksRow = $stmtBooks->fetch();

        // Pages et minutes lues via les sessions cette année (basé sur session_date)
        // Jointure avec user_books pour filtrer par user_id
        $stmtSessions = $this->db->prepare('
            SELECT
                COALESCE(SUM(rs.pages_read), 0)       AS pages_read,
                COALESCE(SUM(rs.duration_minutes), 0) AS minutes_read
            FROM reading_sessions rs
            INNER JOIN user_books ub ON ub.id = rs.user_book_id
            WHERE ub.user_id = :user_id
              AND EXTRACT(YEAR FROM rs.session_date) = :year
        ');
        $stmtSessions->execute([
            ':user_id' => $userId,
            ':year'    => $year,
        ]);
        $sessionsRow = $stmtSessions->fetch();

        return [
            'books_read'   => (int) $booksRow['books_read'],
            'pages_read'   => (int) $sessionsRow['pages_read'],
            'minutes_read' => (int) $sessionsRow['minutes_read'],
        ];
    }

    // -------------------------------------------------------------------------
    // GET READING DATES
    // Retourne toutes les dates distinctes où l'user a au moins une session
    // Triées par date décroissante (plus récente en premier)
    // -------------------------------------------------------------------------
    public function getReadingDates(int $userId): array
    {
        $stmt = $this->db->prepare('
            SELECT DISTINCT rs.session_date
            FROM reading_sessions rs
            INNER JOIN user_books ub ON ub.id = rs.user_book_id
            WHERE ub.user_id = :user_id
            ORDER BY rs.session_date DESC
        ');
        $stmt->execute([':user_id' => $userId]);

        return $stmt->fetchAll(\PDO::FETCH_COLUMN);
    }
}