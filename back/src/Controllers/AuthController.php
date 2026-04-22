<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\AuthService;

class AuthController
{
    private AuthService $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    public function register(): void
    {
        // Récupère le corps de la requête JSON
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Email et mot de passe requis']);
            return;
        }

        $result = $this->authService->register($data['email'], $data['password']);

        if (isset($result['error'])) {
            http_response_code(409);
        } else {
            http_response_code(201);
        }

        echo json_encode($result);
    }

    public function login(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Email et mot de passe requis']);
            return;
        }

        $result = $this->authService->login($data['email'], $data['password']);

        if (isset($result['error'])) {
            http_response_code(401);
        }

        echo json_encode($result);
    }
}