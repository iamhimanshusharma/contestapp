import { Problem } from "../models/problems.model.js"
import { TestCase } from "../models/testcases.model.js"

export const getAllProblems = async (req, res) => {
    try {
        const getProblems = await Problem.find({});

        // Compute per-tag counts
        const tagCounts = {};
        for (const problem of getProblems) {
            if (Array.isArray(problem.tags)) {
                for (const tag of problem.tags) {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                }
            }
        }

        return res.status(200).json({
            success: true,
            problems: getProblems,
            totalCount: getProblems.length,
            tagCounts
        })
    } catch (error) {
        console.log(error);
    }
}

export const getProblemById = async (req, res) => {
    try {

        const { problemId } = req.params;

        const getProblem = await Problem.findOne({ problemId: problemId });

        if (!getProblem) {
            return res.status(404).json({
                success: false,
                problemData: "Not found"
            })
        }

        const getTestcases = await TestCase.aggregate([
            { $match: { problemId: getProblem._id } },
            { $unwind: "$testcases" },
            { $match: { "testcases.testcaseType": "sample" } },
            {
                $project: {
                    _id: 0,
                    input: "$testcases.input",
                    expected: "$testcases.expected",
                    testcaseType: "$testcases.testcaseType"
                }
            }
        ]);


        if (!getTestcases) {
            return res.status(404).json({
                success: false,
                problemData: "Test case not found!"
            })
        }

        return res.status(200).json({
            success: true,
            problemData: getProblem,
            testcases: getTestcases
        })

    } catch (error) {
        console.log(error)
    }
}

export const uploadProblems = async (req, res) => {
    try {
        const { problemId, title, difficulty, description, input, output, constraints, testcases, tags } = req.body;

        if (!problemId || !title || !difficulty || !description || !input || !output || !constraints || !testcases) {
            return res.status(409).json({
                success: false,
                message: "Something is missing"
            })
        }

        const validateProblemId = await Problem.findOne({ problemId: problemId });

        if (validateProblemId) {
            return res.status(409).json({
                success: false,
                message: "Problem Already Exists",
                problem: validateProblemId
            })
        }

        const response = await Problem.create({
            problemId,
            title,
            difficulty,
            description,
            input,
            output,
            constraints,
            tags: Array.isArray(tags) ? tags : [],
            createdby: req.user?._id
        })

        if (!response) {
            return res.status(410).json({
                success: false,
                message: "Problem upload failed"
            })
        }

        const testcaseResponse = await TestCase.create({
            problemId: response._id,
            testcases: testcases
        })

        if (!testcaseResponse) {
            return res.status(410).json({
                success: false,
                message: "Testcase upload failed"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Problem uploaded Successfully",
            problem: response
        })

    } catch (error) {
        console.log(error);
    }
}
