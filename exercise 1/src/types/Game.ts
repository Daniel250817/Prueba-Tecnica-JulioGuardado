import type { Pokemon } from './Pokemon';

export type CardColor = 'black' | 'white';

export interface Card {
  id: string;
  pokemon: Pokemon;
  isFlipped: boolean;
  isMatched: boolean;
  cardColor: CardColor;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  gridSize: number;
  totalPairs: number;
  cardColors: CardColor[];
  flipDelay: number;
  enableTimer: boolean;
}

export interface GameStats {
  moves: number;
  time: number;
  pairsFound: number;
  totalPairs: number;
}

