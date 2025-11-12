import React, { useEffect, useState } from 'react'
import Header from './Header'
import { NavLink } from 'react-router'
import axios from 'axios';

const Contests = () => {
    const constests = [
        { contestName: "Constest One", contestId: "contestone", startdate: "24th November, 2025", starttime: "12:00 PM", duration: "02:00h", points: "100pts" },
        { contestName: "Constest Two", contestId: "contesttwo", startdate: "27th November, 2025", starttime: "7:00 PM", duration: "02:30h", points: "200pts" },
        { contestName: "Constest Three", contestId: "contestthree", startdate: "29th November, 2025", starttime: "11:00 AM", duration: "01:00h", points: "250pts" },
        { contestName: "Constest Four", contestId: "contestfour", startdate: "25th November, 2025", starttime: "9:00 AM", duration: "01:30h", points: "100pts" },
        { contestName: "Constest Five", contestId: "contestfive", startdate: "27th November, 2025", starttime: "3:00 PM", duration: "03:00h", points: "200pts" },
    ]
    return (
        <>
            <Header />
            <div className='p-5'>
                <div className='flex items-center justify-between'>
                    <p className='text-xl text-gray-600 ml-2 font-bold'>Upcoming Contests</p>
                    <NavLink to='/contests/create' className='text-md font-bold text-green-500 shadow-lg py-2 px-3 rounded-md cursor-pointer ring-2'>+ Create Contest</NavLink>
                </div>
            </div>
            <div className='mx-auto'>
                <div className='flex flex-wrap items-center justify-start overflow-auto p-5'>
                    {constests.map((item, index) => (
                        <div key={index} className='ring-1 ring-gray-200 rounded-3xl p-5 shadow-md mb-4 mr-4'>
                            <p className='text-2xl font-medium mb-4'>{item.contestName}</p>
                            <p><span className='text-md font-medium'>Start Date: </span>{item.startdate}</p>
                            <p><span className='text-md font-medium'>Start Time: </span>{item.starttime}</p>
                            <p><span className='text-md font-medium'>Duration: </span>{item.duration}</p>
                            <p><span className='text-md font-medium'>Points: </span>{item.points}</p>
                            <div className='flex gap-3'>
                                <button className='w-full py-2 bg-green-500 mb-2 mt-5 rounded-lg text-white shadow cursor-pointer hover:bg-green-600 transition'>Join</button>
                                <button className='w-full py-2 bg-green-500 mb-2 mt-5 rounded-lg text-white shadow cursor-pointer hover:bg-green-600 transition'>More...</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Contests