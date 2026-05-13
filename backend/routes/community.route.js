import { Router } from "express";
import {
    createCommunityPost,
    getCommunityPosts,
    replyToCommunityPost
} from "../controllers/community.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const communityRouter = Router();

communityRouter.route("/community").get(getCommunityPosts).post(authenticate, createCommunityPost);
communityRouter.route("/community/:postId/replies").post(authenticate, replyToCommunityPost);

export default communityRouter;
