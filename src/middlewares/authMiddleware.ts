import { CookieOptions, NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { generateAccessToken } from "../utils/generateToken";

// interface CustomCookieOptions extends CookieOptions {
//   partitioned?: boolean;
// }

interface CustomRequest extends Request {
  user?: { userId: string };
}

// Define the authMiddleware
const authMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as Secret,
      (error, decodedToken) => {
        if (error) {
          res.status(401).json({ message: "Invalid token" });
          return next();
        }
        req.user = decodedToken as CustomRequest["user"];
        return next();
      }
    );
  }

  if (!token) {
    res.status(401).json({ message: "No token found in the request" });
    return next();
  }
};

export default authMiddleware;
