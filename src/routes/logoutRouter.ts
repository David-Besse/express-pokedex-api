/**
 * @swagger
 * paths:
 *   /api/logout:
 *     post:
 *       tags: [Authentication]
 *       summary: Logout the user
 *       description: Log out the user and send a command to the client to clear cookies, send a 200 status with a message
 *       responses:
 *         200:
 *           description: User successfully logged out.
 *           content:
 *             application/json:
 *                 message:
 *                   type: object
 *                 example:
 *                   message: true
 */


// Import necessary modules from express
import { Request, Response, Router } from "express";
// Import the authMiddleware
import authMiddleware from "../middlewares/authMiddleware";

// Create a new Router instance
const logoutRouter: Router = Router();

// Define the route for handling logout requests
logoutRouter
  .route("/api/logout")
  // Use the authMiddleware for authentication
  .post(authMiddleware, (req: Request, res: Response) => {
    // Clear the access_token cookie and send a 200 status with a message
    res
      .clearCookie("access_token")
      .clearCookie("refresh_token")
      .status(200)
      .send({
        message: true,
      });
  });

// Export the logoutRouter
export default logoutRouter;
