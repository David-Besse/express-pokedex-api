// Importing necessary modules from express framework and other libraries
import {
  Request,
  Response,
  Router,
  CookieOptions,
  NextFunction,
} from "express";
import { body, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken";

// Importing User model and Users data
import { User } from "../models/user";

const prisma: PrismaClient = new PrismaClient();

interface CustomCookieOptions extends CookieOptions {
  partitioned?: boolean;
}

// Creating a new router
const loginRouter: Router = Router();

// Handling POST request to /api/login
loginRouter.post(
  "/api/login",
  // Validating request body using express-validator
  [
    body("email").trim().isEmail().withMessage("Email: is not valid"),
    body("password")
      .trim()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password: is not valid"),
  ],
  // Handling the asynchronous login operation
  async (req: Request, res: Response, next: NextFunction) => {
    // Validating the request and checking for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extracting email and password from the request body
    const { email, password }: { email: string; password: string } = req.body;

    // Checking if the user exists in the Users data
    let existingUser: User | null;
    try {
      existingUser = await prisma.user.findFirst({
        where: { email: email },
      });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }

    // Handling invalid user
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email" });
    }

    // Checking if the password provided matches the stored password using bcrypt
    const isPasswordMatch: boolean = await bcrypt.compare(
      password,
      existingUser.password
    );

    // Handling invalid password
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Creating a jwt token for authentication
    const accessToken = generateAccessToken(existingUser.id);
    // const refreshToken = generateRefreshToken(existingUser.id);

    // Setting the jwt token in a cookie and sending a success response
    res
      // .cookie("access_token", accessToken, {
      // httpOnly: process.env.NODE_ENV === "production",
      // secure: process.env.NODE_ENV === "production",
      // sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
      // signed: true,
      // partitioned: process.env.NODE_ENV === "production",
      // maxAge: 1000 * 60 * 60,
      // } as CustomCookieOptions)
      // .cookie("refresh_token", refreshToken, {
      // httpOnly: process.env.NODE_ENV === "production",
      // secure: process.env.NODE_ENV === "production",
      // sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
      // signed: true,
      // partitioned: process.env.NODE_ENV === "production",
      // maxAge: 1000 * 60 * 60,
      // } as CustomCookieOptions)
      .status(200)
      .json({ email: existingUser.email, accessToken: accessToken });

    return;
  }
);

// Exporting the loginRouter
export default loginRouter;
