import React from 'react'
import { NavLink, Route, Router, Routes } from 'react-router'


const LogIn = () => {
    return (
        <>
            <div className='flex items-center justify-center p-2'>
                <div className='max-w-sm shadow rounded-md px-3 py-3'>
                    <p className='text-3xl font-md text-center pb-5'>Log In</p>
                    <div className="mb-2">
                        <label className="font-medium mb-1">Userame or Email</label>
                        <input
                            type="text"
                            placeholder="Username or Email"
                            className="py-2 px-3 ring-2 ring-gray-200 rounded-md w-full"
                        />
                    </div>

                    <div className="mb-2">
                        <label className="font-medium mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            className="py-2 px-3 ring-2 ring-gray-200 rounded-md w-full"
                        />
                    </div>

                    <div className="pt-2">
                        <button className="w-full py-2 px-4 bg-green-500 text-white text-lg rounded-md shadow hover:bg-green-600 transition cursor-pointer">
                            Log In
                        </button>
                    </div>

                    <div className='flex items-center justify-center gap-2 mt-2'>
                        <p>Don't have an account?</p>
                        <NavLink to={`/signin`} className='font-medium text-blue-600'>Signin</NavLink>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LogIn