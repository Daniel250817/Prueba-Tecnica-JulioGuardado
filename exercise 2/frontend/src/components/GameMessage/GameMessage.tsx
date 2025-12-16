import './GameMessage.css';

interface GameMessageProps {
  message: string | null;
  type: 'success' | 'error' | null;
}

export const GameMessage = ({ message, type }: GameMessageProps) => {
  if (!message || !type) return null;

  return (
    <div className={`game-message game-message--${type}`}>
      {message}
    </div>
  );
};

