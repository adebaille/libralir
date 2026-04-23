<?php

declare(strict_types=1);

namespace App;

class Router
{
    private array $routes = [];

    public function get(string $path, callable $handler): void
    {
        $this->addRoute('GET', $path, $handler);
    }

    public function post(string $path, callable $handler): void
    {
        $this->addRoute('POST', $path, $handler);
    }

    public function put(string $path, callable $handler): void
    {
        $this->addRoute('PUT', $path, $handler);
    }

    public function delete(string $path, callable $handler): void
    {
        $this->addRoute('DELETE', $path, $handler);
    }

    private function addRoute(string $method, string $path, callable $handler): void
    {
        $this->routes[$method][] = [
            'path'    => $path,
            'handler' => $handler,
        ];
    }

    public function dispatch(string $method, string $uri): void
    {
        $path = parse_url($uri, PHP_URL_PATH);

        foreach ($this->routes[$method] ?? [] as $route) {
            $params = $this->match($route['path'], $path);

            if ($params !== null) {
                call_user_func($route['handler'], $params);
                return;
            }
        }

        http_response_code(404);
        echo json_encode(['error' => 'Route not found']);
    }

    // Compare un pattern (ex: /api/books/:id) à une URL réelle (ex: /api/books/42)
    // Retourne les paramètres extraits ou null si pas de correspondance
    private function match(string $pattern, string $path): ?array
    {
        // Transforme ":id" en groupe de capture nommé regex
        $regex = preg_replace('#:([a-zA-Z]+)#', '(?<$1>[^/]+)', $pattern);
        $regex = '#^' . $regex . '$#';

        if (!preg_match($regex, $path, $matches)) {
            return null;
        }

        // On ne garde que les captures nommées (pas les index numériques)
        return array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
    }
}