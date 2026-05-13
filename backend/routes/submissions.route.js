import { Router } from "express";
import { submitSolution } from "../controllers/submissions.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const submissionRouter = Router();

submissionRouter.route("/submit").post(authenticate, submitSolution);

export default submissionRouter;
