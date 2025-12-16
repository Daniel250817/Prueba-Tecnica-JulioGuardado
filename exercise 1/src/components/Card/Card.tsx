import type { Card as CardType } from '../../types/Game';
import './Card.css';

interface CardProps {
  card: CardType;
  onClick: () => void;
  disabled: boolean;
}

export const Card = ({ card, onClick, disabled }: CardProps) => {
  const handleClick = () => {
    if (!disabled && !card.isMatched && !card.isFlipped) {
      onClick();
    }
  };

  const imageUrl =
    card.pokemon.sprites.other?.['official-artwork']?.front_default ||
    card.pokemon.sprites.front_default;

  return (
    <div
      className={`card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''} ${card.cardColor}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={card.isFlipped ? card.pokemon.name : 'Carta boca abajo'}
    >
      <div className="card-inner">
        <div className="card-front">
          <img src={imageUrl} alt={card.pokemon.name} />
        </div>
        <div className="card-back"></div>
      </div>
    </div>
  );
};

