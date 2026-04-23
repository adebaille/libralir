<?php

declare(strict_types=1);

namespace App\Models;

use App\Database\Connection;
use PDO;

// "abstract" = classe modèle (plan), pas utilisable directement
// Chaque Model enfant (UserModel, BookModel...) hérite de ce plan
abstract class BaseModel
{
    // Connexion BDD disponible pour tous les Models enfants
    protected PDO $db;

    // Nom de la table — chaque Model enfant doit le définir
    // Ex: protected string $table = 'books';
    protected string $table = '';

    public function __construct()
    {
        $this->db = Connection::getInstance();
    }

    // Récupère toutes les lignes de la table
    public function findAll(): array
    {
        $stmt = $this->db->query("SELECT * FROM {$this->table}");
        return $stmt->fetchAll();
    }

    // Récupère une ligne par son id
    // Retourne false si rien trouvé
    public function findById(int $id): array|false
    {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE id = :id");
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();
    }
}