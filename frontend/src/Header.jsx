import React, { useRef, useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Moon, Sun, Search, Bell, Flame, ChevronRight, List, BookOpen, TrendingUp, Coins, FlaskConical, ShoppingBag, Gamepad2, Settings, Palette, LogOut, ChevronLeft } from 'lucide-react'
import { useAuth } from './auth/AuthContext'
import UserAvatar from './UserAvatar'

const Header = () => {
    const { user, logout, theme, updateTheme } = useAuth();
    const navigate = useNavigate();
    const nextTheme = theme === "dark" ? "light" : "dark";
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navLinkClasses = ({ isActive }) =>
        `px-3 h-14 flex items-center text-sm transition-colors ${isActive
            ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white font-semibold'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium border-b-2 border-transparent'
        }`;

    const handleLogout = () => {
        setDropdownOpen(false);
        logout();
        navigate('/login');
    };

    const quickActions = [
        { icon: <List size={22} className="text-orange-400" />, label: 'My Lists', bg: 'bg-gray-100 dark:bg-[#3a3a3a]' },
        { icon: <BookOpen size={22} className="text-blue-400" />, label: 'Notebook', bg: 'bg-gray-100 dark:bg-[#3a3a3a]' },
        { icon: <TrendingUp size={22} className="text-green-400" />, label: 'Progress', bg: 'bg-gray-100 dark:bg-[#3a3a3a]' },
        { icon: <Coins size={22} className="text-yellow-500" />, label: 'Points', bg: 'bg-gray-100 dark:bg-[#3a3a3a]', golden: true },
    ];

    const menuItems = [
        { icon: <FlaskConical size={17} />, label: 'Try New Features' },
        { icon: <ShoppingBag size={17} />, label: 'Orders' },
        { icon: <Gamepad2 size={17} />, label: 'My Playgrounds' },
        { icon: <Settings size={17} />, label: 'Settings' },
        { icon: <Palette size={17} />, label: 'Appearance', chevron: true },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#282828] shadow-sm">
            <div className="flex h-14 items-center justify-between px-4 sm:px-6">
                <div className="flex items-center gap-6 h-full">
                    {/* Logo */}
                    <NavLink to="/" className="flex items-center gap-2">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-8 h-8 mt-6 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-[#ffa116]">
                                    <path d="M16 18l2.29-2.29c.39-.39.39-1.02 0-1.41l-2.29-2.29" />
                                    <path d="M22 12l-10-10L2 12l10 10 10-10z" />
                                </svg>
                            </div>
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white hidden sm:block">ContestApp</span>
                    </NavLink>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-1 h-full">
                        <NavLink to="/problems" className={navLinkClasses}>Problems</NavLink>
                        <NavLink to="/contests" className={navLinkClasses}>Contest</NavLink>
                        <NavLink to="/community" className={navLinkClasses}>Discuss</NavLink>
                        <NavLink to="/interview" className={navLinkClasses}>Interview</NavLink>
                        <NavLink to="/store" className={navLinkClasses}>Store</NavLink>
                    </nav>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Search */}
                    <div className="hidden sm:flex items-center relative">
                        <Search className="absolute left-2.5 top-1.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="h-7 w-32 md:w-48 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-[#333333] pl-8 pr-3 text-xs text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#ffa116]"
                        />
                    </div>

                    {/* Icons */}
                    <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                        <button className="hover:text-gray-900 dark:hover:text-white transition-colors relative">
                            <Bell size={18} />
                            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 border border-white dark:border-[#282828]"></span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors">
                            <Flame size={18} />
                            <span className="text-xs font-medium">0</span>
                        </button>
                        <button
                            onClick={() => updateTheme(nextTheme)}
                            className="hover:text-gray-900 dark:hover:text-white transition-colors"
                            title={`Switch to ${nextTheme} mode`}
                        >
                            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>

                    {/* Auth & Avatar */}
                    {user ? (
                        <div className="flex items-center gap-3" ref={dropdownRef}>
                            {/* Avatar button */}
                            <button
                                id="avatar-btn"
                                onClick={() => setDropdownOpen((prev) => !prev)}
                                className="w-8 h-8 rounded-full overflow-hidden border-2 border-transparent hover:border-[#ffa116] transition-all focus:outline-none"
                            >
                                <UserAvatar user={user} />
                            </button>

                            {/* Dropdown */}
                            {dropdownOpen && (
                                <div className="absolute top-14 right-4 sm:right-6 w-72 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-xl shadow-2xl z-[100] overflow-y-auto animate-fade-in-down" style={{ maxHeight: 'calc(100vh - 72px)' }}>
                                    {/* User header — click to go to /profile */}
                                    <button
                                        onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-[#2a2a2a] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors text-left"
                                    >
                                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#ffa116]/40">
                                            <UserAvatar user={user} />
                                        </div>
                                        <div>
                                            <div className="text-gray-900 dark:text-white font-semibold text-sm leading-tight">{user.name || user.email}</div>
                                            <div className="text-[#ffa116] text-xs mt-0.5 leading-tight">Access all features with our Premium subscription!</div>
                                        </div>
                                    </button>

                                    {/* Quick action grid — 4 cols compact */}
                                    <div className="grid grid-cols-4 gap-2 px-3 py-3 border-b border-gray-200 dark:border-[#2a2a2a]">
                                        {quickActions.map((action, i) => (
                                            <button key={i} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-transparent hover:bg-gray-100 dark:bg-[#2a2a2a] dark:hover:bg-[#333] transition-colors group">
                                                <div className={`w-8 h-8 rounded-lg ${i === 3 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : action.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                                                    {i === 3 ? <Coins size={17} className="text-white" /> : React.cloneElement(action.icon, { size: 17 })}
                                                </div>
                                                <span className="text-[10px] text-gray-600 dark:text-gray-300 font-medium leading-tight text-center">{action.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Menu items */}
                                    <div className="py-2">
                                        {menuItems.map((item, i) => (
                                            <button key={i} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                                <span className="text-gray-500 dark:text-gray-400">{item.icon}</span>
                                                <span className="text-sm flex-1 text-left">{item.label}</span>
                                                {item.chevron && <ChevronRight size={14} className="text-gray-400 dark:text-gray-500" />}
                                            </button>
                                        ))}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
                                        >
                                            <LogOut size={17} className="text-gray-500 dark:text-gray-400 group-hover:text-red-500" />
                                            <span className="text-sm">Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* After login premium button */}
                            {/* <NavLink to="/premium" className="hidden sm:flex items-center justify-center h-7 px-3 rounded bg-[#ffa116]/10 text-[#ffa116] hover:bg-[#ffa116]/20 text-xs font-semibold transition-colors">
                                Premium
                            </NavLink> */}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            {/* <NavLink to="/login" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md">Log In</NavLink> */}
                            <NavLink to="/signin" className="hidden sm:flex items-center justify-center h-7 px-3 rounded bg-[#ffa116]/10 text-[#ffa116] hover:bg-[#ffa116]/20 text-sm font-semibold transition-colors">
                                Sign Up
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
