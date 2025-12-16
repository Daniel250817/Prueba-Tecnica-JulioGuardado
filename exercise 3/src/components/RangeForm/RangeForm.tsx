import { useState, FormEvent, useRef } from 'react';
import { parseDate, dateToInputValue, inputValueToDate, formatDate } from '../../utils/dateUtils';
import './RangeForm.css';

interface RangeFormProps {
  onAddRange: (start: Date, end: Date) => void;
  error?: string;
}

export const RangeForm = ({ onAddRange, error }: RangeFormProps) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [localError, setLocalError] = useState<string>('');
  const startDateInputRef = useRef<HTMLInputElement>(null);
  const endDateInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError('');

    if (!startDate || !endDate) {
      setLocalError('Ambas fechas son requeridas');
      return;
    }

    try {
      const start = parseDate(startDate);
      const end = parseDate(endDate);

      if (start.getTime() > end.getTime()) {
        setLocalError('La fecha de inicio debe ser menor o igual a la fecha de fin');
        return;
      }

      onAddRange(start, end);
      setStartDate('');
      setEndDate('');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Error al agregar rango');
    }
  };

  const handleDateChange = (value: string, setter: (value: string) => void) => {
    const cleaned = value.replace(/[^\d/]/g, '');
    const parts = cleaned.split('/');
    
    if (parts.length > 3) return;
    
    let formatted = '';
    if (parts[0]) {
      const day = parts[0].slice(0, 2);
      formatted = day;
      if (parts[1]) {
        const month = parts[1].slice(0, 2);
        formatted += '/' + month;
        if (parts[2]) {
          const yearPart = parts[2].slice(0, 4);
          formatted += '/' + yearPart;
        }
      } else if (cleaned.length > 2 && !cleaned.includes('/')) {
        formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
        if (cleaned.length > 4) {
          formatted += '/' + cleaned.slice(4, 8);
        }
      }
    }
    
    setter(formatted);
  };

  const handleCalendarClick = (ref: React.RefObject<HTMLInputElement>, textValue: string) => {
    if (!ref.current) return;
    
    const input = ref.current;
    
    if (textValue) {
      try {
        const date = parseDate(textValue);
        const dateValue = dateToInputValue(date);
        input.value = dateValue;
      } catch {
        input.value = '';
      }
    } else {
      input.value = '';
    }
    
    const restoreStyles = () => {
      if (input) {
        input.style.position = 'absolute';
        input.style.top = '0';
        input.style.left = '0';
        input.style.width = '1px';
        input.style.height = '1px';
        input.style.pointerEvents = 'none';
        input.style.zIndex = '-1';
        input.style.cursor = 'default';
        input.style.opacity = '0';
      }
    };
    
    input.style.position = 'fixed';
    input.style.top = '50%';
    input.style.left = '50%';
    input.style.transform = 'translate(-50%, -50%)';
    input.style.width = '1px';
    input.style.height = '1px';
    input.style.opacity = '0';
    input.style.pointerEvents = 'auto';
    input.style.zIndex = '9999';
    
    const handleBlur = () => {
      restoreStyles();
      input.removeEventListener('blur', handleBlur);
      input.removeEventListener('change', handleChange);
    };
    
    const handleChange = () => {
      setTimeout(restoreStyles, 100);
      input.removeEventListener('blur', handleBlur);
      input.removeEventListener('change', handleChange);
    };
    
    input.addEventListener('blur', handleBlur);
    input.addEventListener('change', handleChange);
    
    setTimeout(() => {
      if (input) {
        input.focus();
        if (typeof input.showPicker === 'function') {
          try {
            input.showPicker();
          } catch (err) {
            input.click();
          }
        } else {
          input.click();
        }
      }
    }, 10);
  };

  const handleDatePickerChange = (
    value: string,
    setter: (value: string) => void,
    ref: React.RefObject<HTMLInputElement>
  ) => {
    if (value) {
      try {
        const date = inputValueToDate(value);
        setter(formatDate(date));
      } catch (err) {
        console.error('Error parsing date from picker:', err);
      }
    }
    
    setTimeout(() => {
      if (ref.current) {
        ref.current.style.position = 'absolute';
        ref.current.style.top = '0';
        ref.current.style.left = '0';
        ref.current.style.transform = 'none';
        ref.current.style.pointerEvents = 'none';
        ref.current.style.zIndex = '-1';
        ref.current.blur();
      }
    }, 100);
  };

  const displayError = localError || error;

  return (
    <form className="range-form" onSubmit={handleSubmit}>
      <div className="range-form__fields">
        <div className="range-form__field">
          <label htmlFor="start-date" className="range-form__label">
            Fecha Inicio (dd/mm/yyyy)
          </label>
          <div className="range-form__input-wrapper">
            <input
              id="start-date"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}"
              className="range-form__input"
              value={startDate}
              onChange={(e) => handleDateChange(e.target.value, setStartDate)}
              placeholder="dd/mm/yyyy"
              maxLength={10}
            />
            <input
              ref={startDateInputRef}
              type="date"
              className="range-form__date-picker"
              onChange={(e) => handleDatePickerChange(e.target.value, setStartDate, startDateInputRef)}
            />
            <button
              type="button"
              className="range-form__calendar-button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCalendarClick(startDateInputRef, startDate);
              }}
              aria-label="Abrir selector de fecha"
            >
              <svg
                className="range-form__calendar-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </button>
          </div>
        </div>
        <div className="range-form__field">
          <label htmlFor="end-date" className="range-form__label">
            Fecha Fin (dd/mm/yyyy)
          </label>
          <div className="range-form__input-wrapper">
            <input
              id="end-date"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}"
              className="range-form__input"
              value={endDate}
              onChange={(e) => handleDateChange(e.target.value, setEndDate)}
              placeholder="dd/mm/yyyy"
              maxLength={10}
            />
            <input
              ref={endDateInputRef}
              type="date"
              className="range-form__date-picker"
              onChange={(e) => handleDatePickerChange(e.target.value, setEndDate, endDateInputRef)}
            />
            <button
              type="button"
              className="range-form__calendar-button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCalendarClick(endDateInputRef, endDate);
              }}
              aria-label="Abrir selector de fecha"
            >
              <svg
                className="range-form__calendar-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </button>
          </div>
        </div>
        <button type="submit" className="range-form__button">
          Agregar Rango
        </button>
      </div>
      {displayError && <div className="range-form__error">{displayError}</div>}
    </form>
  );
};
