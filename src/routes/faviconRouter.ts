import { Request, Response, Router } from "express";

const faviconRouter: Router = Router();

faviconRouter.get("/favicon.ico", (req: Request, res: Response) => {
  res.sendFile("public/favicon.ico");
});

export default faviconRouter;
