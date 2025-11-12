import React, { useEffect, useState } from 'react'
import DescriptionPage from '../createchallengepage/DescriptionPage';
import { NavLink } from 'react-router';
import Header from '../Header';
import axios from 'axios';

const SelectProblems = () => {
    const [problemData, setProblemData] = useState([]);
    const [seletedProblem, setSelectedProbem] = useState([]);

    async function loadProblem() {
        try {
            const res = await axios.get(`http://localhost:5000/api/problems`);
            setProblemData(res.data.problems);
            console.log(res.data.problems);
        } catch (error) {
            console.log(error)
        }
    }

    function onSelectHandler(e) {
        const { name, value } = e.target;
        const index = seletedProblem.findIndex(item => item.value === value);

        if (index !== -1) {
            const newSelectedProblems = [...seletedProblem];
            newSelectedProblems.splice(index, 1);
            setSelectedProbem(newSelectedProblems);
        } else {
            setSelectedProbem(prevProblems => [
                ...prevProblems,
                { name, value }
            ]);
        }
    }

    useEffect(() => {
    }, [seletedProblem])

    useEffect(() => {
        loadProblem();
    }, [])


    return (
        <>
            <div className='flex items-center justify-around'>
                <div>
                    <input type="text" className='py-2 px-4 ring-2 ring-gray-200 mx-5 rounded-md' placeholder='Search Problem...' />
                    <button className="py-2 px-4 bg-green-500 text-white text-lg rounded-md shadow hover:bg-green-600 transition">
                        Search
                    </button>
                </div>
                <NavLink to='/challenge/create' className='text-md font-bold text-green-500 shadow py-2 px-3 rounded-md cursor-pointer ring-3 ring-gray-100'>+ Create Challenge</NavLink>
            </div>
            <div className="flex justify-center items-start">
                <div className="lg:w-1/2 md:w-full bg-white space-y-2">
                    <div className='m-4'>
                        <p className='text-2xl ml-2 text-gray-500 font-bold'>Selected Problems</p>
                        {seletedProblem.length > 0 ? (seletedProblem.map((item, index) => (
                            <div key={index} className='ring-1 px-4 py-2 m-1 rounded-md'>
                                <span>{item.name}</span>
                            </div>
                        ))) : <p className='text-gray-400'>Selected problem will show here.</p>}
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-4 mb-5 mr-5">
                        <button className="py-2 px-4 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition cursor-pointer">
                            Save Changes
                        </button>
                        <button className="py-2 px-4 bg-green-500 text-white text-lg rounded-md shadow hover:bg-green-600 transition cursor-pointer">
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SelectProblems