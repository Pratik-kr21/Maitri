import React, { useState } from 'react';
import { ArrowUpRight, Lock } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import PillButton from '../components/common/PillButton';

const AuthScreen = ({ onNavigate }) => {
    const [isSignUp, setIsSignUp] = useState(true);
    const [birthYear, setBirthYear] = useState('2000');

    const isMinor = (new Date().getFullYear() - parseInt(birthYear)) < 18;

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--color-brand-secondary)] rounded-full blur-3xl opacity-50 animate-drift" />
            <div className="absolute bottom-20 right-10 w-64 h-64 bg-[var(--color-accent-peach)] rounded-full blur-3xl opacity-50 animate-drift" style={{ animationDelay: '2s' }} />

            <GlassCard className="w-full max-w-md relative z-10 p-8 shadow-floating">
                <div className="flex bg-[var(--color-bg-primary)] rounded-full p-1 mb-6">
                    <button
                        onClick={() => setIsSignUp(true)}
                        className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${isSignUp ? 'bg-white shadow text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}
                    >
                        Sign up
                    </button>
                    <button
                        onClick={() => setIsSignUp(false)}
                        className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${!isSignUp ? 'bg-white shadow text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}
                    >
                        Log in
                    </button>
                </div>

                <h2 className="text-3xl font-serif mb-6">{isSignUp ? 'Welcome to Maitri' : 'Welcome back'}</h2>

                <div className="space-y-4 mb-8">
                    {isSignUp && (
                        <div>
                            <label className="text-xs font-semibold text-[var(--color-text-secondary)] ml-2">Username</label>
                            <input type="text" placeholder="e.g. priya_m" className="w-full bg-[var(--color-bg-primary)] px-4 py-3 rounded-2xl mt-1 border border-[var(--color-border-light)] outline-none focus:border-[var(--color-brand-primary)]" />
                            <p className="text-[10px] text-[var(--color-text-secondary)] ml-2 mt-1">This is how you'll appear in the community.</p>
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-semibold text-[var(--color-text-secondary)] ml-2">Email</label>
                        <input type="email" placeholder="you@example.com" className="w-full bg-[var(--color-bg-primary)] px-4 py-3 rounded-2xl mt-1 border border-[var(--color-border-light)] outline-none focus:border-[var(--color-brand-primary)]" />
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
                            <input type="email" placeholder="Parent/Guardian Email" className="w-full bg-white px-4 py-2 rounded-xl border border-[var(--color-border-light)] outline-none" />
                        </div>
                    )}
                </div>

                <PillButton label="Send my magic link" icon={ArrowUpRight} className="w-full justify-between mb-3" onClick={() => onNavigate('onboarding')} />
                <p className="text-xs text-center text-[var(--color-text-secondary)] mb-6">No password needed. We'll email you a link.</p>

                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 mt-4 border-t border-[var(--color-border-light)] pt-4">
                    <Lock size={12} /> Your health data is encrypted and never sold.
                </div>
            </GlassCard>
        </div>
    );
};

export default AuthScreen;
