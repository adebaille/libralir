<?php

declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

use App\Database\Connection;
use App\Router;
use App\Controllers\AuthController;
use App\Middlewares\AuthMiddleware;
use App\Controllers\BookController;
use App\Controllers\LibraryController;
use App\Controllers\ReadingSessionController;
use App\Controllers\MonthlyChallengeController;
use App\Controllers\BadgeController;
use App\Controllers\RecommendationController;

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

$router->post('/api/library', function () {
    (new LibraryController())->add();
});

$router->get('/api/library', function () {
    (new LibraryController())->list();
});

$router->get('/api/library/:id', function ($params) {
    (new LibraryController())->show($params);
});

$router->put('/api/library/:id', function ($params) {
    (new LibraryController())->update($params);
});

$router->delete('/api/library/:id', function ($params) {
    (new LibraryController())->delete($params);
});

$router->post('/api/library/:id/sessions', function ($params) {
    (new ReadingSessionController())->create($params);
});

$router->get('/api/library/:id/sessions', function ($params) {
    (new ReadingSessionController())->listByBook($params);
});

$router->get('/api/sessions', function () {
    (new ReadingSessionController())->listAll();
});

$router->delete('/api/account', function () {
    (new AuthController())->deleteAccount();
});

$router->post('/api/challenges', function () {
    (new MonthlyChallengeController())->create();
});

$router->get('/api/challenges', function () {
    (new MonthlyChallengeController())->listByMonth();
});

$router->put('/api/challenges/:id', function ($params) {
    (new MonthlyChallengeController())->update($params);
});

$router->delete('/api/challenges/:id', function ($params) {
    (new MonthlyChallengeController())->delete($params);
});

$router->get('/api/badges', function () {
    (new BadgeController())->list();
});

$router->get('/api/recommendations', function () {
    (new RecommendationController())->list();
});

$router->dispatch(
    $_SERVER['REQUEST_METHOD'],
    $_SERVER['REQUEST_URI']
);