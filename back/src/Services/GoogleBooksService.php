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
        $url = self::API_URL . '?' . http_build_query([
            'q'          => $query,
            'maxResults' => $maxResults,
        ]);

        $response = @file_get_contents($url);

            if ($response === false) {
            return [];
            }

        $data = json_decode($response, true);

        if (!isset($data['items'])) {
            return [];
        }

        return array_map([$this, 'formatBook'], $data['items']);
    }

    // Transforme un item Google Books en format simplifié
    private function formatBook(array $item): array
    {
        $info = $item['volumeInfo'] ?? [];

        return [
            'google_books_id' => $item['id'] ?? null,
            'title'           => $info['title'] ?? 'Titre inconnu',
            'authors'         => $info['authors'] ?? [],
            'page_count'      => $info['pageCount'] ?? null,
            'isbn_13'         => $this->extractIsbn($info['industryIdentifiers'] ?? [], 'ISBN_13'),
            'thumbnail'       => $info['imageLinks']['thumbnail'] ?? null,
            'categories'      => $info['categories'] ?? [],  // ← ajouté
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