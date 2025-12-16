import type { Card, CardColor } from '../types/Game';
import type { Pokemon } from '../types/Pokemon';
import { shuffle } from '../utils/shuffle';

class GameService {
  private static instance: GameService;

  private constructor() {}

  public static getInstance(): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService();
    }
    return GameService.instance;
  }

  public createCards(pokemonList: Pokemon[], cardColors: CardColor[]): Card[] {
    const cards: Card[] = [];
    const totalPairs = pokemonList.length;

    for (let i = 0; i < totalPairs; i++) {
      const pokemon = pokemonList[i];
      
      let card1Color: CardColor;
      let card2Color: CardColor;
      
      if (cardColors.length === 1) {
        card1Color = cardColors[0];
        card2Color = cardColors[0];
      } else {
        card1Color = cardColors[i % 2];
        card2Color = cardColors[(i % 2) + 1] || cardColors[0];
      }

      const card1: Card = {
        id: `${pokemon.id}-1`,
        pokemon,
        isFlipped: false,
        isMatched: false,
        cardColor: card1Color,
      };

      const card2: Card = {
        id: `${pokemon.id}-2`,
        pokemon,
        isFlipped: false,
        isMatched: false,
        cardColor: card2Color,
      };

      cards.push(card1, card2);
    }

    return shuffle(cards);
  }

  public checkMatch(card1: Card, card2: Card): boolean {
    return card1.pokemon.id === card2.pokemon.id;
  }

  public calculateEfficiency(moves: number, totalPairs: number): number {
    const minMoves = totalPairs;
    if (moves === 0) return 0;
    return Math.round((minMoves / moves) * 100);
  }
}

export default GameService;

