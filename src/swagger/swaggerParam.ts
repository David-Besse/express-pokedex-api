import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const swagOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pokedex API",
      version: "1.0.0",
      description:
        "This is a simple restful API for my Angular Pokedex project",
      contact: {
        name: "David Besse",
        url: "https://github.com/David-Besse/express-pokedex-api",
        email: "davidb.webdev@gmail.com",
      },
    },
    servers: [
      {
        url: `${
          process.env.NODE_ENV === "development"
            ? process.env.SERVER_URL + ":" + process.env.PORT
            : process.env.SERVER_URL_P + ":" + process.env.PORT_P
        }`,
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "access_token",
        },
        cookieRefresh: {
          type: "apiKey",
          in: "cookie",
          name: "refresh_token",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpecs = swaggerJSDoc(swagOptions);
const swaggerOptions = {
  customCss:
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.10/swagger-ui.min.css",
};

export const swaggerParams = swaggerUI.setup(swaggerSpecs, swaggerOptions);
