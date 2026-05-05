<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\UserService;
use App\Middlewares\AuthMiddleware;

class UserController
{
    private UserService $userService;
    private int $userId;

    public function __construct()
    {
        $user         = AuthMiddleware::check();
        $this->userId = (int) $user['user_id'];

        $this->userService = new UserService();
    }

    // Retourne le profil de l'utilisateur connecté
    // GET /api/me
    public function me(): void
    {
        $result = $this->userService->getProfile($this->userId);

        if (isset($result['error'])) {
            http_response_code(404);
        }

        echo json_encode($result);
    }
}