import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/users.model.js";
import { Submission } from "../models/submissions.model.js";

const createToken = (user) => {
    return jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || "dev-secret",
        { expiresIn: "7d" }
    );
};

const publicUser = (user) => ({
    _id: user._id,
    email: user.email,
    username: user.username,
    theme: user.theme || "light",
    createdAt: user.createdAt
});

export const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();

        if (!normalizedEmail || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        if (!normalizedEmail.includes("@")) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid email address"
            });
        }

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        const usernameBase = normalizedEmail.split("@")[0];
        let username = usernameBase;
        let suffix = 1;

        while (await User.findOne({ username })) {
            username = `${usernameBase}${suffix}`;
            suffix += 1;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email: normalizedEmail,
            username,
            password: hashedPassword
        });

        return res.status(201).json({
            success: true,
            message: "Signup successful",
            token: createToken(user),
            user: publicUser(user)
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Signup failed"
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();

        if (!normalizedEmail || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token: createToken(user),
            user: publicUser(user)
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};

export const me = async (req, res) => {
    return res.status(200).json({
        success: true,
        user: publicUser(req.user)
    });
};

export const updateTheme = async (req, res) => {
    try {
        const { theme } = req.body;

        if (!["light", "dark"].includes(theme)) {
            return res.status(400).json({
                success: false,
                message: "Theme must be light or dark"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { theme },
            { new: true }
        ).select("-password");

        return res.status(200).json({
            success: true,
            user: publicUser(user)
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Could not update theme"
        });
    }
};

export const profile = async (req, res) => {
    try {
        const submissions = await Submission.find({ user: req.user._id })
            .populate("problem", "problemId title difficulty")
            .populate("contest", "contestId contestName totalPoints startTime")
            .sort({ createdAt: -1 });

        const solvedMap = new Map();
        const contestMap = new Map();

        for (const submission of submissions) {
            if (submission.contest) {
                const contestKey = submission.contest._id.toString();
                const existingContest = contestMap.get(contestKey) || {
                    contest: submission.contest,
                    score: 0,
                    solved: 0,
                    problems: {}
                };
                const problemKey = submission.problem._id.toString();
                const previousScore = existingContest.problems[problemKey]?.score || 0;

                if (submission.score > previousScore) {
                    existingContest.score += submission.score - previousScore;
                    existingContest.problems[problemKey] = {
                        problemId: submission.problem.problemId,
                        title: submission.problem.title,
                        score: submission.score,
                        verdict: submission.verdict,
                        submittedAt: submission.createdAt
                    };
                    existingContest.solved = Object.values(existingContest.problems)
                        .filter((problem) => problem.score > 0).length;
                }

                contestMap.set(contestKey, existingContest);
            }

            if (!submission.passed) continue;

            const problemKey = submission.problem._id.toString();
            if (!solvedMap.has(problemKey)) {
                solvedMap.set(problemKey, {
                    problem: submission.problem,
                    solvedAt: submission.createdAt,
                    language: submission.language,
                    code: submission.code,
                    contest: submission.contest,
                    submissions: []
                });
            }
        }

        for (const submission of submissions) {
            const problemKey = submission.problem._id.toString();
            if (!solvedMap.has(problemKey)) continue;

            solvedMap.get(problemKey).submissions.push({
                _id: submission._id,
                language: submission.language,
                verdict: submission.verdict,
                passed: submission.passed,
                score: submission.score,
                code: submission.code,
                submittedAt: submission.createdAt,
                contest: submission.contest
            });
        }

        const contestScores = Array.from(contestMap.values())
            .map((entry) => ({
                contest: entry.contest,
                score: entry.score,
                solved: entry.solved,
                problems: Object.values(entry.problems)
            }))
            .sort((a, b) => new Date(a.contest.startTime) - new Date(b.contest.startTime));

        return res.status(200).json({
            success: true,
            user: publicUser(req.user),
            stats: {
                totalSubmissions: submissions.length,
                solvedProblems: solvedMap.size,
                contestsAttempted: contestScores.length
            },
            solvedProblemIds: Array.from(solvedMap.values()).map((entry) => entry.problem.problemId),
            solvedProblems: Array.from(solvedMap.values()),
            contestScores,
            submissions
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Could not load profile"
        });
    }
};
