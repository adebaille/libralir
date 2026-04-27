<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\RecommendationService;
use App\Middlewares\AuthMiddleware;

class RecommendationController
{
    private RecommendationService $recommendationService;
    private int $userId;

    public function __construct()
    {
        $user         = AuthMiddleware::check();
        $this->userId = (int) $user['user_id'];

        $this->recommendationService = new RecommendationService();
    }

    // Retourne des recommandations basées sur les catégories favorites de l'user
    // GET /api/recommendations?limit=10
    public function list(): void
    {
        $limit = (int) ($_GET['limit'] ?? 10);

        // Bornes raisonnables pour éviter abus
        if ($limit < 1 || $limit > 50) {
            $limit = 10;
        }

        $result = $this->recommendationService->getRecommendations($this->userId, $limit);
        echo json_encode($result);
    }
}