<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\StatsService;
use App\Middlewares\AuthMiddleware;

class StatsController
{
    private StatsService $statsService;
    private int $userId;

    public function __construct()
    {
        $user         = AuthMiddleware::check();
        $this->userId = (int) $user['user_id'];

        $this->statsService = new StatsService();
    }

    // Retourne les stats agrégées pour le dashboard
    // GET /api/stats/dashboard
    public function dashboard(): void
    {
        $result = $this->statsService->getDashboardStats($this->userId);

        if (isset($result['error'])) {
            http_response_code(404);
        }

        echo json_encode($result);
    }
}