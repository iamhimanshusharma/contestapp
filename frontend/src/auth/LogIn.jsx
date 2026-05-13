import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from './AuthContext'


const LogIn = () => {
    const navigate = useNavigate();
    const { applySession } = useAuth();
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const res = await api.post("/auth/login", form);
            applySession(res.data.token, res.data.user);
            navigate("/problems");
        } catch (error) {
            setMessage(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <>
            <div className='flex items-center justify-center p-2'>
                <form onSubmit={onSubmit} className='max-w-sm shadow rounded-md px-3 py-3 w-full'>
                    <p className='text-3xl font-md text-center pb-5'>Log In</p>
                    {message && <p className='mb-3 text-sm text-red-600'>{message}</p>}
                    <div className="mb-2">
                        <label className="font-medium mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="py-2 px-3 ring-2 ring-gray-200 rounded-md w-full"
                        />
                    </div>

                    <div className="mb-2">
                        <label className="font-medium mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
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
                        <NavLink to={`/signin`} className='font-medium text-blue-600'>Sign up</NavLink>
                    </div>
                </form>
            </div>
        </>
    )
}

export default LogIn
