import { Router } from "express";
import { submitSolution } from "../controllers/submissions.controller.js";

const submissionRouter = Router();

submissionRouter.route("/submit").post(submitSolution);

export default submissionRouter;