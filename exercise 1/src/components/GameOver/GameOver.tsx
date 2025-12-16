import type { GameStats as GameStatsType } from '../../types/Game';
import GameService from '../../services/GameService';
import './GameOver.css';

interface GameOverProps {
  stats: GameStatsType;
  timerEnabled: boolean;
  hasWon: boolean;
  onPlayAgain: () => void;
  onChangeDifficulty: () => void;
}

export const GameOver = ({
  stats,
  timerEnabled,
  hasWon,
  onPlayAgain,
  onChangeDifficulty,
}: GameOverProps) => {
  const gameService = GameService.getInstance();
  const efficiency = gameService.calculateEfficiency(stats.moves, stats.totalPairs);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-over-overlay">
      <div className="game-over-modal">
        <h2 className="congratulations">
          {hasWon ? '¡Felicitaciones!' : 'Tiempo agotado'}
        </h2>
        <p className="subtitle">
          {hasWon ? 'Has completado el juego' : 'No encontraste todos los pares a tiempo'}
        </p>

        <div className="final-stats">
          <div className="final-stat-item">
            <span className="final-stat-label">Movimientos totales:</span>
            <span className="final-stat-value">{stats.moves}</span>
          </div>
          {timerEnabled && (
            <div className="final-stat-item">
              <span className="final-stat-label">Tiempo total:</span>
              <span className="final-stat-value">{formatTime(stats.time)}</span>
            </div>
          )}
          <div className="final-stat-item">
            <span className="final-stat-label">Pares encontrados:</span>
            <span className="final-stat-value">
              {stats.pairsFound} / {stats.totalPairs}
            </span>
          </div>
          <div className="final-stat-item">
            <span className="final-stat-label">Eficiencia:</span>
            <span className="final-stat-value">{efficiency}%</span>
          </div>
        </div>

        <div className="game-over-actions">
          <button className="btn btn-primary" onClick={onPlayAgain}>
            Jugar de Nuevo
          </button>
          <button className="btn btn-secondary" onClick={onChangeDifficulty}>
            Cambiar Dificultad
          </button>
        </div>
      </div>
    </div>
  );
};

