<?php

declare(strict_types=1);

require_once __DIR__ . '/../src/Database/Connection.php';
require_once __DIR__ . '/../src/Router.php';

use App\Database\Connection;
use App\Router;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');

$pdo = Connection::getInstance();

$router = new Router();

$router->get('/api/health', function () {
    echo json_encode(['status' => 'ok', 'db' => 'connected']);
});

$router->dispatch(
    $_SERVER['REQUEST_METHOD'],
    $_SERVER['REQUEST_URI']
);