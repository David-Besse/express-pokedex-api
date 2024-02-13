// Import modules
import { Router, Request, Response } from "express";

// Import model
import { Pokemon } from "../models/pokemon";

// Import data
import { pokemons } from "../../data/pokemons.json";

import { getErrorMessage } from "../utils/getErrorMessage";

// Create a new router instance
const pokemonsRouter = Router();

// Create a map of pokemons and users
const pokemonsMap: Map<number, Pokemon> = new Map(
  pokemons.map((pokemon) => [pokemon.id, pokemon])
);

// Endpoint to get a specific pokemon
pokemonsRouter.get("/apipokemons/:id", (req: Request, res: Response) => {
  const pokemonId: number = parseInt(req.params.id);

  const pokemonFound: Pokemon | undefined = pokemonsMap.get(pokemonId);

  if (!pokemonFound) {
    res.status(404).json({ message: getErrorMessage(404) });
    return;
  }

  res.status(200).json(pokemonFound);
});

// Endpoint to get all pokemons
pokemonsRouter.get("/apipokemons", (req: Request, res: Response) => {
  const pokemonList: Pokemon[] = [...pokemonsMap.values()];

  console.log(
    "affichage de pokemonList",
    pokemonList,
    "et aussi son type : ",
    typeof pokemonList
  );

  res.status(200).json(pokemonList);
});

// Endpoint to create a new pokemon
pokemonsRouter.post("/apipokemons", (req: Request, res: Response) => {
  const newPokemon: Pokemon = req.body;

  newPokemon.id = Math.max(...pokemonsMap.keys()) + 1;

  pokemonsMap.set(newPokemon.id, newPokemon);

  res.status(201).json(newPokemon);
});

// Endpoint to update a pokemon
pokemonsRouter.put("/apipokemons/:id", (req: Request, res: Response) => {
  const pokemonId: number = parseInt(req.params.id);

  const pokemonFound: boolean = pokemonsMap.has(pokemonId);

  if (!pokemonFound) {
    res.status(404).json({ message: getErrorMessage(404) });
    return;
  }

  const updatedPokemon: Pokemon = req.body;

  pokemonsMap.set(pokemonId, updatedPokemon);

  res.status(201).json(updatedPokemon);
});

// Endpoint to delete a pokemon
pokemonsRouter.delete("/apipokemons/:id", (req: Request, res: Response) => {
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

export default pokemonsRouter;
