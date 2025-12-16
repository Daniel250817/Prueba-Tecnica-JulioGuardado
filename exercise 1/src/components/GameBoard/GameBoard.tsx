import { Card } from '../Card/Card';
import { GameStats } from '../GameStats/GameStats';
import { GameOver } from '../GameOver/GameOver';
import { useGame } from '../../hooks/useGame';
import type { DifficultyConfig } from '../../types/Game';
import type { Pokemon } from '../../types/Pokemon';
import './GameBoard.css';

interface GameBoardProps {
  pokemonList: Pokemon[];
  config: DifficultyConfig;
  onChangeDifficulty: () => void;
}

export const GameBoard = ({
  pokemonList,
  config,
  onChangeDifficulty,
}: GameBoardProps) => {
  const {
    cards,
    moves,
    pairsFound,
    time,
    isGameOver,
    flippedCards,
    handleCardClick,
    resetGame,
  } = useGame(pokemonList, config);

  const handlePlayAgain = () => {
    resetGame(pokemonList, config);
  };

  const stats = {
    moves,
    time,
    pairsFound,
    totalPairs: config.totalPairs,
  };

  return (
    <div className="game-board-container">
      <GameStats stats={stats} timerEnabled={config.enableTimer} />

      <div
        className="game-board"
        style={{
          gridTemplateColumns: `repeat(${config.gridSize}, 1fr)`,
        }}
      >
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            onClick={() => handleCardClick(index)}
            disabled={flippedCards.length >= 2 || isGameOver}
          />
        ))}
      </div>

      {isGameOver && (
        <GameOver
          stats={stats}
          timerEnabled={config.enableTimer}
          onPlayAgain={handlePlayAgain}
          onChangeDifficulty={onChangeDifficulty}
        />
      )}
    </div>
  );
};

