<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\StatsModel;
use App\Models\UserModel;

// StatsService orchestre la récupération des stats pour le dashboard
class StatsService
{
    private StatsModel $statsModel;
    private UserModel $userModel;

    public function __construct()
    {
        $this->statsModel = new StatsModel();
        $this->userModel  = new UserModel();
    }

    // -------------------------------------------------------------------------
    // GET DASHBOARD STATS
    // Agrège les stats annuelles + l'objectif annuel pour le dashboard
    // -------------------------------------------------------------------------
    public function getDashboardStats(int $userId): array
    {
        $user = $this->userModel->findProfileById($userId);

        if (!$user) {
            return ['error' => 'Utilisateur introuvable'];
        }

        $currentYear = (int) date('Y');
        $stats = $this->statsModel->getYearlyDashboardStats($userId, $currentYear);

        return [
            'year'              => $currentYear,
            'books_read'        => $stats['books_read'],
            'pages_read'        => $stats['pages_read'],
            'minutes_read'      => $stats['minutes_read'],
            'yearly_goal_books' => (int) $user['yearly_goal_books'],
        ];
    }
}