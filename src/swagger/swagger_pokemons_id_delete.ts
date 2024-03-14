// swagger docs for route: /api/pokemons/{id}, method: DELETE
export const swaggerPokemonsIdDelete = {
  tags: ["Pokemons"],
  summary: "Delete one pokemon",
  description: "Delete one pokemon",
  operationId: "deleteOnePokemon",
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
      description: "Pokemon deleted",
      content: {
        "application/json": {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Pokemon deleted",
              description: "Message sent by the server",
            },
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
