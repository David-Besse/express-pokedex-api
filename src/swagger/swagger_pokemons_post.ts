// swagger docs for route: /api/pokemons, method: POST
export const swaggerPokemonsPost = {
  tags: ["Pokemons"],
  summary: "Create a new pokemon",
  description: "Create a new pokemon",
  operationId: "createPokemon",
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/Pokemon",
        },
      },
    },
  },
  responses: {
    201: {
      description: "Pokemon created",
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
    500: {
      description: "Internal server error",
    },
  },
  security: [
    {
      cookieAuth: ["write:pokemons"],
    },
  ],
};
