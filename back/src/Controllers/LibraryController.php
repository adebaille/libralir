<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\LibraryService;
use App\Middlewares\AuthMiddleware;

class LibraryController
{
    private LibraryService $libraryService;
    private int $userId;

    public function __construct()
    {
        // Auth obligatoire : on récupère l'user_id du JWT
        $user         = AuthMiddleware::check();
        $this->userId = (int) $user['user_id'];

        $this->libraryService = new LibraryService();
    }

    // Ajoute un livre à la bibliothèque
    // POST /api/library
    public function add(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode(['error' => 'Corps de requête invalide']);
            return;
        }

        $result = $this->libraryService->addBookToLibrary($this->userId, $data);

        if (isset($result['error'])) {
            http_response_code(400);
        } else {
            http_response_code(201);
        }

        echo json_encode($result);
    }

    // Liste la bibliothèque de l'user
    // GET /api/library
    public function list(): void
    {
        $books = $this->libraryService->getUserLibrary($this->userId);
        echo json_encode(['books' => $books]);
    }
}