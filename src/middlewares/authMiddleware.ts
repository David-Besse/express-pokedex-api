import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  
  if (!req.signedCookies["access_token"]) {
    res.status(401).send({ error: "No token found in the request" });
    return next();
  }

  try {
    const cookie = req.signedCookies["access_token"];

    if (!cookie) {
      return res.status(401).send({
        error: "No token found in the request",
      });
    }

    try {
      const decoded: JwtPayload | string = jwt.verify(
        cookie,
        process.env.ACCESS_TOKEN_SECRET as Secret
      );

      if (!decoded) {
        return res.status(401).send({
          message: "Invalid token",
        });
      }
      next();
    } catch (error) {
      return res.status(401).send({
        message: "Invalid token",
      });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
