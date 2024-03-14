import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { generateAccessToken } from "../utils/generateToken";
import getErrorMessage from "../utils/getErrorMessage";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // If the request path is /api/login or /api/logout, skip authentication
  if (req.path === "/api/login" || req.path === "/api/logout") {
    return next();
  }

  // Get the access token and refresh token from the request
  const accessToken = req.signedCookies["access_token"];
  const refreshToken = req.signedCookies["refresh_token"];

  if (!refreshToken || !accessToken) {
    res.status(401).send({ message: "No token found in the request" });
    return next();
  }

  // Verify the access token and refresh token
  try {
    // Verify the access token
    let accessTokenVerified: JwtPayload | string | undefined;
    if (accessToken) {
      accessTokenVerified = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET as Secret
      );
    }

    // Verify the refresh token
    let refreshTokenVerified: JwtPayload | string | undefined;
    if (refreshToken) {
      refreshTokenVerified = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as Secret
      );
    }

    // If the refresh token is not valid, send an error response
    if (!refreshTokenVerified) {
      res.status(401).send({ message: "Invalid refresh token" });
      return next();
    }

    // If the access token is not valid, generate a new access token
    if (!accessTokenVerified) {
      const newAccessToken = generateAccessToken(refreshToken.userId);

      res.cookie("access_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "strict",
        signed: true,
      });
    }

    return next();
  } catch (error) {
    return res.status(401).send({ error: getErrorMessage(401) });
  }
};

export default authMiddleware;
