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

    // -------------------------------------------------------------------------
    // UPDATE YEARLY GOAL
    // Met à jour l'objectif annuel de livres
    // Validation : doit être un entier positif (0 = pas d'objectif fixé)
    // -------------------------------------------------------------------------
    public function updateYearlyGoal(int $userId, int $yearlyGoalBooks): array
    {
        if ($yearlyGoalBooks < 0) {
            return ['error' => 'L\'objectif doit être un nombre positif'];
        }

        $success = $this->userModel->updateYearlyGoal($userId, $yearlyGoalBooks);

        if (!$success) {
            return ['error' => 'Erreur lors de la mise à jour de l\'objectif'];
        }

        return ['message' => 'Objectif mis à jour'];
    }

    // -------------------------------------------------------------------------
    // UPDATE DISPLAY NAME
    // Met à jour le nom de lecteur
    // Validation : 2-50 caractères après trim (cohérent avec l'inscription)
    // -------------------------------------------------------------------------
    public function updateDisplayName(int $userId, string $displayName): array
    {
        $displayName = trim($displayName);
        $length      = mb_strlen($displayName);

        if ($length < 2 || $length > 50) {
            return ['error' => 'Le nom de lecteur doit contenir entre 2 et 50 caractères'];
        }

        $success = $this->userModel->updateDisplayName($userId, $displayName);

        if (!$success) {
            return ['error' => 'Erreur lors de la mise à jour du nom'];
        }

        return [
            'message'      => 'Nom mis à jour',
            'display_name' => $displayName,
        ];
    }
}