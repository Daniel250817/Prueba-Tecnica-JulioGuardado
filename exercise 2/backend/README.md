# Backend PHP - Juego de Adivinanza de Razas de Perros

## Requisitos

- PHP 7.4 o superior
- Extensión `curl` habilitada

## Instalación y Ejecución

### Opción 1: Servidor PHP Integrado (Recomendado para desarrollo)

1. Navega al directorio `backend`:
   ```bash
   cd backend
   ```

2. Inicia el servidor con el router:
   
   **Linux/Mac/Git Bash:**
   ```bash
   php -S localhost:8000 router.php
   ```
   
   **PowerShell (Windows):**
   ```powershell
   & "C:\xampp\php\php.exe" -S localhost:8000 router.php
   ```
   
   O si PHP está en el PATH:
   ```powershell
   php -S localhost:8000 router.php
   ```

### Opción 2: Servidor Apache

Si tienes Apache configurado, el archivo `.htaccess` manejará el routing automáticamente.

## Endpoints

### GET `/api/game/start`
Inicia el juego y retorna una pregunta con imagen y opciones.

### POST `/api/game/answer`
Envía una respuesta y valida si es correcta.

## Estructura

- `api/game.php` - Endpoint principal del juego
- `services/DogService.php` - Servicio para consumir API dog.ceo
- `models/Game.php` - Modelo de lógica del juego
- `router.php` - Router para servidor PHP integrado
- `.htaccess` - Configuración Apache para routing

