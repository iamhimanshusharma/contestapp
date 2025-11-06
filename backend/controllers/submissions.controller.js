import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";
import { Problem } from "../models/problems.model.js";

const execPromise = util.promisify(exec);

export const submitSolution = async (req, res) => {
    const containerName = `run-${Date.now()}`;
    let workDir;

    try {
        const { problemId, code } = req.body;

        const problem = await Problem.findOne({ problemId });
        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found"
            });
        }

        const testcases = problem.testcases;

        workDir = path.join(process.cwd(), `sub-${Date.now()}`);
        fs.mkdirSync(workDir, { recursive: true });

        const localFile = path.join(workDir, "main.cpp");
        fs.writeFileSync(localFile, code);

        try {
            await execPromise(`docker run -d --name ${containerName} --network none sandboxed-env tail -f /dev/null`);
            await execPromise(`docker cp "${localFile}" ${containerName}:/app/main.cpp`);
            await execPromise(`docker exec ${containerName} sh -c "g++ /app/main.cpp -O2 -o /app/run"`);
        } catch (err) {
            await execPromise(`docker rm -f ${containerName}`);
            return res.status(200).json({ status: "compilation_error", error: err.stderr || err.message });
        }

        const results = [];
        let allPassed = true;

        for (const tc of testcases) {
            try {
                const safeInput = tc.input.replace(/"/g, '\\"');
                const { stdout } = await execPromise(
                    `printf "${safeInput}" | docker exec -i ${containerName} /app/run`
                );

                const output = stdout.trim();
                const passed = output === tc.expected.trim();
                results.push({ input: tc.input, output, expected: tc.expected.trim(), passed });
                if (!passed) allPassed = false;
            } catch {
                results.push({ passed: false, error: "runtime_error" });
                allPassed = false;
            }
        }

        await execPromise(`docker rm -f ${containerName}`);
        fs.rmSync(workDir, { recursive: true, force: true });

        return res.status(200).json({
            status: allPassed ? "accepted" : "wrong_answer",
            results,
        });

    } catch (err) {
        console.error(err);
        // Cleanup if folder exists
        if (workDir && fs.existsSync(workDir)) {
            fs.rmSync(workDir, { recursive: true, force: true });
        }
        // Cleanup container if exists
        try {
            await execPromise(`docker rm -f ${containerName}`);
        } catch { }
        return res.status(500).json({ status: "error", message: "Server error" });
    }
};
