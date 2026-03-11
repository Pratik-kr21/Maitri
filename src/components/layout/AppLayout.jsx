import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
    { to: '/home', label: 'Dashboard' },
    { to: '/journal', label: 'Journal' },
    { to: '/community', label: 'Community' },
    { to: '/ask', label: 'Ask Maitri' },
    { to: '/vault', label: 'Vault' },
];

export default function AppLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    const avatarLetter = user?.username?.[0]?.toUpperCase() || 'M';

    return (
        <div className="min-h-screen bg-[#F8F4F5] flex flex-col">
            {/* ── Top Navbar ── */}
            <header className="bg-white border-b border-[#EDE0E3] sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 shadow-sm">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <img src="/favicon.svg" alt="Maitri logo" className="w-8 h-8" />
                            <span className="font-heading text-xl font-semibold text-[#2C1A1D]">Maitri</span>
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex space-x-6 h-full items-center">
                            {NAV.map(({ to, label }) => (
                                <NavLink key={to} to={to}
                                    className={({ isActive }) =>
                                        `text-sm font-medium transition-colors border-b-2 py-5 px-1 h-full flex items-center ${isActive
                                            ? 'border-[#E87A86] text-[#C85C6B]'
                                            : 'border-transparent text-[#6B4F53] hover:text-[#2C1A1D] hover:border-[#E87A86]/30'
                                        }`
                                    }>
                                    {label}
                                </NavLink>
                            ))}
                        </nav>

                        {/* Desktop Profile */}
                        <div className="hidden md:flex items-center gap-4 relative">
                            <button onClick={() => setShowMenu(!showMenu)} className="flex items-center gap-2 focus:outline-none bg-transparent hover:bg-black/5 rounded-full pl-2 pr-1 py-1 transition">
                                <div className="text-right hidden lg:block">
                                    <p className="text-sm font-semibold text-[#2C1A1D] leading-none">{user?.username}</p>
                                </div>
                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ring-2 ring-white"
                                    style={{ background: user?.avatarColor || '#E87A86' }}>
                                    {avatarLetter}
                                </div>
                            </button>

                            {/* Dropdown menu */}
                            {showMenu && (
                                <>
                                    <div className="fixed inset-0 z-40 cursor-default" onClick={() => setShowMenu(false)}></div>
                                    <div className="absolute top-12 right-0 mt-2 w-48 bg-white border border-[#EDE0E3] rounded-xl shadow-lg py-2 z-50">
                                        <Link to="/profile" onClick={() => setShowMenu(false)}
                                            className="block px-4 py-2 text-sm text-[#2C1A1D] hover:bg-[#F8F4F5] font-medium">
                                            Profile Settings
                                        </Link>
                                        <button onClick={() => { setShowMenu(false); logout(); }}
                                            className="block w-full text-left px-4 py-2 text-sm text-[#9E7A82] hover:bg-[#F8F4F5] font-medium">
                                            Sign out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button onClick={() => setShowMenu(!showMenu)} className="text-[#6B4F53] hover:text-[#2C1A1D]">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {showMenu
                                        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    }
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Nav Menu */}
                {showMenu && (
                    <div className="md:hidden border-t border-[#EDE0E3] bg-white absolute top-16 left-0 right-0 z-40 shadow-lg">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {NAV.map(({ to, label }) => (
                                <NavLink key={to} to={to} onClick={() => setShowMenu(false)}
                                    className={({ isActive }) =>
                                        `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-[#FDE0E4] text-[#C85C6B]' : 'text-[#6B4F53] hover:bg-[#F8F4F5]'
                                        }`
                                    }>
                                    {label}
                                </NavLink>
                            ))}
                        </div>
                        <div className="pt-4 pb-3 border-t border-[#EDE0E3]">
                            <div className="flex items-center px-5 gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                                    style={{ background: user?.avatarColor || '#E87A86' }}>
                                    {avatarLetter}
                                </div>
                                <div>
                                    <div className="text-base font-medium text-[#2C1A1D]">{user?.username}</div>
                                    <div className="text-sm font-medium text-[#9E7A82]">{user?.email}</div>
                                </div>
                            </div>
                            <div className="mt-3 px-2 space-y-1">
                                <Link to="/profile" onClick={() => setShowMenu(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-[#6B4F53] hover:bg-[#F8F4F5]">
                                    Profile Settings
                                </Link>
                                <button onClick={() => { setShowMenu(false); logout(); }}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[#9E7A82] hover:bg-[#F8F4F5]">
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* ── Main content ── */}
            <main className="flex-1 w-full flex flex-col h-[calc(100vh-64px)] overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
}
