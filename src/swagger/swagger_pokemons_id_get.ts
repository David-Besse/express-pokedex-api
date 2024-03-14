// swagger docs for route: /api/pokemons/{id}, method: GET
export const swaggerPokemonsIdGet = {
  tags: ["Pokemons"],
  summary: "Get one pokemon",
  description: "Get one pokemon",
  operationId: "getOnePokemon",
  parameters: [
    {
      in: "path",
      name: "id",
      schema: {
        type: "integer",
      },
      required: true,
      description: "The pokemon ID",
    },
  ],
  responses: {
    200: {
      description: "Send the pokemon",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Pokemon",
          },
        },
      },
    },
    400: {
      description: "Invalid ID supplied",
    },
    401: {
      description: "Invalid credentials",
    },
    403: {
      description: "Insufficient permissions to access the resource",
    },
    404: {
      description: "Pokemon not found",
    },
    500: {
      description: "Internal server error",
    },
  },
  security: [
    {
      cookieAuth: ["read:pokemons"],
    },
    {
      cookieRefresh: ["read:pokemons"],
    },
  ],
};
