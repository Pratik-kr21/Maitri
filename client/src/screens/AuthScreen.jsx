import React, { useState } from 'react';
import { ArrowUpRight, Lock, Loader2 } from 'lucide-react';
import axios from 'axios';
import GlassCard from '../components/common/GlassCard';
import PillButton from '../components/common/PillButton';

const AuthScreen = ({ onNavigate }) => {
    const [isSignUp, setIsSignUp] = useState(true);
    const [birthYear, setBirthYear] = useState('2000');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [parentEmail, setParentEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isMinor = (new Date().getFullYear() - parseInt(birthYear)) < 18;

    const handleAuth = async () => {
        try {
            setLoading(true);
            setError(null);

            if (isSignUp) {
                const res = await axios.post('http://localhost:5000/api/auth/register', {
                    username,
                    email,
                    password,
                    dateOfBirth: new Date(`${birthYear}-01-01`),
                    isMinor
                });
                localStorage.setItem('token', res.data.token);
                onNavigate('onboarding');
            } else {
                const res = await axios.post('http://localhost:5000/api/auth/login', {
                    email,
                    password
                });
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data));
                onNavigate('home');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--color-brand-secondary)] rounded-full blur-3xl opacity-50 animate-drift" />
            <div className="absolute bottom-20 right-10 w-64 h-64 bg-[var(--color-accent-peach)] rounded-full blur-3xl opacity-50 animate-drift" style={{ animationDelay: '2s' }} />

            <GlassCard className="w-full max-w-md relative z-10 p-8 shadow-floating">
                <div className="flex bg-[var(--color-bg-primary)] rounded-full p-1 mb-6">
                    <button
                        onClick={() => { setIsSignUp(true); setError(null); }}
                        className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${isSignUp ? 'bg-white shadow text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}
                    >
                        Sign up
                    </button>
                    <button
                        onClick={() => { setIsSignUp(false); setError(null); }}
                        className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${!isSignUp ? 'bg-white shadow text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}
                    >
                        Log in
                    </button>
                </div>

                <h2 className="text-3xl font-serif mb-6">{isSignUp ? 'Welcome to Maitri' : 'Welcome back'}</h2>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-4 mb-8">
                    {isSignUp && (
                        <div>
                            <label className="text-xs font-semibold text-[var(--color-text-secondary)] ml-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="e.g. priya_m"
                                className="w-full bg-[var(--color-bg-primary)] px-4 py-3 rounded-2xl mt-1 border border-[var(--color-border-light)] outline-none focus:border-[var(--color-brand-primary)]"
                            />
                            <p className="text-[10px] text-[var(--color-text-secondary)] ml-2 mt-1">This is how you'll appear in the community.</p>
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] ml-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full bg-[var(--color-bg-primary)] px-4 py-3 rounded-2xl mt-1 border border-[var(--color-border-light)] outline-none focus:border-[var(--color-brand-primary)]"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] ml-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-[var(--color-bg-primary)] px-4 py-3 rounded-2xl mt-1 border border-[var(--color-border-light)] outline-none focus:border-[var(--color-brand-primary)]"
                        />
                    </div>

                    {isSignUp && (
                        <div>
                            <label className="text-xs font-semibold text-[var(--color-text-secondary)] ml-2">Birth Year</label>
                            <select
                                value={birthYear}
                                onChange={(e) => setBirthYear(e.target.value)}
                                className="w-full bg-[var(--color-bg-primary)] px-4 py-3 rounded-2xl mt-1 border border-[var(--color-border-light)] outline-none focus:border-[var(--color-brand-primary)]"
                            >
                                {Array.from({ length: 40 }).map((_, i) => {
                                    const year = new Date().getFullYear() - 13 - i;
                                    return <option key={year} value={year}>{year}</option>
                                })}
                            </select>
                        </div>
                    )}

                    {isSignUp && isMinor && (
                        <div className="bg-[var(--color-accent-yellow)] bg-opacity-30 rounded-2xl p-4 text-sm font-medium border border-[var(--color-accent-yellow)] animate-floatUp">
                            <p className="mb-2">We'll send a quick note to a parent or guardian — it takes 30 seconds and keeps your space safe.</p>
                            <input
                                type="email"
                                value={parentEmail}
                                onChange={(e) => setParentEmail(e.target.value)}
                                placeholder="Parent/Guardian Email"
                                className="w-full bg-white px-4 py-2 rounded-xl border border-[var(--color-border-light)] outline-none"
                            />
                        </div>
                    )}
                </div>

                <button
                    onClick={handleAuth}
                    disabled={loading}
                    className="w-full bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-hover)] py-3 px-6 rounded-full font-medium transition-all transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-between shadow-md mb-3 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                    <span className="flex-1 text-center font-semibold">
                        {loading ? 'Processing...' : isSignUp ? 'Create your account' : 'Log in safely'}
                    </span>
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowUpRight size={20} className="opacity-80 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                </button>
                <p className="text-xs text-center text-[var(--color-text-secondary)] mb-6">Fully encrypted. Password protected.</p>

                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 mt-4 border-t border-[var(--color-border-light)] pt-4">
                    <Lock size={12} /> Your health data is encrypted and never sold.
                </div>
            </GlassCard>
        </div>
    );
};

export default AuthScreen;
