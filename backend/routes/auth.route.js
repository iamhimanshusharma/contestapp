import { Router } from "express";
import { login, me, signup } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.route("/auth/signup").post(signup);
authRouter.route("/auth/login").post(login);
authRouter.route("/auth/me").get(authenticate, me);

export default authRouter;
