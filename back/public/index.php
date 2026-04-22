<?php

declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../src/Database/Connection.php';
require_once __DIR__ . '/../src/Router.php';
require_once __DIR__ . '/../src/Controllers/AuthController.php';
require_once __DIR__ . '/../src/Services/AuthService.php';

use App\Database\Connection;
use App\Router;
use App\Controllers\AuthController;

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

$router->dispatch(
    $_SERVER['REQUEST_METHOD'],
    $_SERVER['REQUEST_URI']
);