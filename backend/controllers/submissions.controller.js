import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";
import { Problem } from "../models/problems.model.js";

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


export const submitSolution = async (req, res) => {
    const containerName = `run-${Date.now()}`;
    let workDir;

    try {
        const { language, problemId, code } = req.body;

        const lang = languageConfig[language];

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

        const localFile = path.join(workDir, lang.file);
        fs.writeFileSync(localFile, code);

        try {
            //keeps the container running
            await execPromise(`docker run -d --name ${containerName} --network none sandboxed-env tail -f /dev/null`);

            //copying the localfile's code into the main.cpp file in /app on container
            await execPromise(`docker cp "${localFile}" ${containerName}:/app/${lang.file}`);

            //compiling the code in main.cpp file
            if (lang.compile) {
                await execPromise(`docker exec ${containerName} sh -c "${lang.compile}"`);
            }
        } catch (err) {
            await execPromise(`docker rm -f ${containerName}`);
            return res.status(200).json({
                success: false,
                message: "Compilation error",
                error: err.stderr || err.message
            });
        }

        const results = [];
        let allPassed = true;

        for (const tc of testcases) {
            try {
                const safeInput = tc.input.replace(/"/g, '\\"');
                const { stdout } = await execPromise(
                    `printf "${safeInput}" | docker exec -i ${containerName} ${lang.run}`
                );

                const output = stdout.trim();
                const passed = output === tc.expected.trim();
                results.push({ input: tc.input, output, expected: tc.expected.trim(), passed });
                if (!passed) allPassed = false;

            } catch (err) {
                results.push({
                    success: false,
                    message: "Runtime error",
                    error: err.message
                });
                allPassed = false;
            }
        }

        await execPromise(`docker rm -f ${containerName}`);
        fs.rmSync(workDir, { recursive: true, force: true });

        return res.status(200).json({
            success: true,
            message: allPassed ? "Accepted" : "Wrong Answer",
            results,
        });

    } catch (err) {

        // delete the created folder, if exists
        if (workDir && fs.existsSync(workDir)) {
            fs.rmSync(workDir, { recursive: true, force: true });
        }

        // delete the container, if exists
        try {
            await execPromise(`docker rm -f ${containerName}`);
        } catch { }

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
};
