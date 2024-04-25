// Import necessary modules from express
import { Request, Response, Router } from "express";

// Create a new Router instance
const logoutRouter: Router = Router();

// Define the route for handling logout requests
logoutRouter.route("/api/logout").post((req: Request, res: Response) => {
  res
    .status(200)
    .send({
      message: true,
    });
});

// Export the logoutRouter
export default logoutRouter;
