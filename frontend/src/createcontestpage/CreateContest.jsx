import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import { api } from '../api';
import { useAuth } from '../auth/AuthContext';

const slugify = (value) => value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const CreateContest = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [problems, setProblems] = useState([]);
    const [selectedProblems, setSelectedProblems] = useState([]);
    const [form, setForm] = useState({
        contestName: "",
        contestId: "",
        startTime: "",
        durationMinutes: 120,
        totalPoints: 100
    });
    const [message, setMessage] = useState("");
    const [contestIdEdited, setContestIdEdited] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        api.get("/problems")
            .then((res) => setProblems(res.data.problems))
            .catch(() => setMessage("Could not load problems"));
    }, []);

    const updateForm = (key, value) => {
        setForm((current) => ({
            ...current,
            [key]: value,
            contestId: key === "contestName" && !contestIdEdited ? slugify(value) : current.contestId
        }));
    };

    const toggleProblem = (problemId) => {
        setSelectedProblems((current) => {
            if (current.includes(problemId)) {
                return current.filter((id) => id !== problemId);
            }

            return [...current, problemId];
        });
    };

    const filteredProblems = problems.filter((problem) => {
        const query = search.trim().toLowerCase();
        if (!query) return true;

        return [problem.title, problem.problemId, problem.difficulty]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(query));
    });

    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!isAuthenticated) {
            setMessage("Login is required before creating a contest");
            return;
        }

        if (Number(form.durationMinutes) > 180) {
            setMessage("Contest duration cannot be more than 3 hours");
            return;
        }

        try {
            const res = await api.post("/contests", {
                ...form,
                durationMinutes: Number(form.durationMinutes),
                totalPoints: Number(form.totalPoints),
                problems: selectedProblems
            });
            navigate(`/contests/${res.data.contest.contestId}`);
        } catch (error) {
            setMessage(error.response?.data?.message || "Contest creation failed");
        }
    };

    return (
        <>
            <Header />
            <form onSubmit={onSubmit} className="max-w-4xl mx-auto p-6 space-y-5">
                <div className="flex items-center justify-between">
                    <p className="text-2xl text-gray-700 font-bold">Create Contest</p>
                    <button className="py-2 px-4 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition cursor-pointer">
                        Create
                    </button>
                </div>

                {message && <p className="text-sm text-red-600">{message}</p>}

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="font-medium mb-1 block">Contest Name</label>
                        <input
                            value={form.contestName}
                            onChange={(e) => updateForm("contestName", e.target.value)}
                            className="py-2 px-3 ring-2 ring-gray-200 rounded-md w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="font-medium mb-1 block">Contest Id</label>
                        <input
                            value={form.contestId}
                            onChange={(e) => {
                                setContestIdEdited(true);
                                updateForm("contestId", slugify(e.target.value));
                            }}
                            className="py-2 px-3 ring-2 ring-gray-200 rounded-md w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="font-medium mb-1 block">Start Time</label>
                        <input
                            type="datetime-local"
                            value={form.startTime}
                            onChange={(e) => updateForm("startTime", e.target.value)}
                            className="py-2 px-3 ring-2 ring-gray-200 rounded-md w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="font-medium mb-1 block">Duration Minutes</label>
                        <input
                            type="number"
                            min="1"
                            max="180"
                            value={form.durationMinutes}
                            onChange={(e) => updateForm("durationMinutes", e.target.value)}
                            className="py-2 px-3 ring-2 ring-gray-200 rounded-md w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="font-medium mb-1 block">Total Points</label>
                        <input
                            type="number"
                            min="1"
                            value={form.totalPoints}
                            onChange={(e) => updateForm("totalPoints", e.target.value)}
                            className="py-2 px-3 ring-2 ring-gray-200 rounded-md w-full"
                            required
                        />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xl text-gray-700 font-bold">Problems</p>
                        <p className="text-sm text-gray-500">{selectedProblems.length} selected</p>
                    </div>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by title, id, or difficulty"
                        className="mb-3 py-2 px-3 ring-2 ring-gray-200 rounded-md w-full"
                    />
                    <div className="space-y-2">
                        {filteredProblems.map((problem) => (
                            <label key={problem._id} className="flex items-center justify-between ring-1 ring-gray-200 rounded-md p-3 cursor-pointer">
                                <div>
                                    <p className="font-bold">{problem.title}</p>
                                    <p className="text-sm text-gray-500">{problem.problemId} - {problem.difficulty}</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={selectedProblems.includes(problem._id)}
                                    onChange={() => toggleProblem(problem._id)}
                                    className="w-5 h-5"
                                />
                            </label>
                        ))}
                        {problems.length === 0 && <p className="text-gray-500">Upload problems before creating a contest.</p>}
                        {problems.length > 0 && filteredProblems.length === 0 && <p className="text-gray-500">No problems match your search.</p>}
                    </div>
                </div>
            </form>
        </>
    )
}

export default CreateContest
