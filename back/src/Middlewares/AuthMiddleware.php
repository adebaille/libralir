<?php

declare(strict_types=1);

namespace App\Middlewares;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class AuthMiddleware
{
    // Vérifie le JWT envoyé dans le header Authorization
    // Retourne les données du token (user_id, email) si valide
    // Termine la requête avec 401 si invalide
    public static function check(): array
    {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';

        // Le header doit commencer par "Bearer "
        if (!str_starts_with($authHeader, 'Bearer ')) {
            self::unauthorized('Token manquant');
        }

        // On extrait le token (tout ce qui suit "Bearer ")
        $token = substr($authHeader, 7);
        $jwtSecret = $_ENV['JWT_SECRET'] ?? 'default_secret';

        try {
            $decoded = JWT::decode($token, new Key($jwtSecret, 'HS256'));
            return (array) $decoded;
        } catch (Exception $e) {
            self::unauthorized('Token invalide ou expiré');
        }
    }

    private static function unauthorized(string $message): never
    {
        http_response_code(401);
        echo json_encode(['error' => $message]);
        exit;
    }
}