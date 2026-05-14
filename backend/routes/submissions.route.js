import { Router } from "express";
import { submitSolution, getSubmissionsByProblemId } from "../controllers/submissions.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const submissionRouter = Router();

submissionRouter.route("/submit").post(authenticate, submitSolution);
submissionRouter.route("/submissions/:problemId").get(authenticate, getSubmissionsByProblemId);

export default submissionRouter;
