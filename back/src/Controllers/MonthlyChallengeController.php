<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\MonthlyChallengeService;
use App\Middlewares\AuthMiddleware;

class MonthlyChallengeController
{
    private MonthlyChallengeService $challengeService;
    private int $userId;

    public function __construct()
    {
        $user         = AuthMiddleware::check();
        $this->userId = (int) $user['user_id'];

        $this->challengeService = new MonthlyChallengeService();
    }

    // Crée un nouveau défi
    // POST /api/challenges
    public function create(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode(['error' => 'Corps de requête invalide']);
            return;
        }

        $result = $this->challengeService->createChallenge($this->userId, $data);

        if (isset($result['error'])) {
            http_response_code(400);
        } else {
            http_response_code(201);
        }

        echo json_encode($result);
    }

    // Liste les défis d'un mois précis
    // GET /api/challenges?month=4&year=2026
    public function listByMonth(): void
    {
        $month = (int) ($_GET['month'] ?? date('n'));
        $year  = (int) ($_GET['year'] ?? date('Y'));

        $challenges = $this->challengeService->getChallengesByMonth($this->userId, $month, $year);
        echo json_encode(['challenges' => $challenges]);
    }

    // Modifie l'objectif d'un défi
    // PUT /api/challenges/:id
    public function update(array $params): void
    {
        $challengeId = (int) $params['id'];
        $data = json_decode(file_get_contents('php://input'), true);

        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode(['error' => 'Corps de requête invalide']);
            return;
        }

        $result = $this->challengeService->updateChallenge($this->userId, $challengeId, $data);

        if (isset($result['error'])) {
            http_response_code(404);
        }

        echo json_encode($result);
    }

    // Supprime un défi
    // DELETE /api/challenges/:id
    public function delete(array $params): void
    {
        $challengeId = (int) $params['id'];
        $result = $this->challengeService->deleteChallenge($this->userId, $challengeId);

        if (isset($result['error'])) {
            http_response_code(404);
        }

        echo json_encode($result);
    }
}