# Juego de Adivinanza de Razas de Perros

Juego interactivo donde debes adivinar la raza de perros mostrados en imágenes, usando la API de [dog.ceo](https://dog.ceo/dog-api/).

## Características

- Muestra una imagen aleatoria de un perro
- Presenta 4 opciones de razas para elegir
- Sistema de puntuación: 10 puntos iniciales, +2 por respuesta correcta, -2 por incorrecta
- Si respondes correctamente, se carga una nueva imagen automáticamente
- Si respondes incorrectamente, debes seguir intentando con la misma imagen

## Tecnologías

- **Backend**: PHP (vanilla)
- **Frontend**: React.js + TypeScript + Vite
- **API Externa**: [dog.ceo API](https://dog.ceo/dog-api/)

## Estructura del Proyecto

```
exercise 2/
├── backend/
│   ├── api/
│   │   └── game.php          # Endpoint principal del juego
│   ├── services/
│   │   └── DogService.php    # Servicio para consumir API dog.ceo
│   ├── models/
│   │   └── Game.php          # Modelo de lógica del juego
│   └── .htaccess             # Configuración Apache para routing
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # Servicios API
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## Instalación y Configuración

### Backend (PHP)

1. Asegúrate de tener PHP 7.4+ instalado con la extensión `curl` habilitada
2. Navega al directorio `backend`:
   ```bash
   cd backend
   ```
3. Inicia un servidor PHP local. Tienes varias opciones:

   **Opción A - Usando router.php (recomendado):**
   ```bash
   php -S localhost:8000 router.php
   ```
   
   **Opción B - Usando index.php:**
   ```bash
   php -S localhost:8000 index.php
   ```
   
   **Opción C - Acceso directo a game.php:**
   ```bash
   php -S localhost:8000
   ```
   Luego accede directamente a: `http://localhost:8000/api/game.php?action=start` 
   (requiere ajustar las rutas en el frontend)
   
   **Nota:** Si ninguna opción funciona, prueba acceder directamente a:
   - `http://localhost:8000/test` (endpoint de prueba)
   - `http://localhost:8000/api/game.php` (acceso directo)

### Frontend (React)

1. Navega al directorio `frontend`:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

El frontend estará disponible en `http://localhost:3000` y se conectará automáticamente al backend en `http://localhost:8000`.

## Uso

1. Inicia el backend PHP en el puerto 8000
2. Inicia el frontend React en el puerto 3000
3. Abre tu navegador en `http://localhost:3000`
4. El juego comenzará automáticamente mostrando una imagen de un perro
5. Selecciona la raza correcta de las 4 opciones disponibles
6. Si aciertas, ganarás 2 puntos y se cargará una nueva imagen
7. Si fallas, perderás 2 puntos y deberás intentar de nuevo con la misma imagen

## Endpoints del Backend

### GET `/api/game/start`
Inicia el juego y retorna una pregunta con imagen y opciones.

**Respuesta:**
```json
{
  "success": true,
  "image": "https://images.dog.ceo/breeds/...",
  "options": [
    { "value": "bulldog", "label": "Bulldog" },
    ...
  ],
  "correctBreed": "bulldog"
}
```

### POST `/api/game/answer`
Envía una respuesta y valida si es correcta.

**Request:**
```json
{
  "selectedBreed": "bulldog",
  "correctBreed": "bulldog",
  "currentScore": 10
}
```

**Respuesta:**
```json
{
  "success": true,
  "isCorrect": true,
  "message": "¡Correcto! +2 puntos",
  "newScore": 12,
  "newQuestion": { ... }  // Solo si es correcta
}
```

## Notas

- El backend consume la API de dog.ceo desde el servidor (no desde el cliente)
- El juego maneja razas y subrazas (ej: "bulldog/french" se muestra como "French Bulldog")
- El puntaje mínimo es 0 (no puede ser negativo)
- Si hay un error al cargar una pregunta, se mostrará un mensaje y podrás reintentar

