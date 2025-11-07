import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import UserEditor from "./UserEditor";
import { Editor } from "@monaco-editor/react";
import { useParams } from "react-router-dom";

const Problem = () => {
    const [language, setLanguage] = useState("cpp");
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

    useEffect(() => {
        loadProblem(problemId);
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
            <div className="grid grid-flow-col grid-rows-10 grid-cols-2 gap-1 h-screen">
                <div className="flex items-center justify-center row-span-1 col-span-2 border-2 border-gray-300">
                    <button className="text-white bg-gray-500 rounded-md shadow-md cursor-pointer m-1 p-2" onClick={() => runCode("sample")}><img src="../run.png" alt="" className="h-5 w-5" /></button>
                    <button className="text-white bg-gray-500 text-lg py-1 px-6 rounded-md shadow-md cursor-pointer m-1" onClick={() => runCode("hidden")}>Submit</button>
                </div>
                <div className="row-span-9 col-span-1 border border-black border-2 border-gray-300 rounded-md">
                    <div className="flex border-b border-gray-300">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative flex-1 py-2 text-center transition-all duration-300 
              ${activeTab === tab.id
                                        ? "text-gray-700 bg-gray-200"
                                        : "text-gray-700 hover:text-gray-500"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="py-3 px-5 bg-white overflow-auto">{renderContent()}</div>
                </div>
                <div className="grid row-span-7 col-span-1 border-2 border-gray-300 rounded-md">
                    <div className="row-span-1 px-2 pt-2">
                        <select name="" id="language" className="py-1 px-3" onChange={onChangeHandler}>
                            <option value="cpp">c++</option>
                            <option value="c">c</option>
                            <option value="python">python</option>
                            <option value="java">java</option>
                            <option value="javascript">javascript</option>
                        </select>
                    </div>
                    <div className="row-span-20 p-2">
                        <Editor language={language} value={`//` + language} height='100%' onMount={handleEditorDidMount} />
                    </div>
                </div>
                <div className="row-span-2 border border-black overflow-auto py-2 px-4 border-2 border-gray-300 rounded-md">
                    {isError ? (<div>
                        <p className="text-xl text-red-600 font-bold">{getError?.message}</p>
                        <p className="text-sm text-red-600 mt-2">{getError?.error}</p>
                    </div>) : (
                        submissionType !== "none" ? (<div>
                            <div className="flex w-full gap-3 overflow-auto p-2">
                                {responseData.map((testcase, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveTestcase(index)}
                                        className={`${testcase.passed ? "ring-green-500 text-green-500" : "ring-red-500 text-red-500"} ring-2 px-2 flex-1 py-1 text-center rounded-md cursor-pointer
                            ${activeTestcase === index
                                                ? "bg-gray-200"
                                                : "hover:bg-gray-300"
                                            }`}
                                    >
                                        {`Case ${index}`}
                                    </button>
                                ))}
                            </div>
                            <div className="w-full bg-white shadow">
                                <div className="mt-2">
                                    <p className="text-sm font-bold mt-2">Input</p>
                                    <input type="text" name="input" id="" disabled value={responseData[activeTestcase]?.input || ""} className="ring-2 w-full px-2 py-1 rounded-md mt-1 ring-gray-400" />
                                    <p className="text-sm font-bold mt-2">Output</p>
                                    <input type="text" name="input" id="" disabled value={responseData[activeTestcase]?.output || ""} className="ring-2 w-full px-2 py-1 rounded-md mt-1 ring-gray-400" />
                                    <p className="text-sm font-bold mt-2">Expected</p>
                                    <input type="text" name="input" id="" disabled value={responseData[activeTestcase]?.expected || ""} className="ring-2 w-full px-2 py-1 rounded-md mt-1 ring-gray-400" />
                                </div>
                            </div>
                        </div>) : (<div>
                            <div className="flex w-full gap-3 overflow-auto p-2">
                                {allTestcase.map((testcase, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveTestcase(index)}
                                        className={`ring-2 px-2 flex-1 py-1 text-center rounded-md cursor-pointer
                            ${activeTestcase === index
                                                ? "text-gray-700 bg-gray-200"
                                                : "text-gray-700 hover:text-gray-500"
                                            }`}
                                    >
                                        {`Case ${index}`}
                                    </button>
                                ))}
                            </div>
                            <div className="w-full bg-white shadow">
                                <div className="mt-2">
                                    <p className="text-sm font-bold mt-2">Input</p>
                                    <input type="text" name="input" disabled id="" value={allTestcase[activeTestcase]?.input || ""} className="ring-2 w-full px-2 py-1 rounded-md mt-1 ring-gray-400" />
                                    <p className="text-sm font-bold mt-2">Output</p>
                                    <input type="text" name="output" id="" disabled value={allTestcase[activeTestcase]?.output || ""} className="ring-2 w-full px-2 py-1 rounded-md mt-1 ring-gray-400" />
                                    <p className="text-sm font-bold mt-2">Expected</p>
                                    <input type="text" name="expected" id="" disabled value={allTestcase[activeTestcase]?.expected || ""} className="ring-2 w-full px-2 py-1 rounded-md mt-1 ring-gray-400" />
                                </div>
                            </div>
                        </div>))}
                </div>
            </div >
        </>
    );
};

export default Problem;
