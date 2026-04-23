<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\UserModel;
use Firebase\JWT\JWT;

class AuthService
{
    private UserModel $userModel;
    private string $jwtSecret;

    public function __construct()
    {
        $this->userModel = new UserModel();
        $this->jwtSecret = $_ENV['JWT_SECRET'] ?? 'default_secret';
    }

    // Inscription : vérifie l'unicité de l'email, hash le mot de passe, crée l'utilisateur
    public function register(string $email, string $password): array
    {
        if ($this->userModel->findByEmail($email)) {
            return ['error' => 'Cet email est déjà utilisé'];
        }

        $passwordHash = password_hash($password, PASSWORD_BCRYPT);
        $this->userModel->create($email, $passwordHash);

        return ['message' => 'Inscription réussie'];
    }

    // Connexion : vérifie le mot de passe et génère un JWT
    public function login(string $email, string $password): array
    {
        $user = $this->userModel->findByEmail($email);

        if (!$user || !password_verify($password, $user['password_hash'])) {
            return ['error' => 'Email ou mot de passe incorrect'];
        }

        $payload = [
            'user_id' => $user['id'],
            'email'   => $email,
            'exp'     => time() + 86400, // expire dans 24h
        ];

        $token = JWT::encode($payload, $this->jwtSecret, 'HS256');

        return ['token' => $token];
    }
}