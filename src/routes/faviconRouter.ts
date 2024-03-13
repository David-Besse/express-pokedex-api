import { Request, Response, Router } from "express";
import path from "path";

const faviconPath = path.join(__dirname, "../../public/pokeball.ico");

const faviconRouter: Router = Router();

faviconRouter.get("/favicon.ico",(req: Request, res: Response) => {
  res.sendFile(faviconPath);
});

export default faviconRouter;
