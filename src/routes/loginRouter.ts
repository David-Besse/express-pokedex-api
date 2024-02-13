import { Request, Response, Router } from "express";

import { User } from "../models/user";

import { users } from "../../data/users.json";

const usersMap: Map<number, User> = new Map(
  users.map((user) => [user.id, user])
);

const loginRouter: Router = Router();

loginRouter.post("/login", (req: Request, res: Response) => {
  const userEmail: string = req.body.email;
  const userPassword: string = req.body.password;

  const userFound: User[] = [...usersMap.values()].filter(
    (user) => user.email === userEmail && user.password === userPassword
  );

  if (userFound.length < 1) {
    res.status(404).json(userFound);
    return;
  }

  res.status(200).json(userEmail);
});

export default loginRouter;
