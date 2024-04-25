import { CookieOptions, NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { generateAccessToken } from "../utils/generateToken";

interface CustomCookieOptions extends CookieOptions {
  partitioned?: boolean;
}

// Define the authMiddleware
const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // If the request method is GET, skip authentication
  if (req.method === "GET") {
    return next();
  }

  // Get the access token and refresh token from the request
  const accessToken = req.signedCookies["access_token"];
  const refreshToken = req.signedCookies["refresh_token"];
  if (!accessToken || !refreshToken) {
    res.status(401).send({ message: "No token found in the request" });
    return next();
  }

  // Verify the access token
  let accessTokenVerified;
  try {
    accessTokenVerified = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as Secret
    );
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).send({ message: "Invalid access token" });
      return next();
    }
    throw error;
  }
  if (!accessTokenVerified) {
    res.status(401).send({ message: "Invalid access token" });
    return next();
  }

  // Verify the refresh token
  let refreshTokenVerified;
  try {
    refreshTokenVerified = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as Secret
    );
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).send({ message: "Invalid refresh token" });
      return next();
    }
    throw error;
  }
  if (!refreshTokenVerified) {
    res.status(401).send({ message: "Invalid refresh token" });
    return next();
  }

  // If the access token is expires, generate a new access token
  if (accessToken.exp < Date.now() / 1000 && refreshTokenVerified) {
    const newAccessToken = generateAccessToken(accessToken.userId);

    res.cookie("access_token", newAccessToken, {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      signed: true,
      partitioned: process.env.NODE_ENV === "production",
    } as CustomCookieOptions);
  }

  //* TODO: handle session

  return next();
};

export default authMiddleware;
