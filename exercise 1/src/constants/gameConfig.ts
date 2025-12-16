import type { DifficultyConfig, Difficulty } from '../types/Game';

export const FLIP_DELAY = 1000;
export const MAX_FLIPPED_CARDS = 2;
export const TIME_LIMIT_SECONDS = 120; // 2 minutos para modo contra reloj

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    gridSize: 4,
    totalPairs: 8,
    cardColors: ['black'],
    flipDelay: FLIP_DELAY,
    enableTimer: true,
  },
  medium: {
    gridSize: 6,
    totalPairs: 18,
    cardColors: ['black', 'white'],
    flipDelay: FLIP_DELAY,
    enableTimer: true,
  },
  hard: {
    gridSize: 8,
    totalPairs: 32,
    cardColors: ['black', 'white'],
    flipDelay: FLIP_DELAY,
    enableTimer: true,
  },
};

export const DEFAULT_DIFFICULTY: Difficulty = 'medium';

