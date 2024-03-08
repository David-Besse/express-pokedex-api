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

// Load environment variables
dotenv.config();

// Create an express server
const app = express();
app.disable("x-powered-by");

const port = process.env.PORT || 8080;

// Enable CORS
app.use(
  cors({
    origin: `${
      process.env.NODE_ENV === "development"
        ? "http://localhost:4200"
        : "https://pokedex-david-besse.vercel.app"
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
app.use(morgan("dev"));

// Use the routes
app.use([logoutRouter, loginRouter, pokemonsRouter]);

const swagOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pokedex API",
      version: "1.0.0",
      description: "This is a simple restful API for my Angular Pokedex project",
      contact: {
        name: "David Besse",
        url: "https://github.com/David-Besse/express-pokedex-api",
        email: "davidb.webdev@gmail.com",
      },
    },
    servers: [
      {
        url: `${process.env.SERVER_URI}:${port}`,
        description: "Main server",
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
  console.log(`Server running on ${process.env.SERVER_URI}:${port}`);
});

// genrate random secret
// console.log(require('crypto').randomBytes(256).toString('hex'));
