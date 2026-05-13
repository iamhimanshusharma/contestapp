import React from 'react'
import { NavLink } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { useAuth } from './auth/AuthContext'
import UserAvatar from './UserAvatar'

const Header = () => {
    const { user, logout, theme, updateTheme } = useAuth();
    const nextTheme = theme === "dark" ? "light" : "dark";

    return (
        <>
            <div className='flex flex-col gap-4 p-4 shadow rounded-md text-sm sm:text-md font-bold bg-white md:flex-row md:items-center md:justify-around md:p-5'>
                <div className='flex flex-wrap items-center justify-center gap-3 sm:gap-5'>
                    <NavLink to="/" className="px-1"><p>Home</p></NavLink>
                    <NavLink to="/problems" className="px-1"><p>Problems</p></NavLink>
                    <NavLink to="/contests" className="px-1">Contests</NavLink>
                    <NavLink to="/challenge/create" className="px-1">Upload Problem</NavLink>
                    <NavLink to="/community" className="px-1">Community</NavLink>
                </div>
                {user ? (
                    <div className='flex items-center justify-center gap-4'>
                        <button
                            onClick={() => updateTheme(nextTheme)}
                            className="cursor-pointer rounded-md p-2 ring-1 ring-gray-300 text-gray-700 hover:bg-gray-100"
                            title={`Switch to ${nextTheme} mode`}
                            aria-label={`Switch to ${nextTheme} mode`}
                        >
                            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <NavLink to="/profile" aria-label="Profile">
                            <UserAvatar user={user} />
                        </NavLink>
                        <button onClick={logout} className="cursor-pointer text-red-500">Logout</button>
                    </div>
                ) : (
                    <div className='flex items-center justify-center gap-4'>
                        <button
                            onClick={() => updateTheme(nextTheme)}
                            className="cursor-pointer rounded-md p-2 ring-1 ring-gray-300 text-gray-700 hover:bg-gray-100"
                            title={`Switch to ${nextTheme} mode`}
                            aria-label={`Switch to ${nextTheme} mode`}
                        >
                            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/signin">Sign Up</NavLink>
                    </div>
                )}
            </div>
        </>
    )
}

export default Header
