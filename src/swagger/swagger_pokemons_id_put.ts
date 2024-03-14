// swagger docs for route: /api/pokemons/{id}, method: PUT
export const swaggerPokemonsIdPut = {
  tags: ["Pokemons"],
  summary: "Update one pokemon",
  description: "Update one pokemon",
  operationId: "updateOnePokemon",
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
    200: {
      description: "Send the updated pokemon",
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
      cookieAuth: ["write:pokemons"],
    },
    {
      cookieRefresh: ["write:pokemons"],
    },
  ],
};
