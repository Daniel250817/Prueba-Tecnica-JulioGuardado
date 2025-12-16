<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../models/Game.php';

$game = new Game();
$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['REQUEST_URI'] ?? '';

// Routing simple basado en método y path
if ($method === 'GET' && strpos($path, '/api/game/start') !== false) {
    // Endpoint: GET /api/game/start
    try {
        $question = $game->generateQuestion();
        
        if (!$question) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'No se pudo generar la pregunta. Por favor, intenta de nuevo.'
            ]);
            exit();
        }
        
        // Formatear nombres de razas para mostrar
        $formattedOptions = array_map(function($breed) use ($game) {
            return [
                'value' => $breed,
                'label' => $game->formatBreedName($breed)
            ];
        }, $question['options']);
        
        echo json_encode([
            'success' => true,
            'image' => $question['image'],
            'options' => $formattedOptions,
            'correctBreed' => $question['correctBreed']
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Error del servidor: ' . $e->getMessage()
        ]);
    }
    
} elseif ($method === 'POST' && strpos($path, '/api/game/answer') !== false) {
    // Endpoint: POST /api/game/answer
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['selectedBreed']) || !isset($input['correctBreed']) || !isset($input['currentScore'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Datos incompletos'
            ]);
            exit();
        }
        
        $selectedBreed = $input['selectedBreed'];
        $correctBreed = $input['correctBreed'];
        $currentScore = (int)$input['currentScore'];
        
        $isCorrect = $game->validateAnswer($selectedBreed, $correctBreed);
        $newScore = $game->calculateScore($currentScore, $isCorrect);
        
        $response = [
            'success' => true,
            'isCorrect' => $isCorrect,
            'message' => $isCorrect ? '¡Correcto! +2 puntos' : 'Incorrecto. -2 puntos',
            'newScore' => $newScore
        ];
        
        // Si la respuesta es correcta, generar nueva pregunta
        if ($isCorrect) {
            $newQuestion = $game->generateQuestion();
            if ($newQuestion) {
                $formattedOptions = array_map(function($breed) use ($game) {
                    return [
                        'value' => $breed,
                        'label' => $game->formatBreedName($breed)
                    ];
                }, $newQuestion['options']);
                
                $response['newQuestion'] = [
                    'image' => $newQuestion['image'],
                    'options' => $formattedOptions,
                    'correctBreed' => $newQuestion['correctBreed']
                ];
            }
        }
        
        echo json_encode($response);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Error del servidor: ' . $e->getMessage()
        ]);
    }
    
} else {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'error' => 'Endpoint no encontrado'
    ]);
}

