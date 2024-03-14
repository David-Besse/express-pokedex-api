// swagger docs for route: /api/pokemons, method: GET
export const swaggerPokemonsGet = {
  tags: ["Pokemons"],
  summary: "Get all pokemons",
  description: "Get all pokemons",
  operationId: "getAllPokemons",
  responses: {
    200: {
      description: "Send all pokemons",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Pokemon",
            },
          },
        },
      },
    },
    401: {
      description: "Invalid credentials",
    },
    403: {
      description: "Insufficient permissions to access the resource",
    },
    500: {
      description: "Internal server error",
    },
  },
  security: [
    {
      cookieAuth: ["read:pokemons"],
    },
  ],
};
