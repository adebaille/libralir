<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\ReadingSessionModel;
use App\Models\UserBookModel;
use App\Services\BadgeService;

// ReadingSessionService gère la logique des sessions de lecture
// Important : créer une session met automatiquement à jour la progression (current_page)
class ReadingSessionService
{
    private ReadingSessionModel $sessionModel;
    private UserBookModel $userBookModel;
    private BadgeService $badgeService;

    public function __construct()
    {
        $this->sessionModel  = new ReadingSessionModel();
        $this->userBookModel = new UserBookModel();
        $this->badgeService = new BadgeService();
    }

    // Enregistre une session de lecture et met à jour la progression du livre
    public function createSession(int $userId, int $userBookId, array $data): array
    {
        // Vérification de propriété : le livre est bien dans la biblio de l'user
        $userBook = $this->userBookModel->findByIdAndUser($userBookId, $userId);

        if (!$userBook) {
            return ['error' => 'Livre introuvable dans votre bibliothèque'];
        }

        // Validation des pages lues
        $pagesRead = (int) ($data['pages_read'] ?? 0);

        if ($pagesRead <= 0) {
            return ['error' => 'Le nombre de pages lues doit être supérieur à 0'];
        }

        // La nouvelle page actuelle ne doit pas dépasser le total
        $newCurrentPage = $userBook['current_page'] + $pagesRead;

        if ($newCurrentPage > $userBook['total_pages']) {
            return ['error' => 'La progression dépasse le nombre total de pages'];
        }

        // Validation optionnelle de la durée
        $durationMinutes = isset($data['duration_minutes']) ? (int) $data['duration_minutes'] : null;

        if ($durationMinutes !== null && $durationMinutes <= 0) {
            return ['error' => 'La durée doit être supérieure à 0'];
        }

        // Création de la session
        $sessionId = $this->sessionModel->create(
            $userBookId,
            $pagesRead,
            $durationMinutes,
            $data['session_date'] ?? null
        );

        // Mise à jour automatique de la progression
        // Si on atteint la dernière page, on passe le statut à 'completed'
        $newStatus = $newCurrentPage === (int) $userBook['total_pages']
            ? 'completed'
            : 'in_progress';

        $this->userBookModel->update($userBookId, $newStatus, $newCurrentPage);

        $newBadges = $this->badgeService->checkAndAwardBadges($userId);

        return [
            'message'      => 'Session enregistrée',
            'session_id'   => $sessionId,
            'current_page' => $newCurrentPage,
            'status'       => $newStatus,
            'new_badges'   => $newBadges,
        ];
    }

    // Liste toutes les sessions d'un livre de la biblio
    public function getSessionsByUserBook(int $userId, int $userBookId): array
    {
        $userBook = $this->userBookModel->findByIdAndUser($userBookId, $userId);

        if (!$userBook) {
            return ['error' => 'Livre introuvable dans votre bibliothèque'];
        }

        return ['sessions' => $this->sessionModel->findAllByUserBook($userBookId)];
    }

    // Liste toutes les sessions d'un user (historique global)
    public function getAllSessionsByUser(int $userId): array
    {
        return $this->sessionModel->findAllByUser($userId);
    }
}