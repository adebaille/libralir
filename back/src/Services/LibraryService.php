<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\BookModel;
use App\Models\UserBookModel;
use App\Models\CategoryModel;
use App\Services\BadgeService;

// LibraryService gère la logique d'ajout d'un livre à la bibliothèque d'un user
// Logique en 2 temps : on s'assure que le livre existe dans le catalogue,
// puis on l'associe à l'utilisateur
class LibraryService
{
    private BookModel $bookModel;
    private UserBookModel $userBookModel;
    private CategoryModel $categoryModel;
    private BadgeService $badgeService;

    public function __construct()
    {
        $this->bookModel     = new BookModel();
        $this->userBookModel = new UserBookModel();
        $this->categoryModel = new CategoryModel();
        $this->badgeService = new BadgeService();
    }

    // Ajoute un livre à la bibliothèque d'un user
    // Deux modes :
    // - Google Books : payload contient google_books_id, on cherche dans le catalogue avant
    // - Saisie manuelle : pas de google_books_id, on crée toujours une nouvelle entrée
    public function addBookToLibrary(int $userId, array $bookData): array
    {
        // Validation des champs communs aux deux modes
        if (empty($bookData['title'])) {
            return ['error' => 'Le titre est requis'];
        }

        if (empty($bookData['page_count']) || $bookData['page_count'] <= 0) {
            return ['error' => 'Nombre de pages invalide'];
        }

        $googleBooksId = !empty($bookData['google_books_id'])
            ? $bookData['google_books_id']
            : null;

        // Étape 1 : récupérer ou créer le livre dans le catalogue
        $book = null;

        if ($googleBooksId !== null) {
            // Mode Google Books : on vérifie si le livre est déjà dans le catalogue
            $book = $this->bookModel->findByGoogleBooksId($googleBooksId);
        }

        if ($book) {
            $bookId = (int) $book['id'];
        } else {
            // Pas dans le catalogue (ou saisie manuelle) : on crée
            $author = isset($bookData['authors']) && is_array($bookData['authors'])
                ? implode(', ', $bookData['authors'])
                : ($bookData['author'] ?? null);

            $bookId = $this->bookModel->create(
                $bookData['title'],
                $author,
                (int) $bookData['page_count'],
                $googleBooksId,
                $bookData['isbn_13'] ?? null,
                $bookData['thumbnail'] ?? null
            );

            // Catégories (si fournies, typiquement par Google Books)
            if (!empty($bookData['categories']) && is_array($bookData['categories'])) {
                foreach ($bookData['categories'] as $categoryName) {
                    $categoryId = $this->categoryModel->findOrCreate($categoryName);
                    $this->categoryModel->attachToBook($bookId, $categoryId);
                }
            }
        }

        // Étape 2 : vérifier les doublons UNIQUEMENT pour les livres Google Books
        // (pour la saisie manuelle, on accepte les doublons — décision V1)
        if ($googleBooksId !== null) {
            if ($this->userBookModel->findByUserAndBook($userId, $bookId)) {
                return ['error' => 'Ce livre est déjà dans votre bibliothèque'];
            }
        }

        // Étape 3 : ajouter à la bibliothèque
        $this->userBookModel->create($userId, $bookId);
        $newBadges = $this->badgeService->checkAndAwardBadges($userId);

        return [
            'message'    => 'Livre ajouté à votre bibliothèque',
            'new_badges' => $newBadges,
        ];
    }

    // Récupère la bibliothèque d'un user avec filtres optionnels
    public function getUserLibrary(int $userId, array $filters = []): array
    {
        return $this->userBookModel->findAllByUser(
            $userId,
            $filters['status']   ?? null,
            $filters['author']   ?? null,
            $filters['title']    ?? null,
            $filters['category'] ?? null,
            $filters['order_by'] ?? 'created_at_desc'
        );
    }

    // Récupère un livre précis de la bibliothèque
    public function getBookFromLibrary(int $userId, int $userBookId): array
    {
        $book = $this->userBookModel->findByIdAndUser($userBookId, $userId);

        if (!$book) {
            return ['error' => 'Livre introuvable dans votre bibliothèque'];
        }

        return ['book' => $book];
    }

    // Met à jour le statut et/ou la progression
    // Gère automatiquement completed_at selon les transitions de statut
    public function updateBookInLibrary(int $userId, int $userBookId, array $data): array
    {
        $book = $this->userBookModel->findByIdAndUser($userBookId, $userId);

        if (!$book) {
            return ['error' => 'Livre introuvable dans votre bibliothèque'];
        }

        // Validation du statut si fourni
        $validStatuses = ['to_read', 'in_progress', 'completed', 'paused', 'abandoned'];
        $status = $data['status'] ?? $book['status'];

        if (!in_array($status, $validStatuses, true)) {
            return ['error' => 'Statut invalide'];
        }

        // Validation de la progression si fournie
        $currentPage = isset($data['current_page']) ? (int) $data['current_page'] : $book['current_page'];

        if ($currentPage < 0 || $currentPage > $book['total_pages']) {
            return ['error' => 'Page actuelle invalide'];
        }

        // Gestion de completed_at selon les transitions de statut
        $completedAt = $book['completed_at'] ?? null;

        if ($status === 'completed' && $book['status'] !== 'completed') {
            // Passage à completed → on enregistre la date
            $completedAt = date('Y-m-d H:i:s');
        } elseif ($status !== 'completed' && $book['status'] === 'completed') {
            // L'user revient en arrière (relecture, erreur) → on reset
            $completedAt = null;
        }
        // Sinon (transition completed → completed ou autre → autre) : on garde tel quel

        $this->userBookModel->update($userBookId, $status, $currentPage, $completedAt);
        $newBadges = $this->badgeService->checkAndAwardBadges($userId);

        return [
            'message'    => 'Lecture mise à jour',
            'new_badges' => $newBadges,
        ];
    }

    // Retire un livre de la bibliothèque
    public function removeBookFromLibrary(int $userId, int $userBookId): array
    {
        $book = $this->userBookModel->findByIdAndUser($userBookId, $userId);

        if (!$book) {
            return ['error' => 'Livre introuvable dans votre bibliothèque'];
        }

        $this->userBookModel->delete($userBookId);

        return ['message' => 'Livre retiré de votre bibliothèque'];
    }
}