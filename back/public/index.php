<?php

declare(strict_types=1);

require_once __DIR__ . '/../src/Database/Connection.php';

use App\Database\Connection;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');

$pdo = Connection::getInstance();

echo json_encode(['status' => 'ok', 'db' => 'connected']);