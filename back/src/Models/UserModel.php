<?php

declare(strict_types=1);

namespace App\Models;

// UserModel gère les accès BDD liés à la table users
// Hérite de BaseModel pour récupérer findAll() et findById() gratuitement
class UserModel extends BaseModel
{
    protected string $table = 'users';

    // -------------------------------------------------------------------------
    // FIND BY EMAIL
    // Cherche un utilisateur par son email
    // Utilisé à la connexion pour vérifier si le compte existe
    // -------------------------------------------------------------------------
    public function findByEmail(string $email): array|false
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM users WHERE email = :email'
        );
        $stmt->execute([':email' => $email]);
        return $stmt->fetch();
    }
    
// -------------------------------------------------------------------------
    // FIND PROFILE BY ID
    // Retourne les infos publiques d'un user (sans password_hash)
    // Utilisé par GET /api/me et tout endpoint qui retourne le profil
    // -------------------------------------------------------------------------
    public function findProfileById(int $id): array|false
    {
        $stmt = $this->db->prepare(
            'SELECT id, email, display_name, created_at 
             FROM users 
             WHERE id = :id'
        );
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();
    }

    // -------------------------------------------------------------------------
    // CREATE
    // Insère un nouvel utilisateur avec un hash déjà préparé par AuthService
    // Le Model ne hash pas — il stocke simplement ce qu'on lui donne
    // -------------------------------------------------------------------------
    public function create(string $email, string $passwordHash, string $displayName): bool
    {
        $stmt = $this->db->prepare(
            'INSERT INTO users (email, password_hash, display_name) 
             VALUES (:email, :password_hash, :display_name)'
        );

        return $stmt->execute([
            ':email'         => $email,
            ':password_hash' => $passwordHash,
            ':display_name'  => $displayName,
        ]);
    }

    // -------------------------------------------------------------------------
    // DELETE
    // Supprime un utilisateur
    // Grâce au ON DELETE CASCADE défini dans init.sql,
    // PostgreSQL supprime automatiquement toutes ses données liées
    // (livres, sessions de lecture, badges...)
    // -------------------------------------------------------------------------
    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare(
            'DELETE FROM users WHERE id = :id'
        );

        return $stmt->execute([':id' => $id]);
    }
}