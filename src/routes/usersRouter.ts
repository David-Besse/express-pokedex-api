import { Request, Response, Router } from "express";

import { User } from "../models/user";

import { getErrorMessage } from "../utils/getErrorMessage";

import { users } from "../../data/users.json";

const usersMap: Map<number, User> = new Map(
  users.map((user) => [user.id, user])
);

const usersRouter = Router();

usersRouter.get("/apiusers/:email", (req: Request, res: Response) => {
  const userEmail: string = req.params.email;

  const userFound: User[] = [...usersMap.values()].filter(
    (user) => user.email === userEmail
  );

  if (userFound.length < 1) {
    res.status(404).json({ message: getErrorMessage(404) });
    return;
  }

  res.status(200).json(userFound[0]);
});

export default usersRouter;
