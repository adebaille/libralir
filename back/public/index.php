<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173'); // port Vite par défaut

echo json_encode(['status' => 'ok']);