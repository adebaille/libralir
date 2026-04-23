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

    // Récupère la bibliothèque d'un user
    public function getUserLibrary(int $userId): array
    {
        return $this->userBookModel->findAllByUser($userId);
    }
}