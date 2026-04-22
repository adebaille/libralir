<?php

declare(strict_types=1);

namespace App\Database;

use PDO;
use PDOException;

class Connection
{
    // Connexion partagée — créée une seule fois, réutilisée partout (pattern Singleton)
    private static ?PDO $instance = null;

    public static function getInstance(): PDO
    {
        if (self::$instance === null) {
            $dsn = sprintf(
                'pgsql:host=%s;port=%s;dbname=%s',
                $_ENV['DB_HOST'] ?? 'postgres',
                $_ENV['DB_PORT'] ?? '5432',
                $_ENV['DB_NAME'] ?? 'libralir'
            );

            try {
                self::$instance = new PDO(
                    $dsn,
                    $_ENV['DB_USER'] ?? '',
                    $_ENV['DB_PASSWORD'] ?? '',
                    [
                        // Lève une exception en cas d'erreur SQL
                        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                        // Retourne les résultats en tableau associatif ($row['email'])
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        // Désactive la simulation des requêtes préparées (plus sécurisé)
                        PDO::ATTR_EMULATE_PREPARES   => false,
                    ]
                );
            } catch (PDOException $e) {
                throw new \RuntimeException('Connexion DB échouée : ' . $e->getMessage());
            }
        }

        return self::$instance;
    }
}