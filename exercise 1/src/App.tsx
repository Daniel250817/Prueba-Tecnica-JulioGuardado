import { useState } from 'react';
import { DifficultySelector } from './components/DifficultySelector/DifficultySelector';
import { GameBoard } from './components/GameBoard/GameBoard';
import { usePokemon } from './hooks/usePokemon';
import type { Difficulty, DifficultyConfig } from './types/Game';
import { DIFFICULTY_CONFIGS, DEFAULT_DIFFICULTY } from './constants/gameConfig';
import './styles/theme.css';

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>(DEFAULT_DIFFICULTY);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isTimedMode, setIsTimedMode] = useState<boolean>(false);

  const baseConfig: DifficultyConfig = DIFFICULTY_CONFIGS[difficulty];
  const config: DifficultyConfig = { ...baseConfig, enableTimer: isTimedMode };
  const { pokemonList, loading, error } = usePokemon(config.totalPairs);

  const handleStartGame = () => {
    if (pokemonList.length > 0) {
      setGameStarted(true);
    }
  };

  const handleChangeDifficulty = () => {
    setGameStarted(false);
  };


  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'white', fontSize: '1.5rem' }}>
        Cargando Pokémon...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'white', fontSize: '1.5rem', flexDirection: 'column', gap: '1rem' }}>
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
          Recargar
        </button>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <DifficultySelector
        selectedDifficulty={difficulty}
        onSelectDifficulty={setDifficulty}
        isTimedMode={isTimedMode}
        onToggleTimedMode={setIsTimedMode}
        onStart={handleStartGame}
      />
    );
  }

  return (
    <GameBoard
      pokemonList={pokemonList}
      config={config}
      onChangeDifficulty={handleChangeDifficulty}
    />
  );
}

export default App;

