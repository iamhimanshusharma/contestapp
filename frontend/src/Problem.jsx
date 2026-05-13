import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { NavLink, useParams } from "react-router-dom";
import MarkdownPreview from '@uiw/react-markdown-preview';
import { api } from "./api";
import { useAuth } from "./auth/AuthContext";


const Problem = () => {
    const [language, setLanguage] = useState("cpp");
    const [leftWidth, setLeftWidth] = useState(50);
    const [upHeight, setUpHeight] = useState(70);
    const editorRef = useRef(null);
    const [responseData, setResponseData] = useState([]);
    const [submitResponseData, setSubmitResponseData] = useState();
    const [problemData, setProblemData] = useState({});
    const [isExecuting, setIsExecuting] = useState(false);
    const { problemId, contestId } = useParams();
    const { isAuthenticated } = useAuth();
    const [activeTab, setActiveTab] = useState("description");
    const [activeTestcase, setActiveTestcase] = useState(0);
    const [allTestcase, setAllTestcase] = useState([]);
    const [getError, setError] = useState();
    const [isError, setIsError] = useState(false);
    const containerRef = useRef(null);
    const isDragging = useRef(false);
    const varContainerRef = useRef(null);
    const varIsDragging = useRef(false);

    const tabs = [
        { id: "description", label: "Description" },
        { id: "submission", label: "Submission" }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "description":
                return <div className="m-2">
                    <p className="text-2xl font-bold my-2">{problemData.title}</p>
                    <span className={`${getDifficulty(problemData.difficulty)} text-sm border border-gray-300 px-3 pb-1 rounded-full`}>{problemData.difficulty}</span>
                    {/* <p className="text-md my-2">{problemData.description}</p> */}
                    <MarkdownPreview className="text-md my-2" source={problemData.description} wrapperElement={{ "data-color-mode": "light" }} />
                    <span className="text-sm font-bold">Input</span>
                    <p className="text-sm my-2">{problemData.input}</p>
                    <span className="text-sm font-bold">Output</span>
                    <p className="text-sm my-2">{problemData.output}</p>
                    <span className="text-sm font-bold">Constraints</span>
                    <p className="text-sm my-2">{problemData.constraints}</p>
                </div>
            case "submission":
                return isExecuting ? (
                    <div className="flex items-center gap-3 text-blue-700">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-700"></div>
                        <p className="font-medium">Submitting your code...</p>
                    </div>
                ) : submitResponseData ? (submitResponseData?.success ? (<p className="text-xl font-bold text-green-500">{submitResponseData.message}</p>) : submitResponseData?.failedTestcase ? (<div className="mt-2">
                    <p className="text-xl font-bold text-red-500">Wrong Answer</p>
                    <p className="text-sm font-bold mt-2">Input</p>
                    <input type="text" name="input" id="" disabled value={submitResponseData?.failedTestcase?.input} className="ring-2 w-full px-2 py-1 rounded-md mt-1 ring-gray-400" />
                    <p className="text-sm font-bold mt-2">Output</p>
                    <input type="text" name="input" id="" disabled value={submitResponseData?.failedTestcase?.output} className="ring-2 w-full px-2 py-1 rounded-md mt-1 ring-gray-400" />
                    <p className="text-sm font-bold mt-2">Expected</p>
                    <input type="text" name="input" id="" disabled value={submitResponseData?.failedTestcase?.expected} className="ring-2 w-full px-2 py-1 rounded-md mt-1 ring-gray-400" />
                </div>) : (<p className="text-xl font-bold text-red-500">{submitResponseData.message}</p>)) : <p className="text-gray-600">Your submission will show here.</p>;
            default:
                return null;
        }
    };

    const renderTestcasePanel = () => {
        const testcasesToShow = responseData.length > 0 ? responseData : allTestcase;
        const showingRunResults = responseData.length > 0;
        const selectedIndex = Math.min(activeTestcase, Math.max(testcasesToShow.length - 1, 0));
        const selectedTestcase = testcasesToShow[selectedIndex] || {};

        return (
            <div>
                {isExecuting && (
                    <div className="mb-3 flex items-center gap-3 rounded-md bg-blue-50 px-4 py-3 text-blue-700">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-700"></div>
                        <p className="font-medium">Running your code...</p>
                    </div>
                )}

                {isError && (
                    <div className="mb-3 rounded-md bg-red-50 px-4 py-3">
                        <p className="text-xl text-red-600 font-bold">
                            {getError?.message}
                        </p>
                        <p className="text-sm text-red-600 mt-2 whitespace-pre-wrap">{getError?.error}</p>
                    </div>
                )}

                {testcasesToShow.length > 0 ? (
                    <>
                        <div className="flex w-full gap-3 overflow-auto p-2">
                            {testcasesToShow.map((testcase, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveTestcase(index)}
                                    className={`${showingRunResults
                                        ? testcase.passed
                                            ? "ring-green-500 text-green-500"
                                            : "ring-red-500 text-red-500"
                                        : "text-gray-700"
                                        } ring-2 px-2 flex-1 py-1 text-center rounded-md cursor-pointer ${selectedIndex === index
                                            ? "bg-gray-200"
                                            : "hover:bg-gray-300"
                                        }`}
                                >
                                    {`Case ${index + 1}`}
                                </button>
                            ))}
                        </div>

                        <div className="w-full bg-white shadow mt-2">
                            <p className="text-sm font-bold mt-2">Input</p>
                            <textarea
                                disabled
                                value={selectedTestcase.input || ""}
                                className="ring-2 w-full px-2 py-1 rounded-md mt-1 ring-gray-400 resize-none"
                                rows={3}
                            />
                            <p className="text-sm font-bold mt-2">Output</p>
                            <textarea
                                disabled
                                value={showingRunResults ? selectedTestcase.output || "" : "Run code to see output"}
                                className="ring-2 w-full px-2 py-1 rounded-md mt-1 ring-gray-400 resize-none"
                                rows={3}
                            />
                            <p className="text-sm font-bold mt-2">Expected</p>
                            <textarea
                                disabled
                                value={selectedTestcase.expected || ""}
                                className="ring-2 w-full px-2 py-1 rounded-md mt-1 ring-gray-400 resize-none"
                                rows={3}
                            />
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500">Testcases will show here.</p>
                )}
            </div>
        );
    };


    function handleEditorDidMount(editor) {
        editorRef.current = editor;
    }

    function onChangeHandler(e) {
        const { value } = e.target;

        setLanguage(value);
    }

    async function loadProblem(pId) {
        try {
            const res = await api.get(`/problems/${pId}`);

            if (!res.data.error) {
                setIsError(false);
                setProblemData(res.data.problemData);
                setAllTestcase(res.data.testcases);
                console.log(res.data.problemData);
                console.log(res.data.testcases);
            } else {
                setIsError(true);
                setError(res.data);
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleMouseDown = () => {
        isDragging.current = true;
        document.body.style.cursor = "col-resize";
    };

    const varHandleMouseDown = () => {
        varIsDragging.current = true;
        document.body.style.cursor = "col-resize";
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        document.body.style.cursor = "default";
    };

    const varHandleMouseUp = () => {
        varIsDragging.current = false;
        document.body.style.cursor = "default";
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        const containerWidth = containerRef.current.offsetWidth;
        const newLeftWidth = (e.clientX / containerWidth) * 100;
        if (newLeftWidth > 10 && newLeftWidth < 90) {
            setLeftWidth(newLeftWidth);
        }
    };

    const varHandleMouseMove = (e) => {
        if (!varIsDragging.current) return;
        const containerHeight = varContainerRef.current.offsetHeight;
        const newUpHeight = (e.clientY / containerHeight) * 100;
        if (newUpHeight > 10 && newUpHeight < 90) {
            setUpHeight(newUpHeight);
        }
    };

    useEffect(() => {
        loadProblem(problemId);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", varHandleMouseUp);
        window.addEventListener("mousemove", varHandleMouseMove);
        return () => {
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", varHandleMouseUp);
            window.removeEventListener("mousemove", varHandleMouseMove);
        };
    }, [problemId]);

    async function runCode(type) {
        if (!isAuthenticated) {
            setActiveTab("submission");
            setSubmitResponseData({
                success: false,
                message: "Login is required before running or submitting code"
            });
            return;
        }

        const code = editorRef.current.getValue();
        const language = document.getElementById("language").value;

        localStorage.setItem('oldcode', code);


        try {
            setIsExecuting(true);
            setIsError(false);
            if (type === "hidden") {
                setActiveTab("submission");
                setSubmitResponseData();
            }
            const res = await api.post("/submit", {
                type,
                language,
                problemId,
                code,
                contestId
            });

            if (!res.data.error) {
                if (type === "hidden") {
                    setSubmitResponseData(res.data)
                }
                setIsError(false);
                if (res.data.results?.length > 0) {
                    setResponseData(res.data.results);
                    setActiveTestcase(0);
                }
                console.log(res.data);
            } else {
                setIsError(true);
                setError(res.data);
                console.log(res.data);
            }

        } catch (err) {
            setIsError(true);
            setError(err.response?.data || {
                message: "Execution failed",
                error: err.message
            });
        } finally {
            setIsExecuting(false);
        }
    }

    function getDifficulty(diff) {
        switch (diff) {
            case "Easy":
                return "text-green-600";
            case "Medium":
                return "text-yellow-600";
            case "Hard":
                return "text-red-600";
            default:
                return null;
        }
    }



    return (
        <>
            <div className="gap-1 h-screen flex flex-col">
                <div className="flex items-center justify-center border-2 border-gray-300 relative">
                    <NavLink to={contestId ? `/contests/${contestId}` : "/problems"} className="absolute left-4 text-sm text-blue-600">
                        Back
                    </NavLink>
                    <button
                        className="rounded-md shadow-md cursor-pointer m-1 p-1 ring-3 ring-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => runCode("sample")}
                        disabled={isExecuting}
                    >
                        <img src="../run.svg" alt="" className="h-7 w-7" />
                    </button>
                    <button
                        className="py-1 px-2 rounded-md shadow-md cursor-pointer m-1 ring-3 ring-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => runCode("hidden")}
                        disabled={isExecuting}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <img src="../upload1.svg" alt="" className="h-7 w-7" />
                            <p className="text-lg text-green-500 font-bold">Submit</p>
                        </div>
                    </button>
                </div>

                <div ref={containerRef} className="flex w-full flex-1 overflow-hidden">
                    <div
                        className="border-2 border-gray-300 rounded-md flex flex-col"
                        style={{ width: `${leftWidth}%` }}
                    >
                        <div className="flex border-b border-gray-300">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative flex-1 py-2 text-center transition-all duration-300 ${activeTab === tab.id
                                        ? "text-gray-700 bg-gray-200"
                                        : "text-gray-700 hover:text-gray-500"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="py-3 px-5 bg-white overflow-auto flex-1">
                            {renderContent()}
                        </div>
                    </div>

                    <div
                        className="w-1 hover:bg-blue-700 cursor-col-resize"
                        onMouseDown={handleMouseDown}
                    ></div>

                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div ref={varContainerRef} className="flex flex-col h-full w-full">
                            <div
                                className="border-2 border-gray-300 rounded-md flex flex-col"
                                style={{ height: `${upHeight}%` }}
                            >
                                <div className="px-2 pt-2">
                                    <select
                                        name=""
                                        id="language"
                                        className="py-1 px-3 border rounded"
                                        onChange={onChangeHandler}
                                    >
                                        <option value="cpp">C++</option>
                                        <option value="c">C</option>
                                        <option value="python">Python</option>
                                        <option value="java">Java</option>
                                        <option value="javascript">JavaScript</option>
                                    </select>
                                </div>

                                <div className="p-2 flex-1 overflow-auto">
                                    <Editor
                                        language={language}
                                        value={`//` + language}
                                        height="100%"
                                        onMount={handleEditorDidMount}
                                    />
                                </div>
                            </div>

                            <div
                                className="h-1 hover:bg-blue-700 cursor-row-resize"
                                onMouseDown={varHandleMouseDown}
                            ></div>

                            <div className="border-2 border-gray-300 rounded-md overflow-auto py-2 px-4 flex-1">
                                {renderTestcasePanel()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Problem;
