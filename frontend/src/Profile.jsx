import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Header from "./Header";
import { api } from "./api";
import { useAuth } from "./auth/AuthContext";

const ContestScoreLineChart = ({ scores = [] }) => {
    const width = 720;
    const height = 280;
    const padding = 42;
    const maxScore = Math.max(...scores.map((entry) => entry.score), 1);
    const points = scores.map((entry, index) => {
        const x = scores.length === 1
            ? width / 2
            : padding + (index * (width - padding * 2)) / (scores.length - 1);
        const y = height - padding - (entry.score / maxScore) * (height - padding * 2);
        return { ...entry, x, y };
    });
    const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

    return (
        <div className="overflow-x-auto">
            <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[620px] w-full h-auto" role="img" aria-label="Contest score line graph">
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#CBD5E1" strokeWidth="2" />
                <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#CBD5E1" strokeWidth="2" />
                <text x={padding} y={padding - 14} fill="currentColor" fontSize="13">{maxScore} pts</text>
                <text x={padding} y={height - 12} fill="currentColor" fontSize="13">0 pts</text>

                {points.length > 1 && <path d={linePath} fill="none" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />}

                {points.map((point, index) => (
                    <g key={point.contest._id || index}>
                        <title>{`${point.contest.contestName}: ${point.score} pts`}</title>
                        <circle cx={point.x} cy={point.y} r="8" fill="#22C55E" stroke="#FFFFFF" strokeWidth="3" />
                        <text x={point.x} y={height - 16} textAnchor="middle" fill="currentColor" fontSize="12">
                            {index + 1}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
};

const Profile = () => {
    const { user, isAuthenticated } = useAuth();
    const [profile, setProfile] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!isAuthenticated) return;

        api.get("/auth/profile")
            .then((res) => setProfile(res.data))
            .catch((error) => setMessage(error.response?.data?.message || "Could not load profile"));
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <>
                <Header />
                <div className="max-w-4xl mx-auto p-4 sm:p-6">
                    <p className="text-xl font-bold text-gray-700">Login to view your profile.</p>
                    <NavLink to="/login" className="inline-block mt-4 py-2 px-4 bg-green-500 text-white rounded-md">Login</NavLink>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50">
                <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
                    <div className="bg-white rounded-md p-6 ring-1 ring-gray-200">
                        <p className="text-2xl sm:text-3xl font-bold text-gray-800">@{user?.username}</p>
                        <p className="text-gray-500 mt-1">{user?.email}</p>
                        <p className="text-gray-500 mt-1">Theme preference: {user?.theme || "light"}</p>
                    </div>

                    {message && <p className="text-sm text-red-600">{message}</p>}

                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-md p-5 ring-1 ring-gray-200">
                            <p className="text-3xl font-bold text-gray-800">{profile?.stats?.solvedProblems || 0}</p>
                            <p className="text-gray-500">Solved Problems</p>
                        </div>
                        <div className="bg-white rounded-md p-5 ring-1 ring-gray-200">
                            <p className="text-3xl font-bold text-gray-800">{profile?.stats?.totalSubmissions || 0}</p>
                            <p className="text-gray-500">Submissions</p>
                        </div>
                        <div className="bg-white rounded-md p-5 ring-1 ring-gray-200">
                            <p className="text-3xl font-bold text-gray-800">{profile?.stats?.contestsAttempted || 0}</p>
                            <p className="text-gray-500">Contests Attempted</p>
                        </div>
                    </div>

                    <section className="bg-white rounded-md p-6 ring-1 ring-gray-200">
                        <p className="text-2xl font-bold text-gray-800 mb-1">Contest Ratings</p>
                        <p className="text-sm text-gray-500 mb-4">Each point is one contest. Hover a point to see the score.</p>
                        <div className="space-y-4">
                            {profile?.contestScores?.length > 0 && <ContestScoreLineChart scores={profile.contestScores} />}
                            {profile?.contestScores?.length === 0 && <p className="text-gray-500">No contest submissions yet.</p>}
                        </div>
                    </section>

                    <section className="bg-white rounded-md p-6 ring-1 ring-gray-200">
                        <p className="text-2xl font-bold text-gray-800 mb-4">Solved Problems and Submitted Code</p>
                        <div className="space-y-4">
                            {profile?.solvedProblems?.map((entry) => (
                                <details key={entry.problem._id} className="rounded-md ring-1 ring-gray-200 p-4">
                                    <summary className="cursor-pointer font-bold text-gray-800">
                                        {entry.problem.title} ({entry.problem.difficulty}) - {entry.language}
                                    </summary>
                                    <p className="text-sm text-gray-500 mt-2">Solved at {new Date(entry.solvedAt).toLocaleString()}</p>
                                    <pre className="mt-3 overflow-auto rounded-md bg-gray-900 p-4 text-sm text-gray-100">
                                        <code>{entry.code}</code>
                                    </pre>
                                    <div className="mt-4 space-y-2">
                                        <p className="font-bold text-gray-700">Submissions for this problem</p>
                                        {entry.submissions.map((submission) => (
                                            <details key={submission._id} className="rounded-md bg-gray-50 p-3 text-sm">
                                                <summary className="cursor-pointer">
                                                    <span className="mr-3">{submission.language}</span>
                                                    <span className={submission.passed ? "text-green-600" : "text-red-600"}>{submission.verdict}</span>
                                                    <span className="ml-3 text-gray-500">{new Date(submission.submittedAt).toLocaleString()}</span>
                                                </summary>
                                                <pre className="mt-3 overflow-auto rounded-md bg-gray-900 p-4 text-sm text-gray-100">
                                                    <code>{submission.code}</code>
                                                </pre>
                                            </details>
                                        ))}
                                    </div>
                                </details>
                            ))}
                            {profile?.solvedProblems?.length === 0 && <p className="text-gray-500">No solved problems yet.</p>}
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
};

export default Profile;
