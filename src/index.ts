// Import modules
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";

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
app.use(cookieParser(process.env.ACCESS_TOKEN_SECRET));

// Parse incoming requests with JSON payloads
app.use(express.json());

// Parse incoming requests for url-encoded form
app.use(express.urlencoded({ extended: true }));

// Middleware function to log the Endpoint for all incoming requests
app.use(morgan ("dev"));

// Use the routes
app.use([logoutRouter, loginRouter, pokemonsRouter]);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// genrate random secret
// console.log(require('crypto').randomBytes(256).toString('hex'));
