<?php

require_once __DIR__ . '/../services/DogService.php';

class Game {
    private DogService $dogService;
    
    public function __construct() {
        $this->dogService = new DogService();
    }
    
    /**
     * Genera una pregunta con imagen y 4 opciones
     * @return array|null Array con 'image', 'options', 'correctBreed' o null si hay error
     */
    public function generateQuestion(): ?array {
        // Obtener todas las razas primero (se usa para validación)
        $allBreeds = $this->dogService->getAllBreeds();
        if (empty($allBreeds)) {
            return null;
        }
        
        // Intentar obtener una imagen válida con raza que exista en la lista
        // Hacer hasta 10 intentos para tener más probabilidades de éxito
        $maxAttempts = 10;
        $attempt = 0;
        $randomData = null;
        $correctBreed = null;
        
        while ($attempt < $maxAttempts) {
            $randomData = $this->dogService->getRandomBreedImage();
            
            if ($randomData && !empty($randomData['breed'])) {
                $correctBreed = $randomData['breed'];
                
                // Validar que la raza existe en la lista de razas disponibles
                if (in_array($correctBreed, $allBreeds)) {
                    // Raza válida encontrada, salir del loop
                    break;
                }
                // Si la raza no está en la lista, continuar intentando
            }
            
            $attempt++;
        }
        
        // Si después de los intentos no tenemos una raza válida, retornar error
        if (!$randomData || empty($correctBreed) || !in_array($correctBreed, $allBreeds)) {
            return null;
        }
        
        $image = $randomData['image'];
        
        // Remover la raza correcta de las opciones
        $availableBreeds = array_filter($allBreeds, function($breed) use ($correctBreed) {
            return $breed !== $correctBreed;
        });
        
        // Seleccionar 3 razas aleatorias incorrectas
        $incorrectBreeds = [];
        $availableBreedsArray = array_values($availableBreeds);
        shuffle($availableBreedsArray);
        
        for ($i = 0; $i < 3 && $i < count($availableBreedsArray); $i++) {
            $incorrectBreeds[] = $availableBreedsArray[$i];
        }
        
        // Crear array de opciones (1 correcta + 3 incorrectas)
        $options = array_merge([$correctBreed], $incorrectBreeds);
        shuffle($options); // Mezclar para que la correcta no siempre esté primera
        
        return [
            'image' => $image,
            'options' => $options,
            'correctBreed' => $correctBreed
        ];
    }
    
    /**
     * Valida si la respuesta seleccionada es correcta
     * @param string $selectedBreed Raza seleccionada por el usuario
     * @param string $correctBreed Raza correcta
     * @return bool True si es correcta, false si no
     */
    public function validateAnswer(string $selectedBreed, string $correctBreed): bool {
        return trim($selectedBreed) === trim($correctBreed);
    }
    
    /**
     * Calcula el nuevo puntaje basado en si la respuesta es correcta
     * @param int $currentScore Puntaje actual
     * @param bool $isCorrect Si la respuesta es correcta
     * @return int Nuevo puntaje
     */
    public function calculateScore(int $currentScore, bool $isCorrect): int {
        if ($isCorrect) {
            return $currentScore + 2;
        } else {
            return max(0, $currentScore - 2); // No permitir puntaje negativo
        }
    }
    
    /**
     * Formatea el nombre de la raza para mostrarlo de forma legible
     * @param string $breed Nombre de la raza (puede incluir subraza)
     * @return string Nombre formateado
     */
    public function formatBreedName(string $breed): string {
        // Convertir "bulldog/french" a "French Bulldog"
        $parts = explode('/', $breed);
        if (count($parts) === 2) {
            return ucfirst($parts[1]) . ' ' . ucfirst($parts[0]);
        }
        return ucfirst($breed);
    }
}
