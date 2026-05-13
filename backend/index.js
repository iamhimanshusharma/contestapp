import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import submissionRouter from "./routes/submissions.route.js";
import problemRouter from "./routes/problems.route.js";
import contestRouter from "./routes/contests.route.js";
import authRouter from "./routes/auth.route.js";
import communityRouter from "./routes/community.route.js";
import { dbConnect } from "./db/db.js"
import dotenv from "dotenv";
dotenv.config({});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors({
    // origin: 'http://localhost:5173'
    origin: '*'
}));

app.use("/api", submissionRouter);
app.use("/api", problemRouter);
app.use("/api", contestRouter);
app.use("/api", authRouter);
app.use("/api", communityRouter);

app.listen(5000, () => {
    dbConnect();
    console.log("Server running on port 5000")
});
