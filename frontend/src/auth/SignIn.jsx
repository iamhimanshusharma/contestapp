import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from './AuthContext'
import Header from '../Header'
import { Eye, EyeOff, Github, Chrome, Apple, MoreHorizontal, CheckCircle2 } from 'lucide-react'

const LeetCodeLogo = () => (
    <div className="flex flex-col items-center mb-6">
        <div className="w-10 h-10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-[#ffa116]">
                <path d="M16 18l2.29-2.29c.39-.39.39-1.02 0-1.41l-2.29-2.29" />
                <path d="M22 12l-10-10L2 12l10 10 10-10z" />
            </svg>
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-2 tracking-tight">ContestApp</span>
    </div>
);

const SignIn = () => {
    const navigate = useNavigate();
    const { applySession } = useAuth();
    const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (form.password !== form.confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        try {
            const res = await api.post("/auth/signup", {
                email: form.email,
                password: form.password
            });
            applySession(res.data.token, res.data.user);
            navigate("/problems");
        } catch (error) {
            setMessage(error.response?.data?.message || "Sign up failed");
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f8fa] dark:bg-[#1a1a1a] flex flex-col font-sans">
            <Header />
            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-[400px] bg-white dark:bg-[#282828] rounded-lg p-6 sm:p-8 shadow-sm border border-transparent dark:border-[#333]">
                    <LeetCodeLogo />

                    {message && <p className='mb-4 text-sm text-red-500 text-center'>{message}</p>}

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                placeholder="Username or E-mail"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full h-[38px] px-3 bg-white dark:bg-[#333] border border-gray-300 dark:border-[#444] rounded-md text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-colors"
                            />
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full h-[38px] pl-3 pr-10 bg-white dark:bg-[#333] border border-gray-300 dark:border-[#444] rounded-md text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                value={form.confirmPassword}
                                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                className="w-full h-[38px] pl-3 pr-10 bg-white dark:bg-[#333] border border-gray-300 dark:border-[#444] rounded-md text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        <button type="submit" className="w-full h-10 mt-2 bg-[#42505a] hover:bg-[#344049] dark:bg-[#e0e0e0] dark:hover:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-md transition-colors">
                            Sign Up
                        </button>
                    </form>

                    <div className="mt-4 text-center text-[11px] text-gray-500 dark:text-gray-400">
                        By continuing, you agree to <span className="text-blue-500 cursor-pointer hover:underline">Terms</span> & <span className="text-blue-500 cursor-pointer hover:underline">Privacy Policy</span>.
                    </div>

                    <div className="flex justify-center items-center mt-6 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Already have an account? </span>
                        <NavLink to="/login" className="ml-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">Log in</NavLink>
                    </div>

                    {/* <div className="relative mt-6 mb-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-[#444]"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-white dark:bg-[#282828] text-gray-400">or you can sign up with</span>
                        </div>
                    </div> */}

                    {/* <div className="flex justify-center gap-4 mt-4"> */}
                    {/* <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#333] hover:bg-gray-200 dark:hover:bg-[#444] flex items-center justify-center transition-colors text-gray-500 dark:text-gray-400">
                            <Chrome size={16} />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#333] hover:bg-gray-200 dark:hover:bg-[#444] flex items-center justify-center transition-colors text-gray-500 dark:text-gray-400">
                            <Github size={16} />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#333] hover:bg-gray-200 dark:hover:bg-[#444] flex items-center justify-center transition-colors text-gray-500 dark:text-gray-400">
                            <Apple size={16} />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#333] hover:bg-gray-200 dark:hover:bg-[#444] flex items-center justify-center transition-colors text-gray-500 dark:text-gray-400">
                            <MoreHorizontal size={16} />
                        </button> */}
                    {/* </div> */}
                </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-200 dark:border-[#333] text-[11px] text-gray-500 dark:text-gray-400 bg-transparent">
                <div>Copyright © 2026 ContestApp</div>
                <div className="flex flex-wrap items-center justify-center gap-4 mt-2 sm:mt-0">
                    {/* <span className="cursor-pointer hover:text-gray-800 dark:hover:text-gray-300">Download App</span>
                    <span className="cursor-pointer hover:text-gray-800 dark:hover:text-gray-300">Help Center</span>
                    <span className="cursor-pointer hover:text-gray-800 dark:hover:text-gray-300">Bug Bounty</span>
                    <span className="cursor-pointer hover:text-gray-800 dark:hover:text-gray-300">Online Interview</span>
                    <span className="cursor-pointer hover:text-gray-800 dark:hover:text-gray-300">Terms</span>
                    <span className="cursor-pointer hover:text-gray-800 dark:hover:text-gray-300">Privacy Policy</span> */}
                </div>
                <div className="flex items-center gap-1 mt-2 sm:mt-0">
                    <span className="w-4 h-3 rounded-[2px] bg-[url('https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg')] bg-cover inline-block bg-gray-300 dark:bg-gray-600"></span>
                    <span>India</span>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
