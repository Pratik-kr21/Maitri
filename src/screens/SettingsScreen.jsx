import React, { useState, useEffect } from 'react';
import { Lock, LogOut, User as UserIcon, Bell, Shield, HeartPulse } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import ToggleSwitch from '../components/common/ToggleSwitch';
import HeartbeatDivider from '../components/common/HeartbeatDivider';
import PillButton from '../components/common/PillButton';

const SettingsScreen = ({ onNavigate }) => {
    const [reminders, setReminders] = useState(true);
    const [privacy, setPrivacy] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser || { username: 'Guest', isMinor: false });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        onNavigate('landing');
    };

    return (
        <div className="pb-24 pt-6 px-4 md:px-8 animate-floatUp max-w-7xl mx-auto relative overflow-hidden min-h-screen">
            <div className="fixed top-0 right-0 w-[40vw] h-[40vh] bg-[var(--color-brand-secondary)] rounded-full blur-[120px] opacity-40 -mr-40 pointer-events-none z-[-1]" />
            <div className="fixed bottom-0 left-0 w-[40vw] h-[40vh] bg-[var(--color-accent-peach)] rounded-full blur-[100px] opacity-30 -ml-40 pointer-events-none z-[-1]" />

            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-hover)] rounded-full flex items-center justify-center text-white shadow-lg shadow-[var(--color-brand-primary)]/20">
                    <UserIcon size={24} className="md:w-7 md:h-7" />
                </div>
                <div>
                    <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-text-primary)] leading-tight">Profile</h2>
                    <p className="font-medium text-[var(--color-text-secondary)] opacity-80 mt-1 text-sm md:text-base">Manage your account and preferences</p>
                </div>
            </div>

            <div className="lg:grid lg:grid-cols-2 lg:gap-10">
                <div className="mb-10 lg:mb-0">
                    <div className="flex items-center gap-2 mb-3 px-2">
                        <Shield className="text-[var(--color-text-secondary)]" size={16} />
                        <h3 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Account Information</h3>
                    </div>

                    <GlassCard className="p-0 overflow-hidden !rounded-3xl border-white/60">
                        <div className="p-5 flex justify-between items-center border-b border-[var(--color-border-light)] hover:bg-white/40 transition-colors">
                            <span className="font-medium text-[var(--color-text-secondary)] text-base">Username</span>
                            <span className="font-bold text-[var(--color-text-primary)] text-base bg-white/80 px-3 py-1 rounded-full shadow-sm">{user?.username}</span>
                        </div>
                        <div className="p-5 flex justify-between items-center border-b border-[var(--color-border-light)] hover:bg-white/40 transition-colors">
                            <span className="font-medium text-[var(--color-text-secondary)] text-base">Account Type</span>
                            <span className="font-bold text-[var(--color-text-primary)] text-xs uppercase tracking-wider bg-[var(--color-brand-secondary)] px-3 py-1 rounded-full shadow-sm">{user?.isMinor ? 'Youth' : 'Adult'}</span>
                        </div>
                        <div className="p-5 flex justify-between items-center hover:bg-white/40 transition-colors bg-white/30">
                            <span className="font-medium text-[var(--color-text-secondary)] text-base flex items-center gap-2">
                                <Lock size={14} className="text-[var(--color-brand-primary)]" /> Data Privacy
                            </span>
                            <span className="font-bold text-[var(--color-brand-primary)] text-xs uppercase tracking-wider bg-white px-3 py-1 rounded-full shadow-sm border border-[var(--color-border-light)]">Encrypted</span>
                        </div>
                    </GlassCard>

                    <div className="mt-8 px-2 hidden lg:block text-center">
                        <div className="inline-flex w-20 h-20 bg-gradient-to-br from-[var(--color-accent-peach)] to-[var(--color-brand-secondary)] rounded-full shadow-md items-center justify-center border-4 border-white opacity-80 hover:opacity-100 transition-opacity">
                            <HeartPulse size={32} className="text-white drop-shadow-sm" />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3 px-2">
                            <Bell className="text-[var(--color-text-secondary)]" size={16} />
                            <h3 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Notifications & AI</h3>
                        </div>
                        <GlassCard className="!rounded-3xl flex flex-col gap-5 p-5 md:p-6 border-white/60">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1 pr-4">
                                    <span className="font-bold text-[var(--color-text-primary)] text-base">Phase change alerts</span>
                                    <span className="text-xs text-[var(--color-text-secondary)] font-medium leading-relaxed opacity-80">Get notified when transitioning into a new cycle phase.</span>
                                </div>
                                <ToggleSwitch on={reminders} onChange={setReminders} />
                            </div>
                            <HeartbeatDivider />
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-1 pr-4">
                                        <span className="font-bold text-[var(--color-text-primary)] text-base flex items-center gap-2">Enable AI Tracking</span>
                                        <span className="text-xs text-[var(--color-text-secondary)] font-medium leading-relaxed opacity-80">Allow Maitri AI to process symptom combinations.</span>
                                    </div>
                                    <ToggleSwitch on={privacy} onChange={setPrivacy} />
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={handleLogout}
                            className="w-full bg-white border border-[var(--color-border-light)] hover:border-red-200 hover:bg-red-50 text-red-600 rounded-full py-3 px-6 flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                        >
                            <LogOut size={16} strokeWidth={2.5} /> Sign Out
                        </button>
                    </div>
                </div>
            </div>

            <div className="text-center py-16 opacity-50 flex flex-col items-center justify-center gap-2">
                <HeartPulse className="text-[var(--color-text-secondary)]" size={20} />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">Maitri Health OS v1.0.0</p>
            </div>
        </div>
    );
};

export default SettingsScreen;
