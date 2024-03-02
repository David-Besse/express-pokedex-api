// Importing necessary modules from express framework and other libraries
import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Importing User model and Users data
import { User } from "../models/user";
import Users from "../../data/users";

// Creating a new router
const loginRouter: Router = Router();

// Handling POST request to /api/login
loginRouter.post(
  "/api/login",
  // Validating request body using express-validator
  [
    body("email").trim().isEmail().withMessage("Sanitized email: is not valid"),
    body("password")
      .trim()
      .isLength({ min: 12 })
      .withMessage("sanitized password: is not valid"),
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
    const checkUser: User | undefined = Users.find(
      (user) => user.email === email
    );

    // Handling invalid email
    if (!checkUser) {
      return res.status(401).json({ message: "Invalid email" });
    }

    // Checking if the password provided matches the stored password using bcrypt
    const isPasswordCorrect: boolean = await bcrypt.compare(
      password,
      checkUser.password
    );

    // Handling invalid password
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Creating a jwt token for authentication
    const token = jwt.sign(
      { id: checkUser.id },
      process.env.ACCESS_TOKEN_SECRET as jwt.Secret
    );

    // Setting the jwt token in a cookie and sending a success response
    return res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "strict",
        signed: true,
      })
      .status(200)
      .json({ email: checkUser.email });
  }
);

// Exporting the loginRouter
export default loginRouter;