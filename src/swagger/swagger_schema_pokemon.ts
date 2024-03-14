// swagger schema for Pokemon
export const swaggerSchemaPokemon = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      format: "int32",
      nullable: true, // A pokemon can have no id
    },
    name: {
      type: "string",
      nullable: true, // A pokemon can have no name
    },
    hp: {
      type: "integer",
      format: "int32",
      nullable: true, // A pokemon can have no hp
    },
    cp: {
      type: "integer",
      format: "int32",
      nullable: true, // A pokemon can have no cp
    },
    types: {
      type: "array",
      nullable: true, // A pokemon can have no types
      items: {
        type: "string",
      },
    },
    picture: {
      type: "string",
      nullable: true, // A pokemon can have no picture
    },
    created: {
      type: "string",
      format: "date-time",
      nullable: true, // A pokemon can have no created date
    },
  },
  required: ["id", "name", "hp", "cp", "types", "picture", "created"],
  example: {
    id: 1,
    name: "Bulbizarre",
    hp: 25,
    cp: 5,
    types: ["Plante", "Poison"],
    created: "2022-10-25T16:00:00.000Z",
  },
};
