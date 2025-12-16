import './Score.css';

interface ScoreProps {
  score: number;
}

export const Score = ({ score }: ScoreProps) => {
  return (
    <div className="score-container">
      <div className="score-label">Puntos</div>
      <div className="score-value">{score}</div>
    </div>
  );
};

