<?php

declare(strict_types=1);

namespace App\Models;

// UserBookModel gère la table user_books
// Chaque ligne = un livre dans la bibliothèque d'un utilisateur
// Contient le statut de lecture et la progression
class UserBookModel extends BaseModel
{
    protected string $table = 'user_books';

    // -------------------------------------------------------------------------
    // FIND BY USER AND BOOK
    // Vérifie si un user a déjà ce livre dans sa bibliothèque
    // Utile pour éviter les doublons à l'ajout
    // -------------------------------------------------------------------------
    public function findByUserAndBook(int $userId, int $bookId): array|false
    {
        $stmt = $this->db->prepare('
            SELECT * FROM user_books
            WHERE user_id = :user_id AND book_id = :book_id
        ');
        $stmt->execute([
            ':user_id' => $userId,
            ':book_id' => $bookId,
        ]);
        return $stmt->fetch();
    }

    // -------------------------------------------------------------------------
    // CREATE
    // Ajoute un livre à la bibliothèque d'un utilisateur
    // Par défaut : status 'to_read', current_page 0
    // -------------------------------------------------------------------------
    public function create(int $userId, int $bookId, string $status = 'to_read'): bool
    {
        $stmt = $this->db->prepare('
            INSERT INTO user_books (user_id, book_id, status)
            VALUES (:user_id, :book_id, :status)
        ');

        return $stmt->execute([
            ':user_id' => $userId,
            ':book_id' => $bookId,
            ':status'  => $status,
        ]);
    }

    // -------------------------------------------------------------------------
    // FIND ALL BY USER
    // Récupère tous les livres de la bibliothèque d'un utilisateur
    // On joint avec books pour avoir titre, auteur, couverture, etc.
    // -------------------------------------------------------------------------
    public function findAllByUser(int $userId): array
    {
        $stmt = $this->db->prepare('
            SELECT
                ub.id AS user_book_id,
                ub.status,
                ub.current_page,
                ub.created_at,
                b.id AS book_id,
                b.title,
                b.author,
                b.total_pages,
                b.thumbnail_url
            FROM user_books ub
            INNER JOIN books b ON b.id = ub.book_id
            WHERE ub.user_id = :user_id
            ORDER BY ub.created_at DESC
        ');
        $stmt->execute([':user_id' => $userId]);
        return $stmt->fetchAll();
    }

    // -------------------------------------------------------------------------
    // FIND BY ID AND USER
    // Récupère une entrée user_books par son id, en vérifiant que
    // l'entrée appartient bien à l'user (sécurité)
    // -------------------------------------------------------------------------
    public function findByIdAndUser(int $userBookId, int $userId): array|false
    {
        $stmt = $this->db->prepare('
            SELECT
                ub.id AS user_book_id,
                ub.status,
                ub.current_page,
                ub.created_at,
                b.id AS book_id,
                b.title,
                b.author,
                b.total_pages,
                b.thumbnail_url
            FROM user_books ub
            INNER JOIN books b ON b.id = ub.book_id
            WHERE ub.id = :user_book_id AND ub.user_id = :user_id
        ');
        $stmt->execute([
            ':user_book_id' => $userBookId,
            ':user_id'      => $userId,
        ]);
        return $stmt->fetch();
    }

    // -------------------------------------------------------------------------
    // UPDATE
    // Met à jour le statut et/ou la progression d'une lecture
    // -------------------------------------------------------------------------
    public function update(int $userBookId, string $status, int $currentPage): bool
    {
        $stmt = $this->db->prepare('
            UPDATE user_books
            SET status       = :status,
                current_page = :current_page,
                updated_at   = CURRENT_TIMESTAMP
            WHERE id = :id
        ');

        return $stmt->execute([
            ':id'           => $userBookId,
            ':status'       => $status,
            ':current_page' => $currentPage,
        ]);
    }

    // -------------------------------------------------------------------------
    // DELETE
    // Retire un livre de la bibliothèque
    // -------------------------------------------------------------------------
    public function delete(int $userBookId): bool
    {
        $stmt = $this->db->prepare('DELETE FROM user_books WHERE id = :id');
        return $stmt->execute([':id' => $userBookId]);
    }
}