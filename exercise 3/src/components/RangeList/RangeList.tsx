import type { DateRange } from '../../types/Range';
import { formatDate } from '../../utils/dateUtils';
import './RangeList.css';

interface RangeListProps {
  ranges: DateRange[];
  onRemoveRange: (id: string) => void;
}

export const RangeList = ({ ranges, onRemoveRange }: RangeListProps) => {
  if (ranges.length === 0) {
    return (
      <div className="range-list range-list--empty">
        <p>No hay rangos agregados</p>
      </div>
    );
  }

  return (
    <div className="range-list">
      <h3 className="range-list__title">Rangos ({ranges.length})</h3>
      <ul className="range-list__items">
        {ranges.map((range) => (
          <li key={range.id} className="range-list__item">
            <div className="range-list__info">
              <span className="range-list__dates">
                {formatDate(range.start)} - {formatDate(range.end)}
              </span>
              {range.isReplaced && (
                <span className="range-list__badge range-list__badge--replaced">
                  Reemplazado
                </span>
              )}
              {!range.isReplaced && (
                <span className="range-list__badge range-list__badge--original">
                  Original
                </span>
              )}
            </div>
            <button
              className="range-list__remove"
              onClick={() => onRemoveRange(range.id)}
              aria-label={`Eliminar rango ${formatDate(range.start)} - ${formatDate(range.end)}`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
