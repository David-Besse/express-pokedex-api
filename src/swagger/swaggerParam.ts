import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI, { SwaggerOptions } from "swagger-ui-express";
import dotenv from "dotenv";

dotenv.config();

import { swaggerPokemonsIdGet } from "./swagger_pokemons_id_get";
import { swaggerPokemonsIdPut } from "./swagger_pokemons_id_put";
import { swaggerPokemonsIdDelete } from "./swagger_pokemons_id_delete";
import { swaggerPokemonsGet } from "./swagger_pokemons_get";
import { swaggerPokemonsPost } from "./swagger_pokemons_post";
import { swaggerLogoutPost } from "./swagger_logout_post";
import { swaggerLoginPost } from "./swagger_login-post";
import { swaggerSchemaUser } from "./swagger_schema_user";
import { swaggerSchemaPokemon } from "./swagger_schema_pokemon";

const swagOptions: SwaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Pokedex API",
      version: "1.0.0",
      description:
        "This is a simple restful API for my Angular Pokedex project",
      contact: {
        name: "David Besse",
        email: "davidb.webdev@gmail.com",
      },
    },
    externalDocs: {
      description: "Find more info on GitHub",
      url: "https://github.com/David-Besse/express-pokedex-api",
    },
    servers: [
      {
        url: process.env.SERVER_URL_P + ":" + process.env.PORT_P,
      },
      {
        url: process.env.SERVER_URL + ":" + process.env.PORT,
      },
    ],
    tags: [
      { name: "Login", description: "Login with email and password" },
      { name: "Logout", description: "Logout the user" },
      { name: "Pokemons", description: "Operations about pokemons" },
    ],
    paths: {
      "/api/login": {
        post: swaggerLoginPost,
      },
      "/api/logout": {
        post: swaggerLogoutPost,
      },
      "/api/pokemons/{id}": {
        get: swaggerPokemonsIdGet,
        put: swaggerPokemonsIdPut,
        delete: swaggerPokemonsIdDelete,
      },
      "/api/pokemons": {
        post: swaggerPokemonsPost,
        get: swaggerPokemonsGet,
      },
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "access_token",
          nullable: false,
        },
        cookieRefresh: {
          type: "apiKey",
          in: "cookie",
          name: "refresh_token",
          nullable: false,
        },
      },
      schemas: {
        User: swaggerSchemaUser,
        Pokemon: swaggerSchemaPokemon,
      },
    },
  },
  apis: ["src/swagger/*.ts"],
};

const swaggerSpecs: SwaggerOptions = swaggerJSDoc(swagOptions);

// const options: SwaggerOptions = {
//   customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.12.0/swagger-ui.min.css",
//   customJsUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.12.0/swagger-ui.min.js",
// };

export const swaggerParams = swaggerUI.setup(swaggerSpecs);
