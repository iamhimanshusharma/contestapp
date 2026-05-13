import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import { api } from "./api";

const ContestResults = () => {
    const { contestId } = useParams();
    const [data, setData] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        api.get(`/contests/${contestId}/results`)
            .then((res) => setData(res.data))
            .catch((error) => setMessage(error.response?.data?.message || "Could not load results"));
    }, [contestId]);

    return (
        <>
            <Header />
            <div className="max-w-5xl mx-auto p-4 sm:p-6">
                <p className="text-2xl font-bold text-gray-700 mb-4">
                    {data?.contest?.contestName || "Contest"} Results
                </p>
                {message && <p className="text-sm text-red-600">{message}</p>}
                <div className="overflow-auto ring-1 ring-gray-200 rounded-md">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3">Rank</th>
                                <th className="p-3">User</th>
                                <th className="p-3">Solved</th>
                                <th className="p-3">Score</th>
                                <th className="p-3">Last Submission</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.results?.map((result) => (
                                <tr key={result.user._id} className="border-t border-gray-200">
                                    <td className="p-3">{result.rank}</td>
                                    <td className="p-3">@{result.user.username}</td>
                                    <td className="p-3">{result.solved}</td>
                                    <td className="p-3">{result.score}</td>
                                    <td className="p-3">{new Date(result.lastSubmissionAt).toLocaleString()}</td>
                                </tr>
                            ))}
                            {data?.results?.length === 0 && (
                                <tr>
                                    <td className="p-3 text-gray-500" colSpan="5">No submissions yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ContestResults;
