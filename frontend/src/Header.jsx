import React from 'react'
import { NavLink } from 'react-router'

const Header = () => {
    return (
        <>
            <div className='flex items-center justify-around p-5 shadow rounded-md text-md font-bold'>
                <div className=' flex items-center justify-center'>
                    <NavLink to="/" className="mx-5"><p>Home</p></NavLink>
                    <NavLink to="/problems" className="mx-5"><p>Problems</p></NavLink>
                    <NavLink to="/contests" className="mx-5">Contests</NavLink>
                    <NavLink to="/community" className="mx-5">Community</NavLink>
                </div>
                <div>
                    <NavLink to="/login" className="mx-5">Login</NavLink>
                    <NavLink to="/signin" className="mx-5">SignIn</NavLink>
                </div>
            </div>
        </>
    )
}

export default Header