<?php
// Punto de entrada principal del backend
// Permite acceso directo a los endpoints

$requestUri = $_SERVER['REQUEST_URI'] ?? '';
$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Remover query string y normalizar path
$path = parse_url($requestUri, PHP_URL_PATH);
$path = rtrim($path, '/');

// Routing
if (preg_match('#^/api/game/start#', $path) || $path === '/api/game/start') {
    $_SERVER['REQUEST_URI'] = '/api/game/start';
    require __DIR__ . '/api/game.php';
} elseif (preg_match('#^/api/game/answer#', $path) || $path === '/api/game/answer') {
    $_SERVER['REQUEST_URI'] = '/api/game/answer';
    require __DIR__ . '/api/game.php';
} else {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'error' => 'Endpoint no encontrado. Use /api/game/start o /api/game/answer'
    ]);
}

