<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\GoogleBooksService;
use App\Middlewares\AuthMiddleware;

class BookController
{
    private GoogleBooksService $googleBooksService;

    public function __construct()
    {
        // Toutes les routes de ce Controller nécessitent d'être connecté
        AuthMiddleware::check();

        $this->googleBooksService = new GoogleBooksService();
    }

    // Recherche de livres via Google Books
    // GET /api/books/search?q=harry+potter
   public function search(): void
    {
        $query = trim($_GET['q'] ?? '');

        if ($query === '') {
            http_response_code(400);
            echo json_encode(['error' => 'Le paramètre q est requis']);
            return;
        }

        try {
            $books = $this->googleBooksService->search($query);
            echo json_encode(['books' => $books]);
        } catch (\RuntimeException $e) {
            http_response_code(503);
            echo json_encode(['error' => 'Service de recherche temporairement indisponible']);
        }
    }
}