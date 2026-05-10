<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\UserService;
use App\Middlewares\AuthMiddleware;

class UserController
{
    private UserService $userService;
    private int $userId;

    public function __construct()
    {
        $user         = AuthMiddleware::check();
        $this->userId = (int) $user['user_id'];

        $this->userService = new UserService();
    }

    // Retourne le profil de l'utilisateur connecté
    // GET /api/me
    public function me(): void
    {
        $result = $this->userService->getProfile($this->userId);

        if (isset($result['error'])) {
            http_response_code(404);
        }

        echo json_encode($result);
    }

    // Met à jour l'objectif annuel de l'utilisateur connecté
    // PUT /api/me/yearly-goal
    public function updateYearlyGoal(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!is_array($data) || !isset($data['yearly_goal_books'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Champ yearly_goal_books requis']);
            return;
        }

        $yearlyGoalBooks = (int) $data['yearly_goal_books'];

        $result = $this->userService->updateYearlyGoal($this->userId, $yearlyGoalBooks);

        if (isset($result['error'])) {
            http_response_code(400);
        }

        echo json_encode($result);
    }
}