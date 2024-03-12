import jwt, { JwtPayload } from "jsonwebtoken";

/**
 * Generate access token with payload and expiration time
 * @param payload data to be stored in the access token
 * @returns access token with the payload and expiration time
 */
export const generateAccessToken = (payload: any): string => {
  return jwt.sign(
    { userId: payload },
    process.env.ACCESS_TOKEN_SECRET as jwt.Secret,
    {
      expiresIn: "1h",
    }
  );
};

/**
 * Generate refresh token with payload and expiration time
 * @param payload data to be stored in the refresh token
 * @returns refresh token with the payload and expiration time
 */
export const generateRefreshToken = (payload: any): string => {
  return jwt.sign(
    { userId: payload },
    process.env.REFRESH_TOKEN_SECRET as jwt.Secret,
    {
      expiresIn: "1y",
    }
  );
};
