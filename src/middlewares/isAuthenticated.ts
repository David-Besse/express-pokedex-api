import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  if (req.path === "/api/login") {
    console.log("Skipping authentication for /login");
    next();
    return;
  }

  const token: string | undefined = req.cookies.access_token;
  if (!token) {
    console.log("No token found:", token);
    return res.status(403).send({
      message: "No token found in the request",
    });
  }

  try {
    console.log("Checking authentication...");
    const decoded: JwtPayload | string = jwt.verify(
      token,
      process.env.JWT_SECRET as Secret
    );
    if (!decoded) {
      console.log("Invalid token");
      return res.status(403).send({
        message: "Invalid token",
      });
    }
    console.log("Token is valid");
    req.body.user = decoded;
  } catch (error) {
    return res.status(401).send({
      message: "Unauthorized",
    });
  }
  
  next();
};

export default isAuthenticated;
