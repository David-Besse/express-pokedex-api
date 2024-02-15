// Import modules
import express, { Router } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logEndpoint from "./middlewares/logEndpoint";
import isAuthenticated from "./middlewares/isAuthenticated";

import pokemonsRouter from "./routes/pokemonsRouter";
import loginRouter from "./routes/loginRouter";

// Create an express server
const app = express();
const port = process.env.PORT || 8080;

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

// Parse cookies
app.use(cookieParser());

// Parse incoming requests with JSON payloads
app.use(express.json());

// Parse incoming requests with urlencoded payloads (for form data)
app.use(express.urlencoded({ extended: true }));

// Middleware function to log the Endpoint for all incoming requests
app.use(logEndpoint);

// Middleware function to check if the user is authenticated when accessing /api
// app.use(isAuthenticated);

// Use the routes
app.use(loginRouter);
app.use(pokemonsRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
