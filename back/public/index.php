<?php

declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

use App\Database\Connection;
use App\Router;
use App\Controllers\AuthController;
use App\Middlewares\AuthMiddleware;
use App\Controllers\BookController;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');

$pdo = Connection::getInstance();

$router = new Router();

$router->get('/api/health', function () {
    echo json_encode(['status' => 'ok', 'db' => 'connected']);
});

$router->post('/api/auth/register', function () {
    (new AuthController())->register();
});

$router->post('/api/auth/login', function () {
    (new AuthController())->login();
});

$router->get('/api/me', function () {
    $user = AuthMiddleware::check();
    echo json_encode([
        'user_id' => $user['user_id'],
        'email'   => $user['email'],
    ]);
});

$router->get('/api/books/search', function () {
    (new BookController())->search();
});

$router->dispatch(
    $_SERVER['REQUEST_METHOD'],
    $_SERVER['REQUEST_URI']
);