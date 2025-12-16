import { useEffect } from 'react';
import { useGame } from './hooks/useGame';
import { DogImage } from './components/DogImage/DogImage';
import { Options } from './components/Options/Options';
import { Score } from './components/Score/Score';
import { GameMessage } from './components/GameMessage/GameMessage';
import { GameOver } from './components/GameOver/GameOver';
import './App.css';

function App() {
  const {
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
  } = useGame();

  useEffect(() => {
    loadNewQuestion();
  }, [loadNewQuestion]);

  const handleOptionSelect = (selectedBreed: string) => {
    handleAnswer(selectedBreed);
  };

  return (
    <div className="app">
      {isGameOver && (
        <GameOver 
          correctAnswers={correctAnswers}
          onPlayAgain={resetGame}
        />
      )}
      
      <div className="app-container">
        <header className="app-header">
          <h1>🐕 Adivina la Raza del Perro</h1>
          <Score score={score} />
        </header>

        <main className="app-main">
          {currentQuestion ? (
            <>
              <DogImage 
                imageUrl={currentQuestion.image} 
                isLoading={isLoading}
              />
              
              <GameMessage 
                message={message} 
                type={messageType} 
              />
              
              <Options
                options={currentQuestion.options}
                onSelect={handleOptionSelect}
                disabled={isGameOver || (!!message && messageType === 'success')}
                isLoading={isLoading}
              />
            </>
          ) : (
            <div className="loading-container">
              {isLoading ? (
                <p>Cargando juego...</p>
              ) : (
                <div>
                  <p>Error al cargar el juego</p>
                  <button onClick={resetGame} className="retry-button">
                    Reintentar
                  </button>
                </div>
              )}
            </div>
          )}
        </main>

        <footer className="app-footer">
          <button onClick={resetGame} className="reset-button">
            Reiniciar Juego
          </button>
        </footer>
      </div>
    </div>
  );
}

export default App;

