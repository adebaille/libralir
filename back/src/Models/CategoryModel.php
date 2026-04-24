<?php

declare(strict_types=1);

namespace App\Models;

// CategoryModel gère la table categories et le pivot book_categories
class CategoryModel extends BaseModel
{
    protected string $table = 'categories';

    // -------------------------------------------------------------------------
    // FIND OR CREATE
    // Cherche une catégorie par son nom, la crée si elle n'existe pas
    // Retourne l'id dans les deux cas
    // -------------------------------------------------------------------------
    public function findOrCreate(string $name): int
    {
        // Chercher d'abord
        $stmt = $this->db->prepare('SELECT id FROM categories WHERE name = :name');
        $stmt->execute([':name' => $name]);
        $existing = $stmt->fetch();

        if ($existing) {
            return (int) $existing['id'];
        }

        // Sinon, créer
        $stmt = $this->db->prepare('
            INSERT INTO categories (name) VALUES (:name) RETURNING id
        ');
        $stmt->execute([':name' => $name]);
        return (int) $stmt->fetchColumn();
    }

    // -------------------------------------------------------------------------
    // ATTACH TO BOOK
    // Lie une catégorie à un livre (pivot book_categories)
    // Utilise ON CONFLICT pour éviter les doublons silencieusement
    // -------------------------------------------------------------------------
    public function attachToBook(int $bookId, int $categoryId): void
    {
        $stmt = $this->db->prepare('
            INSERT INTO book_categories (book_id, category_id)
            VALUES (:book_id, :category_id)
            ON CONFLICT DO NOTHING
        ');
        $stmt->execute([
            ':book_id'     => $bookId,
            ':category_id' => $categoryId,
        ]);
    }

    // -------------------------------------------------------------------------
    // FIND BY BOOK
    // Récupère toutes les catégories d'un livre
    // -------------------------------------------------------------------------
    public function findByBook(int $bookId): array
    {
        $stmt = $this->db->prepare('
            SELECT c.id, c.name
            FROM categories c
            INNER JOIN book_categories bc ON bc.category_id = c.id
            WHERE bc.book_id = :book_id
        ');
        $stmt->execute([':book_id' => $bookId]);
        return $stmt->fetchAll();
    }
}