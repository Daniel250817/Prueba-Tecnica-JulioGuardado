import { useState } from 'react';
import { RangeForm } from './components/RangeForm/RangeForm';
import { GanttChart } from './components/GanttChart/GanttChart';
import { RangeList } from './components/RangeList/RangeList';
import { useRanges } from './hooks/useRanges';
import './styles/theme.css';

function App() {
  const { sortedRanges, addRange, removeRange, clearRanges, dateRange } = useRanges();
  const [error, setError] = useState<string>('');

  const handleAddRange = (start: Date, end: Date) => {
    try {
      setError('');
      addRange(start, end);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar rango');
    }
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Algoritmo Comelón - Visualización Gantt</h1>
        <p className="app__subtitle">
          Gestiona rangos de fechas con reglas de reemplazo y visualízalos en un diagrama Gantt
        </p>
      </header>

      <main className="app__main">
        <RangeForm onAddRange={handleAddRange} error={error} />

        {sortedRanges.length > 0 && (
          <>
            <RangeList ranges={sortedRanges} onRemoveRange={removeRange} />
            <div className="app__actions">
              <button className="app__clear-button" onClick={clearRanges}>
                Limpiar Todos los Rangos
              </button>
            </div>
            <GanttChart ranges={sortedRanges} dateRange={dateRange} />
          </>
        )}

        {sortedRanges.length === 0 && (
          <div className="app__empty">
            <p>Agrega rangos de fechas para comenzar</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
