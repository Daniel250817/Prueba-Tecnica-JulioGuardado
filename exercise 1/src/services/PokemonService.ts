import type { Pokemon } from '../types/Pokemon';

class PokemonService {
  private static instance: PokemonService;
  private cache: Map<number, Pokemon> = new Map();

  private constructor() {}

  public static getInstance(): PokemonService {
    if (!PokemonService.instance) {
      PokemonService.instance = new PokemonService();
    }
    return PokemonService.instance;
  }

  public async fetchPokemon(limit: number): Promise<Pokemon[]> {
    const ids: number[] = [];

    for (let i = 1; i <= limit; i++) {
      ids.push(i);
    }

    const promises = ids.map((id) => this.fetchPokemonById(id));
    const results = await Promise.all(promises);

    return results.filter((pokemon): pokemon is Pokemon => pokemon !== null);
  }

  private async fetchPokemonById(id: number): Promise<Pokemon | null> {
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch Pokemon ${id}`);
      }
      const data: Pokemon = await response.json();
      this.cache.set(id, data);
      return data;
    } catch (error) {
      console.error(`Error fetching Pokemon ${id}:`, error);
      return null;
    }
  }

  public clearCache(): void {
    this.cache.clear();
  }
}

export default PokemonService;

