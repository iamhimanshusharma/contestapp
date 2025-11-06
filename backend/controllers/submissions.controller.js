import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";

const execPromise = util.promisify(exec);

export const submitSolution = async (req, res) => {
    try {
        const { problemId, code } = req.body;

        const workDir = path.join(process.cwd(), `testcases/${problemId}`);
        fs.mkdirSync(workDir, { recursive: true });

        const codePath = path.join(workDir, "main.cpp");
        fs.writeFileSync(codePath, code);

        await execPromise(`g++ main.cpp -o main`, { cwd: workDir });

        const testcases = [];

        for (let i = 0; i < 2; i++) {
            const inputFile = `input0${i}.txt`;
            const expectedFile = `output0${i}.txt`;

            const expectedOutput = fs.readFileSync(path.join(workDir, expectedFile), "utf-8");

            try {
                const { stdout } = await execPromise(`./main < ${inputFile}`, { cwd: workDir });

                testcases.push({
                    success: stdout.trim() === expectedOutput.trim(),
                    output: stdout.trim(),
                    expected: expectedOutput.trim(),
                });

            } catch (error) {
                testcases.push({
                    success: false,
                    output: error.stderr || error.message,
                    expected: expectedOutput.trim(),
                });
            }
        }

        return res.status(200).json({ success: true, testcases });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
