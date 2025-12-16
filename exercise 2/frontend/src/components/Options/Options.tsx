import './Options.css';

interface Option {
  value: string;
  label: string;
}

interface OptionsProps {
  options: Option[];
  onSelect: (value: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export const Options = ({ options, onSelect, disabled, isLoading }: OptionsProps) => {
  return (
    <div className="options-container">
      {options.map((option) => (
        <button
          key={option.value}
          className="option-button"
          onClick={() => onSelect(option.value)}
          disabled={disabled || isLoading}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

