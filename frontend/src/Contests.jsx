import React from 'react'
import Header from './Header'
import { NavLink } from 'react-router'

const Contests = () => {
    return (
        <>
            <Header />
            <div>
                <div className='flex items-center justify-between m-2'>
                    <p className='text-xl text-gray-600 ml-2 font-bold'>Upcoming Contests</p>
                    <NavLink to='/contests/create' className='text-md font-bold text-green-500 shadow py-2 px-3 rounded-md cursor-pointer ring-3 ring-gray-100'>+ Create Contest</NavLink>
                </div>
            </div>
        </>
    )
}

export default Contests