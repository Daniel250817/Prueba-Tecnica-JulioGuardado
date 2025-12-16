<?php
// Router para el servidor PHP integrado
// Uso: Desde el directorio backend ejecutar: php -S localhost:8000 router.php

chdir(__DIR__);

$requestUri = $_SERVER['REQUEST_URI'] ?? '';
$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';

$path = parse_url($requestUri, PHP_URL_PATH);
$path = rtrim($path, '/');

// Si la ruta está vacía o es solo "/", redirigir a start
if ($path === '' || $path === '/') {
    $path = '/api/game/start';
}

$isStart = (
    $path === '/api/game/start' ||
    strpos($path, '/api/game/start') === 0 ||
    $path === 'api/game/start' ||
    strpos($path, 'api/game/start') === 0
);

$isAnswer = (
    $path === '/api/game/answer' ||
    strpos($path, '/api/game/answer') === 0 ||
    $path === 'api/game/answer' ||
    strpos($path, 'api/game/answer') === 0
);

if ($isStart) {
    $_SERVER['REQUEST_URI'] = '/api/game/start';
    $_SERVER['REQUEST_METHOD'] = $requestMethod;
    require __DIR__ . '/api/game.php';
    exit;
} elseif ($isAnswer) {
    $_SERVER['REQUEST_URI'] = '/api/game/answer';
    $_SERVER['REQUEST_METHOD'] = $requestMethod;
    require __DIR__ . '/api/game.php';
    exit;
} else {
    // Endpoint de prueba para verificar que el servidor funciona
    if ($path === '/test' || $path === '/api/test') {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'message' => 'Servidor funcionando correctamente',
            'debug' => [
                'requestUri' => $requestUri,
                'path' => $path,
                'method' => $requestMethod,
                'scriptDir' => __DIR__
            ]
        ]);
        exit;
    }
    
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'error' => 'Endpoint no encontrado. Use /api/game/start o /api/game/answer',
        'debug' => [
            'requestUri' => $requestUri,
            'path' => $path,
            'method' => $requestMethod,
            'availableEndpoints' => ['/api/game/start', '/api/game/answer', '/test']
        ]
    ]);
}

