import { NextFunction, Request, Response } from "express";

// Middleware function to log the endpoint used
const logEndpoint = (req: Request, res: Response, next: NextFunction) => {
  console.log(`Endpoint used: ${req.method} ${req.originalUrl}`);
  next();
};

export default logEndpoint;
