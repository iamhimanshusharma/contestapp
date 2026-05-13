import { Router } from "express";
import { getAllProblems, getProblemById, uploadProblems } from "../controllers/problems.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const problemRouter = Router();

problemRouter.route("/problems").get(getAllProblems);
problemRouter.route("/problems/:problemId").get(getProblemById);
problemRouter.route("/problems").post(authenticate, uploadProblems);


export default problemRouter;
