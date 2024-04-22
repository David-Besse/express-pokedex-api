// Import modules
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import { swaggerParams } from "./swagger/swaggerParam";
import pokemonsRouter from "./routes/pokemonsRouter";
import loginRouter from "./routes/loginRouter";
import logoutRouter from "./routes/logoutRouter";
import faviconRouter from "./routes/faviconRouter";

// Load environment variables
dotenv.config();

// Create an express server
const app = express();
app.disable("x-powered-by");

app.use(express.static("public"));

const port =
  process.env.NODE_ENV === "production"
    ? process.env.PORT_P
    : process.env.PORT;

// Enable CORS
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? (process.env.CLIENT_URL_P as string)
      : (process.env.CLIENT_URL as string),
  credentials: true,
};
app.use(cors(corsOptions));

// Parse cookies for all incoming requests
app.use(cookieParser(process.env.COOKIE_SECRET));

// Parse incoming requests with JSON payloads
app.use(express.json());

// Parse incoming requests for url-encoded form
app.use(express.urlencoded({ extended: true }));

// Middleware function to log the Endpoint for all incoming requests
app.use(
  morgan(
    `${
      process.env.NODE_ENV === "production"
        ? (process.env.MORGAN_MODE_P as string)
        : (process.env.MORGAN_MODE as string)
    }`
  )
);

// Use the routes
app.use([logoutRouter, loginRouter, pokemonsRouter, faviconRouter]);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerParams);

// Start the server
app.listen(port, () => {
  console.log(
    `Server running on ${
      process.env.NODE_ENV === "production"
        ? process.env.SERVER_URL_P
        : process.env.SERVER_URL
    }:${port}`
  );
});

// Export the app (dont forget this to deploy on Vercel as a serverless function)
export default app;

// generate random secret
// console.log(require('crypto').randomBytes(256).toString('hex'));
