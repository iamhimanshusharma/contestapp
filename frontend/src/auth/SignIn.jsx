import React from 'react'
import { NavLink, Route, Router, Routes } from 'react-router'


const SignIn = () => {
    return (
        <>
            <div className='flex items-center justify-center p-2'>
                <div className='max-w-sm shadow rounded-md px-3 py-3'>
                    <p className='text-3xl font-md text-center pb-5'>Sign In</p>
                    <div className="mb-2">
                        <label className="font-medium mb-1">First Name</label>
                        <input
                            type="text"
                            placeholder="First Name"
                            className="py-2 px-3 ring-2 ring-gray-200 rounded-md w-full"
                        />
                    </div>

                    <div className="mb-2">
                        <label className="font-medium mb-1">Last Name</label>
                        <input
                            type="text"
                            placeholder="Last Name"
                            className="py-2 px-3 ring-2 ring-gray-200 rounded-md w-full"
                        />
                    </div>

                    <div className="mb-2">
                        <label className="font-medium mb-1">Gender</label>
                        <select
                            name="difficulty"
                            className="py-2 px-3 ring-2 ring-gray-200 rounded-md w-full">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="rathernotsay">Rather Not Say</option>
                        </select>
                    </div>

                    <div className="mb-2">
                        <label className="font-medium mb-1">Password</label>
                        <input
                            type="text"
                            placeholder="Password"
                            className="py-2 px-3 ring-2 ring-gray-200 rounded-md w-full"
                        />
                    </div>

                    <div className="mb-2">
                        <label className="font-medium mb-1">Confirm Password</label>
                        <input
                            type="text"
                            placeholder="Confirm Password"
                            className="py-2 px-3 ring-2 ring-gray-200 rounded-md w-full"
                        />
                    </div>

                    <div className="pt-2">
                        <button className="w-full py-2 px-4 bg-green-500 text-white text-lg rounded-md shadow hover:bg-green-600 transition cursor-pointer">
                            Sign In
                        </button>
                    </div>

                    <div className='flex items-center justify-center gap-2 mt-2'>
                        <p>Already have an account?</p>
                        <NavLink to={`/login`} className='font-medium text-blue-600'>Login</NavLink>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignIn