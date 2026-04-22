<?php

declare(strict_types=1);

namespace App\Services;

use App\Database\Connection;
use Firebase\JWT\JWT;
use PDO;

class AuthService
{
    private PDO $pdo;
    private string $jwtSecret;

    public function __construct()
    {
        $this->pdo       = Connection::getInstance();
        $this->jwtSecret = $_ENV['JWT_SECRET'] ?? 'default_secret';
    }

    public function register(string $email, string $password): array
    {
        // Vérifie si l'email existe déjà
        $stmt = $this->pdo->prepare('SELECT id FROM users WHERE email = :email');
        $stmt->execute([':email' => $email]);

        if ($stmt->fetch()) {
            return ['error' => 'Cet email est déjà utilisé'];
        }

        // Hash du mot de passe
        $passwordHash = password_hash($password, PASSWORD_BCRYPT);

        // Insertion en BDD
        $stmt = $this->pdo->prepare(
            'INSERT INTO users (email, password_hash) VALUES (:email, :password_hash)'
        );
        $stmt->execute([
            ':email'         => $email,
            ':password_hash' => $passwordHash,
        ]);

        return ['message' => 'Inscription réussie'];
    }

    public function login(string $email, string $password): array
    {
        // Récupère l'utilisateur
        $stmt = $this->pdo->prepare('SELECT id, password_hash FROM users WHERE email = :email');
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            return ['error' => 'Email ou mot de passe incorrect'];
        }

        // Génère le JWT
        $payload = [
            'user_id' => $user['id'],
            'email'   => $email,
            'exp'     => time() + 86400, // expire dans 24h
        ];

        $token = JWT::encode($payload, $this->jwtSecret, 'HS256');

        return ['token' => $token];
    }
}