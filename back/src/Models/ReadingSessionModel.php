<?php

declare(strict_types=1);

namespace App\Models;

// ReadingSessionModel gère la table reading_sessions
// Chaque ligne = une session de lecture pour un livre de la bibliothèque d'un user
class ReadingSessionModel extends BaseModel
{
    protected string $table = 'reading_sessions';

    // -------------------------------------------------------------------------
    // CREATE
    // Enregistre une nouvelle session de lecture
    // -------------------------------------------------------------------------
    public function create(
        int $userBookId,
        int $pagesRead,
        ?int $durationMinutes = null,
        ?string $sessionDate = null
    ): int {
        $stmt = $this->db->prepare('
            INSERT INTO reading_sessions (user_book_id, pages_read, duration_minutes, session_date)
            VALUES (:user_book_id, :pages_read, :duration_minutes, COALESCE(:session_date, CURRENT_DATE))
            RETURNING id
        ');

        $stmt->execute([
            ':user_book_id'     => $userBookId,
            ':pages_read'       => $pagesRead,
            ':duration_minutes' => $durationMinutes,
            ':session_date'     => $sessionDate,
        ]);

        return (int) $stmt->fetchColumn();
    }

    // -------------------------------------------------------------------------
    // FIND ALL BY USER BOOK
    // Récupère toutes les sessions pour une lecture donnée
    // -------------------------------------------------------------------------
    public function findAllByUserBook(int $userBookId): array
    {
        $stmt = $this->db->prepare('
            SELECT * FROM reading_sessions
            WHERE user_book_id = :user_book_id
            ORDER BY session_date DESC, created_at DESC
        ');
        $stmt->execute([':user_book_id' => $userBookId]);
        return $stmt->fetchAll();
    }

    // -------------------------------------------------------------------------
    // FIND ALL BY USER
    // Récupère toutes les sessions d'un user (toutes lectures confondues)
    // On joint avec user_books + books pour avoir les infos du livre
    // -------------------------------------------------------------------------
    public function findAllByUser(int $userId): array
    {
        $stmt = $this->db->prepare('
            SELECT
                rs.id,
                rs.pages_read,
                rs.duration_minutes,
                rs.session_date,
                rs.created_at,
                b.title,
                b.author
            FROM reading_sessions rs
            INNER JOIN user_books ub ON ub.id = rs.user_book_id
            INNER JOIN books b ON b.id = ub.book_id
            WHERE ub.user_id = :user_id
            ORDER BY rs.session_date DESC, rs.created_at DESC
        ');
        $stmt->execute([':user_id' => $userId]);
        return $stmt->fetchAll();
    }

    // -------------------------------------------------------------------------
    // DELETE
    // Supprime une session de lecture
    // -------------------------------------------------------------------------
    public function delete(int $sessionId): bool
    {
        $stmt = $this->db->prepare('DELETE FROM reading_sessions WHERE id = :id');
        return $stmt->execute([':id' => $sessionId]);
    }
}