import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Header from "./Header";
import { api } from "./api";
import { useAuth } from "./auth/AuthContext";
import {
    MapPin, Link2, Eye, CheckSquare, MessageSquare, Star,
    ChevronRight, List, MessageCircle, Activity, Settings, Edit
} from "lucide-react";

// Utility to get relative time (e.g., "a month ago")
const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} days ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return diffInMonths === 1 ? 'a month ago' : `${diffInMonths} months ago`;
    const diffInYears = Math.floor(diffInDays / 365);
    return diffInYears === 1 ? 'a year ago' : `${diffInYears} years ago`;
};

// Activity Heatmap Component
const ActivityHeatmap = ({ submissions }) => {
    const today = new Date();
    const activityMap = {};

    if (submissions) {
        submissions.forEach(sub => {
            const dateStr = new Date(sub.createdAt).toISOString().split('T')[0];
            activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
        });
    }

    const weeks = 52;
    const days = 7;
    const grid = [];

    // Generate last 364 days
    for (let w = weeks - 1; w >= 0; w--) {
        const week = [];
        for (let d = 0; d < days; d++) {
            const date = new Date(today);
            date.setDate(today.getDate() - (w * 7 + (6 - d)));
            const dateStr = date.toISOString().split('T')[0];
            const count = activityMap[dateStr] || 0;

            // Determine color based on activity density
            let colorClass = "bg-[#333]"; // 0
            if (count === 1) colorClass = "bg-[#0e4429]";
            else if (count === 2) colorClass = "bg-[#006d32]";
            else if (count === 3) colorClass = "bg-[#26a641]";
            else if (count >= 4) colorClass = "bg-[#39d353]";

            week.push(<div key={dateStr} className={`w-3 h-3 rounded-[2px] ${colorClass}`} title={`${count} submissions on ${dateStr}`}></div>);
        }
        grid.push(<div key={w} className="flex flex-col gap-1">{week}</div>);
    }

    return (
        <div className="flex gap-1 overflow-x-auto no-scrollbar py-2">
            {grid}
        </div>
    );
};

const Profile = () => {
    const { user, isAuthenticated } = useAuth();
    const [profile, setProfile] = useState(null);
    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState("Recent AC");

    useEffect(() => {
        if (!isAuthenticated) return;

        api.get("/auth/profile")
            .then((res) => setProfile(res.data))
            .catch((error) => setMessage(error.response?.data?.message || "Could not load profile"));
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] text-gray-300 font-sans">
                <Header />
                <div className="max-w-4xl mx-auto p-4 sm:p-6 mt-10 text-center">
                    <p className="text-xl font-bold text-gray-200">Login to view your profile.</p>
                    <NavLink to="/login" className="inline-block mt-4 py-2 px-6 bg-[#2cbb5d] text-white font-medium rounded-md hover:bg-[#2cbb5d]/90 transition-colors">Sign in</NavLink>
                </div>
            </div>
        );
    }

    // Stats calculations
    const solvedEasy = profile?.solvedProblems?.filter(p => p.problem.difficulty === "Easy").length || 0;
    const solvedMed = profile?.solvedProblems?.filter(p => p.problem.difficulty === "Medium").length || 0;
    const solvedHard = profile?.solvedProblems?.filter(p => p.problem.difficulty === "Hard").length || 0;
    const totalSolved = profile?.stats?.solvedProblems || 0;

    // Mocked total limits
    const totalEasy = 943;
    const totalMed = 2054;
    const totalHard = 933;
    const totalProblems = totalEasy + totalMed + totalHard;

    const recentAC = profile?.submissions?.filter(s => s.passed).slice(0, 15) || [];

    // Calculate ring percentages
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const easyStroke = (solvedEasy / totalProblems) * circumference;
    const medStroke = (solvedMed / totalProblems) * circumference;
    const hardStroke = (solvedHard / totalProblems) * circumference;

    return (
        <div className="min-h-screen bg-[#1a1a1a] text-gray-300 font-sans pb-10">
            <Header />

            <main className="max-w-[1200px] mx-auto p-4 sm:p-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

                    {/* LEFT SIDEBAR */}
                    <div className="md:col-span-3 space-y-4">
                        {/* User Card */}
                        <div className="bg-[#282828] rounded-xl p-5 shadow-sm">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-600">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-xl font-bold text-gray-100">{user?.username}</h1>
                                    <p className="text-sm text-gray-500">@{user?.username}</p>
                                    <div className="mt-2 text-xs font-medium text-gray-400">
                                        Rank <span className="text-gray-200">216,507</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-gray-400 mb-5">
                                <div><span className="text-gray-200 font-medium">0</span> Following</div>
                                <div><span className="text-gray-200 font-medium">1</span> Followers</div>
                            </div>

                            <button className="w-full py-2 bg-[#2cbb5d]/10 hover:bg-[#2cbb5d]/20 text-[#2cbb5d] rounded-lg text-sm font-medium transition-colors mb-5">
                                Edit Profile
                            </button>

                            <div className="space-y-3 text-sm text-gray-400 border-b border-[#444] pb-5">
                                <div className="flex items-center gap-3"><MapPin size={16} /> India</div>
                                <div className="flex items-center gap-3"><Link2 size={16} /> <a href="#" className="hover:text-[#ffa116]">Website</a></div>
                            </div>

                            {/* Community Stats */}
                            <div className="pt-5 space-y-4">
                                <h2 className="text-sm font-bold text-gray-200 mb-2">Community Stats</h2>
                                <div className="flex items-center gap-3">
                                    <Eye size={16} className="text-blue-500" />
                                    <div className="flex-1 flex justify-between text-sm">
                                        <span className="text-gray-400">Views</span>
                                        <span className="text-gray-200 font-medium">36</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckSquare size={16} className="text-cyan-500" />
                                    <div className="flex-1 flex justify-between text-sm">
                                        <span className="text-gray-400">Solution</span>
                                        <span className="text-gray-200 font-medium">1</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MessageSquare size={16} className="text-teal-500" />
                                    <div className="flex-1 flex justify-between text-sm">
                                        <span className="text-gray-400">Discuss</span>
                                        <span className="text-gray-200 font-medium">0</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Star size={16} className="text-yellow-500" />
                                    <div className="flex-1 flex justify-between text-sm">
                                        <span className="text-gray-400">Reputation</span>
                                        <span className="text-gray-200 font-medium">0</span>
                                    </div>
                                </div>
                            </div>

                            {/* Languages */}
                            <div className="pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-bold text-gray-200">Languages</h2>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="px-2.5 py-1 rounded-full bg-[#333] text-gray-300 text-xs">C++</span>
                                        <div className="text-xs text-gray-400"><span className="text-gray-200 font-medium">{profile?.stats?.solvedProblems || 0}</span> problems solved</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT MAIN AREA */}
                    <div className="md:col-span-9 space-y-4">

                        {/* Top Row: Progress & Badges */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Progress Card */}
                            <div className="bg-[#282828] rounded-xl p-5 shadow-sm flex items-center justify-between">
                                <div className="relative w-32 h-32 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                        {/* Background Track */}
                                        <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#333" strokeWidth="4" />
                                        {/* Easy (Cyan) */}
                                        <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#00b8a3" strokeWidth="4" strokeDasharray={`${easyStroke} ${circumference}`} strokeLinecap="round" />
                                        {/* Medium (Yellow) - Offset by Easy */}
                                        <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#ffc01e" strokeWidth="4" strokeDasharray={`${medStroke} ${circumference}`} strokeDashoffset={-easyStroke} strokeLinecap="round" />
                                        {/* Hard (Red) - Offset by Easy+Medium */}
                                        <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#ff375f" strokeWidth="4" strokeDasharray={`${hardStroke} ${circumference}`} strokeDashoffset={-(easyStroke + medStroke)} strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                        <div className="text-2xl font-bold text-gray-100 leading-none">
                                            {totalSolved}<span className="text-xs text-gray-500 font-medium">/{totalProblems}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                                            <CheckSquare size={10} className="text-[#2cbb5d]" /> Solved
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 pl-8 space-y-3">
                                    <div className="bg-[#333] rounded-md px-3 py-2 flex flex-col text-center">
                                        <span className="text-xs text-[#00b8a3] font-medium">Easy</span>
                                        <span className="text-sm font-bold text-gray-200">{solvedEasy}<span className="text-gray-500 font-normal">/{totalEasy}</span></span>
                                    </div>
                                    <div className="bg-[#333] rounded-md px-3 py-2 flex flex-col text-center">
                                        <span className="text-xs text-[#ffc01e] font-medium">Med.</span>
                                        <span className="text-sm font-bold text-gray-200">{solvedMed}<span className="text-gray-500 font-normal">/{totalMed}</span></span>
                                    </div>
                                    <div className="bg-[#333] rounded-md px-3 py-2 flex flex-col text-center">
                                        <span className="text-xs text-[#ff375f] font-medium">Hard</span>
                                        <span className="text-sm font-bold text-gray-200">{solvedHard}<span className="text-gray-500 font-normal">/{totalHard}</span></span>
                                    </div>
                                </div>
                            </div>

                            {/* Badges Card (Mocked) */}
                            <div className="bg-[#282828] rounded-xl p-5 shadow-sm relative overflow-hidden">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-sm text-gray-400">Badges</div>
                                    <ChevronRight size={16} className="text-gray-500" />
                                </div>
                                {/* <div className="text-3xl font-bold text-gray-200 mb-4">3</div> */}

                                {/* <div className="flex items-center gap-4"> */}
                                {/* <div className="w-12 h-14 bg-[#333] clip-hexagon flex items-center justify-center border-2 border-blue-500 rounded-lg">
                                        <div className="text-xs font-bold text-blue-400">SQL</div>
                                    </div> */}
                                {/* </div> */}

                                {/* <div className="mt-4"> */}
                                {/* <div className="text-[11px] text-gray-500">Most Recent Badge</div>
                                    <div className="text-sm font-bold text-gray-200">50 Days Badge 2026</div> */}
                                {/* </div> */}
                            </div>
                        </div>

                        {/* Middle Row: Heatmap */}
                        <div className="bg-[#282828] rounded-xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-sm text-gray-200">
                                    <span className="text-lg font-bold mr-1">{profile?.stats?.totalSubmissions || 0}</span>
                                    submissions in the past one year
                                </div>
                                <div className="flex gap-4 text-xs text-gray-400">
                                    <div>Total active days: <span className="text-gray-200 font-medium">122</span></div>
                                    <div>Max streak: <span className="text-gray-200 font-medium">45</span></div>
                                </div>
                            </div>

                            <ActivityHeatmap submissions={profile?.submissions} />

                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span>
                            </div>
                        </div>

                        {/* Bottom Row: Recent AC */}
                        <div className="bg-[#282828] rounded-xl p-5 shadow-sm">
                            {/* Tabs */}
                            <div className="flex items-center justify-between mb-4 border-b border-[#444] pb-2">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setActiveTab("Recent AC")}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'Recent AC' ? 'bg-[#333] text-gray-200' : 'text-gray-400 hover:text-gray-200 hover:bg-[#333]/50'}`}
                                    >
                                        <Activity size={16} /> Recent AC
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("List")}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'List' ? 'bg-[#333] text-gray-200' : 'text-gray-400 hover:text-gray-200 hover:bg-[#333]/50'}`}
                                    >
                                        <List size={16} /> List
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("Solutions")}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'Solutions' ? 'bg-[#333] text-gray-200' : 'text-gray-400 hover:text-gray-200 hover:bg-[#333]/50'}`}
                                    >
                                        <CheckSquare size={16} /> Solutions
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("Discuss")}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'Discuss' ? 'bg-[#333] text-gray-200' : 'text-gray-400 hover:text-gray-200 hover:bg-[#333]/50'}`}
                                    >
                                        <MessageCircle size={16} /> Discuss
                                    </button>
                                </div>
                                <a href="#" className="text-xs text-gray-400 hover:text-gray-200 transition-colors flex items-center">
                                    View all submissions <ChevronRight size={14} />
                                </a>
                            </div>

                            {/* List Content */}
                            <div className="space-y-1">
                                {activeTab === "Recent AC" && (
                                    recentAC.length > 0 ? recentAC.map((sub, idx) => (
                                        <NavLink
                                            to={`/problems/${sub.problem.problemId}`}
                                            key={idx}
                                            className="flex items-center justify-between p-3 rounded-lg hover:bg-[#333] transition-colors group"
                                        >
                                            <div className="text-sm font-bold text-gray-300 group-hover:text-blue-400 transition-colors">
                                                {sub.problem.title}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {getRelativeTime(sub.createdAt)}
                                            </div>
                                        </NavLink>
                                    )) : (
                                        <div className="py-8 text-center text-sm text-gray-500">No recent accepted submissions.</div>
                                    )
                                )}
                                {activeTab !== "Recent AC" && (
                                    <div className="py-8 text-center text-sm text-gray-500">Content for {activeTab} is not available.</div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
