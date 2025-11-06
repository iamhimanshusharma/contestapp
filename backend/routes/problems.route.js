import { Router } from "express";
import { getAllProblems, getProblemById, uploadProblems } from "../controllers/problems.controller.js";

const problemRouter = Router();

problemRouter.route("/problems").get(getAllProblems);
problemRouter.route("/problems/:problemId").get(getProblemById);
problemRouter.route("/problems").post(uploadProblems);


export default problemRouter;