import { useState, useEffect } from 'react';
import type { Pokemon } from '../types/Pokemon';
import PokemonService from '../services/PokemonService';

export const usePokemon = (limit: number) => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      setError(null);
      try {
        const service = PokemonService.getInstance();
        const pokemon = await service.fetchPokemon(limit);
        if (pokemon.length === 0) {
          setError('No se pudieron cargar los Pokémon');
        } else {
          setPokemonList(pokemon);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar Pokémon');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [limit]);

  return { pokemonList, loading, error };
};

