<?php

declare(strict_types=1);

namespace App\Services;

class GoogleBooksService
{
    private const API_URL = 'https://www.googleapis.com/books/v1/volumes';

    // Recherche des livres via Google Books API
    // Retourne un tableau simplifié avec uniquement ce qui nous intéresse
    public function search(string $query, int $maxResults = 10): array
    {
        // On tente jusqu'à 3 fois en cas d'erreur 5xx (Google instable)
        // Pause exponentielle entre les tentatives : 200ms, 400ms
        $maxAttempts = 5;

        for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
            error_log("req" . $query);
            $result = $this->attemptSearch($query, $maxResults);


            // Succès : on retourne les résultats
            if ($result['success']) {
                return $result['books'];
            }

            // Erreur non-retryable (404, malformé...) : on abandonne
            if (!$result['retryable']) {
                error_log("Google Books non-retryable error: " . $result['error']);
                return [];
            }

            // Erreur retryable : on attend avant de retenter, sauf si dernier essai
            if ($attempt < $maxAttempts) {
                usleep(200_000 * $attempt); // 200ms, 400ms, 600ms, 800ms
            } else {
                // Tous les retries ont échoué : Google est indisponible
                error_log("Google Books failed after $maxAttempts attempts");
                throw new \RuntimeException('Google Books API unavailable');
            }
        }

        return [];
    }

    // Une tentative de recherche, retourne le statut détaillé
    private function attemptSearch(string $query, int $maxResults): array
    {
        $params = [
            'q' => $query,
            'maxResults' => $maxResults,
        ];

        // Ajoute la clé API si elle est configurée
        // Permet d'avoir un quota dédié et d'éviter les 503 du pool anonyme
        $apiKey = $_ENV['GOOGLE_BOOKS_API_KEY'] ?? '';
        if ($apiKey !== '') {
            $params['key'] = $apiKey;
        }

        $url = self::API_URL . '?' . http_build_query($params);

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 3,
            CURLOPT_CONNECTTIMEOUT => 2,
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);

        // Erreur réseau (timeout, DNS, etc.) : retryable
        if ($response === false) {
            return [
                'success' => false,
                'retryable' => true,
                'error' => "Network error: $error",
            ];
        }

        // 5xx : Google a un souci temporaire, retryable
        if ($httpCode >= 500) {
            return [
                'success' => false,
                'retryable' => true,
                'error' => "HTTP $httpCode from Google Books",
            ];
        }

        // 4xx : requête invalide, pas de retry
        if ($httpCode >= 400) {
            return [
                'success' => false,
                'retryable' => false,
                'error' => "HTTP $httpCode from Google Books",
            ];
        }

        // 200 : succès
        $data = json_decode($response, true);
        $items = $data['items'] ?? [];

        return [
            'success' => true,
            'books' => array_map([$this, 'formatBook'], $items),
        ];
    }

    // Transforme un item Google Books en format simplifié
    private function formatBook(array $item): array
    {
        $info = $item['volumeInfo'] ?? [];

        return [
            'google_books_id' => $item['id'] ?? null,
            'title' => $info['title'] ?? 'Titre inconnu',
            'authors' => $info['authors'] ?? [],
            'page_count' => $info['pageCount'] ?? null,
            'isbn_13' => $this->extractIsbn($info['industryIdentifiers'] ?? [], 'ISBN_13'),
            'thumbnail' => $info['imageLinks']['thumbnail'] ?? null,
            'categories' => $info['categories'] ?? [],  // ← ajouté
        ];
    }

    // Cherche un ISBN du type demandé (ISBN_10 ou ISBN_13)
    private function extractIsbn(array $identifiers, string $type): ?string
    {
        foreach ($identifiers as $identifier) {
            if (($identifier['type'] ?? '') === $type) {
                return $identifier['identifier'] ?? null;
            }
        }
        return null;
    }

    // Recherche des livres par catégorie via le paramètre subject de Google Books
    public function searchByCategory(string $category, int $maxResults = 10): array
    {
        return $this->search('subject:' . $category, $maxResults);
    }
}