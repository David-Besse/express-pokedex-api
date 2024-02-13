// Import modules
import express, { NextFunction, Request, Response, Router } from "express";
import cors from "cors";
// import cors from "cors";
import pokemonsRouter from "./routes/pokemonsRouter";
import loginRouter from "./routes/loginRouter";

// Create an express server
const app = express();
const port = process.env.PORT || 8080;
const rootRouter = Router();

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
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

// Mount the routes
rootRouter.use("/", pokemonsRouter);
rootRouter.use("/", loginRouter);

// Use the routes
app.use("/", rootRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
