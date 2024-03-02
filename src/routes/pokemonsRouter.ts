// Import modules
import { Router, Request, Response, NextFunction } from "express";

import authMiddleware from "../middlewares/authMiddleware";

// Import model
import { Pokemon } from "../models/pokemon";

// Import data
import { pokemons } from "../../data/pokemons.json";

// Import utils
import getErrorMessage from "../../utils/getErrorMessage";

// Create a new router instance
const pokemonsRouter: Router = Router();

// Create a map of pokemons and users
const pokemonsMap: Map<number, Pokemon> = new Map(
  pokemons.map((pokemon) => [pokemon.id, pokemon])
);

pokemonsRouter
  .route("/api/pokemons/:id")

  // Endpoint to get a specific pokemon
  .get(authMiddleware, (req: Request, res: Response) => {
    const pokemonId: number = parseInt(req.params.id);

    const pokemonFound: Pokemon | undefined = pokemonsMap.get(pokemonId);

    if (!pokemonFound) {
      res.status(404).json({});
    } else {
      res.status(200).json(pokemonFound);
    }
  })

  // Endpoint to update a pokemon
  .put(authMiddleware, (req: Request, res: Response) => {
    const pokemonId: number = parseInt(req.params.id);

    const pokemonFound: boolean = pokemonsMap.has(pokemonId);

    if (!pokemonFound) {
      res.status(404).json({ message: getErrorMessage(404) });
    } else {
      const updatedPokemon: Pokemon = req.body;

      pokemonsMap.set(pokemonId, updatedPokemon);

      res.status(201).json(updatedPokemon);
    }
  })

  // Endpoint to delete a pokemon
  .delete(authMiddleware, (req: Request, res: Response) => {
    const pokemonId: number = parseInt(req.params.id);

    const pokemonFound: boolean = pokemonsMap.has(pokemonId);

    if (!pokemonFound) {
      res.status(404).json({ message: getErrorMessage(404) });
      return;
    }

    const isPokemonDeleted: boolean = pokemonsMap.delete(pokemonId);

    if (!isPokemonDeleted) {
      res.status(500).json({ message: getErrorMessage(500) });
      return;
    }

    res.status(200).json({ message: "Pokemon deleted" });
  });

pokemonsRouter
  .route("/api/pokemons")

  // Endpoint to get all pokemons
  .get(authMiddleware, (req: Request, res: Response) => {
    const pokemonList: Pokemon[] = [...pokemonsMap.values()];

    res.status(200).json(pokemonList);
  })

  // Endpoint to create a new pokemon
  .post(authMiddleware, (req: Request, res: Response) => {
    const newPokemon: Pokemon = req.body;

    newPokemon.id = Math.max(...pokemonsMap.keys()) + 1;

    pokemonsMap.set(newPokemon.id, newPokemon);

    res.status(201).json(newPokemon);
  });

export default pokemonsRouter;
