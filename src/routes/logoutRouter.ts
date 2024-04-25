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
      .status(200)
      .clearCookie("access_token")
      .clearCookie("refresh_token")
      .send({
        message: true,
      });
  });

// Export the logoutRouter
export default logoutRouter;
