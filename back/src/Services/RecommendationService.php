<?php

declare(strict_types=1);

namespace App\Services;

use App\Database\Connection;
use PDO;

// RecommendationService génère des suggestions de livres
// Algo : récupère les catégories favorites de l'user → cherche dans Google Books
// → filtre les livres déjà dans sa bibliothèque
class RecommendationService
{
    private GoogleBooksService $googleBooksService;
    private PDO $pdo;

    public function __construct()
    {
        $this->googleBooksService = new GoogleBooksService();
        $this->pdo                = Connection::getInstance();
    }

    // Génère des recommandations pour un user
    // Limite : nombre de livres à retourner au total
    public function getRecommendations(int $userId, int $limit = 10): array
    {
        // 1. Récupérer les catégories favorites de l'user
        $topCategories = $this->getTopCategories($userId, 3);

        if (empty($topCategories)) {
            return [
                'message'    => 'Ajoutez des livres à votre bibliothèque pour recevoir des recommandations',
                'books'      => [],
                'categories' => [],
            ];
        }

        // 2. Récupérer les google_books_id déjà dans la biblio (à exclure)
        $existingIds = $this->getUserGoogleBooksIds($userId);

        // 3. Pour chaque catégorie, chercher des livres
        $recommendations = [];

        foreach ($topCategories as $category) {
            $results = $this->googleBooksService->searchByCategory($category, 10);

            foreach ($results as $book) {
                // Skip si pas d'id Google Books
                if (empty($book['google_books_id'])) {
                    continue;
                }

                // Skip si déjà dans la biblio
                if (in_array($book['google_books_id'], $existingIds, true)) {
                    continue;
                }

                // Skip si déjà dans les recommandations (évite les doublons cross-catégories)
                if (isset($recommendations[$book['google_books_id']])) {
                    continue;
                }

                $book['matched_category'] = $category;
                $recommendations[$book['google_books_id']] = $book;

                if (count($recommendations) >= $limit) {
                    break 2; // sort des deux boucles
                }
            }
        }

        return [
            'books'      => array_values($recommendations),
            'categories' => $topCategories,
        ];
    }

    // -------------------------------------------------------------------------
    // Récupère les catégories les plus représentées dans la biblio d'un user
    // -------------------------------------------------------------------------
    private function getTopCategories(int $userId, int $limit): array
    {
        $stmt = $this->pdo->prepare('
            SELECT c.name, COUNT(*) AS occurrences
            FROM user_books ub
            INNER JOIN book_categories bc ON bc.book_id = ub.book_id
            INNER JOIN categories c ON c.id = bc.category_id
            WHERE ub.user_id = :user_id
            GROUP BY c.name
            ORDER BY occurrences DESC
            LIMIT :limit
        ');
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();

        return array_column($stmt->fetchAll(), 'name');
    }

    // -------------------------------------------------------------------------
    // Récupère les google_books_id déjà présents dans la biblio d'un user
    // -------------------------------------------------------------------------
    private function getUserGoogleBooksIds(int $userId): array
    {
        $stmt = $this->pdo->prepare('
            SELECT b.google_books_id
            FROM user_books ub
            INNER JOIN books b ON b.id = ub.book_id
            WHERE ub.user_id = :user_id
              AND b.google_books_id IS NOT NULL
        ');
        $stmt->execute([':user_id' => $userId]);
        return array_column($stmt->fetchAll(), 'google_books_id');
    }
}