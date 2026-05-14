import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CheckCircle, Search, ChevronDown, Lock, Star, BookOpen, Clock, Calendar as CalendarIcon, Target, Code, Database, Terminal, Layers, Plus, Filter, Shuffle, Play } from 'lucide-react';
import { api } from './api';
import Header from "./Header";
import { useAuth } from './auth/AuthContext';

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

// Left Sidebar Component
const LeftSidebar = () => (
    <div className="w-[220px] hidden lg:flex flex-col gap-4 flex-shrink-0 sticky top-20 self-start">
        {/* Create Problem CTA */}
        <NavLink
            to="/challenge/create"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-[#ffa116] hover:bg-[#e8920f] text-white text-sm font-semibold shadow-md transition-colors"
        >
            <Plus size={16} strokeWidth={2.5} />
            Create Problem
        </NavLink>

        <div>
            <div className="text-gray-500 dark:text-gray-400 text-xs font-bold mb-3 uppercase tracking-wider px-2">Library</div>
            <div className="flex flex-col gap-1">
                <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#282828] text-gray-700 dark:text-gray-300 transition-colors">
                    <Target size={18} className="text-gray-400" />
                    <span className="text-sm font-medium">Quest</span>
                    <span className="ml-auto bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full">New</span>
                </button>
                <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#282828] text-gray-700 dark:text-gray-300 transition-colors">
                    <BookOpen size={18} className="text-gray-400" />
                    <span className="text-sm font-medium">Explore</span>
                </button>
                <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#282828] text-gray-700 dark:text-gray-300 transition-colors">
                    <CalendarIcon size={18} className="text-gray-400" />
                    <span className="text-sm font-medium">Study Plan</span>
                </button>
            </div>
        </div>

        <div>
            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-3 px-3">
                <div className="text-xs font-bold uppercase tracking-wider">My Lists</div>
                <div className="flex items-center gap-2">
                    <button className="hover:text-gray-900 dark:hover:text-white"><Plus size={14} /></button>
                    <button className="hover:text-gray-900 dark:hover:text-white"><ChevronDown size={14} /></button>
                </div>
            </div>
            <div className="flex flex-col gap-1">
                {[
                    { name: 'Favorite', icon: <Star size={18} className="text-orange-400 fill-orange-400" />, locked: true },
                ].map((list, i) => (
                    <button key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#282828] text-gray-700 dark:text-gray-300 transition-colors group">
                        {list.icon}
                        <span className="text-sm font-medium truncate">{list.name}</span>
                        {list.locked && <Lock size={12} className="ml-auto text-gray-400 group-hover:text-gray-500 dark:text-gray-600 dark:group-hover:text-gray-400" />}
                    </button>
                ))}
            </div>
        </div>
    </div>
);

// Right Sidebar Component
const RightSidebar = () => (
    <div className="w-[320px] hidden xl:flex flex-col gap-6 flex-shrink-0 sticky top-20 self-start">
        <div className="bg-white dark:bg-[#282828] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-[#333]">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">Day 14</span>
                    <span className="text-xs text-gray-500">06:55:22 left</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                    <button className="hover:text-gray-300"><ChevronDown className="rotate-90 w-4 h-4" /></button>
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-lg flex items-center justify-center shadow-inner relative overflow-hidden text-yellow-100 font-bold text-[10px]">
                        5 <span className="absolute bottom-1 right-0 text-[6px]">MAY</span>
                    </div>
                    <button className="hover:text-gray-300"><ChevronDown className="-rotate-90 w-4 h-4" /></button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-gray-500 dark:text-gray-400">
                <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
                <div className="p-1.5 text-gray-300 dark:text-gray-600"></div><div className="p-1.5 text-gray-300 dark:text-gray-600"></div><div className="p-1.5 text-gray-300 dark:text-gray-600"></div><div className="p-1.5 text-gray-300 dark:text-gray-600"></div>
                {[1,2,3,4,5,6,7,8,9,10,11,12,13].map(d => (
                    <div key={d} className="p-1.5 text-gray-700 dark:text-gray-300 relative">{d}<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#2cbb5d] rounded-full"></span></div>
                ))}
                <div className="p-1.5 w-6 h-6 mx-auto rounded-full bg-[#2cbb5d] text-white flex items-center justify-center font-medium shadow-sm">14</div>
                {[15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31].map(d => (
                    <div key={d} className="p-1.5 text-gray-700 dark:text-gray-300">{d}</div>
                ))}
            </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-[#332511] dark:to-[#1f160a] rounded-xl p-4 shadow-sm border border-orange-200 dark:border-[#422e15]">
            <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-bold text-orange-600 dark:text-[#ffa116] flex items-center gap-1">Weekly Premium <Star size={14} className="fill-orange-500 text-orange-500" /></div>
                <div className="text-xs text-orange-500 dark:text-gray-400">Less than a day</div>
            </div>
            <div className="flex gap-3 mb-4 justify-between px-1">
                {['W1','W2','W3','W4','W5'].map((w, i) => (
                    <div key={w} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 1 ? 'bg-orange-500 dark:bg-[#ffa116] text-white' : i === 0 ? 'text-orange-600 dark:text-[#ffa116] border border-orange-300 dark:border-[#ffa116]' : 'text-orange-400 dark:text-gray-500'}`}>{w}</div>
                ))}
            </div>
            <div className="flex items-center justify-between mt-5">
                <div className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-[#2cbb5d]"><Target size={14} /> 0 Redeem</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer">Rules</div>
            </div>
        </div>

        <div className="bg-white dark:bg-[#282828] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-[#333]">
            <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-bold text-gray-900 dark:text-gray-200">Trending Companies</div>
            </div>
            <div className="flex flex-wrap gap-2">
                {[['Google',2273],['Amazon',1969],['Uber',364],['Meta',1372],['Apple',306],['Microsoft',1376]].map(([name, count]) => (
                    <span key={name} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#333] text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#444] cursor-pointer transition-colors">
                        {name} <span className="bg-[#ffa116] text-white px-1.5 py-0.5 rounded-full text-[10px]">{count}</span>
                    </span>
                ))}
            </div>
        </div>
    </div>
);

// Promo Cards Component
const PromoCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="h-32 rounded-xl bg-gradient-to-r from-[#0d1021] to-[#1a1b3c] border border-[#2a2c4c] flex flex-col items-center justify-center p-4 relative overflow-hidden group cursor-pointer shadow-sm">
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-10 h-10 rounded-xl bg-[#ffa116] flex items-center justify-center mb-3 shadow-lg z-10">
                <ChevronDown className="rotate-[-90deg] text-white" size={24} strokeWidth={3} />
            </div>
            <h3 className="text-white font-bold text-lg text-center z-10">LeetCode at Your Fingertips</h3>
        </div>
        <div className="h-32 rounded-xl bg-gradient-to-r from-[#174836] to-[#257356] border border-[#30916d] p-5 relative overflow-hidden group cursor-pointer shadow-sm flex flex-col justify-center">
            <h3 className="text-white font-bold text-xl leading-tight mb-1 relative z-10">LeetCode's Interview Crash Course:</h3>
            <p className="text-emerald-100/80 text-xs font-medium relative z-10 w-3/4">System Design for Interviews and Beyond</p>
        </div>
        <div className="h-32 rounded-xl bg-gradient-to-br from-[#7748ff] to-[#592ede] border border-[#8a5fff] p-5 relative overflow-hidden group cursor-pointer hidden lg:flex flex-col justify-center shadow-sm">
            <h3 className="text-white font-bold text-xl leading-tight mb-1 relative z-10">LeetCode's Interview Crash Course</h3>
            <p className="text-purple-200/90 text-xs font-medium relative z-10">Data Structures and Algorithms</p>
        </div>
    </div>
);

const INITIAL_TAGS_SHOWN = 8;

const ProblemSet = () => {
    const [problemData, setProblemData] = useState([]);
    const [solvedProblemIds, setSolvedProblemIds] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [tagCounts, setTagCounts] = useState({});
    const [activeTag, setActiveTag] = useState(null);
    const [tagsExpanded, setTagsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { isAuthenticated } = useAuth();

    async function loadProblem() {
        try {
            const res = await api.get(`/problems`);
            setProblemData(res.data.problems);
            setTotalCount(res.data.totalCount || res.data.problems.length);
            setTagCounts(res.data.tagCounts || {});
        } catch (error) {
            console.log(error);
        }
    }

    function getDifficultyColor(diff) {
        switch (diff) {
            case "Easy": return "text-green-600 dark:text-[#00b8a3]";
            case "Medium": return "text-yellow-600 dark:text-[#ffc01e]";
            case "Hard": return "text-red-600 dark:text-[#ff375f]";
            default: return "text-gray-500";
        }
    }

    useEffect(() => { loadProblem(); }, []);

    useEffect(() => {
        if (!isAuthenticated) { setSolvedProblemIds([]); return; }
        api.get("/auth/profile")
            .then((res) => setSolvedProblemIds(res.data.solvedProblemIds || []))
            .catch(() => setSolvedProblemIds([]));
    }, [isAuthenticated]);

    // Tags to display
    const tagsToShow = tagsExpanded ? ALL_TAGS : ALL_TAGS.slice(0, INITIAL_TAGS_SHOWN);

    // Filter problems
    const filteredProblems = problemData.filter(item => {
        const matchesTag = activeTag ? (Array.isArray(item.tags) && item.tags.includes(activeTag)) : true;
        const matchesSearch = searchQuery
            ? item.title.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        return matchesTag && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-200 flex flex-col font-sans">
            <Header />

            <div className="flex-1 w-full max-w-[1400px] mx-auto flex gap-6 px-4 sm:px-6 py-6">
                <LeftSidebar />

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0">
                    <PromoCards />

                    {/* Topic Tags */}
                    <div className="flex items-start flex-wrap gap-2 mb-5">
                        {/* All Topics chip */}
                        <span
                            onClick={() => setActiveTag(null)}
                            className={`inline-flex items-center px-3 py-1.5 rounded-full border text-xs font-medium cursor-pointer transition-colors shadow-sm ${
                                activeTag === null
                                    ? 'bg-[#ffa116] text-white border-[#ffa116]'
                                    : 'bg-white dark:bg-[#282828] border-gray-200 dark:border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333]'
                            }`}
                        >
                            All
                        </span>
                        {tagsToShow.map((topic, i) => (
                            <span
                                key={i}
                                onClick={() => setActiveTag(activeTag === topic ? null : topic)}
                                className={`inline-flex items-center px-3 py-1.5 rounded-full border text-xs font-medium cursor-pointer transition-colors shadow-sm ${
                                    activeTag === topic
                                        ? 'bg-[#ffa116] text-white border-[#ffa116]'
                                        : 'bg-white dark:bg-[#282828] border-gray-200 dark:border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333]'
                                }`}
                            >
                                {topic}
                                <span className={`ml-1.5 font-normal ${activeTag === topic ? 'text-white/80' : 'text-gray-400 dark:text-gray-500'}`}>
                                    {tagCounts[topic] ?? 0}
                                </span>
                            </span>
                        ))}
                        <button
                            onClick={() => setTagsExpanded(prev => !prev)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#282828] transition-colors ml-auto"
                        >
                            {tagsExpanded ? 'Collapse' : 'Expand'} <ChevronDown size={14} className={`transition-transform ${tagsExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    {/* Category Buttons */}
                    <div className="flex items-center flex-wrap gap-3 mb-6">
                        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white text-gray-900 text-sm font-semibold shadow hover:bg-gray-50 transition-colors">
                            <Layers size={16} /> All Topics
                        </button>
                        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 dark:bg-[#282828] text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-300 dark:hover:bg-[#333] transition-colors">
                            <Target size={16} className="text-orange-500 dark:text-[#ffa116]" /> Algorithms
                        </button>
                        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 dark:bg-[#282828] text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-300 dark:hover:bg-[#333] transition-colors">
                            <Database size={16} className="text-blue-500" /> Database
                        </button>
                        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 dark:bg-[#282828] text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-300 dark:hover:bg-[#333] transition-colors">
                            <Terminal size={16} className="text-green-600 dark:text-[#2cbb5d]" /> Shell
                        </button>
                        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 dark:bg-[#282828] text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-300 dark:hover:bg-[#333] transition-colors">
                            <Layers size={16} className="text-purple-500" /> Concurrency
                        </button>
                    </div>

                    {/* Filters Row */}
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search questions"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="h-8 w-48 sm:w-64 rounded-md bg-white dark:bg-[#282828] border border-gray-200 dark:border-gray-700 pl-9 pr-4 text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:focus:ring-[#ffa116]"
                                />
                            </div>
                            <button className="p-1.5 rounded bg-white dark:bg-[#282828] border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#333] transition-colors flex items-center justify-center"><Filter size={18} /></button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <div className="w-3.5 h-3.5 rounded-full border border-gray-400 dark:border-gray-500 relative flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-green-500 dark:bg-[#2cbb5d] rounded-full hidden"></div>
                                </div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {solvedProblemIds.length}/{totalCount} Solved
                                </span>
                            </div>
                            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"><Shuffle size={18} /></button>
                        </div>
                    </div>

                    {/* Active tag indicator */}
                    {activeTag && (
                        <div className="mb-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>Filtered by:</span>
                            <span className="inline-flex items-center gap-1.5 bg-[#ffa116]/10 text-[#ffa116] border border-[#ffa116]/30 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                {activeTag}
                                <button onClick={() => setActiveTag(null)} className="hover:text-white transition-colors">✕</button>
                            </span>
                            <span className="text-xs text-gray-400">({filteredProblems.length} problems)</span>
                        </div>
                    )}

                    {/* Problem List */}
                    <div className="bg-white dark:bg-transparent rounded-xl overflow-hidden border border-gray-200 dark:border-transparent shadow-sm flex-1">
                        <div className="grid grid-cols-[40px_minmax(0,1fr)_100px_80px_60px] gap-4 px-4 py-3 border-b border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400">
                            <div>Status</div>
                            <div>Title</div>
                            <div className="text-right">Acceptance</div>
                            <div>Difficulty</div>
                            <div></div>
                        </div>

                        <div className="flex flex-col">
                            {filteredProblems.map((item, index) => {
                                const isSolved = solvedProblemIds.includes(item.problemId);
                                const isPremium = index % 5 === 0 && index !== 0;

                                return (
                                    <NavLink
                                        to={`/problems/${item.problemId}`}
                                        key={item.problemId || index}
                                        className={`grid grid-cols-[40px_minmax(0,1fr)_100px_80px_60px] gap-4 px-4 py-3.5 items-center group transition-colors ${index % 2 === 0 ? 'bg-gray-50 dark:bg-[#1a1a1a]/40' : 'bg-white dark:bg-[#282828]/40'} hover:bg-gray-100 dark:hover:bg-[#282828] dark:border-b dark:border-gray-800/50`}
                                    >
                                        <div className="flex items-center justify-center">
                                            {isSolved ? (
                                                <CheckCircle size={18} className="text-green-500 dark:text-[#2cbb5d]" />
                                            ) : (
                                                <div className="w-[18px] h-[18px] rounded-[4px] border border-gray-300 dark:border-gray-600 group-hover:border-gray-400 dark:group-hover:border-gray-500 transition-colors"></div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="font-medium text-gray-900 dark:text-gray-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {index + 1}. {item.title}
                                            </span>
                                            {isPremium && <Lock size={14} className="text-orange-500 dark:text-[#ffa116]" />}
                                        </div>

                                        <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                                            {(Math.random() * 40 + 30).toFixed(1)}%
                                        </div>

                                        <div className={`text-sm font-medium ${getDifficultyColor(item.difficulty)}`}>
                                            {item.difficulty === 'Medium' ? 'Med.' : item.difficulty}
                                        </div>

                                        <div className="flex items-center justify-end gap-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play size={16} className="hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer" />
                                            <Star size={16} className={`cursor-pointer ${isSolved ? 'text-orange-400 fill-orange-400' : 'hover:text-orange-400'}`} />
                                        </div>
                                    </NavLink>
                                );
                            })}

                            {filteredProblems.length === 0 && (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    {problemData.length === 0 ? 'Loading problems...' : 'No problems found for this filter.'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <RightSidebar />
            </div>
        </div>
    );
}

export default ProblemSet;
