// Import modules
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
// import cors from "cors";
import pokemonsRouter from "./routes/pokemonsRouter";
// import usersRouter from "./routes/usersRouter";

// Create an express server
const app = express();

// Enable CORS
app.use(
  cors({
    origin: "*",
  })
);

// Middleware function to log the endpoint used
const logEndpoint = (req: Request, res: Response, next: NextFunction) => {
  console.log(`Endpoint used: ${req.method} ${req.originalUrl}`);
  next();
};

// Use the middleware function logEndpoint for all incoming requests
app.use(logEndpoint);

// Parse incoming requests with JSON payloads
app.use(express.json());

// Use the routes
app.use("/apipokemons", pokemonsRouter);
// app.use("/apiusers", usersRouter);

// Start the server
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
