import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import UserEditor from "./UserEditor";
import { Editor } from "@monaco-editor/react";

const Problem = () => {
    const [language, setLanguage] = useState("cpp");
    const editorRef = useRef(null);

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }

    function onChangeHandler(e) {
        const { name, value } = e.target;

        setLanguage(value);
    }

    useEffect(() => {
    }, [language]);

    async function runCode() {
        const code = editorRef.current.getValue();
        const input = document.getElementById("input").value;

        localStorage.setItem('oldcode', code);
        localStorage.setItem('oldinput', input);


        try {
            const res = await axios.post("http://localhost:5000/run", { code, input });
            document.getElementById("output").textContent = res.data.output;
        } catch (err) {
            console.error(err);
            document.getElementById("output").textContent =
                err.response?.data?.output || "Something went wrong!";
        }
    }

    return (
        <>
            <div className="grid grid-flow-col grid-rows-10 grid-cols-2 gap-1 h-screen">
                <div className="flex items-center justify-center row-span-1 col-span-2 border-2 border-gray-300">
                    <button className="text-white bg-white rounded-md shadow-md cursor-pointer m-1 p-2" onClick={runCode}><img src="./run.png" alt="" className="h-5 w-5" /></button>
                    <button className="text-white bg-green-500 text-lg py-1 px-6 rounded-md shadow-md cursor-pointer m-1" onClick={runCode}>SUBMIT</button>
                </div>
                <div className="row-span-9 col-span-1 border border-black border-2 border-gray-300 rounded-md">01</div>
                <div className="grid row-span-7 col-span-1 border-2 border-gray-300 rounded-md">
                    <div className="row-span-1 px-2 pt-2">
                        <select name="" id="language" className="py-1 px-3" onChange={onChangeHandler}>
                            <option value="cpp">c++</option>
                            <option value="c">c</option>
                            <option value="java">java</option>
                            <option value="javascript">javascript</option>
                        </select>
                    </div>
                    <div className="row-span-20 p-2">
                        {/* <textarea name="" id="code" className="text-sm p-2 w-full h-full ring-1 shadow rounded-md"></textarea> */}
                        <Editor language={language} value={`//` + language} height='100%' onMount={handleEditorDidMount} />
                    </div>
                </div>
                <div className="row-span-2 border border-black overflow-auto p-2 border-2 border-gray-300 rounded-md">
                    <p>Input</p>
                    <input type="text" id="input" className="p-2 w-full text-sm my-2 w-fit ring-1 shadow rounded-md" />
                    <p>Output</p>
                    <textarea name="" id="output" disabled className="w-full text-sm my-2 p-2 ring-1 rounded-md"></textarea>
                </div>
            </div>
        </>
    );
};

export default Problem;
