<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\ReadingSessionService;
use App\Middlewares\AuthMiddleware;

class ReadingSessionController
{
    private ReadingSessionService $sessionService;
    private int $userId;

    public function __construct()
    {
        $user         = AuthMiddleware::check();
        $this->userId = (int) $user['user_id'];

        $this->sessionService = new ReadingSessionService();
    }

    // Crée une session de lecture pour un livre de la biblio
    // POST /api/library/:id/sessions
    public function create(array $params): void
    {
        $userBookId = (int) $params['id'];
        $data = json_decode(file_get_contents('php://input'), true);

        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode(['error' => 'Corps de requête invalide']);
            return;
        }

        $result = $this->sessionService->createSession($this->userId, $userBookId, $data);

        if (isset($result['error'])) {
            http_response_code(400);
        } else {
            http_response_code(201);
        }

        echo json_encode($result);
    }

    // Liste les sessions d'un livre de la biblio
    // GET /api/library/:id/sessions
    public function listByBook(array $params): void
    {
        $userBookId = (int) $params['id'];
        $result = $this->sessionService->getSessionsByUserBook($this->userId, $userBookId);

        if (isset($result['error'])) {
            http_response_code(404);
        }

        echo json_encode($result);
    }

    // Liste toutes les sessions de l'user (historique global)
    // GET /api/sessions
    public function listAll(): void
    {
        $sessions = $this->sessionService->getAllSessionsByUser($this->userId);
        echo json_encode(['sessions' => $sessions]);
    }
}