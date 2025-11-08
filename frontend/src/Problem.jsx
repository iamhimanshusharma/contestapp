import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import UserEditor from "./UserEditor";
import { Editor } from "@monaco-editor/react";
import { useParams } from "react-router-dom";

const Problem = () => {
    const [language, setLanguage] = useState("cpp");
    const [leftWidth, setLeftWidth] = useState(50);
    const [upHeight, setUpHeight] = useState(70);
    const editorRef = useRef(null);
    const [responseData, setResponseData] = useState([]);
    const [submitResponseData, setSubmitResponseData] = useState();
    const [problemData, setProblemData] = useState({});
    const [submissionType, setSubmissionType] = useState("none");
    const { problemId } = useParams();
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
                    <p className="text-md my-2">{problemData.description}</p>
                    <span className="text-sm font-bold">Input</span>
                    <p className="text-sm my-2">{problemData.input}</p>
                    <span className="text-sm font-bold">Output</span>
                    <p className="text-sm my-2">{problemData.output}</p>
                    <span className="text-sm font-bold">Constraints</span>
                    <p className="text-sm my-2">{problemData.constraints}</p>
                </div>
            case "submission":
                return submitResponseData ? (submitResponseData?.success ? (<p className="text-xl font-bold text-green-500">{submitResponseData.message}</p>) : (<div className="mt-2">
                    <p className="text-xl font-bold text-red-500">Wrong Answer</p>
                    <p className="text-sm font-bold mt-2">Input</p>
                    <input type="text" name="input" id="" disabled value={submitResponseData?.failedTestcase?.input} className="ring-2 w-full px-2 py-1 rounded-md mt-1 ring-gray-400" />
                    <p className="text-sm font-bold mt-2">Output</p>
                    <input type="text" name="input" id="" disabled value={submitResponseData?.failedTestcase?.output} className="ring-2 w-full px-2 py-1 rounded-md mt-1 ring-gray-400" />
                    <p className="text-sm font-bold mt-2">Expected</p>
                    <input type="text" name="input" id="" disabled value={submitResponseData?.failedTestcase?.expected} className="ring-2 w-full px-2 py-1 rounded-md mt-1 ring-gray-400" />
                </div>)) : <p className="text-gray-600">Your submission will show here.</p>;
            default:
                return null;
        }
    };


    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }

    function onChangeHandler(e) {
        const { name, value } = e.target;

        setLanguage(value);
    }

    async function loadProblem(pId) {
        try {
            const res = await axios.get(`http://localhost:5000/api/problems/${pId}`);

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
    }, []);

    async function runCode(type) {
        const code = editorRef.current.getValue();
        const language = document.getElementById("language").value;

        localStorage.setItem('oldcode', code);


        try {
            setSubmissionType(type);
            if (type === "hidden") setActiveTab("submission");
            const res = await axios.post("http://localhost:5000/api/submit", {
                type,
                language,
                problemId,
                code
            });

            if (!res.data.error) {
                if (type === "hidden") {
                    setSubmitResponseData(res.data)
                }
                setIsError(false);
                setResponseData(res.data.results);
                console.log(res.data);
            } else {
                setIsError(true);
                setError(res.data);
                console.log(res.data);
            }

        } catch (err) {
            console.error(err);
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
                <div className="flex items-center justify-center border-2 border-gray-300">
                    <button
                        className="rounded-md shadow-md cursor-pointer m-1 p-1 ring-3 ring-gray-100"
                        onClick={() => runCode("sample")}
                    >
                        <img src="../run.svg" alt="" className="h-7 w-7" />
                    </button>
                    <button
                        className="py-1 px-2 rounded-md shadow-md cursor-pointer m-1 ring-3 ring-gray-100"
                        onClick={() => runCode("hidden")}
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
                                {isError ? (
                                    <div>
                                        <p className="text-xl text-red-600 font-bold">
                                            {getError?.message}
                                        </p>
                                        <p className="text-sm text-red-600 mt-2">{getError?.error}</p>
                                    </div>
                                ) : submissionType !== "none" ? (
                                    <div>
                                        <div className="flex w-full gap-3 overflow-auto p-2">
                                            {responseData.map((testcase, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setActiveTestcase(index)}
                                                    className={`${testcase.passed
                                                        ? "ring-green-500 text-green-500"
                                                        : "ring-red-500 text-red-500"
                                                        } ring-2 px-2 flex-1 py-1 text-center rounded-md cursor-pointer ${activeTestcase === index
                                                            ? "bg-gray-200"
                                                            : "hover:bg-gray-300"
                                                        }`}
                                                >
                                                    {`Case ${index}`}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="w-full bg-white shadow mt-2">
                                            <p className="text-sm font-bold mt-2">Input</p>
                                            <input
                                                type="text"
                                                disabled
                                                value={responseData[activeTestcase]?.input || ""}
                                                className="ring-2 w-full px-2 py-1 rounded-md mt-1 ring-gray-400"
                                            />
                                            <p className="text-sm font-bold mt-2">Output</p>
                                            <input
                                                type="text"
                                                disabled
                                                value={responseData[activeTestcase]?.output || ""}
                                                className="ring-2 w-full px-2 py-1 rounded-md mt-1 ring-gray-400"
                                            />
                                            <p className="text-sm font-bold mt-2">Expected</p>
                                            <input
                                                type="text"
                                                disabled
                                                value={responseData[activeTestcase]?.expected || ""}
                                                className="ring-2 w-full px-2 py-1 rounded-md mt-1 ring-gray-400"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex w-full gap-3 overflow-auto p-2">
                                            {allTestcase.map((testcase, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setActiveTestcase(index)}
                                                    className={`ring-2 px-2 flex-1 py-1 text-center rounded-md cursor-pointer ${activeTestcase === index
                                                        ? "text-gray-700 bg-gray-200"
                                                        : "text-gray-700 hover:text-gray-500"
                                                        }`}
                                                >
                                                    {`Case ${index}`}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="w-full bg-white shadow mt-2">
                                            <p className="text-sm font-bold mt-2">Input</p>
                                            <input
                                                type="text"
                                                disabled
                                                value={allTestcase[activeTestcase]?.input || ""}
                                                className="ring-2 w-full px-2 py-1 rounded-md mt-1 ring-gray-400"
                                            />
                                            <p className="text-sm font-bold mt-2">Output</p>
                                            <input
                                                type="text"
                                                disabled
                                                value={allTestcase[activeTestcase]?.output || ""}
                                                className="ring-2 w-full px-2 py-1 rounded-md mt-1 ring-gray-400"
                                            />
                                            <p className="text-sm font-bold mt-2">Expected</p>
                                            <input
                                                type="text"
                                                disabled
                                                value={allTestcase[activeTestcase]?.expected || ""}
                                                className="ring-2 w-full px-2 py-1 rounded-md mt-1 ring-gray-400"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Problem;
