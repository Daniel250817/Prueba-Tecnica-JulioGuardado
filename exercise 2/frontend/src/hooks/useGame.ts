import { useState, useCallback } from 'react';
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

  const loadNewQuestion = useCallback(async (retryCount = 0) => {
    const maxRetries = 3;
    
    setIsLoading(true);
    setMessage(null);
    setMessageType(null);
    
    try {
      const question = await startGame();
      setCurrentQuestion(question);
      setIsLoading(false);
    } catch (error) {
      // Si falla y aún tenemos reintentos, intentar de nuevo después de un delay
      if (retryCount < maxRetries) {
        setIsLoading(false);
        setTimeout(() => {
          loadNewQuestion(retryCount + 1);
        }, 1000 * (retryCount + 1)); // Delay incremental: 1s, 2s, 3s
      } else {
        setMessage(error instanceof Error ? error.message : 'Error al cargar la pregunta. Por favor, intenta de nuevo.');
        setMessageType('error');
        setIsLoading(false);
      }
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
        setIsLoading(false);
      } else if (response.isCorrect && response.newQuestion) {
        // Si la respuesta es correcta y el juego no terminó, mostrar mensaje primero
        setIsLoading(false);
        
        // Pre-cargar la nueva imagen antes de cambiar
        const newImage = new Image();
        newImage.onload = () => {
          // Esperar un momento para que el usuario vea el mensaje de éxito
          setTimeout(() => {
            // Cambiar a la nueva pregunta después de que la imagen esté cargada
            setCurrentQuestion(response.newQuestion!);
            setMessage(null);
            setMessageType(null);
          }, 1500);
        };
        newImage.onerror = () => {
          // Si falla la carga, cambiar de todas formas después de un delay
          setTimeout(() => {
            setCurrentQuestion(response.newQuestion!);
            setMessage(null);
            setMessageType(null);
          }, 2000);
        };
        newImage.src = response.newQuestion.image;
      } else {
        // Respuesta incorrecta, solo quitar loading
        setIsLoading(false);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Error al procesar la respuesta');
      setMessageType('error');
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
