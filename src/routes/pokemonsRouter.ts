// Import modules
import { Router, Request, Response } from "express";
import { PrismaClient } from "../../prisma/prisma-client";
import { body, param, validationResult } from "express-validator";
// Import middlewares
import authMiddleware from "../middlewares/authMiddleware";
// Import model
import { Pokemon } from "../models/pokemon";
// Import utils
import getErrorMessage from "../utils/getErrorMessage";

const pokemonsRouter: Router = Router();

const prisma: PrismaClient = new PrismaClient();

pokemonsRouter
  .route("/api/pokemons/:id")

  // Endpoint to get a specific pokemon
  .get(
    // Use the authMiddleware for authentication
    authMiddleware,

    // Validating the request using express-validator
    [param("id").trim().escape().isInt({ min: 1, max: 999 })],

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
        .escape()
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
          data:
            // Extracts the data from the request body if it exists.
            // Using Pick to only extract the properties that we want to update
            req.body as Pick<
              Pokemon,
              "name" | "hp" | "cp" | "picture" | "types"
            >,
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
  .delete(
    authMiddleware,
    [
      param("id")
        .trim()
        .escape()
        .isInt({ min: 1, max: 999 })
        .withMessage(
          "Invalid pokemon ID: must be an integer between 1 and 999"
        ),
    ],
    async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const pokemonId: number = parseInt(req.params.id);

      const pokemonFound: Pokemon | null = await prisma.pokemon.delete({
        where: {
          id: pokemonId,
        },
      });

      if (!pokemonFound) {
        res.status(404).json({ message: getErrorMessage(404) });
        return;
      }

      res.status(200).json({ message: "Pokemon deleted" });
    }
  );

pokemonsRouter
  .route("/api/pokemons")

  // Endpoint to get all pokemons
  .get(authMiddleware, async (req: Request, res: Response) => {
    try {
      const pokemonsList: Pokemon[] = await prisma.pokemon.findMany();
      await prisma.$disconnect();
      res.status(200).json(pokemonsList);
    } catch (error: any) {
      console.error(error);
      res.status(error.status).json([]);
      await prisma.$disconnect();
      process.exit(1);
    }
  })

  // Endpoint to create a new pokemon
  .post(
    authMiddleware,
    [
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
        // Custom sanitizer to ensure that it is an integer because express-validator transforms it to a string before
        // checking for errors and the value sent in the request could be a string
        .customSanitizer((value) => parseInt(value))
        .withMessage("HP must be an integer between 1 and 999"),
      body("cp")
        .optional()
        .trim()
        .escape()
        .isInt({ min: 1, max: 999 })
        // Custom sanitizer to ensure that it is an integer because express-validator transforms it to a string before
        // checking for errors and the value sent in the request could be a string
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

      const newPokemon: Pokemon = await prisma.pokemon.create({
        data: req.body,
      });

      res.status(201).json(newPokemon);
    }
  );

export default pokemonsRouter;
