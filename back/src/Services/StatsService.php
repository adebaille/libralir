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

        // Calcule la série en cours à partir des dates de lecture
        $readingDates  = $this->statsModel->getReadingDates($userId);
        $currentStreak = $this->calculateCurrentStreak($readingDates);

        return [
            'year'              => $currentYear,
            'books_read'        => $stats['books_read'],
            'pages_read'        => $stats['pages_read'],
            'minutes_read'      => $stats['minutes_read'],
            'yearly_goal_books' => (int) $user['yearly_goal_books'],
            'current_streak'    => $currentStreak,
        ];
    }

    // -------------------------------------------------------------------------
    // CALCULATE CURRENT STREAK
    // Calcule la série de jours consécutifs de lecture en cours
    // Règle : la série inclut les jours consécutifs jusqu'à hier ou aujourd'hui
    // Si l'user n'a pas lu hier ni aujourd'hui, la série est de 0
    // -------------------------------------------------------------------------
    private function calculateCurrentStreak(array $readingDates): int
    {
        if (empty($readingDates)) {
            return 0;
        }

        $today     = new \DateTimeImmutable('today');
        $yesterday = $today->modify('-1 day');

        // Convertit la première date (la plus récente) en DateTimeImmutable
        $mostRecent = new \DateTimeImmutable($readingDates[0]);

        // Si la dernière session n'est ni aujourd'hui ni hier, la série est cassée
        if ($mostRecent < $yesterday) {
            return 0;
        }

        // On compte les jours consécutifs en remontant
        $streak       = 1;
        $expectedDate = $mostRecent->modify('-1 day');

        for ($i = 1; $i < count($readingDates); $i++) {
            $currentDate = new \DateTimeImmutable($readingDates[$i]);

            if ($currentDate->format('Y-m-d') === $expectedDate->format('Y-m-d')) {
                $streak++;
                $expectedDate = $expectedDate->modify('-1 day');
            } else {
                break;
            }
        }

        return $streak;
    }
}