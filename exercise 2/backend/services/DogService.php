<?php

class DogService {
    private const API_BASE_URL = 'https://dog.ceo/api';
    
    /**
     * Obtiene todas las razas disponibles de la API
     * @return array Lista de razas
     */
    public function getAllBreeds(): array {
        $url = self::API_BASE_URL . '/breeds/list/all';
        $response = $this->makeRequest($url);
        
        if (!$response || !isset($response['message'])) {
            return [];
        }
        
        $breeds = [];
        foreach ($response['message'] as $breed => $subbreeds) {
            // Agregar raza principal
            $breeds[] = $breed;
            
            // Agregar subrazas si existen
            if (!empty($subbreeds)) {
                foreach ($subbreeds as $subbreed) {
                    $breeds[] = $breed . '/' . $subbreed;
                }
            }
        }
        
        return $breeds;
    }
    
    /**
     * Obtiene una imagen aleatoria de una raza específica
     * @param string $breed Nombre de la raza
     * @return string|null URL de la imagen o null si hay error
     */
    public function getRandomImage(string $breed): ?string {
        $url = self::API_BASE_URL . '/breed/' . urlencode($breed) . '/images/random';
        $response = $this->makeRequest($url);
        
        if (!$response || !isset($response['message'])) {
            return null;
        }
        
        return $response['message'];
    }
    
    /**
     * Obtiene una imagen aleatoria de cualquier raza
     * @return array|null Array con 'image' (URL) y 'breed' (nombre de la raza) o null si hay error
     */
    public function getRandomBreedImage(): ?array {
        $url = self::API_BASE_URL . '/breeds/image/random';
        $response = $this->makeRequest($url);
        
        if (!$response || !isset($response['message'])) {
            return null;
        }
        
        $imageUrl = $response['message'];
        
        // Validar que la URL tenga el formato esperado
        if (empty($imageUrl) || !is_string($imageUrl)) {
            return null;
        }
        
        // Extraer la raza de la URL: https://images.dog.ceo/breeds/{breed}/image.jpg
        // Patrones mejorados para capturar diferentes formatos de URL
        // Ejemplos: 
        // - breeds/bulldog/image.jpg
        // - breeds/bulldog/french/image.jpg
        // - breeds/hound-afghan/image.jpg
        // - breeds/hound/afghan/image.jpg
        
        $breed = null;
        
        // Patrón 1: Captura razas con subrazas (bulldog/french)
        if (preg_match('/breeds\/([^\/]+(?:\/[^\/]+)?)\//', $imageUrl, $matches)) {
            $breed = trim($matches[1]);
        }
        // Patrón 2: Captura solo la primera parte antes de /image
        elseif (preg_match('/breeds\/([^\/\s]+)\//', $imageUrl, $matches)) {
            $breed = trim($matches[1]);
        }
        // Patrón 3: Captura cualquier cosa entre breeds/ y /image
        elseif (preg_match('/breeds\/(.+?)\/image/', $imageUrl, $matches)) {
            $breed = trim($matches[1]);
            // Si tiene múltiples partes, unirlas con /
            $breed = str_replace('/', '/', $breed);
        }
        // Patrón 4: Último intento - captura cualquier cosa después de breeds/
        elseif (preg_match('/breeds\/([^\/\s]+)/', $imageUrl, $matches)) {
            $breed = trim($matches[1]);
        }
        
        // Validar que la raza extraída no esté vacía
        if (empty($breed)) {
            return null;
        }
        
        return [
            'image' => $imageUrl,
            'breed' => $breed
        ];
    }
    
    /**
     * Realiza una petición HTTP a la API
     * @param string $url URL a consultar
     * @return array|null Respuesta decodificada o null si hay error
     */
    private function makeRequest(string $url): ?array {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        
        if ($error || $httpCode !== 200 || !$response) {
            error_log("Error en DogService: HTTP $httpCode - $error");
            return null;
        }
        
        $data = json_decode($response, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            error_log("Error decodificando JSON: " . json_last_error_msg());
            return null;
        }
        
        return $data;
    }
}

