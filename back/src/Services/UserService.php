<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\UserModel;

// UserService gère la logique métier liée aux utilisateurs
// Récupération du profil, mise à jour des infos, préférences...
class UserService
{
    private UserModel $userModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
    }

    // -------------------------------------------------------------------------
    // GET PROFILE
    // Récupère le profil public d'un user (sans password_hash)
    // -------------------------------------------------------------------------
    public function getProfile(int $userId): array
    {
        $user = $this->userModel->findProfileById($userId);

        if (!$user) {
            return ['error' => 'Utilisateur introuvable'];
        }

        return $user;
    }
}