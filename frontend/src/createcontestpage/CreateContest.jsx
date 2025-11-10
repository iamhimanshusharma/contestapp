import React, { useState } from 'react'
import DescriptionPage from '../createchallengepage/DescriptionPage';
import { NavLink } from 'react-router';
import Header from '../Header';

const CreateContest = () => {



    return (
        <>
            <Header />
            <div>
                <div className='flex items-center justify-between m-2'>
                    <p className='text-xl text-gray-600 ml-2 font-bold'>Contest Details</p>
                    <NavLink to='/challenge/create' className='text-md font-bold text-green-500 shadow py-2 px-3 rounded-md cursor-pointer ring-3 ring-gray-100'>+ Create Challenge</NavLink>
                </div>
            </div>
        </>
    )
}

export default CreateContest