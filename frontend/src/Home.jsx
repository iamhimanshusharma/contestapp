import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Header from './Header'
import { api } from './api'
import { useAuth } from './auth/AuthContext'

const Home = () => {
    const { user, isAuthenticated } = useAuth();
    const [stats, setStats] = useState({ problems: 0, contests: 0, liveContests: 0 });

    useEffect(() => {
        Promise.all([
            api.get("/problems"),
            api.get("/contests")
        ]).then(([problemRes, contestRes]) => {
            const contests = contestRes.data.contests || [];
            setStats({
                problems: problemRes.data.problems?.length || 0,
                contests: contests.length,
                liveContests: contests.filter((contest) => contest.status === "live").length
            });
        }).catch(() => {
            setStats({ problems: 0, contests: 0, liveContests: 0 });
        });
    }, []);

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50">
                <section className="bg-white border-b border-gray-200">
                    <div className="max-w-6xl mx-auto px-6 py-14 grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
                        <div>
                            <p className="text-sm font-bold text-green-600 uppercase">Code, compete, discuss</p>
                            <h1 className="text-5xl font-bold text-gray-900 mt-3 leading-tight">
                                Practice problems and run contests from one focused workspace.
                            </h1>
                            <p className="text-lg text-gray-600 mt-5 max-w-2xl">
                                Upload challenges, solve in the editor, register for contests before they start, and compare results after submissions are judged.
                            </p>
                            <div className="flex flex-wrap gap-3 mt-8">
                                <NavLink to="/problems" className="py-3 px-5 bg-green-500 text-white rounded-md shadow hover:bg-green-600">
                                    Start Solving
                                </NavLink>
                                <NavLink to="/contests" className="py-3 px-5 bg-gray-900 text-white rounded-md shadow hover:bg-black">
                                    View Contests
                                </NavLink>
                                {!isAuthenticated && (
                                    <NavLink to="/signin" className="py-3 px-5 bg-white text-gray-800 rounded-md ring-1 ring-gray-300 hover:bg-gray-100">
                                        Create Account
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-900 text-white rounded-md p-6 shadow">
                            <p className="text-gray-300">Welcome {user ? `@${user.username}` : "coder"}</p>
                            <div className="grid grid-cols-3 gap-3 mt-5">
                                <div className="bg-white text-gray-900 rounded-md p-4">
                                    <p className="text-3xl font-bold">{stats.problems}</p>
                                    <p className="text-sm text-gray-500">Problems</p>
                                </div>
                                <div className="bg-white text-gray-900 rounded-md p-4">
                                    <p className="text-3xl font-bold">{stats.contests}</p>
                                    <p className="text-sm text-gray-500">Contests</p>
                                </div>
                                <div className="bg-white text-gray-900 rounded-md p-4">
                                    <p className="text-3xl font-bold">{stats.liveContests}</p>
                                    <p className="text-sm text-gray-500">Live</p>
                                </div>
                            </div>
                            <div className="mt-6 space-y-3">
                                <NavLink to="/challenge/create" className="block py-3 px-4 rounded-md bg-green-500 hover:bg-green-600">
                                    Upload a Problem
                                </NavLink>
                                <NavLink to="/contests/create" className="block py-3 px-4 rounded-md bg-white text-gray-900 hover:bg-gray-100">
                                    Create a Contest
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-4">
                    {[
                        ["Practice", "Browse uploaded problems by difficulty and submit only after logging in."],
                        ["Compete", "Build contests from existing problems with a strict three-hour maximum duration."],
                        ["Discuss", "Ask questions in the community and reply when another user needs help."]
                    ].map(([title, body]) => (
                        <div key={title} className="bg-white rounded-md p-5 ring-1 ring-gray-200">
                            <p className="text-xl font-bold text-gray-800">{title}</p>
                            <p className="text-gray-600 mt-2">{body}</p>
                        </div>
                    ))}
                </section>
            </main>
        </>
    )
}

export default Home
