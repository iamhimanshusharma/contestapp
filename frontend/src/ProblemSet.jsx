import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { api } from './api';
import Header from "./Header"
import { useAuth } from './auth/AuthContext';

const ProblemSet = () => {
    const [problemData, setProblemData] = useState([]);
    const [solvedProblemIds, setSolvedProblemIds] = useState([]);
    const { isAuthenticated } = useAuth();

    async function loadProblem() {
        try {
            const res = await api.get(`/problems`);
            setProblemData(res.data.problems);
            console.log(res.data.problems);
        } catch (error) {
            console.log(error)
        }
    }

    function getDifficulty(diff) {
        switch (diff) {
            case "Easy":
                return "text-green-600";
            case "Medium":
                return "text-yellow-600";
            case "Hard":
                return "text-red-600";
            default:
                return null;
        }
    }

    useEffect(() => {
        loadProblem();
    }, [])

    useEffect(() => {
        if (!isAuthenticated) {
            setSolvedProblemIds([]);
            return;
        }

        api.get("/auth/profile")
            .then((res) => setSolvedProblemIds(res.data.solvedProblemIds || []))
            .catch(() => setSolvedProblemIds([]));
    }, [isAuthenticated]);

    return (
        <>
            <Header />
            <div className='flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5'>
                <p className='text-xl text-gray-600 font-bold'>Problems</p>
                <NavLink to="/challenge/create" className='text-center text-md font-bold text-green-500 shadow py-2 px-3 rounded-md cursor-pointer ring-2 ring-gray-100'>+ Upload Problem</NavLink>
            </div>
            {problemData.map((item, index) => (
                <div key={index} className='border border-gray-300 ring-1 mx-2 my-1 rounded-md py-2'>
                    <NavLink to={`/problems/${item.problemId}`}>
                        <div className='flex items-center justify-between gap-3 px-4'>
                            <p className='text-md font-bold flex items-center gap-2'>
                                {solvedProblemIds.includes(item.problemId) && <CheckCircle size={18} className="text-green-500" />}
                                {item.title}
                            </p>
                            <p className={`${getDifficulty(item.difficulty)} text-sm`}>{item.difficulty}</p>
                        </div>
                    </NavLink >
                </div >
            ))}
        </>
    )
}

export default ProblemSet
