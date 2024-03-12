// Import modules
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

import pokemonsRouter from "./routes/pokemonsRouter";
import loginRouter from "./routes/loginRouter";
import logoutRouter from "./routes/logoutRouter";
import mainRouter from "./routes/mainRouter";

// Load environment variables
dotenv.config();

// Create an express server
const app = express();
app.disable("x-powered-by");

const port =
  process.env.NODE_ENV === "development"
    ? process.env.PORT
    : process.env.PORT_P;

// Enable CORS
app.use(
  cors({
    origin: `${
      process.env.NODE_ENV === "development"
        ? process.env.CLIENT_URL
        : process.env.CLIENT_URL_P
    }`,
    credentials: true,
  })
);

// Parse cookies for all incoming requests
app.use(cookieParser(process.env.COOKIE_SECRET));

// Parse incoming requests with JSON payloads
app.use(express.json());

// Parse incoming requests for url-encoded form
app.use(express.urlencoded({ extended: true }));

// Middleware function to log the Endpoint for all incoming requests
app.use(
  morgan(
    `${process.env.NODE_ENV === "development"
      ? process.env.MORGAN_MODE
      : process.env.MORGAN_MODE_P}`
  )
);

// Use the routes
// app.use([logoutRouter, loginRouter, pokemonsRouter, mainRouter]);
app.use([mainRouter]);

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
            ? process.env.SERVER_URL
            : process.env.SERVER_URL_P
        }:${port}`,
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerJSDoc(swagOptions))
);

// Start the server
app.listen(port, () => {
  console.log(
    `Server running on ${
      process.env.NODE_ENV === "development"
        ? process.env.SERVER_URL
        : process.env.SERVER_URL_P
    }:${port}`
  );
});

// Export the app (dont forget this to deploy on Vercel as a serverless function)
export default app;

// genrate random secret
// console.log(require('crypto').randomBytes(256).toString('hex'));
