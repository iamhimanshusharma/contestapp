import mongoose from "mongoose";
import { Contest } from "../models/contests.model.js";
import { Problem } from "../models/problems.model.js";
import { Submission } from "../models/submissions.model.js";

const contestEndTime = (contest) => {
    return new Date(new Date(contest.startTime).getTime() + contest.durationMinutes * 60 * 1000);
};

const contestStatus = (contest) => {
    const now = new Date();
    const start = new Date(contest.startTime);
    const end = contestEndTime(contest);

    if (now < start) return "upcoming";
    if (now > end) return "ended";
    return "live";
};

const contestDto = (contest) => ({
    _id: contest._id,
    contestName: contest.contestName,
    contestId: contest.contestId,
    contestOrganizer: contest.contestOrganizer,
    problems: contest.problems,
    startTime: contest.startTime,
    durationMinutes: contest.durationMinutes,
    endTime: contestEndTime(contest),
    totalPoints: contest.totalPoints,
    registeredUsers: contest.registeredUsers,
    status: contestStatus(contest)
});

export const getAllContests = async (req, res) => {
    try {
        const contests = await Contest.find({})
            .populate("contestOrganizer", "username email")
            .populate("problems", "problemId title difficulty")
            .sort({ startTime: 1 });

        return res.status(200).json({
            success: true,
            contests: contests.map(contestDto)
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Could not load contests"
        });
    }
};

export const getContestById = async (req, res) => {
    try {
        const { contestId } = req.params;
        const contest = await Contest.findOne({ contestId })
            .populate("contestOrganizer", "username email")
            .populate("problems", "problemId title difficulty");

        if (!contest) {
            return res.status(404).json({
                success: false,
                message: "Contest not found"
            });
        }

        return res.status(200).json({
            success: true,
            contest: contestDto(contest)
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Could not load contest"
        });
    }
};

export const createContest = async (req, res) => {
    try {
        const { contestName, contestId, problems, startTime, durationMinutes, totalPoints } = req.body;
        const normalizedDuration = Number(durationMinutes);
        const normalizedPoints = Number(totalPoints);

        if (!contestName || !contestId || !Array.isArray(problems) || problems.length === 0 || !startTime || !normalizedDuration || !normalizedPoints) {
            return res.status(400).json({
                success: false,
                message: "Contest name, id, start time, duration, points, and problems are required",
            });
        }

        if (normalizedDuration > 180) {
            return res.status(400).json({
                success: false,
                message: "Contest duration cannot be more than 3 hours",
            });
        }

        const problemDocs = await Problem.find({ _id: { $in: problems } });
        if (problemDocs.length !== problems.length) {
            return res.status(400).json({
                success: false,
                message: "One or more selected problems were not found",
            });
        }

        const response = await Contest.create({
            contestName,
            contestId,
            contestOrganizer: req.user._id,
            problems,
            startTime: new Date(startTime),
            durationMinutes: normalizedDuration,
            totalPoints: normalizedPoints,
            registeredUsers: [req.user._id]
        });

        return res.status(201).json({
            success: true,
            message: "Contest creation successful",
            contest: contestDto(response)
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Contest name or id already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Contest creation failed",
        });
    }
};

export const registerForContest = async (req, res) => {
    try {
        const { contestId } = req.params;
        const contest = await Contest.findOne({ contestId });

        if (!contest) {
            return res.status(404).json({
                success: false,
                message: "Contest not found"
            });
        }

        if (new Date() >= new Date(contest.startTime)) {
            return res.status(400).json({
                success: false,
                message: "Registration is closed because the contest has started"
            });
        }

        const alreadyRegistered = contest.registeredUsers.some((userId) => userId.equals(req.user._id));
        if (!alreadyRegistered) {
            contest.registeredUsers.push(req.user._id);
            await contest.save();
        }

        return res.status(200).json({
            success: true,
            message: "Registered for contest",
            contest: contestDto(contest)
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Contest registration failed"
        });
    }
};

export const getContestResults = async (req, res) => {
    try {
        const { contestId } = req.params;
        const contest = await Contest.findOne({ contestId }).populate("problems", "problemId title");

        if (!contest) {
            return res.status(404).json({
                success: false,
                message: "Contest not found"
            });
        }

        const submissions = await Submission.find({ contest: contest._id })
            .populate("user", "username email")
            .populate("problem", "problemId title")
            .sort({ createdAt: 1 });

        const scoreboard = new Map();

        for (const submission of submissions) {
            const userId = submission.user._id.toString();
            const problemId = submission.problem._id.toString();
            const existing = scoreboard.get(userId) || {
                user: submission.user,
                score: 0,
                solved: 0,
                problems: {},
                lastSubmissionAt: submission.createdAt
            };
            const previousProblemScore = existing.problems[problemId]?.score || 0;

            if (submission.score > previousProblemScore) {
                existing.score += submission.score - previousProblemScore;
                existing.problems[problemId] = {
                    problemId: submission.problem.problemId,
                    title: submission.problem.title,
                    verdict: submission.verdict,
                    score: submission.score,
                    submittedAt: submission.createdAt
                };
                existing.solved = Object.values(existing.problems).filter((problem) => problem.score > 0).length;
            }

            existing.lastSubmissionAt = submission.createdAt;
            scoreboard.set(userId, existing);
        }

        const results = Array.from(scoreboard.values())
            .sort((a, b) => b.score - a.score || new Date(a.lastSubmissionAt) - new Date(b.lastSubmissionAt))
            .map((entry, index) => ({
                rank: index + 1,
                user: entry.user,
                score: entry.score,
                solved: entry.solved,
                problems: Object.values(entry.problems),
                lastSubmissionAt: entry.lastSubmissionAt
            }));

        return res.status(200).json({
            success: true,
            contest: contestDto(contest),
            results
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Could not load contest results"
        });
    }
};
