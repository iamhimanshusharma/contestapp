import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import { api } from '../api';
import { useAuth } from '../auth/AuthContext';

const emptyTestcase = { input: "", expected: "", testcaseType: "sample" };

const slugify = (value) => {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
};

const CreateChallenge = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [form, setForm] = useState({
        problemId: "",
        title: "",
        difficulty: "Easy",
        description: "",
        input: "",
        output: "",
        constraints: ""
    });
    const [testcases, setTestcases] = useState([{ ...emptyTestcase }]);
    const [message, setMessage] = useState("");
    const [problemIdEdited, setProblemIdEdited] = useState(false);

    const updateForm = (key, value) => {
        setForm((current) => ({
            ...current,
            [key]: value,
            problemId: key === "title" && !problemIdEdited ? slugify(value) : current.problemId
        }));
    };

    const updateTestcase = (index, key, value) => {
        setTestcases((current) => current.map((testcase, testcaseIndex) => {
            if (testcaseIndex !== index) return testcase;
            return { ...testcase, [key]: value };
        }));
    };

    const addTestcase = () => {
        setTestcases((current) => [...current, { ...emptyTestcase, testcaseType: "hidden" }]);
    };

    const removeTestcase = (index) => {
        setTestcases((current) => current.filter((_, testcaseIndex) => testcaseIndex !== index));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!isAuthenticated) {
            setMessage("Login is required before uploading a problem");
            return;
        }

        try {
            const res = await api.post("/problems", {
                ...form,
                testcases
            });
            navigate(`/problems/${res.data.problem.problemId}`);
        } catch (error) {
            setMessage(error.response?.data?.message || "Problem upload failed");
        }
    };

    return (
        <>
            <Header />
            <form onSubmit={onSubmit} className="max-w-4xl mx-auto p-4 sm:p-6 space-y-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-2xl font-bold text-gray-700">Upload Problem</p>
                    <button className="py-2 px-4 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition cursor-pointer">
                        Upload
                    </button>
                </div>

                {message && <p className="text-sm text-red-600">{message}</p>}

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="font-medium mb-1 block">Title</label>
                        <input
                            value={form.title}
                            onChange={(e) => updateForm("title", e.target.value)}
                            className="py-2 px-3 ring-2 ring-gray-200 rounded-md w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="font-medium mb-1 block">Problem Id</label>
                        <input
                            value={form.problemId}
                            onChange={(e) => {
                                setProblemIdEdited(true);
                                updateForm("problemId", slugify(e.target.value));
                            }}
                            className="py-2 px-3 ring-2 ring-gray-200 rounded-md w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="font-medium mb-1 block">Difficulty</label>
                        <select
                            value={form.difficulty}
                            onChange={(e) => updateForm("difficulty", e.target.value)}
                            className="py-2 px-3 ring-2 ring-gray-200 rounded-md w-full"
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                </div>

                {["description", "input", "output", "constraints"].map((field) => (
                    <div key={field}>
                        <label className="font-medium mb-1 block capitalize">{field}</label>
                        <textarea
                            value={form[field]}
                            onChange={(e) => updateForm(field, e.target.value)}
                            rows={field === "description" ? 7 : 3}
                            className="py-2 px-3 ring-2 ring-gray-200 rounded-md w-full"
                            required
                        />
                    </div>
                ))}

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xl font-bold text-gray-700">Testcases</p>
                    <button type="button" onClick={addTestcase} className="py-2 px-3 text-green-600 shadow rounded-md ring-2 ring-gray-100 cursor-pointer">
                        + Add Testcase
                    </button>
                </div>

                <div className="space-y-4">
                    {testcases.map((testcase, index) => (
                        <div key={index} className="ring-1 ring-gray-200 rounded-md p-4">
                            <div className="flex items-center justify-between gap-3 mb-3">
                                <p className="font-bold text-gray-600">Case {index + 1}</p>
                                {testcases.length > 1 && (
                                    <button type="button" onClick={() => removeTestcase(index)} className="text-red-500 cursor-pointer">
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="font-medium mb-1 block">Input</label>
                                    <textarea
                                        value={testcase.input}
                                        onChange={(e) => updateTestcase(index, "input", e.target.value)}
                                        rows={4}
                                        className="py-2 px-3 ring-2 ring-gray-200 rounded-md w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="font-medium mb-1 block">Expected Output</label>
                                    <textarea
                                        value={testcase.expected}
                                        onChange={(e) => updateTestcase(index, "expected", e.target.value)}
                                        rows={4}
                                        className="py-2 px-3 ring-2 ring-gray-200 rounded-md w-full"
                                        required
                                    />
                                </div>
                            </div>
                            <select
                                value={testcase.testcaseType}
                                onChange={(e) => updateTestcase(index, "testcaseType", e.target.value)}
                                className="mt-3 py-2 px-3 ring-2 ring-gray-200 rounded-md"
                            >
                                <option value="sample">Sample</option>
                                <option value="hidden">Hidden</option>
                            </select>
                        </div>
                    ))}
                </div>
            </form>
        </>
    )
}

export default CreateChallenge
