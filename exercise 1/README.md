# Pokémon Memory Game

Juego de memoria con temática Pokémon desarrollado con React, TypeScript y Vite.

## Características

- Tablero de juego configurable (4x4, 6x6, 8x8)
- Cartas con imágenes de Pokémon obtenidas de PokeAPI
- Sistema de dificultad con variación visual de cartas
- Contador de movimientos e intentos
- Contador de tiempo opcional (modo contra reloj)
- Seguimiento de pares encontrados
- Pantalla de finalización con estadísticas completas

## Arquitectura

El proyecto sigue principios de Clean Architecture y SOLID:

- **Singleton Pattern**: PokemonService y GameService
- **Separación de responsabilidades**: Componentes, hooks, servicios y tipos
- **TypeScript**: Tipado fuerte en toda la aplicación
- **Custom Hooks**: usePokemon y useGame para separar lógica de presentación

## Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── Card/
│   ├── GameBoard/
│   ├── GameStats/
│   ├── GameOver/
│   └── DifficultySelector/
├── services/           # Servicios singleton
│   ├── PokemonService.ts
│   └── GameService.ts
├── hooks/              # Custom hooks
│   ├── usePokemon.ts
│   └── useGame.ts
├── types/              # TypeScript interfaces
│   ├── Pokemon.ts
│   └── Game.ts
├── constants/          # Configuraciones
│   └── gameConfig.ts
├── utils/              # Utilidades
│   └── shuffle.ts
└── styles/             # Estilos globales
    └── theme.css
```

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Niveles de Dificultad

- **Fácil**: 4x4 (8 pares) - Todas las cartas negras
- **Medio**: 6x6 (18 pares) - Combinación negro/blanco
- **Difícil**: 8x8 (32 pares) - Combinación negro/blanco

## Tecnologías

- React 18+
- TypeScript
- Vite
- PokeAPI

