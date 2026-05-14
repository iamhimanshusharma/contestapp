import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ChevronDown, X, Search } from 'lucide-react';
import Header from '../Header';
import { api } from '../api';
import { useAuth } from '../auth/AuthContext';

const ALL_TAGS = [
    "Array", "String", "Hash Table", "Math", "Dynamic Programming", "Sorting", "Greedy",
    "Depth-First Search", "Binary Search", "Database", "Bit Manipulation", "Matrix", "Tree",
    "Breadth-First Search", "Two Pointers", "Prefix Sum", "Heap (Priority Queue)", "Simulation",
    "Counting", "Graph Theory", "Binary Tree", "Stack", "Sliding Window", "Enumeration", "Design",
    "Backtracking", "Union-Find", "Number Theory", "Linked List", "Ordered Set", "Segment Tree",
    "Monotonic Stack", "Divide and Conquer", "Combinatorics", "Trie", "Bitmask", "Queue",
    "Recursion", "Geometry", "Binary Indexed Tree", "Memoization", "Hash Function",
    "Binary Search Tree", "Topological Sort", "Shortest Path", "String Matching", "Rolling Hash",
    "Game Theory", "Interactive", "Data Stream", "Monotonic Queue", "Brainteaser",
    "Doubly-Linked List", "Merge Sort", "Randomized", "Counting Sort", "Iterator", "Concurrency",
    "Quickselect", "Suffix Array", "Sweep Line", "Probability and Statistics",
    "Minimum Spanning Tree", "Bucket Sort", "Shell", "Reservoir Sampling", "Eulerian Circuit",
    "Radix Sort", "Strongly Connected Component", "Rejection Sampling"
];

const emptyTestcase = { input: "", expected: "", testcaseType: "sample" };

const slugify = (value) => {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
};

const TagPicker = ({ selectedTags, onChange }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filtered = ALL_TAGS.filter(t =>
        t.toLowerCase().includes(search.toLowerCase()) && !selectedTags.includes(t)
    );

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            onChange(selectedTags.filter(t => t !== tag));
        } else {
            onChange([...selectedTags, tag]);
        }
    };

    return (
        <div className="relative">
            {/* Selected chips */}
            <div
                onClick={() => setOpen(!open)}
                className="min-h-[44px] py-2 px-3 ring-2 ring-gray-200 rounded-md flex flex-wrap gap-1.5 cursor-pointer hover:ring-gray-300 bg-white"
            >
                {selectedTags.length === 0 && (
                    <span className="text-gray-400 text-sm self-center">Select tags...</span>
                )}
                {selectedTags.map(tag => (
                    <span
                        key={tag}
                        className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2 py-1 rounded-full"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); toggleTag(tag); }}
                            className="hover:text-red-500 transition-colors"
                        >
                            <X size={11} />
                        </button>
                    </span>
                ))}
                <ChevronDown
                    size={16}
                    className={`ml-auto self-center text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-xl max-h-64 flex flex-col">
                    <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                            <Search size={14} className="absolute left-2.5 top-2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tags..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                                onClick={e => e.stopPropagation()}
                            />
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 flex flex-wrap gap-1.5">
                        {filtered.length === 0 && (
                            <span className="text-gray-400 text-sm p-2">No tags found</span>
                        )}
                        {filtered.map(tag => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => toggleTag(tag)}
                                className="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-300 transition-colors"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
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
    const [selectedTags, setSelectedTags] = useState([]);
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
                tags: selectedTags,
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
                    <div>
                        <label className="font-medium mb-1 block">Tags</label>
                        <TagPicker selectedTags={selectedTags} onChange={setSelectedTags} />
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
