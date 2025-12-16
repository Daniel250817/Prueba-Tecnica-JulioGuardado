import './GameOver.css';

interface GameOverProps {
  correctAnswers: number;
  onPlayAgain: () => void;
}

export const GameOver = ({ correctAnswers, onPlayAgain }: GameOverProps) => {
  return (
    <div className="game-over-overlay">
      <div className="game-over-modal">
        <h2 className="game-over-title">¡Juego Terminado!</h2>
        <p className="game-over-subtitle">
          Has perdido. Tu puntaje llegó a 0.
        </p>

        <div className="game-over-stats">
          <div className="stat-item">
            <span className="stat-label">Aciertos totales:</span>
            <span className="stat-value">{correctAnswers}</span>
          </div>
        </div>

        <div className="game-over-actions">
          <button className="btn-play-again" onClick={onPlayAgain}>
            Jugar de Nuevo
          </button>
        </div>
      </div>
    </div>
  );
};

