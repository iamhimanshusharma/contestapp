import React, { useCallback, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import Header from "./Header";
import { api } from "./api";
import { useAuth } from "./auth/AuthContext";

const ContestDetail = () => {
    const { contestId } = useParams();
    const { user, isAuthenticated } = useAuth();
    const [contest, setContest] = useState(null);
    const [message, setMessage] = useState("");

    const loadContest = useCallback(() => {
        api.get(`/contests/${contestId}`)
            .then((res) => setContest(res.data.contest))
            .catch((error) => setMessage(error.response?.data?.message || "Could not load contest"));
    }, [contestId]);

    useEffect(() => {
        loadContest();
    }, [loadContest]);

    const register = async () => {
        setMessage("");

        if (!isAuthenticated) {
            setMessage("Login is required before registering");
            return;
        }

        try {
            await api.post(`/contests/${contestId}/register`);
            setMessage("Registered for contest");
            loadContest();
        } catch (error) {
            setMessage(error.response?.data?.message || "Registration failed");
        }
    };

    if (!contest) {
        return (
            <>
                <Header />
                <p className="p-5 text-gray-500">{message || "Loading contest..."}</p>
            </>
        );
    }

    const isRegistered = Boolean(user && contest.registeredUsers?.some((userId) => userId === user._id));
    const canOpenProblems = isRegistered && contest.status === "live";
    const canRegister = contest.status === "upcoming" && !isRegistered;
    const statusMessage = contest.status === "ended"
        ? "This contest has ended. Registration is closed."
        : contest.status === "live"
            ? "This contest is live. Registration is closed."
            : isRegistered
                ? "You are registered. Problems unlock when the contest starts."
                : "Register before the start time to participate.";

    return (
        <>
            <Header />
            <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-700">{contest.contestName}</p>
                        <p className="text-gray-500 mt-1">{contest.status} - starts {new Date(contest.startTime).toLocaleString()} - {contest.durationMinutes} min</p>
                    </div>
                    <NavLink to={`/contests/${contest.contestId}/results`} className="py-2 px-4 bg-gray-700 text-white rounded-md shadow">
                        Results
                    </NavLink>
                </div>

                {message && <p className="text-sm text-red-600">{message}</p>}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {canRegister && (
                        <button onClick={register} className="py-2 px-4 bg-green-500 text-white rounded-md shadow hover:bg-green-600 cursor-pointer">
                            Register
                        </button>
                    )}
                    {isRegistered && <span className="py-2 px-4 bg-green-100 text-green-700 rounded-md font-medium">Registered</span>}
                    <p className="text-sm text-gray-500">{statusMessage}</p>
                </div>

                <div className="space-y-2">
                    <p className="text-xl font-bold text-gray-700">Problems</p>
                    {contest.problems.map((problem) => (
                        <div key={problem._id} className="ring-1 ring-gray-200 rounded-md p-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="font-bold">{problem.title}</p>
                                <p className="text-sm text-gray-500">{problem.problemId} - {problem.difficulty}</p>
                            </div>
                            {canOpenProblems ? (
                                <NavLink to={`/contests/${contest.contestId}/problems/${problem.problemId}`} className="text-blue-600 font-medium">
                                    Solve
                                </NavLink>
                            ) : (
                                <span className="text-gray-400">Locked</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ContestDetail;
