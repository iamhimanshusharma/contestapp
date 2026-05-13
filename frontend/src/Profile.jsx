import React, { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import Header from "./Header";
import { api } from "./api";
import { useAuth } from "./auth/AuthContext";

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

    const maxScore = useMemo(() => {
        const scores = profile?.contestScores?.map((entry) => entry.score) || [];
        return Math.max(...scores, 1);
    }, [profile]);

    if (!isAuthenticated) {
        return (
            <>
                <Header />
                <div className="max-w-4xl mx-auto p-6">
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
                <div className="max-w-6xl mx-auto p-6 space-y-6">
                    <div className="bg-white rounded-md p-6 ring-1 ring-gray-200">
                        <p className="text-3xl font-bold text-gray-800">@{user?.username}</p>
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
                        <p className="text-2xl font-bold text-gray-800 mb-4">Contest Scores</p>
                        <div className="space-y-4">
                            {profile?.contestScores?.map((entry) => (
                                <div key={entry.contest._id}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium">{entry.contest.contestName}</span>
                                        <span>{entry.score} pts</span>
                                    </div>
                                    <div className="h-5 bg-gray-200 rounded-md overflow-hidden">
                                        <div
                                            className="h-full bg-green-500"
                                            style={{ width: `${Math.max((entry.score / maxScore) * 100, 4)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
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
