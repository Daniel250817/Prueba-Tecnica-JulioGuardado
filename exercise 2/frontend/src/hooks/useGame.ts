import { useState, useCallback, useEffect } from 'react';
import { startGame, submitAnswer, type Question } from '../services/api';

interface UseGameReturn {
  score: number;
  currentQuestion: Question | null;
  isLoading: boolean;
  message: string | null;
  messageType: 'success' | 'error' | null;
  isGameOver: boolean;
  correctAnswers: number;
  loadNewQuestion: () => Promise<void>;
  handleAnswer: (selectedBreed: string) => Promise<void>;
  resetGame: () => void;
}

const INITIAL_SCORE = 10;

export const useGame = (): UseGameReturn => {
  const [score, setScore] = useState<number>(INITIAL_SCORE);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);

  const loadNewQuestion = useCallback(async () => {
    setIsLoading(true);
    setMessage(null);
    setMessageType(null);
    
    try {
      const question = await startGame();
      setCurrentQuestion(question);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Error al cargar la pregunta');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAnswer = useCallback(async (selectedBreed: string) => {
    if (!currentQuestion || isLoading || isGameOver) return;
    
    setIsLoading(true);
    setMessage(null);
    setMessageType(null);
    
    try {
      const response = await submitAnswer(
        selectedBreed,
        currentQuestion.correctBreed,
        score
      );
      
      const newScore = response.newScore;
      setScore(newScore);
      setMessage(response.message);
      setMessageType(response.isCorrect ? 'success' : 'error');
      
      // Si la respuesta es correcta, incrementar contador de aciertos
      if (response.isCorrect) {
        setCorrectAnswers(prev => prev + 1);
      }
      
      // Verificar si el juego terminó (score llegó a 0)
      if (newScore <= 0) {
        setIsGameOver(true);
      } else if (response.isCorrect && response.newQuestion) {
        // Si la respuesta es correcta y el juego no terminó, cargar nueva pregunta
        setTimeout(() => {
          setCurrentQuestion(response.newQuestion!);
          setMessage(null);
          setMessageType(null);
        }, 1500);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Error al procesar la respuesta');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  }, [currentQuestion, score, isLoading, isGameOver]);

  const resetGame = useCallback(() => {
    setScore(INITIAL_SCORE);
    setCurrentQuestion(null);
    setMessage(null);
    setMessageType(null);
    setIsGameOver(false);
    setCorrectAnswers(0);
    loadNewQuestion();
  }, [loadNewQuestion]);

  // Detectar cuando el score llega a 0
  useEffect(() => {
    if (score <= 0 && !isGameOver) {
      setIsGameOver(true);
    }
  }, [score, isGameOver]);

  return {
    score,
    currentQuestion,
    isLoading,
    message,
    messageType,
    isGameOver,
    correctAnswers,
    loadNewQuestion,
    handleAnswer,
    resetGame
  };
};

