import { Problem } from "../models/problems.model.js"
import { TestCase } from "../models/testcases.model.js"

export const getAllProblems = async (req, res) => {
    try {

        const getProblems = await Problem.find({});

        return res.status(200).json({
            success: true,
            problems: getProblems
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

        return res.status(200).json({
            success: true,
            problemData: getProblem
        })

    } catch (error) {
        console.log(error)
    }
}

export const uploadProblems = async (req, res) => {
    try {
        const { problemId, title, difficulty, description, input, output, constraints, testcases } = req.body;

        if (!problemId || !title || !difficulty || !description || !input || !output || !constraints || !testcases) {
            return res.status(409).json({
                success: false,
                message: "Something is missiong"
            })
        }

        const validateProblemId = await Problem.findOne({ problemId: problemId });

        if (validateProblemId) {
            return res.status(200).json({
                success: true,
                message: "Problem Already Exists",
                problem: validateProblemId
            })
        }

        const response = await Problem.create({
            problemId, title, difficulty, description, input, output, constraints, testcases
        })

        if (!response) {
            return res.status(410).json({
                success: false,
                message: "Problem upload failed"
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