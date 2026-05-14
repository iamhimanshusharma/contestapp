import React, { useEffect, useState } from 'react'
import Header from './Header'
import { NavLink } from 'react-router-dom'
import { api } from './api';

const Contests = () => {
    const [contests, setContests] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        api.get("/contests")
            .then((res) => setContests(res.data.contests))
            .catch(() => setMessage("Could not load contests"));
    }, []);

    const formatDate = (value) => new Date(value).toLocaleString();

    return (
        <>
            <Header />
            <div className='p-4 sm:p-5'>
                <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                    <p className='text-xl text-gray-600 ml-2 font-bold'>Contests</p>
                    <NavLink to='/contests/create' className='text-center text-md font-bold text-[#ffa116] shadow-lg py-2 px-3 rounded-md cursor-pointer ring-2'>+ Create Contest</NavLink>
                </div>
                {message && <p className='text-sm text-red-600 mt-3'>{message}</p>}
            </div>
            <div className='mx-auto'>
                <div className='grid grid-cols-1 gap-4 p-4 sm:flex sm:flex-wrap sm:items-center sm:justify-start sm:p-5'>
                    {contests.map((item) => (
                        <div key={item._id} className='ring-1 ring-gray-200 rounded-md p-5 shadow-md w-full sm:w-80'>
                            <p className='text-2xl font-medium mb-4'>{item.contestName}</p>
                            <p><span className='text-md font-medium'>Status: </span>{item.status}</p>
                            <p><span className='text-md font-medium'>Start: </span>{formatDate(item.startTime)}</p>
                            <p><span className='text-md font-medium'>Duration: </span>{item.durationMinutes} min</p>
                            <p><span className='text-md font-medium'>Points: </span>{item.totalPoints}</p>
                            <div className='grid grid-cols-1 gap-2 sm:flex sm:gap-3'>
                                <NavLink to={`/contests/${item.contestId}`} className='w-full text-center py-2 bg-[#ffa116] hover:bg-[#e8920f] mb-2 mt-5 rounded-md text-white shadow cursor-pointer transition'>Open</NavLink>
                                <NavLink to={`/contests/${item.contestId}/results`} className='w-full text-center py-2 bg-gray-700 mb-2 mt-5 rounded-md text-white shadow cursor-pointer hover:bg-gray-800 transition'>Results</NavLink>
                            </div>
                        </div>
                    ))}
                    {contests.length === 0 && <p className='text-gray-500'>No contests created yet.</p>}
                </div>
            </div>
        </>
    )
}

export default Contests
