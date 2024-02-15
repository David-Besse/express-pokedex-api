import { Request, Response, Router } from "express";
import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";

import { User } from "../models/user";

import { users } from "../../data/users.json";

dotenv.config();

const usersMap: Map<number, User> = new Map(
  users.map((user) => [user.id, user])
);

const loginRouter: Router = Router();

loginRouter.post("/api/login", async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;

  const existingUser: User | undefined = [...usersMap.values()].find(
    (user) => user.email === email
  );

  if (!existingUser || existingUser.password !== password) {
    return res.status(401).json([]);
  }

  let token;

  try {
    //Creating jwt token
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
      },
      process.env.ACCESS_TOKEN_SECRET as Secret,
      { expiresIn: "1h" }
    );
  } catch (err) {
    console.log("error in generating token:", err);
    return res.status(400).json([]);
  }

  res
    .cookie("access_token", token, {
      // this is required to prevent XSS
      httpOnly: true,
      // this is required to prevent CSRF
      sameSite: "none",
      // this is required to prevent XSS (disabled in development mode)
      // secure: true,
    })
    .status(200)
    .json({ email: existingUser.email }); // dont forget to send an empty array
});

export default loginRouter;
