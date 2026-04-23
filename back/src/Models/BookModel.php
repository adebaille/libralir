<?php

declare(strict_types=1);

namespace App\Models;

// BookModel gère la table books (catalogue partagé)
// Hérite de BaseModel pour récupérer findAll() et findById()
class BookModel extends BaseModel
{
    protected string $table = 'books';

    // -------------------------------------------------------------------------
    // FIND BY GOOGLE BOOKS ID
    // Vérifie si un livre existe déjà dans notre catalogue
    // Retourne le livre s'il existe, false sinon
    // -------------------------------------------------------------------------
    public function findByGoogleBooksId(string $googleBooksId): array|false
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM books WHERE google_books_id = :google_books_id'
        );
        $stmt->execute([':google_books_id' => $googleBooksId]);
        return $stmt->fetch();
    }

    // -------------------------------------------------------------------------
    // CREATE
    // Ajoute un livre au catalogue (à partir des données Google Books)
    // Retourne l'id du livre créé
    // -------------------------------------------------------------------------
    public function create(
        string $title,
        ?string $author,
        int $totalPages,
        string $googleBooksId,
        ?string $isbn13,
        ?string $thumbnailUrl
    ): int {
        $stmt = $this->db->prepare('
            INSERT INTO books (title, author, total_pages, google_books_id, isbn_13, thumbnail_url)
            VALUES (:title, :author, :total_pages, :google_books_id, :isbn_13, :thumbnail_url)
            RETURNING id
        ');

        $stmt->execute([
            ':title'           => $title,
            ':author'          => $author,
            ':total_pages'     => $totalPages,
            ':google_books_id' => $googleBooksId,
            ':isbn_13'         => $isbn13,
            ':thumbnail_url'   => $thumbnailUrl,
        ]);

        return (int) $stmt->fetchColumn();
    }
}