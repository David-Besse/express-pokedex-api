/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *       required:
 *         - email
 *         - password
 *       example:
 *         email: admin@pkm.com
 *         password: AdminPKM2024!
 *   responses:
 *     200:
 *       email:
 *         type: string
 *         format: email
 *       example:
 *         email: admin@pkm.com
 */

/**
 * @swagger
 * paths:
 *   /api/login:
 *     post:
 *       tags: [Login]
 *       summary: Login the user
 *       description: User can login to the application with email and password, he will receive an access token and a refresh token
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       security: []
 *       responses:
 *         200:
 *           description:             
 *             User Successfully authenticated.
 *             The session ID is returned in a cookie named `access_token`. You need to include this cookie in subsequent requests.
 *             Another cookie named `refresh_token` is returned. You need to include this cookie in subsequent requests.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/responses/200'
 *           headers:
 *             Set-Cookie:
 *               schema:
 *                 type: string
 *                 example: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6Ik...; Path=/; HttpOnly; Secure;
 *                 description: The session ID is returned in a cookie named `access_token`.
 *             Set-Cookie-2:
 *               schema:
 *                 type: string
 *                 example: refresh_token=Y3JldCIsImlhdCI6MT08TcqZjYQyQ0Uw0...; Path=/; HttpOnly; Secure;
 *                 description: Another cookie named `refresh_token`.
 * 
 */

// Importing necessary modules from express framework and other libraries
import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken";

// Importing User model and Users data
import { User } from "../models/user";

const prisma: PrismaClient = new PrismaClient();

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
  async (req: Request, res: Response) => {
    // Validating the request and checking for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extracting email and password from the request body
    const { email, password }: { email: string; password: string } = req.body;

    // Checking if the user exists in the Users data
    const findUser: User | null = await prisma.user.findUnique({
      where: { email: email },
    });

    // Handling invalid email
    if (!findUser) {
      return res.status(401).json({ message: "Invalid email" });
    }

    // Checking if the password provided matches the stored password using bcrypt
    const isPasswordCorrect: boolean = await bcrypt.compare(
      password,
      findUser.password
    );

    // Handling invalid password
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Creating a jwt token for authentication
    const accessToken = generateAccessToken(findUser.id);
    const refreshToken = generateRefreshToken(findUser.id);

    // Setting the jwt token in a cookie and sending a success response
    res
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        signed: true,
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        signed: true,
      })
      .status(200)
      .json({ email: findUser.email });

    return;
  }
);

// Exporting the loginRouter
export default loginRouter;
