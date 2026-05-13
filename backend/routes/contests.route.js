import { Router } from "express";
import {
    createContest,
    getAllContests,
    getContestById,
    getContestResults,
    registerForContest
} from "../controllers/contests.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const contestRouter = Router();

contestRouter.route("/contests").get(getAllContests).post(authenticate, createContest);
contestRouter.route("/contests/:contestId").get(getContestById);
contestRouter.route("/contests/:contestId/register").post(authenticate, registerForContest);
contestRouter.route("/contests/:contestId/results").get(getContestResults);

export default contestRouter;
