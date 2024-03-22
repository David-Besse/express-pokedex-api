import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { generateAccessToken } from "../utils/generateToken";
import getErrorMessage from "../utils/getErrorMessage";
import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();

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
    let accessTokenVerified: JwtPayload | undefined | string;
    if (accessToken) {
      accessTokenVerified = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET as Secret
      );
    }

    // Verify the refresh token
    let refreshTokenVerified;
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
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        signed: true,
      });
    }

    // If the access token and refresh token are valid
    if (accessToken && refreshToken) {
      const userId = accessToken.id;

      const checkUser = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!checkUser) {
        return res.status(401).send({ message: "Invalid access token" });
      }

      const userConnected: { id: number; email: string; role: string } = {
        id: checkUser.id,
        email: checkUser.email,
        role: checkUser.role,
      };

      //* TODO: Add the user to the request object
      // req.user  = userConnected;
    }

    return next();
  } catch (error) {
    return res.status(401).send({ error: getErrorMessage(401) });
  }
};

export default authMiddleware;
