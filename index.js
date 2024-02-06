// Create an express server, listening on port 8080
const express = require("express");

const app = express();

const { pokemons } = require("./data/pokemons.json");
const { users } = require("./data/users.json");
const pokemonsMap = new Map(pokemons.map((pokemon) => [pokemon.id, pokemon]));
const usersMap = new Map(users.map((user) => [user.id, user]));

/**
 * A function that returns an error message based on the provided status code.
 *
 * @param {number} statusCode - The status code to get the error message for.
 * @return {string} The error message corresponding to the status code.
 */
function getErrorMessage(statusCode) {
  switch (statusCode) {
    case 400:
      return "Bad Request";
    case 401:
      return "Unauthorized";
    case 403:
      return "Forbidden";
    case 404:
      return "Not Found";
    case 500:
      return "Internal Server Error";
    default:
      return "Unknown Error";
  }
}

/**
 * Logs the endpoint being accessed and calls the next middleware function.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @return {void}
 */
function logEndpoint(req, res, next) {
  console.log(`Endpoint used: ${req.method} ${req.originalUrl}`);
  next();
}

// Use the middleware function logEndpoint for all incoming requests
app.use(logEndpoint);

// Parse incoming requests with JSON payloads
app.use(express.json());

app.listen(8080, () => {
  console.log("Server running on port 8080");
});

app.get("/apipokemons/:id", (req, res) => {
  const pokemonId = parseInt(req.params.id);

  const pokemonFound = pokemonsMap.get(pokemonId);

  if (!pokemonFound) {
    res.status(404).json({ message: getErrorMessage(404) });
    return;
  }

  res.status(200).json(pokemonFound);
});

app.get("/apipokemons", (req, res) => {
  const pokemonList = [...pokemonsMap.values()];

  res.status(200).json(pokemonList);
});

app.post("/apipokemons", (req, res) => {
  const newPokemon = req.body;

  const lastPokemonId = Math.max(...pokemonsMap.keys());

  newPokemon.id = lastPokemonId + 1;

  pokemonsMap.set(newPokemon.id, newPokemon);

  res.status(201).json(newPokemon);
});

app.put("/apipokemons/:id", (req, res) => {
  const pokemonId = parseInt(req.params.id);

  const pokemonFound = pokemonsMap.has(pokemonId);

  if (!pokemonFound) {
    res.status(404).json({ message: getErrorMessage(404) });
    return;
  }

  const updatedPokemon = req.body;

  pokemonsMap.set(pokemonId, updatedPokemon);

  res.status(201).json(updatedPokemon);
});

app.delete("/apipokemons/:id", (req, res) => {
  const pokemonId = parseInt(req.params.id);

  const pokemonFound = pokemonsMap.has(pokemonId);

  if (!pokemonFound) {
    res.status(404).json({ message: getErrorMessage(404) });
    return;
  }

  const isPokemonDeleted = pokemonsMap.delete(pokemonId);

  if (!isPokemonDeleted) {
    res.status(500).json({ message: getErrorMessage(500) });
  }

  res.status(200).json({ message: "Pokemon deleted" });
});
