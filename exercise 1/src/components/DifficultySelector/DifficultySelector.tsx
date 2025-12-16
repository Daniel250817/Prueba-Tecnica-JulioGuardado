import type { Difficulty } from '../../types/Game';
import './DifficultySelector.css';

interface DifficultySelectorProps {
  selectedDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onStart: () => void;
}

export const DifficultySelector = ({
  selectedDifficulty,
  onSelectDifficulty,
  onStart,
}: DifficultySelectorProps) => {
  const difficulties: Array<{
    value: Difficulty;
    label: string;
    description: string;
    imageUrl: string;
  }> = [
    {
      value: 'easy',
      label: 'Fácil',
      description: '4x4 (8 pares)',
      imageUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/129.png', // Magikarp
    },
    {
      value: 'medium',
      label: 'Medio',
      description: '6x6 (18 pares)',
      imageUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png', // Pikachu
    },
    {
      value: 'hard',
      label: 'Difícil',
      description: '8x8 (32 pares)',
      imageUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png', // Charizard
    },
  ];

  return (
    <div className="difficulty-selector">
      <h1 className="game-title">Pokémon Memory Game</h1>
      <p className="game-subtitle">Selecciona la dificultad</p>

      <div className="difficulty-options">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty.value}
            className={`difficulty-btn ${selectedDifficulty === difficulty.value ? 'active' : ''}`}
            onClick={() => onSelectDifficulty(difficulty.value)}
          >
            <div className="difficulty-icon">
              <img src={difficulty.imageUrl} alt={difficulty.label} />
            </div>
            <span className="difficulty-label">{difficulty.label}</span>
            <span className="difficulty-description">{difficulty.description}</span>
          </button>
        ))}
      </div>

      <button className="start-btn" onClick={onStart}>
        Comenzar Juego
      </button>
    </div>
  );
};

