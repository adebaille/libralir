<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\BadgeService;
use App\Middlewares\AuthMiddleware;

class BadgeController
{
    private BadgeService $badgeService;
    private int $userId;

    public function __construct()
    {
        $user         = AuthMiddleware::check();
        $this->userId = (int) $user['user_id'];

        $this->badgeService = new BadgeService();
    }

    // Liste tous les badges obtenus par l'user connecté
    // GET /api/badges
    public function list(): void
    {
        $badges = $this->badgeService->getUserBadges($this->userId);
        echo json_encode(['badges' => $badges]);
    }
}