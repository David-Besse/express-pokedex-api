// Import modules
import { Router, Request, Response, NextFunction } from "express";

// Import middlewares
import authMiddleware from "../middlewares/authMiddleware";

// Import model
import { Pokemon } from "../models/pokemon";

// Import data
import pokemons from "../../data/pokemons";

// Import utils
import getErrorMessage from "../../utils/getErrorMessage";

// Import Prisma
import { PrismaClient } from "@prisma/client";

// Import express-validator
import { body, param, validationResult } from "express-validator";

// Create a new router instance
const pokemonsRouter: Router = Router();

// Create a new PrismaClient
const prisma = new PrismaClient();

// Create a map of pokemons and users
const pokemonsMap: Map<number, Pokemon> = new Map(
  pokemons.map((pokemon) => [pokemon.id, pokemon])
);

pokemonsRouter
  .route("/api/pokemons/:id")

  // Endpoint to get a specific pokemon
  .get(
    // Use the authMiddleware for authentication
    authMiddleware,

    // Validating the request using express-validator
    [
      param("id")
        .trim()
        .escape()
        .replace(/\s/g, "")
        .isInt({ min: 1, max: 999 }),
    ],

    // Handling the asynchronous request
    async (req: Request, res: Response) => {
      // Extracts the validation errors from the request
      const errors = validationResult(req);

      // Handling validation errors
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Extracts the pokemon id from the request
      const pokemonId: number = parseInt(req.params.id);

      try {
        const pokemonFound: Pokemon | null = await prisma.pokemon.findUnique({
          where: {
            id: pokemonId,
          },
        });
        await prisma.$disconnect();
        if (!pokemonFound) {
          return res.status(404).json({ message: getErrorMessage(404) });
        }
        res.status(200).json(pokemonFound);
      } catch (e) {
        console.error(e);
        res.status(500).json({ message: getErrorMessage(500) });
        await prisma.$disconnect();
        process.exit(1);
      }
    }
  )

  // Endpoint to update a pokemon
  .put(
    authMiddleware,

    [
      param("id")
        .trim()
        .escape()
        .isInt({ min: 1, max: 999 })
        .withMessage(
          "Invalid pokemon ID: must be an integer between 1 and 999"
        ),
      body("name")
        .optional()
        .trim()
        .escape()
        .isLength({ min: 1, max: 50 })
        .withMessage("Name must be between 1 and 50 characters"),
      body("hp")
        .optional()
        .trim()
        .escape()
        .isInt({ min: 1, max: 999 })
        // Custom sanitizer to ensure that it is an integer because express-validator transforms it to a string before checking for errors and the value sent in the request could be a string
        .customSanitizer((value) => parseInt(value))
        .withMessage("HP must be an integer between 1 and 999"),
      body("cp")
        .optional()
        .trim()
        .escape()
        .isInt({ min: 1, max: 999 })
        // Custom sanitizer to ensure that it is an integer because express-validator transforms it to a string before checking for errors and the value sent in the request could be a string
        .customSanitizer((value) => parseInt(value))
        .withMessage("CP must be an integer between 1 and 999"),
      body("picture")
        .optional()
        .trim()
        .isURL()
        .withMessage("Invalid picture URL"),
      body("types")
        .optional()
        .trim()
        .isArray({ min: 1, max: 3 })
        .withMessage("Types must be an array with 1 to 3 elements"),
    ],

    async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const pokemonId: number = parseInt(req.params.id);

      try {
        const isPokemonUpdated: Pokemon | null = await prisma.pokemon.update({
          where: {
            id: pokemonId,
          },
          data: {
            // Extracts the data from the request body if it exists.
            // Using Pick to only extract the properties that we want to update
            ...(req.body as Pick<
              Pokemon,
              "name" | "hp" | "cp" | "picture" | "types"
            >),
          },
        });

        if (!isPokemonUpdated) {
          return res.status(404).json({ message: getErrorMessage(404) });
        }

        res.status(200).json(isPokemonUpdated);
      } catch (e) {
        console.error(e);
        res.status(500).json({ message: getErrorMessage(500) });
        await prisma.$disconnect();
        process.exit(1);
      } finally {
        await prisma.$disconnect();
      }
    }
  )

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
  .get(authMiddleware, async (req: Request, res: Response) => {
    try {
      const pokemonsList: Pokemon[] = await prisma.pokemon.findMany();
      await prisma.$disconnect();
      res.status(200).json(pokemonsList);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: getErrorMessage(500) });
      await prisma.$disconnect();
      process.exit(1);
    }
  })

  // Endpoint to create a new pokemon
  .post(authMiddleware, (req: Request, res: Response) => {
    const newPokemon: Pokemon = req.body;

    newPokemon.id = Math.max(...pokemonsMap.keys()) + 1;

    pokemonsMap.set(newPokemon.id, newPokemon);

    res.status(201).json(newPokemon);
  });

export default pokemonsRouter;
