// Import necessary modules from express
import { CookieOptions, Request, Response, Router } from "express";
// Import the authMiddleware
import authMiddleware from "../middlewares/authMiddleware";

interface CustomCookieOptions extends CookieOptions {
  partitioned?: boolean;
}

// Create a new Router instance
const logoutRouter: Router = Router();

// Define the route for handling logout requests
logoutRouter
  .route("/api/logout")
  // Use the authMiddleware for authentication
  .post(authMiddleware, (req: Request, res: Response) => {
    // Clear the access_token cookie and send a 200 status with a message
    res
      .clearCookie("access_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        signed: true,
        partitioned: true,
      } as CustomCookieOptions)
      .clearCookie("refresh_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        signed: true,
        partitioned: true,
      } as CustomCookieOptions)
      .status(200)
      .send({
        message: true,
      });
  });

// Export the logoutRouter
export default logoutRouter;
