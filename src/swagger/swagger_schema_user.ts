// swagger schema for User
export const swaggerSchemaUser = {
  type: "object",
  properties: {
    email: {
      type: "string",
      nullable: true, // A user can have no email
    },
    password: {
      type: "string",
      nullable: true, // A user can have no password
    },
  },
  required: ["email", "password"],
  example: {
    email: "admin@pkm.com",
    password: "AdminPKM2024!",
  }
};
