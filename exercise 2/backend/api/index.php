<?php
// Punto de entrada para /api/*
// Este archivo se ejecuta cuando se accede a /api/ o cualquier subruta

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir el archivo game.php que tiene toda la lógica
require_once __DIR__ . '/game.php';

