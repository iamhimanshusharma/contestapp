import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'

const Header = () => {
    const { user, logout, theme, updateTheme } = useAuth();
    const nextTheme = theme === "dark" ? "light" : "dark";

    return (
        <>
            <div className='flex items-center justify-around p-5 shadow rounded-md text-md font-bold bg-white'>
                <div className=' flex items-center justify-center'>
                    <NavLink to="/" className="mx-5"><p>Home</p></NavLink>
                    <NavLink to="/problems" className="mx-5"><p>Problems</p></NavLink>
                    <NavLink to="/contests" className="mx-5">Contests</NavLink>
                    <NavLink to="/challenge/create" className="mx-5">Upload Problem</NavLink>
                    <NavLink to="/community" className="mx-5">Community</NavLink>
                </div>
                {user ? (
                    <div className='flex items-center gap-4'>
                        <button
                            onClick={() => updateTheme(nextTheme)}
                            className="cursor-pointer rounded-md px-3 py-1 ring-1 ring-gray-300 text-gray-700"
                        >
                            {theme === "dark" ? "Light" : "Dark"}
                        </button>
                        <NavLink to="/profile" className='text-gray-600'>@{user.username}</NavLink>
                        <button onClick={logout} className="cursor-pointer text-red-500">Logout</button>
                    </div>
                ) : (
                    <div className='flex items-center gap-4'>
                        <button
                            onClick={() => updateTheme(nextTheme)}
                            className="cursor-pointer rounded-md px-3 py-1 ring-1 ring-gray-300 text-gray-700"
                        >
                            {theme === "dark" ? "Light" : "Dark"}
                        </button>
                        <NavLink to="/login" className="mx-5">Login</NavLink>
                        <NavLink to="/signin" className="mx-5">Sign Up</NavLink>
                    </div>
                )}
            </div>
        </>
    )
}

export default Header
