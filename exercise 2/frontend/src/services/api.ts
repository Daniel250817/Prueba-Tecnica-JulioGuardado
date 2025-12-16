const API_BASE_URL = '/api';

export interface Question {
  image: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  correctBreed: string;
}

export interface StartGameResponse {
  success: boolean;
  image?: string;
  options?: Array<{ value: string; label: string }>;
  correctBreed?: string;
  error?: string;
}

export interface AnswerResponse {
  success: boolean;
  isCorrect: boolean;
  message: string;
  newScore: number;
  newQuestion?: Question;
  error?: string;
}

/**
 * Inicia el juego obteniendo la primera pregunta
 */
export async function startGame(): Promise<Question> {
  try {
    const response = await fetch(`${API_BASE_URL}/game/start`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error del servidor: ${response.status} ${response.statusText}`);
    }
    
    const data: StartGameResponse = await response.json();
    
    if (!data.success || !data.image || !data.options || !data.correctBreed) {
      throw new Error(data.error || 'Error al obtener la pregunta');
    }
    
    return {
      image: data.image,
      options: data.options,
      correctBreed: data.correctBreed
    };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose en http://localhost:8000');
    }
    throw error;
  }
}

/**
 * Envía una respuesta al backend
 */
export async function submitAnswer(
  selectedBreed: string,
  correctBreed: string,
  currentScore: number
): Promise<AnswerResponse> {
  const response = await fetch(`${API_BASE_URL}/game/answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      selectedBreed,
      correctBreed,
      currentScore
    })
  });
  
  if (!response.ok) {
    throw new Error('Error al enviar la respuesta');
  }
  
  const data: AnswerResponse = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Error al procesar la respuesta');
  }
  
  return data;
}

