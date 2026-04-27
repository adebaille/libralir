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
    // Récupère les livres de la bibliothèque d'un user, avec filtres optionnels
    // Chaque filtre est optionnel : si absent, on ne l'applique pas
    // -------------------------------------------------------------------------
    public function findAllByUser(
        int $userId,
        ?string $status = null,
        ?string $author = null,
        ?string $title = null,
        ?string $category = null,
        string $orderBy = 'created_at_desc'
    ): array {
        $sql = "
            SELECT
                ub.id AS user_book_id,
                ub.status,
                ub.current_page,
                ub.created_at,
                b.id AS book_id,
                b.title,
                b.author,
                b.total_pages,
                b.thumbnail_url,
                COALESCE(
                    (SELECT array_agg(c.name)
                     FROM book_categories bc
                     INNER JOIN categories c ON c.id = bc.category_id
                     WHERE bc.book_id = b.id),
                    ARRAY[]::VARCHAR[]
                ) AS categories
            FROM user_books ub
            INNER JOIN books b ON b.id = ub.book_id
            WHERE ub.user_id = :user_id
        ";
        $params = [':user_id' => $userId];

        // Filtre par statut (égalité exacte)
        if ($status !== null && $status !== '') {
            $sql .= ' AND ub.status = :status';
            $params[':status'] = $status;
        }

        // Filtre par auteur (recherche partielle insensible à la casse)
        if ($author !== null && $author !== '') {
            $sql .= ' AND b.author ILIKE :author';
            $params[':author'] = '%' . $author . '%';
        }

        // Filtre par titre (recherche partielle insensible à la casse)
        if ($title !== null && $title !== '') {
            $sql .= ' AND b.title ILIKE :title';
            $params[':title'] = '%' . $title . '%';
        }

        // Filtre par catégorie (recherche partielle insensible à la casse)
        if ($category !== null && $category !== '') {
            $sql .= ' AND EXISTS (
                SELECT 1 FROM book_categories bc
                INNER JOIN categories c ON c.id = bc.category_id
                WHERE bc.book_id = b.id AND c.name ILIKE :category
            )';
            $params[':category'] = '%' . $category . '%';
        }

        // Tri — on utilise match() pour éviter l'injection SQL dans ORDER BY
        $sql .= match ($orderBy) {
            'title_asc'       => ' ORDER BY b.title ASC',
            'title_desc'      => ' ORDER BY b.title DESC',
            'author_asc'      => ' ORDER BY b.author ASC',
            'author_desc'     => ' ORDER BY b.author DESC',
            'created_at_asc'  => ' ORDER BY ub.created_at ASC',
            default           => ' ORDER BY ub.created_at DESC',
        };

       $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        // Convertit le format PostgreSQL "{\"a\",\"b\"}" en tableau PHP
        foreach ($rows as &$row) {
            $row['categories'] = $this->parsePgArray($row['categories']);
        }

        return $rows;
    }

    // Parse le format de tableau PostgreSQL (ex: {"Fantasy","Aventure"}) en tableau PHP
    private function parsePgArray(?string $pgArray): array
    {
        if ($pgArray === null || $pgArray === '{}') {
            return [];
        }

        // Retire les accolades et split sur les virgules
        $content = trim($pgArray, '{}');
        $items = str_getcsv($content, ',', '"', '\\');
        return array_map(fn($item) => trim($item), $items);
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
                b.thumbnail_url,
                COALESCE(
                    (SELECT array_agg(c.name)
                     FROM book_categories bc
                     INNER JOIN categories c ON c.id = bc.category_id
                     WHERE bc.book_id = b.id),
                    ARRAY[]::VARCHAR[]
                ) AS categories
            FROM user_books ub
            INNER JOIN books b ON b.id = ub.book_id
            WHERE ub.id = :user_book_id AND ub.user_id = :user_id
        ');
        $stmt->execute([
            ':user_book_id' => $userBookId,
            ':user_id'      => $userId,
        ]);

        $row = $stmt->fetch();

        if ($row === false) {
            return false;
        }

        $row['categories'] = $this->parsePgArray($row['categories']);
        return $row;
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