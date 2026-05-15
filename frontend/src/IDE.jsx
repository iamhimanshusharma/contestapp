import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
    ChevronLeft, ChevronRight, Shuffle, Play, CloudUpload,
    Settings, Timer, CheckCircle, FileText, FlaskConical,
    MessageSquare, BookOpen, Star, Share2, MessageCircle,
    Bug, Maximize2, RotateCcw, Lock, Unlock, Check, Terminal,
    ChevronDown, ThumbsUp, ThumbsDown, HelpCircle, Tag, Building2, Code2, Plus,
    List, TrendingUp, Coins, ShoppingBag, Gamepad2, Palette, LogOut, Sun, Moon
} from "lucide-react";
import MarkdownPreview from '@uiw/react-markdown-preview';
import { api } from "./api";
import { useAuth } from "./auth/AuthContext";
import UserAvatar from "./UserAvatar";

const IDE = () => {
    const [language, setLanguage] = useState("cpp");
    const [leftWidth, setLeftWidth] = useState(50);
    const [upHeight, setUpHeight] = useState(65);
    const editorRef = useRef(null);
    const [responseData, setResponseData] = useState([]);
    const [submitResponseData, setSubmitResponseData] = useState();
    const [problemData, setProblemData] = useState({});
    const [isExecuting, setIsExecuting] = useState(false);
    const [submissionHistory, setSubmissionHistory] = useState([]);
    const [isSolved, setIsSolved] = useState(false);
    const { problemId, contestId } = useParams();
    const { isAuthenticated, user, logout, theme, updateTheme } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("description");
    const [activeTestcase, setActiveTestcase] = useState(0);
    const [allTestcase, setAllTestcase] = useState([]);
    const [getError, setError] = useState();
    const [isError, setIsError] = useState(false);
    // Avatar dropdown
    const [avatarOpen, setAvatarOpen] = useState(false);
    const avatarRef = useRef(null);
    // Custom testcases added by user via + button
    const [customTestcases, setCustomTestcases] = useState([]);
    const [customRunResults, setCustomRunResults] = useState({}); // idx -> { passed: bool, output: string }
    // Topics accordion
    const [topicsOpen, setTopicsOpen] = useState(false);
    const topicsRef = useRef(null);

    // Resize refs
    const containerRef = useRef(null);
    const isDragging = useRef(false);
    const varContainerRef = useRef(null);
    const varIsDragging = useRef(false);

    const nextTheme = theme === "dark" ? "light" : "dark";

    // Close avatar dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (avatarRef.current && !avatarRef.current.contains(e.target)) setAvatarOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Fetch problem data
    async function loadProblem(pId) {
        try {
            const res = await api.get(`/problems/${pId}`);
            if (!res.data.error) {
                setIsError(false);
                setProblemData(res.data.problemData);
                setAllTestcase(res.data.testcases || []);
            } else {
                setIsError(true);
                setError(res.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        loadProblem(problemId);
        if (isAuthenticated) {
            fetchSubmissions(problemId);
        }
    }, [problemId, isAuthenticated]);

    async function fetchSubmissions(pId) {
        try {
            const res = await api.get(`/submissions/${pId}`);
            if (res.data.success) {
                setSubmissionHistory(res.data.submissions || []);
                const solved = res.data.submissions.some(sub => sub.passed === true);
                setIsSolved(solved);
            }
        } catch (error) {
            console.error("Failed to fetch submissions", error);
        }
    }

    // Resizing Logic
    const handleMouseDown = () => { isDragging.current = true; document.body.style.cursor = "col-resize"; };
    const handleMouseUp = () => { isDragging.current = false; document.body.style.cursor = "default"; };
    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        const containerWidth = containerRef.current.offsetWidth;
        const newLeftWidth = (e.clientX / containerWidth) * 100;
        if (newLeftWidth > 20 && newLeftWidth < 80) setLeftWidth(newLeftWidth);
    };

    const varHandleMouseDown = () => { varIsDragging.current = true; document.body.style.cursor = "row-resize"; };
    const varHandleMouseUp = () => { varIsDragging.current = false; document.body.style.cursor = "default"; };
    const varHandleMouseMove = (e) => {
        if (!varIsDragging.current) return;
        const containerHeight = varContainerRef.current.offsetHeight;
        const rect = varContainerRef.current.getBoundingClientRect();
        const newUpHeight = ((e.clientY - rect.top) / containerHeight) * 100;
        if (newUpHeight > 20 && newUpHeight < 80) setUpHeight(newUpHeight);
    };

    useEffect(() => {
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

    function handleEditorDidMount(editor) {
        editorRef.current = editor;
    }

    async function runCode(type) {
        if (!isAuthenticated) {
            setActiveTab("submissions");
            setSubmitResponseData({ success: false, message: "Login is required before running or submitting code" });
            return;
        }

        const code = editorRef.current.getValue();
        localStorage.setItem('oldcode', code);

        // Detect if a custom testcase tab is active and user clicked Run (not Submit)
        const isCustomActive = type === "sample" && activeTestcase >= allTestcase.length;
        const customLocalIdx = isCustomActive ? activeTestcase - allTestcase.length : null;
        const customCase = customLocalIdx !== null ? customTestcases[customLocalIdx] : null;

        // Override type to "custom" so the backend uses the custom input path
        const effectiveType = isCustomActive ? "custom" : type;

        try {
            setIsExecuting(true);
            setIsError(false);
            if (type === "hidden") {
                setActiveTab("submissions");
                setSubmitResponseData(null);
            }

            const res = await api.post("/submit", {
                type: effectiveType,
                language,
                problemId,
                code,
                contestId,
                ...(customCase ? { customInput: customCase.input, customExpected: customCase.expected } : {})
            });

            if (!res.data.error) {
                setIsError(false);

                if (isCustomActive) {
                    // Store custom run result for dot + output display
                    if (res.data.results?.length > 0) {
                        const r = res.data.results[0];
                        setCustomRunResults(prev => ({
                            ...prev,
                            [customLocalIdx]: { passed: r.passed, output: r.output, expected: r.expected }
                        }));
                    }
                } else {
                    if (type === "hidden") {
                        setSubmitResponseData(res.data);
                        fetchSubmissions(problemId);
                    }
                    if (res.data.results?.length > 0) {
                        setResponseData(res.data.results);
                        setActiveTestcase(0);
                    }
                }
            } else {
                setIsError(true);
                setError(res.data);
            }
        } catch (err) {
            setIsError(true);
            setError(err.response?.data || { message: "Execution failed", error: err.message });
        } finally {
            setIsExecuting(false);
        }
    }

    function addCustomTestcase() {
        const newCase = { input: "", expected: "" };
        setCustomTestcases(prev => [...prev, newCase]);
        setActiveTestcase(allTestcase.length + customTestcases.length);
    }

    function updateCustomTestcase(localIdx, field, value) {
        setCustomTestcases(prev => prev.map((tc, i) => i === localIdx ? { ...tc, [field]: value } : tc));
    }

    function removeCustomTestcase(localIdx) {
        setCustomTestcases(prev => prev.filter((_, i) => i !== localIdx));
        setCustomRunResults(prev => {
            const next = { ...prev };
            delete next[localIdx];
            return next;
        });
        setActiveTestcase(Math.max(0, activeTestcase - 1));
    }

    function scrollToTopics() {
        setTopicsOpen(true);
        setTimeout(() => topicsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }

    function getDifficultyColor(diff) {
        switch (diff) {
            case "Easy": return "text-[#00b8a3] bg-[#00b8a3]/10";
            case "Medium": return "text-[#ffc01e] bg-[#ffc01e]/10";
            case "Hard": return "text-[#ff375f] bg-[#ff375f]/10";
            default: return "text-gray-500 bg-gray-100 dark:bg-[#333]";
        }
    }

    // Parse array/object strings nicely for testcases
    const formatValue = (val) => {
        try { return typeof val === 'object' ? JSON.stringify(val) : val; }
        catch (e) { return val; }
    };

    return (
        <div className="h-screen w-full flex flex-col bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-300 font-sans overflow-hidden">
            {/* Top Navigation Bar */}
            <div className="h-[50px] bg-white dark:bg-[#282828] flex items-center justify-between px-4 border-b border-gray-200 dark:border-[#333] shrink-0">
                {/* Left */}
                <div className="flex items-center gap-4 flex-1">
                    <NavLink to="/" className="text-[#ffa116] hover:text-orange-400 transition-colors">
                        <Code2 size={24} />
                    </NavLink>
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#333] rounded-md p-1">
                        <NavLink to={contestId ? `/contests/${contestId}` : "/problems"} className="flex items-center gap-2 px-2 py-1 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-[#444] rounded text-gray-700 dark:text-gray-300 transition-colors">
                            <Terminal size={16} /> Problem List
                        </NavLink>
                        <div className="flex items-center">
                            <button className="p-1 hover:bg-gray-200 dark:hover:bg-[#444] rounded text-gray-500 dark:text-gray-400 transition-colors"><ChevronLeft size={16} /></button>
                            <button className="p-1 hover:bg-gray-200 dark:hover:bg-[#444] rounded text-gray-500 dark:text-gray-400 transition-colors"><ChevronRight size={16} /></button>
                        </div>
                        <button className="p-1 ml-1 hover:bg-gray-200 dark:hover:bg-[#444] rounded text-gray-500 dark:text-gray-400 transition-colors"><Shuffle size={14} /></button>
                    </div>
                </div>

                {/* Center */}
                <div className="flex items-center gap-2 flex-1 justify-center">
                    <button
                        onClick={() => runCode("sample")}
                        disabled={isExecuting}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-gray-100 dark:bg-[#333] hover:bg-gray-200 dark:hover:bg-[#444] text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        {isExecuting ? <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-gray-700"></div> : <Play size={16} className="text-green-600 dark:text-[#2cbb5d] fill-current" />} Run
                    </button>
                    <button
                        onClick={() => runCode("hidden")}
                        disabled={isExecuting}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-green-100 text-green-700 dark:bg-[#2cbb5d]/20 dark:text-[#2cbb5d] hover:bg-green-200 dark:hover:bg-[#2cbb5d]/30 text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        <CloudUpload size={16} /> Submit
                    </button>
                </div>

                {/* Right */}
                <div className="flex items-center justify-end gap-4 flex-1">
                    <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"><Settings size={18} /></button>
                    <div className="hidden sm:flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <Timer size={16} /> <span className="text-xs">0</span>
                    </div>
                    <button
                        onClick={() => updateTheme(nextTheme)}
                        className="hover:text-gray-900 dark:hover:text-white transition-colors"
                        title={`Switch to ${nextTheme} mode`}
                    >
                        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    {user ? (
                        <div className="relative" ref={avatarRef}>
                            <button
                                onClick={() => setAvatarOpen(p => !p)}
                                className="w-7 h-7 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 hover:ring-2 ring-[#ffa116] transition-all focus:outline-none"
                            >
                                <UserAvatar user={user} />
                            </button>
                            {avatarOpen && (
                                <div className="absolute top-12 right-4 sm:right-6 w-72 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-xl shadow-2xl z-[100] overflow-y-auto animate-fade-in-down" style={{ width: 272, maxHeight: 'calc(100vh - 60px)' }}>
                                    <button
                                        onClick={() => { setAvatarOpen(false); navigate('/profile'); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-[#2a2a2a] hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors text-left"
                                    >
                                        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#ffa116]/40">
                                            <UserAvatar user={user} />
                                        </div>
                                        <div>
                                            <div className="text-gray-900 dark:text-white font-semibold text-sm leading-tight">{user.name || user.email}</div>
                                            <div className="text-[#ffa116] text-xs mt-0.5">Access all features with Premium!</div>
                                        </div>
                                    </button>
                                    <div className="grid grid-cols-4 gap-2 px-3 py-3 border-b border-gray-200 dark:border-[#2a2a2a]">
                                        {[
                                            { icon: <List size={17} className="text-orange-400" />, label: 'My Lists', bg: 'bg-gray-100 dark:bg-[#3a3a3a]' },
                                            { icon: <BookOpen size={17} className="text-blue-400" />, label: 'Notebook', bg: 'bg-gray-100 dark:bg-[#3a3a3a]' },
                                            { icon: <TrendingUp size={17} className="text-green-400" />, label: 'Progress', bg: 'bg-gray-100 dark:bg-[#3a3a3a]' },
                                            { icon: <Coins size={17} className="text-white" />, label: 'Points', bg: 'bg-gradient-to-br from-yellow-400 to-orange-500' },
                                        ].map((a, i) => (
                                            <button key={i} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-transparent hover:bg-gray-100 dark:bg-[#2a2a2a] dark:hover:bg-[#333] transition-colors group">
                                                <div className={`w-8 h-8 rounded-lg ${a.bg} flex items-center justify-center`}>{a.icon}</div>
                                                <span className="text-[10px] text-gray-600 dark:text-gray-300 font-medium">{a.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="py-2">
                                        {[
                                            { icon: <FlaskConical size={17} />, label: 'Try New Features' },
                                            { icon: <ShoppingBag size={17} />, label: 'Orders' },
                                            { icon: <Gamepad2 size={17} />, label: 'My Playgrounds' },
                                            { icon: <Settings size={17} />, label: 'Settings' },
                                        ].map((item, i) => (
                                            <button key={i} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                                <span className="text-gray-500 dark:text-gray-400">{item.icon}</span>
                                                <span className="text-sm flex-1 text-left">{item.label}</span>
                                                {item.chevron && <ChevronRight size={14} className="text-gray-400 dark:text-gray-500" />}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => { setAvatarOpen(false); logout(); navigate('/login'); }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
                                        >
                                            <LogOut size={17} className="text-gray-400" />
                                            <span className="text-sm">Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <NavLink to="/login" className="text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Sign in</NavLink>
                    )}
                </div>
            </div>

            {/* Main Workspace */}
            <div ref={containerRef} className="flex-1 flex w-full overflow-hidden p-1.5 gap-[2px]">

                {/* Left Pane (Description) */}
                <div
                    className="bg-white dark:bg-[#282828] rounded-lg border border-gray-200 dark:border-[#333] flex flex-col overflow-hidden shadow-sm"
                    style={{ width: `${leftWidth}%` }}
                >
                    {/* Tabs */}
                    <div className="flex bg-gray-50 dark:bg-[#333] px-2 pt-2 border-b border-gray-200 dark:border-[#444] gap-1 overflow-x-auto no-scrollbar">
                        <button onClick={() => setActiveTab('description')} className={`flex items-center gap-2 px-3 py-2 rounded-t-lg text-xs font-medium transition-colors ${activeTab === 'description' ? 'bg-white dark:bg-[#282828] text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#444]'}`}>
                            <FileText size={14} className={activeTab === 'description' ? 'text-blue-500' : ''} /> Description
                        </button>
                        <button onClick={() => setActiveTab('solutions')} className={`flex items-center gap-2 px-3 py-2 rounded-t-lg text-xs font-medium transition-colors ${activeTab === 'solutions' ? 'bg-white dark:bg-[#282828] text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#444]'}`}>
                            <FlaskConical size={14} /> Solutions
                        </button>
                        <button onClick={() => setActiveTab('submissions')} className={`flex items-center gap-2 px-3 py-2 rounded-t-lg text-xs font-medium transition-colors ${activeTab === 'submissions' ? 'bg-white dark:bg-[#282828] text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#444]'}`}>
                            <RotateCcw size={14} /> Submissions
                        </button>
                        <button onClick={() => setActiveTab('editorial')} className={`flex items-center gap-2 px-3 py-2 rounded-t-lg text-xs font-medium transition-colors ${activeTab === 'editorial' ? 'bg-white dark:bg-[#282828] text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#444]'}`}>
                            <BookOpen size={14} /> Editorial
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-auto p-5 relative">
                        {activeTab === "description" ? (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{problemData.title || "Loading..."}</h1>
                                    {isSolved && (
                                        <div className="flex items-center gap-1 text-green-600 dark:text-[#2cbb5d] text-xs font-medium">
                                            Solved <CheckCircle size={14} />
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 mb-6">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problemData.difficulty)}`}>
                                        {problemData.difficulty || "Medium"}
                                    </span>
                                    <button
                                        onClick={scrollToTopics}
                                        className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-[#333] text-gray-600 dark:text-gray-300 text-xs font-medium flex items-center gap-1 hover:bg-gray-200 dark:hover:bg-[#444] cursor-pointer transition-colors border border-gray-200 dark:border-[#444]"
                                    >
                                        <Tag size={12} /> Topics
                                    </button>
                                    <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-[#333] text-gray-600 dark:text-gray-300 text-xs font-medium flex items-center gap-1 hover:bg-gray-200 dark:hover:bg-[#444] cursor-pointer transition-colors border border-gray-200 dark:border-[#444]">
                                        <Building2 size={12} className="text-orange-400" /> Companies
                                    </span>
                                </div>

                                <div className="prose dark:prose-invert prose-sm max-w-none prose-pre:bg-gray-50 dark:prose-pre:bg-[#333] prose-pre:text-gray-800 dark:prose-pre:text-gray-200 prose-code:text-gray-800 dark:prose-code:text-gray-200 prose-code:bg-gray-100 dark:prose-code:bg-[#333] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
                                    {problemData.description ? (
                                        <MarkdownPreview source={problemData.description} wrapperElement={{ "data-color-mode": theme || "dark", style: { backgroundColor: 'transparent' } }} />
                                    ) : (
                                        <p className="text-gray-500">Loading description...</p>
                                    )}

                                    {problemData.input && (
                                        <div className="mt-6">
                                            <p className="font-bold mb-2 text-gray-900 dark:text-white">Example:</p>
                                            <pre className="bg-gray-50 dark:bg-[#333] p-3 rounded-md border border-gray-200 dark:border-transparent text-sm font-mono whitespace-pre-wrap">
                                                <strong>Input:</strong> {problemData.input}<br />
                                                <strong>Output:</strong> {problemData.output}
                                            </pre>
                                        </div>
                                    )}

                                    {problemData.constraints && (
                                        <div className="mt-6">
                                            <p className="font-bold mb-2 text-gray-900 dark:text-white">Constraints:</p>
                                            <ul className="list-disc pl-5 text-sm space-y-1">
                                                {problemData.constraints.split('\n').map((c, i) => (
                                                    <li key={i}><code className="bg-gray-100 dark:bg-[#333] px-1.5 py-0.5 rounded text-xs">{c}</code></li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Topics Accordion */}
                                    <div ref={topicsRef} className="mt-8 border border-gray-200 dark:border-[#333] rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => setTopicsOpen(p => !p)}
                                            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-[#333] hover:bg-gray-100 dark:hover:bg-[#3a3a3a] transition-colors"
                                        >
                                            <span className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                                                <Tag size={15} className="text-[#ffa116]" /> Topics
                                            </span>
                                            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${topicsOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {topicsOpen && (
                                            <div className="px-4 py-4 bg-white dark:bg-[#282828] flex flex-wrap gap-2">
                                                {Array.isArray(problemData.tags) && problemData.tags.length > 0 ? (
                                                    problemData.tags.map((tag, i) => (
                                                        <span key={i} className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-medium">
                                                            {tag}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-gray-400">No topics tagged for this problem.</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : activeTab === "submissions" ? (
                            <div className="text-sm">
                                {submitResponseData && (
                                    submitResponseData.success ? (
                                        <div className="flex flex-col items-center justify-center py-6 mb-6 border-b border-gray-200 dark:border-[#333]">
                                            <CheckCircle size={40} className="text-green-500 dark:text-[#2cbb5d] mb-2" />
                                            <p className="text-xl font-bold text-green-500 dark:text-[#2cbb5d]">{submitResponseData.message || "Accepted"}</p>
                                        </div>
                                    ) : submitResponseData.failedTestcase ? (
                                        <div className="mt-2 mb-6 border-b border-gray-200 dark:border-[#333] pb-6">
                                            <p className="text-xl font-bold text-red-500">Wrong Answer</p>
                                            <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/10 dark:border-red-900/30">
                                                <p className="text-sm font-bold text-red-700 dark:text-red-400 mb-1">Input</p>
                                                <div className="bg-white dark:bg-[#1a1a1a] p-3 rounded-md border border-gray-200 dark:border-[#333] font-mono text-sm">{submitResponseData.failedTestcase.input}</div>
                                                <p className="text-sm font-bold text-red-700 dark:text-red-400 mt-4 mb-1">Output</p>
                                                <div className="bg-white dark:bg-[#1a1a1a] p-3 rounded-md border border-gray-200 dark:border-[#333] font-mono text-sm text-red-600 dark:text-red-400">{submitResponseData.failedTestcase.output}</div>
                                                <p className="text-sm font-bold text-green-700 dark:text-green-400 mt-4 mb-1">Expected</p>
                                                <div className="bg-white dark:bg-[#1a1a1a] p-3 rounded-md border border-gray-200 dark:border-[#333] font-mono text-sm text-green-600 dark:text-green-400">{submitResponseData.failedTestcase.expected}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-xl font-bold text-red-500 mb-6 pb-6 border-b border-gray-200 dark:border-[#333]">{submitResponseData.message}</p>
                                    )
                                )}

                                {submissionHistory.length > 0 ? (
                                    <div className="w-full">
                                        <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Submission History</h3>
                                        <div className="border border-gray-200 dark:border-[#333] rounded-lg overflow-hidden">
                                            <table className="w-full text-left border-collapse">
                                                <thead className="bg-gray-50 dark:bg-[#333] border-b border-gray-200 dark:border-[#444]">
                                                    <tr>
                                                        <th className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Verdict</th>
                                                        <th className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Language</th>
                                                        <th className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Time</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 dark:divide-[#333]">
                                                    {submissionHistory.map((sub) => (
                                                        <tr key={sub._id} className="hover:bg-gray-50 dark:hover:bg-[#2c2c2c] transition-colors">
                                                            <td className="px-4 py-3">
                                                                <span className={`font-semibold text-xs ${sub.passed ? 'text-green-600 dark:text-[#2cbb5d]' : 'text-red-500'}`}>
                                                                    {sub.verdict}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300">
                                                                <span className="bg-gray-100 dark:bg-[#333] px-2 py-1 rounded">{sub.language}</span>
                                                            </td>
                                                            <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                                                {new Date(sub.createdAt).toLocaleString()}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    !submitResponseData && (
                                        <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
                                            <Terminal size={48} className="mb-4 opacity-50" />
                                            <p>No submissions yet.</p>
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
                                <BookOpen size={48} className="mb-4 opacity-50" />
                                <p className="text-sm">Content for {activeTab} is not available.</p>
                            </div>
                        )}
                    </div>

                    {/* Footer Action Bar */}
                    <div className="border-t border-gray-200 dark:border-[#333] p-2.5 flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs bg-white dark:bg-[#282828]">
                        <div className="flex items-center gap-5 px-2">
                            <button className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"><ThumbsUp size={16} /> 36.8K</button>
                            <button className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"><ThumbsDown size={16} /></button>
                            <button className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"><MessageCircle size={16} /> 1.1K</button>
                            <button className="hover:text-yellow-500 transition-colors"><Star size={16} className="fill-yellow-500 text-yellow-500" /></button>
                            <button className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"><Share2 size={16} /></button>
                            <button className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"><HelpCircle size={16} /></button>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                            <div className="w-2 h-2 rounded-full bg-green-500 dark:bg-[#2cbb5d]"></div> 810 Online
                        </div>
                    </div>
                </div>

                {/* Vertical Splitter*/}
                <div
                    className="w-1 cursor-col-resize hover:bg-blue-500 transition-colors rounded my-0.5 flex flex-col justify-center items-center"
                    onMouseDown={handleMouseDown}
                >
                    <div className="w-1 h-10 bg-gray-300 dark:bg-[#444] rounded-full"></div>
                </div>

                {/* Right Pane (Editor & Testcases) */}
                <div className="flex-1 flex flex-col min-w-0" ref={varContainerRef}>

                    {/* Top Editor Pane */}
                    <div
                        className="bg-white dark:bg-[#282828] rounded-lg border border-gray-200 dark:border-[#333] flex flex-col overflow-hidden shadow-sm"
                        style={{ height: `${upHeight}%` }}
                    >
                        {/* Editor Header */}
                        <div className="flex items-center justify-between bg-gray-50 dark:bg-[#333] px-3 py-2 border-b border-gray-200 dark:border-[#444]">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-[#2cbb5d]">
                                    <Code2 size={16} /> Code
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="bg-transparent text-xs text-gray-700 dark:text-gray-300 font-medium focus:outline-none cursor-pointer hover:text-gray-900 dark:hover:text-white"
                                    >
                                        <option value="cpp">C++</option>
                                        <option value="c">C</option>
                                        <option value="python">Python</option>
                                        <option value="java">Java</option>
                                        <option value="javascript">JavaScript</option>
                                    </select>
                                    <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer transition-colors">
                                        <Lock size={12} /> Auto
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                                <button className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"><Settings size={16} /></button>
                                <button className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"><RotateCcw size={16} /></button>
                                <button className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"><Maximize2 size={16} /></button>
                            </div>
                        </div>

                        {/* Monaco Editor */}
                        <div className="flex-1 overflow-hidden relative bg-[#fffffe] dark:bg-[#1e1e1e]">
                            <Editor
                                language={language === 'c' ? 'cpp' : language}
                                value={`// Write your ${language} code here\n`}
                                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    lineHeight: 24,
                                    padding: { top: 16 },
                                    scrollBeyondLastLine: false,
                                    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                                }}
                                onMount={handleEditorDidMount}
                            />
                        </div>

                        {/* Editor Footer */}
                        <div className="flex items-center justify-between px-4 py-1.5 bg-white dark:bg-[#282828] border-t border-gray-200 dark:border-[#333] text-xs text-gray-500 dark:text-gray-500">
                            <span>Saved</span>
                            <span>Ln 1, Col 1</span>
                        </div>
                    </div>

                    {/* Horizontal Splitter */}
                    <div
                        className="h-1 cursor-row-resize hover:bg-blue-500 transition-colors rounded my-0.5 flex flex-col justify-center items-center"
                        onMouseDown={varHandleMouseDown}
                    >
                        <div className="w-10 h-1 bg-gray-300 dark:bg-[#444] rounded-full"></div>
                    </div>

                    {/* Bottom Testcase Pane */}
                    <div className="bg-white dark:bg-[#282828] rounded-lg border border-gray-200 dark:border-[#333] flex flex-col overflow-hidden shadow-sm flex-1">

                        {/* Testcase Header */}
                        <div className="flex bg-gray-50 dark:bg-[#333] px-2 pt-2 border-b border-gray-200 dark:border-[#444] gap-1">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium bg-white dark:bg-[#282828] text-gray-900 dark:text-white">
                                <Check size={16} className="text-green-500 dark:text-[#2cbb5d]" /> Testcase
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#444] transition-colors">
                                <Terminal size={16} className="text-green-600 dark:text-green-800" /> Test Result
                            </button>
                        </div>

                        {/* Testcase Body */}
                        <div className="flex-1 overflow-auto p-4 flex flex-col bg-white dark:bg-[#282828]">
                            {isError ? (
                                <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 p-4 text-sm text-red-600 dark:text-red-400 shadow-sm">
                                    <p className="font-bold flex items-center gap-2"><Bug size={18} /> {getError?.message}</p>
                                    <p className="mt-2 whitespace-pre-wrap text-xs bg-white/50 dark:bg-black/20 p-2 rounded">{getError?.error}</p>
                                </div>
                            ) : null}

                            {allTestcase.length > 0 ? (
                                <>
                                    {/* Case Tabs */}
                                    <div className="flex gap-2 mb-5 flex-wrap">
                                        {allTestcase.map((_, idx) => {
                                            let isPassed = null;
                                            if (responseData && responseData[idx] !== undefined) {
                                                isPassed = responseData[idx].passed;
                                            }
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => setActiveTestcase(idx)}
                                                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTestcase === idx ? 'bg-gray-200 dark:bg-[#444] text-gray-900 dark:text-white' : 'bg-gray-100 dark:bg-[#333] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#444]'}`}
                                                >
                                                    {isPassed === true && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                                                    {isPassed === false && <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>}
                                                    Case {idx + 1}
                                                </button>
                                            );
                                        })}
                                        {customTestcases.map((_, idx) => {
                                            const cr = customRunResults[idx];
                                            return (
                                                <button
                                                    key={`custom-${idx}`}
                                                    onClick={() => setActiveTestcase(allTestcase.length + idx)}
                                                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border border-dashed ${activeTestcase === allTestcase.length + idx ? 'bg-gray-200 dark:bg-[#444] text-gray-900 dark:text-white border-gray-400' : 'bg-gray-100 dark:bg-[#333] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#444] border-gray-300 dark:border-[#555]'}`}
                                                >
                                                    {cr?.passed === true && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                                                    {cr?.passed === false && <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>}
                                                    Custom {idx + 1}
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={addCustomTestcase}
                                            className="px-2 py-1.5 rounded-lg bg-gray-100 dark:bg-[#333] text-gray-500 hover:bg-gray-200 dark:hover:bg-[#444] transition-colors"
                                            title="Add custom testcase"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    {/* Inputs & Outputs */}
                                    <div className="flex flex-col gap-4">
                                        {activeTestcase < allTestcase.length ? (
                                            /* Built-in testcase */
                                            <>
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Input =</label>
                                                    <div className="bg-gray-100 dark:bg-[#333] p-3 rounded-lg font-mono text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-transparent cursor-text select-all min-h-[40px]">
                                                        {formatValue(allTestcase[activeTestcase]?.input)}
                                                    </div>
                                                </div>
                                                {responseData && responseData[activeTestcase] && (
                                                    <>
                                                        <div className="flex flex-col gap-1.5">
                                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Output =</label>
                                                            <div className={`p-3 rounded-lg font-mono text-sm border cursor-text select-all min-h-[40px] ${responseData[activeTestcase].passed ? 'bg-gray-100 dark:bg-[#333] text-gray-800 dark:text-gray-200 border-gray-200 dark:border-transparent' : 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30'}`}>
                                                                {formatValue(responseData[activeTestcase].output)}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-1.5">
                                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Expected =</label>
                                                            <div className="bg-gray-100 dark:bg-[#333] p-3 rounded-lg font-mono text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-transparent cursor-text select-all min-h-[40px]">
                                                                {formatValue(responseData[activeTestcase].expected)}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            /* Custom testcase */
                                            (() => {
                                                const localIdx = activeTestcase - allTestcase.length;
                                                const tc = customTestcases[localIdx];
                                                if (!tc) return null;
                                                const cr = customRunResults[localIdx];
                                                return (
                                                    <>
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-xs font-semibold text-[#ffa116]">Custom Testcase {localIdx + 1}</span>
                                                            <button
                                                                onClick={() => removeCustomTestcase(localIdx)}
                                                                className="text-xs text-red-400 hover:text-red-500 transition-colors"
                                                            >Remove</button>
                                                        </div>
                                                        <div className="flex flex-col gap-1.5">
                                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Input =</label>
                                                            <textarea
                                                                rows={3}
                                                                value={tc.input}
                                                                onChange={e => {
                                                                    updateCustomTestcase(localIdx, 'input', e.target.value);
                                                                    // Reset dot when input changes
                                                                    setCustomRunResults(prev => { const n = { ...prev }; delete n[localIdx]; return n; });
                                                                }}
                                                                placeholder="Enter your custom input..."
                                                                className="bg-gray-100 dark:bg-[#333] p-3 rounded-lg font-mono text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-[#444] focus:outline-none focus:ring-1 focus:ring-[#ffa116] resize-none w-full"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-1.5">
                                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Expected Output = <span className="text-gray-400 font-normal">(optional — for comparison)</span></label>
                                                            <textarea
                                                                rows={2}
                                                                value={tc.expected}
                                                                onChange={e => {
                                                                    updateCustomTestcase(localIdx, 'expected', e.target.value);
                                                                    setCustomRunResults(prev => { const n = { ...prev }; delete n[localIdx]; return n; });
                                                                }}
                                                                placeholder="Enter expected output (optional)..."
                                                                className="bg-gray-100 dark:bg-[#333] p-3 rounded-lg font-mono text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-[#444] focus:outline-none focus:ring-1 focus:ring-[#ffa116] resize-none w-full"
                                                            />
                                                        </div>
                                                        {/* Show output after Run */}
                                                        {cr && (
                                                            <>
                                                                <div className="flex flex-col gap-1.5">
                                                                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Output =</label>
                                                                    <div className={`p-3 rounded-lg font-mono text-sm border cursor-text select-all min-h-[40px] ${cr.passed === true ? 'bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/30'
                                                                        : cr.passed === false ? 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30'
                                                                            : 'bg-gray-100 dark:bg-[#333] text-gray-800 dark:text-gray-200 border-gray-200 dark:border-transparent'
                                                                        }`}>
                                                                        {cr.output || <span className="text-gray-400">(no output)</span>}
                                                                    </div>
                                                                </div>
                                                                {cr.passed === true && (
                                                                    <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-xs font-semibold">
                                                                        <div className="w-2 h-2 rounded-full bg-green-500"></div> Output matches expected
                                                                    </div>
                                                                )}
                                                                {cr.passed === false && (
                                                                    <div className="flex items-center gap-1.5 text-red-500 text-xs font-semibold">
                                                                        <div className="w-2 h-2 rounded-full bg-red-500"></div> Output does not match expected
                                                                    </div>
                                                                )}
                                                                {cr.passed === null && (
                                                                    <div className="text-xs text-gray-400 italic">No expected output provided — cannot determine pass/fail.</div>
                                                                )}
                                                            </>
                                                        )}
                                                    </>
                                                );
                                            })()
                                        )}
                                    </div>
                                </>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-sm">No testcases available. They will appear here when loaded.</p>
                            )}
                        </div>

                        {/* Testcase Footer */}
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-[#282828] border-t border-gray-200 dark:border-[#333] text-xs text-gray-500 dark:text-gray-400 font-medium cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                            <Code2 size={16} /> Source <HelpCircle size={14} className="ml-0.5" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default IDE;
