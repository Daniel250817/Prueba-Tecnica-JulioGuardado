import type { GameStats as GameStatsType } from '../../types/Game';
import './GameStats.css';

interface GameStatsProps {
  stats: GameStatsType;
  timerEnabled: boolean;
}

export const GameStats = ({ stats, timerEnabled }: GameStatsProps) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-stats">
      <div className="stat-item">
        <span className="stat-label">Movimientos:</span>
        <span className="stat-value">{stats.moves}</span>
      </div>
      {timerEnabled && (
        <div className="stat-item">
          <span className="stat-label">Tiempo:</span>
          <span className="stat-value">{formatTime(stats.time)}</span>
        </div>
      )}
      <div className="stat-item">
        <span className="stat-label">Pares:</span>
        <span className="stat-value">
          {stats.pairsFound} / {stats.totalPairs}
        </span>
      </div>
    </div>
  );
};

