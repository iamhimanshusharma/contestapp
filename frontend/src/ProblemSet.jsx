import React, { useEffect, useState } from 'react'
import Problem from './Problem'
import { NavLink, Route, Router, Routes } from 'react-router'
import axios from 'axios';
import Header from "./Header"

const ProblemSet = () => {
    const [problemData, setProblemData] = useState([]);

    async function loadProblem() {
        try {
            const res = await axios.get(`http://localhost:5000/api/problems`);
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

    return (
        <>
            <Header />
            {problemData.map((item, index) => (
                <div key={index} className='border border-gray-300 ring-1 mx-2 my-1 rounded-md py-2'>
                    <NavLink to={`/problems/${item.problemId}`}>
                        <div className='flex items-center justify-around'>
                            <p className='text-md font-bold'>{item.title}</p>
                            <p className={`${getDifficulty(item.difficulty)} text-sm`}>{item.difficulty}</p>
                        </div>
                    </NavLink >
                </div >
            ))}
        </>
    )
}

export default ProblemSet