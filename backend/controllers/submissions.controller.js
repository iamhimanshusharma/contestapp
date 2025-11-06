import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";
import { Problem } from "../models/problems.model.js";

const execPromise = util.promisify(exec);

function winPath(p) {
    return p.replace(/\\/g, "/").replace(/^([A-Za-z]):/, (m, d) => `/${d.toLowerCase()}`);
}

export const submitSolution = async (req, res) => {
    try {
        const { problemId, code } = req.body;

        const problem = await Problem.findOne({ problemId });
        if (!problem) return res.status(404).json({ status: "error", message: "Problem not found" });

        const testcases = problem.testcases;
        const workDir = path.join(process.cwd(), "judge", `sub-${Date.now()}`);
        fs.mkdirSync(workDir, { recursive: true });
        fs.writeFileSync(path.join(workDir, "main.cpp"), code);

        const mountPath = winPath(workDir);
        const containerName = `run-${Date.now()}`;

        // START CONTAINER (single-line)
        await execPromise(
            `docker run -d --name ${containerName} --network none -v ${mountPath}:/app sandboxed-env tail -f /dev/null`
        );

        // COMPILE
        try {
            await execPromise(
                `docker exec ${containerName} sh -c "g++ /app/main.cpp -O2 -o /app/run"`
            );
        } catch (err) {
            await execPromise(`docker rm -f ${containerName}`);
            return res.status(200).json({ status: "compilation_error", error: err.stderr || err.message });
        }

        // RUN TESTS
        let results = [], allPassed = true;
        for (const tc of testcases) {
            const safeInput = tc.input.replace(/"/g, '\\"');

            const { stdout } = await execPromise(
                `printf "${safeInput}" | docker exec -i ${containerName} /app/run`
            );

            const output = stdout.trim();
            const expected = tc.expected.trim();
            const passed = output === expected;

            results.push({ input: tc.input, output, expected, passed });
            if (!passed) allPassed = false;
        }

        // CLEANUP
        await execPromise(`docker rm -f ${containerName}`);
        fs.rmSync(workDir, { recursive: true, force: true });

        return res.status(200).json({
            status: allPassed ? "accepted" : "wrong_answer",
            results
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: "error", message: "Server error" });
    }
};
