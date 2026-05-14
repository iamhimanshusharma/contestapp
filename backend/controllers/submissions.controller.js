import { exec, spawn } from "child_process";
import util from "util";
import { Problem } from "../models/problems.model.js";
import { TestCase } from "../models/testcases.model.js";
import { Contest } from "../models/contests.model.js";
import { Submission } from "../models/submissions.model.js";
import { containerName } from "../constants.js"
import { containerExists, containerStart, createContainer } from "../scripts/dockerCommands.js";

const execPromise = util.promisify(exec);

const languageConfig = {
    cpp: {
        file: "main.cpp",
        compile: "g++ main.cpp -O2 -o run",
        run: "./run"
    },
    c: {
        file: "main.c",
        compile: "gcc main.c -O2 -o run",
        run: "./run"
    },
    java: {
        file: "Main.java",
        compile: "javac Main.java",
        run: "java Main"
    },
    python: {
        file: "main.py",
        compile: null,
        run: "python3 main.py"
    },
    javascript: {
        file: "main.js",
        compile: null,
        run: "node main.js"
    }
};

async function ensureSandbox() {
    try {
        // Check if container exists
        const { stdout } = await execPromise(containerExists);
        const isRunning = stdout.trim() === "true";

        if (!isRunning) {
            await execPromise(containerStart);
        }
    } catch (err) {
        // Container does not exists, create new
        await execPromise(createContainer);
    }
}

async function cleanupSandboxFolder(folderName) {
    try {
        await execPromise(`docker exec ${containerName} rm -rf /app/${folderName}`);
    } catch (error) {
        // Cleanup is best effort; the original execution error is more useful to return.
    }
}

function dockerExecWithInput(args, input = "") {
    return new Promise((resolve, reject) => {
        const child = spawn("docker", args);
        let stdout = "";
        let stderr = "";

        child.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        child.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        child.on("error", (error) => {
            reject({ stderr: error.message });
        });

        child.on("close", (code) => {
            if (code === 0) {
                resolve({ stdout, stderr });
            } else {
                reject({ stdout, stderr, code });
            }
        });

        child.stdin.write(input);
        child.stdin.end();
    });
}

export const submitSolution = async (req, res) => {
    const isolatedFolderName = `sub-${Date.now()}`;
    let testcases;
    let contest = null;
    let problem;

    try {
        const { type, language, problemId, code, contestId } = req.body;

        const lang = languageConfig[language];
        if (!lang) {
            return res.status(400).json({
                success: false,
                message: "Unsupported language"
            });
        }

        problem = await Problem.findOne({ problemId });
        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found"
            });
        }

        if (contestId) {
            contest = await Contest.findOne({ contestId });

            if (!contest) {
                return res.status(404).json({
                    success: false,
                    message: "Contest not found"
                });
            }

            const now = new Date();
            const start = new Date(contest.startTime);
            const end = new Date(start.getTime() + contest.durationMinutes * 60 * 1000);
            const isRegistered = contest.registeredUsers.some((userId) => userId.equals(req.user._id));
            const contestHasProblem = contest.problems.some((contestProblemId) => contestProblemId.equals(problem._id));

            if (!isRegistered) {
                return res.status(403).json({
                    success: false,
                    message: "Register for this contest before it starts to submit"
                });
            }

            if (!contestHasProblem) {
                return res.status(400).json({
                    success: false,
                    message: "This problem is not part of the contest"
                });
            }

            if (now < start) {
                return res.status(400).json({
                    success: false,
                    message: "Contest has not started yet"
                });
            }

            if (now > end) {
                return res.status(400).json({
                    success: false,
                    message: "Contest is over"
                });
            }
        }

        if (type === "custom") {
            const { customInput = "", customExpected = "" } = req.body;

            try {
                await ensureSandbox();
                await execPromise(`docker exec ${containerName} mkdir -p /app/${isolatedFolderName}`);
                await dockerExecWithInput(
                    ["exec", "-i", containerName, "sh", "-c", `cat > /app/${isolatedFolderName}/${lang.file}`],
                    code
                );
                if (lang.compile) {
                    await execPromise(`docker exec ${containerName} sh -c "cd /app/${isolatedFolderName} && ${lang.compile}"`);
                }
            } catch (err) {
                await cleanupSandboxFolder(isolatedFolderName);
                return res.status(200).json({
                    success: false,
                    message: "Compilation error",
                    error: err.stderr || err.message || "Could not compile code"
                });
            }

            try {
                const { stdout } = await dockerExecWithInput(
                    ["exec", "-i", containerName, "sh", "-c", `cd /app/${isolatedFolderName} && timeout 5s ${lang.run}`],
                    customInput
                );
                const output = stdout.trim();
                const expected = customExpected.trim();
                const passed = expected !== "" ? output === expected : null; // null = no expected provided

                await cleanupSandboxFolder(isolatedFolderName);
                return res.status(200).json({
                    success: true,
                    results: [{ input: customInput, output, expected, passed }]
                });
            } catch (err) {
                await cleanupSandboxFolder(isolatedFolderName);
                return res.status(200).json({
                    success: false,
                    message: "Runtime error",
                    error: err.stderr || err.stdout || "Program did not finish successfully"
                });
            }
        }

        if (type === "sample") {
            testcases = await TestCase.aggregate([
                { $match: { problemId: problem._id } },
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
        } else {
            const getTestcases = await TestCase.findOne({ problemId: problem._id });
            if (!getTestcases) {
                return res.status(404).json({
                    success: false,
                    message: "Testcases not found"
                });
            }
            testcases = getTestcases.testcases;
        }

        try {

            //check if container is running or not, if not then start it, if not create then create it
            await ensureSandbox();

            //create a temporary folder on container
            await execPromise(`docker exec ${containerName} mkdir -p /app/${isolatedFolderName}`);

            await dockerExecWithInput(
                ["exec", "-i", containerName, "sh", "-c", `cat > /app/${isolatedFolderName}/${lang.file}`],
                code
            );

            //compiling the code
            if (lang.compile) {
                await execPromise(
                    `docker exec ${containerName} sh -c "cd /app/${isolatedFolderName} && ${lang.compile}"`
                );
            }
        } catch (err) {
            await cleanupSandboxFolder(isolatedFolderName);
            return res.status(200).json({
                success: false,
                message: "Compilation error",
                error: err.stderr || err.message || "Could not compile code"
            });
        }

        const results = [];
        let allPassed = true;
        let failedTestcase = null;

        for (const tc of testcases) {
            try {
                const { stdout } = await dockerExecWithInput(
                    ["exec", "-i", containerName, "sh", "-c", `cd /app/${isolatedFolderName} && timeout 5s ${lang.run}`],
                    tc.input
                );

                const output = stdout.trim();
                const passed = output === tc.expected.trim();

                if (!passed && !failedTestcase) {
                    failedTestcase = {
                        input: tc.input,
                        output,
                        expected: tc.expected.trim(),
                        passed: false
                    };
                }

                if (tc.testcaseType.trim() === "sample") results.push({ input: tc.input, output, expected: tc.expected.trim(), passed });
                if (!passed) allPassed = false;

            } catch (err) {
                await cleanupSandboxFolder(isolatedFolderName);
                return res.status(200).json({
                    success: false,
                    message: "Runtime error",
                    error: err.stderr || err.stdout || "Program did not finish successfully"
                })
            }
        }

        await cleanupSandboxFolder(isolatedFolderName);


        if (type === "hidden") {
            const score = contest && allPassed ? contest.totalPoints / contest.problems.length : allPassed ? 1 : 0;

            await Submission.create({
                user: req.user._id,
                problem: problem._id,
                contest: contest?._id || null,
                language,
                code,
                verdict: allPassed ? "Accepted" : "Wrong Answer",
                passed: allPassed,
                score
            });
        }

        return res.status(200).json({
            success: allPassed,
            message: allPassed ? "Accepted" : "Wrong Answer",
            results,
            failedTestcase
        });

    } catch (err) {

        await cleanupSandboxFolder(isolatedFolderName);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.stderr || err.message || "Execution failed"
        });
    }
};

export const getSubmissionsByProblemId = async (req, res) => {
    try {
        const { problemId } = req.params;
        
        const problem = await Problem.findOne({ problemId });
        if (!problem) {
            return res.status(404).json({ success: false, message: "Problem not found" });
        }

        const submissions = await Submission.find({ 
            user: req.user._id, 
            problem: problem._id 
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            submissions
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
};
