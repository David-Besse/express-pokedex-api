import { Request, Response, Router } from "express";

const mainRouter: Router = Router();

mainRouter.get("/", (req: Request, res: Response) => {
  res.send(
    "Hello welcome to Pokedex API ! This is the main route, check /api/docs for more information"
  );
});

export default mainRouter;
