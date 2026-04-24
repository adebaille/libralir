<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\BookModel;
use App\Models\UserBookModel;

// LibraryService gère la logique d'ajout d'un livre à la bibliothèque d'un user
// Logique en 2 temps : on s'assure que le livre existe dans le catalogue,
// puis on l'associe à l'utilisateur
class LibraryService
{
    private BookModel $bookModel;
    private UserBookModel $userBookModel;

    public function __construct()
    {
        $this->bookModel     = new BookModel();
        $this->userBookModel = new UserBookModel();
    }

    // Ajoute un livre (issu de Google Books) à la bibliothèque d'un user
    // $bookData = payload reçu du front (title, authors, page_count, google_books_id, etc.)
    public function addBookToLibrary(int $userId, array $bookData): array
    {
        // Validation minimale
        if (empty($bookData['google_books_id']) || empty($bookData['title'])) {
            return ['error' => 'Données du livre incomplètes'];
        }

        if (empty($bookData['page_count']) || $bookData['page_count'] <= 0) {
            return ['error' => 'Nombre de pages invalide'];
        }

        // Étape 1 : le livre existe-t-il déjà dans le catalogue ?
        $book = $this->bookModel->findByGoogleBooksId($bookData['google_books_id']);

        if (!$book) {
            // Pas dans le catalogue : on l'ajoute
            $author = isset($bookData['authors']) && is_array($bookData['authors'])
                ? implode(', ', $bookData['authors'])
                : null;

            $bookId = $this->bookModel->create(
                $bookData['title'],
                $author,
                (int) $bookData['page_count'],
                $bookData['google_books_id'],
                $bookData['isbn_13'] ?? null,
                $bookData['thumbnail'] ?? null
            );
        } else {
            $bookId = (int) $book['id'];
        }

        // Étape 2 : vérifier si l'user a déjà ce livre
        if ($this->userBookModel->findByUserAndBook($userId, $bookId)) {
            return ['error' => 'Ce livre est déjà dans votre bibliothèque'];
        }

        // Étape 3 : ajouter à la bibliothèque
        $this->userBookModel->create($userId, $bookId);

        return ['message' => 'Livre ajouté à votre bibliothèque'];
    }

    // Récupère la bibliothèque d'un user avec filtres optionnels
    public function getUserLibrary(int $userId, array $filters = []): array
    {
        return $this->userBookModel->findAllByUser(
            $userId,
            $filters['status']   ?? null,
            $filters['author']   ?? null,
            $filters['title']    ?? null,
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

        $this->userBookModel->update($userBookId, $status, $currentPage);

        return ['message' => 'Lecture mise à jour'];
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