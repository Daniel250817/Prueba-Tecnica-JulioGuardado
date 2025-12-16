import { useState, useEffect, useCallback } from 'react';
import type { Card, DifficultyConfig } from '../types/Game';
import type { Pokemon } from '../types/Pokemon';
import GameService from '../services/GameService';
import { FLIP_DELAY, MAX_FLIPPED_CARDS } from '../constants/gameConfig';

interface UseGameReturn {
  cards: Card[];
  moves: number;
  pairsFound: number;
  time: number;
  isGameOver: boolean;
  flippedCards: number[];
  handleCardClick: (index: number) => void;
  resetGame: (pokemonList: Pokemon[], config: DifficultyConfig) => void;
  startTimer: () => void;
  stopTimer: () => void;
}

export const useGame = (
  pokemonList: Pokemon[],
  config: DifficultyConfig
): UseGameReturn => {
  const [cards, setCards] = useState<Card[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [pairsFound, setPairsFound] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const gameService = GameService.getInstance();

  const initializeGame = useCallback(
    (pokemon: Pokemon[], gameConfig: DifficultyConfig) => {
      const newCards = gameService.createCards(pokemon, gameConfig.cardColors);
      setCards(newCards);
      setMoves(0);
      setPairsFound(0);
      setTime(0);
      setIsGameOver(false);
      setFlippedCards([]);
      setIsTimerRunning(false);
    },
    [gameService]
  );

  useEffect(() => {
    if (pokemonList.length > 0) {
      initializeGame(pokemonList, config);
    }
  }, [pokemonList, config, initializeGame]);

  useEffect(() => {
    if (pairsFound === config.totalPairs && pairsFound > 0) {
      setIsGameOver(true);
      stopTimer();
    }
  }, [pairsFound, config.totalPairs]);

  const startTimer = useCallback(() => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
      const interval = window.setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    }
  }, [isTimerRunning]);

  const stopTimer = useCallback(() => {
    if (timerInterval !== null) {
      window.clearInterval(timerInterval);
      setTimerInterval(null);
      setIsTimerRunning(false);
    }
  }, [timerInterval]);

  const handleCardClick = useCallback(
    (index: number) => {
      if (isGameOver) return;

      const card = cards[index];
      if (card.isFlipped || card.isMatched) return;
      if (flippedCards.length >= MAX_FLIPPED_CARDS) return;

      if (flippedCards.length === 0) {
        startTimer();
      }

      const newFlippedCards = [...flippedCards, index];
      setFlippedCards(newFlippedCards);

      setCards((prevCards) => {
        const updated = [...prevCards];
        updated[index] = { ...updated[index], isFlipped: true };
        return updated;
      });

      if (newFlippedCards.length === MAX_FLIPPED_CARDS) {
        const [firstIndex, secondIndex] = newFlippedCards;
        const firstCard = cards[firstIndex];
        const secondCard = cards[secondIndex];

        setMoves((prev) => prev + 1);

        if (gameService.checkMatch(firstCard, secondCard)) {
          setPairsFound((prev) => prev + 1);
          setCards((prevCards) => {
            const updated = [...prevCards];
            updated[firstIndex] = { ...updated[firstIndex], isMatched: true };
            updated[secondIndex] = { ...updated[secondIndex], isMatched: true };
            return updated;
          });
          setFlippedCards([]);
        } else {
          setTimeout(() => {
            setCards((prevCards) => {
              const updated = [...prevCards];
              updated[firstIndex] = { ...updated[firstIndex], isFlipped: false };
              updated[secondIndex] = { ...updated[secondIndex], isFlipped: false };
              return updated;
            });
            setFlippedCards([]);
          }, FLIP_DELAY);
        }
      }
    },
    [cards, flippedCards, isGameOver, gameService, startTimer]
  );

  const resetGame = useCallback(
    (pokemon: Pokemon[], gameConfig: DifficultyConfig) => {
      stopTimer();
      initializeGame(pokemon, gameConfig);
    },
    [initializeGame, stopTimer]
  );

  useEffect(() => {
    return () => {
      if (timerInterval !== null) {
        window.clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  return {
    cards,
    moves,
    pairsFound,
    time,
    isGameOver,
    flippedCards,
    handleCardClick,
    resetGame,
    startTimer,
    stopTimer,
  };
};

