import { exec, spawn } from "child_process";
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

async function ensureSandbox(containerName, image = "sandboxed-env") {
    try {
        // Check if container exists
        const { stdout } = await execPromise(`docker inspect -f '{{.State.Running}}' ${containerName}`);
        const isRunning = stdout.trim() === "true";

        if (!isRunning) {
            await execPromise(`docker start ${containerName}`);
        }
    } catch (err) {
        // Container does not exists, create new
        await execPromise(`docker run -d --name ${containerName} --network none ${image} tail -f /dev/null`);
    }
}

export const submitSolution = async (req, res) => {
    const containerName = "sandboxed-env";

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

        const isolatedFolderName = `sub-${Date.now()}`;

        try {

            //check if container is running or not, if not then start it, if not create then create it
            await ensureSandbox(containerName);

            //create a temporary folder on container
            await execPromise(`docker exec ${containerName} mkdir -p /app/${isolatedFolderName}`);

            const child = spawn("docker", ["exec", "-i", containerName, "sh", "-c", `tee /app/${isolatedFolderName}/${lang.file} > /dev/null`]);

            child.stdin.write(code);

            child.stdin.end();

            //compiling the code
            if (lang.compile) {
                await execPromise(
                    `docker exec ${containerName} sh -c "cd /app/${isolatedFolderName} && ${lang.compile}"`
                );
            }
        } catch (err) {
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
                    `printf "${safeInput}" | docker exec -i ${containerName} sh -c "cd /app/${isolatedFolderName} && ${lang.run}"`
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

        await execPromise(`docker exec ${containerName} rm -rf /app/${isolatedFolderName}`);


        return res.status(200).json({
            success: true,
            message: allPassed ? "Accepted" : "Wrong Answer",
            results,
        });

    } catch (err) {

        // delete the created folder, if exists
        await execPromise(`docker exec ${containerName} rm -rf /app/${isolatedFolderName}`);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
};
