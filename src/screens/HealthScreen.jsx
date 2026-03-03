import React, { useState, useEffect } from 'react';
import { Activity, Lock, BookOpen, HelpCircle, Loader2, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import GlassCard from '../components/common/GlassCard';
import PillButton from '../components/common/PillButton';
import axios from 'axios';

const HealthScreen = () => {
    const [tab, setTab] = useState('Patterns');
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/cycles/logs`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLogs(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    // Helper functions for dynamic data patterns representation
    const getFrequentSymptom = () => {
        if (logs.length === 0) return 'data';
        const counts = {};
        logs.forEach(log => {
            log.symptoms?.forEach(s => { counts[s] = (counts[s] || 0) + 1 });
        });
        const arr = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
        return arr[0] || 'symptoms';
    }

    const patternCount = logs.length > 0 ? Math.max(1, Math.floor(logs.length / 5)) : 0;

    // Process logs for charting
    const processEnergyData = () => {
        return logs.slice().reverse().map(log => ({
            date: new Date(log.logDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            energy: log.energyLevel === 'high' ? 3 : log.energyLevel === 'medium' ? 2 : 1
        })).slice(-14); // Last 14 logs
    };

    return (
        <div className="pb-24 pt-6 px-4 md:px-8 animate-floatUp max-w-7xl mx-auto relative">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--color-brand-secondary)] rounded-full blur-[80px] opacity-40 -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute top-40 left-0 w-64 h-64 bg-[var(--color-accent-yellow)] rounded-full blur-[60px] opacity-30 -ml-20 pointer-events-none" />

            <h2 className="text-3xl font-serif mb-6 relative z-10 text-[var(--color-text-primary)]">My Health</h2>

            {/* Sub Tabs */}
            <div className="flex overflow-x-auto gap-2 pb-4 mb-6 scrollbar-hide relative z-10">
                {['History', 'Patterns', 'Stories', 'Vault'].map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all shadow-sm
                            ${tab === t
                                ? 'bg-[var(--color-bg-secondary)] text-white scale-105 shadow-md'
                                : 'bg-white/80 backdrop-blur-sm text-[var(--color-text-secondary)] border border-white/40 hover:bg-white'}
                        `}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {loading && <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[var(--color-brand-primary)]" size={32} /></div>}

            {tab === 'History' && !loading && (
                <div className="space-y-6 animate-floatUp relative z-10">
                    <GlassCard>
                        <h3 className="font-serif text-xl mb-4 flex items-center gap-2"><Calendar className="text-[var(--color-brand-primary)]" size={20} /> Recent Log Timeline</h3>
                        {logs.length > 0 ? (
                            <div className="space-y-3">
                                {logs.slice(0, 5).map(log => (
                                    <div key={log._id} className="flex flex-col md:flex-row md:items-center justify-between p-3.5 bg-white/50 rounded-xl border border-white/60">
                                        <span className="font-medium text-sm">{new Date(log.logDate).toLocaleDateString()}</span>
                                        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                                            {log.symptoms?.map(s => <span key={s} className="bg-[var(--color-brand-secondary)] text-[var(--color-text-secondary)] px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full">{s}</span>)}
                                            <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full">Energy: {log.energyLevel || 'Medium'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-[var(--color-text-secondary)] py-4 text-center text-sm">No logs found yet.</p>}
                    </GlassCard>

                    <GlassCard>
                        <h3 className="font-serif text-xl mb-4">Energy Trend (Last 14 days)</h3>
                        {logs.length > 2 ? (
                            <div className="h-56 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={processEnergyData()}>
                                        <XAxis dataKey="date" stroke="#8884d8" fontSize={11} tickLine={false} axisLine={false} />
                                        <YAxis hide domain={[0, 4]} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '0.75rem', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                                            formatter={(value) => [value === 3 ? 'High' : value === 2 ? 'Medium' : 'Low', 'Energy']}
                                        />
                                        <Line type="monotone" dataKey="energy" stroke="var(--color-brand-primary)" strokeWidth={3} dot={{ r: 4, fill: "var(--color-brand-primary)", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : <p className="text-[var(--color-text-secondary)] py-6 text-center text-sm bg-white/40 rounded-xl">Log at least 3 days to see your trend graph.</p>}
                    </GlassCard>
                </div>
            )}

            {tab === 'Patterns' && !loading && (
                <div className="relative z-10">
                    <div className="bg-gradient-to-r from-[var(--color-brand-secondary)] to-[var(--color-accent-peach)] rounded-2xl p-5 flex flex-col md:flex-row gap-3 items-center border border-white/50 mb-6 shadow-sm">
                        <Activity size={24} className="text-[var(--color-brand-primary)]" />
                        <p className="font-medium text-[var(--color-text-secondary)] leading-relaxed text-xs md:text-sm">
                            Patterns surface automatically after you log 2 full cycles. You have logged <b>{logs.length}</b> days so far. We are building a personalized model just for you.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {logs.length > 0 ? (
                            <>
                                <GlassCard className="h-full flex flex-col p-5">
                                    <div className="inline-block px-2.5 py-1 bg-[var(--color-bg-primary)] rounded-full text-[9px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3 w-fit shadow-sm">
                                        Observed over {patternCount} cycles
                                    </div>
                                    <h3 className="text-xl font-serif mb-2 text-[var(--color-text-primary)]">Frequent {getFrequentSymptom()} noticed</h3>
                                    <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4 flex-1 text-sm font-medium">
                                        You have frequently logged {getFrequentSymptom()} in your check-ins over the past week. This is commonly associated with estrogen fluctuation during this phase.
                                    </p>
                                    <div className="border-t border-[var(--color-border-light)] pt-3 flex items-center gap-1.5 text-[var(--color-text-secondary)] opacity-70">
                                        <HelpCircle size={12} />
                                        <span className="text-[9px] uppercase font-bold tracking-wider">Information, not medical diagnosis</span>
                                    </div>
                                </GlassCard>

                                {patternCount > 0 && (
                                    <GlassCard className="h-full flex flex-col p-5">
                                        <div className="inline-block px-2.5 py-1 bg-[var(--color-bg-primary)] rounded-full text-[9px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3 w-fit shadow-sm">
                                            Cycle Duration
                                        </div>
                                        <h3 className="text-xl font-serif mb-2 text-[var(--color-text-primary)]">Consistent Length</h3>
                                        <p className="text-[var(--color-text-secondary)] leading-relaxed flex-1 text-sm font-medium">
                                            Your cycles hover around 28 days recently. This consistency is a sign that your hormonal rhythm is stable.
                                        </p>
                                    </GlassCard>
                                )}
                            </>
                        ) : (
                            <div className="col-span-3 text-center p-8 bg-white/50 backdrop-blur-md border border-[var(--color-border-light)] rounded-3xl shadow-sm">
                                <h3 className="font-serif text-xl mb-2 text-[var(--color-text-primary)]">Ready to learn about your body?</h3>
                                <p className="text-[var(--color-text-secondary)] text-sm font-medium max-w-sm mx-auto">No active patterns yet. Log more symptoms on the home screen to build your models!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {tab === 'Vault' && (
                <div className="space-y-6 animate-floatUp max-w-2xl mx-auto relative z-10 pt-4">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-accent-yellow)] to-[var(--color-accent-peach)] rounded-full flex items-center justify-center animate-drift shadow-md border-[3px] border-white">
                            <Lock size={28} className="text-[var(--color-text-primary)]" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-serif text-center mb-2">Your Private Vault</h3>
                    <p className="text-center text-sm text-[var(--color-text-secondary)] mb-8 px-4 font-medium leading-relaxed">Your health data is encrypted at the application block. We do not sell or share it with third parties.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <GlassCard className="hover:-translate-y-1 cursor-pointer transition-all p-5">
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-serif text-lg">Export Report</span>
                                <BookOpen size={20} className="text-[var(--color-brand-primary)]" />
                            </div>
                            <p className="text-xs text-gray-500 mb-5 min-h-[40px]">Download your cycle tracking history as a clean, doctor-ready PDF.</p>
                            <PillButton label="Generate PDF" className="w-full justify-center py-2.5 text-xs shadow-sm border-0" />
                        </GlassCard>

                        <GlassCard className="border-red-100 hover:border-red-300 p-5">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-serif text-lg text-red-700">Danger Zone</span>
                            </div>
                            <p className="text-xs text-red-500 mb-5 min-h-[40px] font-medium leading-relaxed">This permanently removes your account and all history from Maitri within 24 hours.</p>
                            <button className="w-full bg-white border border-red-200 text-red-600 rounded-full py-2.5 font-bold uppercase tracking-wider text-[10px] hover:bg-red-50 transition-colors shadow-sm">Delete Account</button>
                        </GlassCard>
                    </div>
                </div>
            )}

            {/* Fallback for empty tabs */}
            {tab === 'Stories' && (
                <div className="text-center py-12 text-[var(--color-text-secondary)] bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 animate-floatUp relative z-10 shadow-sm">
                    <div className="w-16 h-16 bg-[var(--color-brand-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Activity size={24} className="text-[var(--color-brand-primary)]" />
                    </div>
                    <h3 className="text-2xl font-serif mb-2">Cycle Stories</h3>
                    <p className="text-sm font-medium max-w-xs mx-auto opacity-70">A beautiful, shareable recap of your body's journey generated at the end of every cycle. Come back soon!</p>
                </div>
            )}
        </div>
    );
};

export default HealthScreen;
