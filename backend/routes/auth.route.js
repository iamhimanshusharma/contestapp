import { Router } from "express";
import { login, me, profile, signup, updateTheme } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.route("/auth/signup").post(signup);
authRouter.route("/auth/login").post(login);
authRouter.route("/auth/me").get(authenticate, me);
authRouter.route("/auth/theme").patch(authenticate, updateTheme);
authRouter.route("/auth/profile").get(authenticate, profile);

export default authRouter;
