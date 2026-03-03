import React, { useState, useEffect } from 'react';
import { Bell, User, Loader2, Sparkles, Navigation } from 'lucide-react';
import PhaseArc from '../components/features/PhaseArc';
import FloatingBadge from '../components/common/FloatingBadge';
import GlassCard from '../components/common/GlassCard';
import PhaseChip from '../components/common/PhaseChip';
import HeartbeatDivider from '../components/common/HeartbeatDivider';
import SymptomChip from '../components/common/SymptomChip';
import CheckCircle from '../components/common/CheckCircle';
import axios from 'axios';

const HomeScreen = () => {
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [activeCycle, setActiveCycle] = useState(null);
    const [insight, setInsight] = useState({
        phase: 'Follicular',
        whatsHappening: 'Loading your insights...',
        whyYouFeel: '',
        oneSmallThing: ''
    });

    const [energy, setEnergy] = useState('');
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                setUser(storedUser);

                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // Get Cycles
                const res = await axios.get('http://localhost:5000/api/cycles', config);
                if (res.data && res.data.length > 0) {
                    setActiveCycle(res.data[0]);
                }

                // Complex Mock payload representing what backend would yield 
                // in full production version!
                setInsight({
                    phase: 'Follicular',
                    whatsHappening: 'Oestrogen is rising, which usually brings an upward trend in energy and mood as your body clears out the old lining.',
                    whyYouFeel: 'You might feel slightly more motivated or less sluggish than usual today as hormone levels rebuild.',
                    oneSmallThing: 'Hydrate well! Increasing your water intake can maximize this energy boost.'
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogEnergy = (val) => {
        setEnergy(val.toLowerCase());
        setStep(1);
    };

    const toggleSymptom = (s) => {
        if (selectedSymptoms.includes(s)) {
            setSelectedSymptoms(selectedSymptoms.filter(item => item !== s));
        } else {
            setSelectedSymptoms([...selectedSymptoms, s]);
        }
    };

    const submitLog = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post('http://localhost:5000/api/cycles/log', {
                cycleId: activeCycle ? activeCycle._id : null,
                logDate: new Date(),
                energyLevel: energy || 'medium',
                symptoms: selectedSymptoms,
                flowIntensity: 'none'
            }, config);

            setStep(2);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[var(--color-brand-primary)]" size={40} /></div>;

    const daysProgress = activeCycle ? Math.floor((new Date() - new Date(activeCycle.startDate)) / (1000 * 60 * 60 * 24)) : 7;
    const daysRemaining = 28 - daysProgress;

    return (
        <div className="pb-24 pt-6 px-4 md:px-8 relative max-w-7xl mx-auto overflow-hidden">
            {/* Ambient Backgrounds */}
            <div className="fixed top-0 right-0 w-[40vw] h-[40vh] bg-[var(--color-brand-secondary)] rounded-full blur-[120px] opacity-40 -mr-40 pointer-events-none z-[-1]" />
            <div className="fixed bottom-0 left-0 w-[40vw] h-[40vh] bg-[var(--color-accent-yellow)] rounded-full blur-[100px] opacity-30 -ml-40 pointer-events-none z-[-1]" />

            {/* Top bar */}
            <div className="flex justify-between items-center mb-8 mt-2">
                <div>
                    <div className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-[var(--color-text-primary)] relative inline-block">
                        Maitri<span className="text-[var(--color-brand-primary)]">.</span>
                        <Sparkles className="absolute -top-2 -right-5 text-[var(--color-accent-peach)] opacity-60" size={16} />
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm border border-white flex items-center justify-center hover:bg-white transition-all shadow-sm group">
                        <Bell size={18} className="text-[var(--color-text-secondary)] group-hover:scale-110 transition-transform" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-hover)] shadow-md flex items-center justify-center text-white transform hover:scale-105 transition-all" title={user?.username}>
                        <User size={18} />
                    </button>
                </div>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-serif text-[var(--color-text-primary)]">Hello, <span className="text-[var(--color-brand-primary)]">{user?.username}</span></h1>
                <p className="text-[var(--color-text-secondary)] font-medium mt-2 text-base md:text-lg opacity-80">Welcome to your daily health overview.</p>
            </div>

            <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
                {/* Left Column: Hero Card */}
                <div className="lg:col-span-5 bg-gradient-to-b from-white to-[#FDF9FA] rounded-3xl p-6 md:p-8 shadow-sm border border-[rgba(232,122,134,0.15)] relative mb-8 lg:mb-0 lg:h-full flex flex-col justify-center">
                    <div className="flex flex-col items-center text-center relative z-10 w-full mb-6">
                        <div className="bg-[var(--color-bg-primary)] px-3 py-1 rounded-full text-[9px] font-bold text-[var(--color-brand-primary)] tracking-widest uppercase mb-4 shadow-sm border border-white">
                            Current Status
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-serif mb-2 text-[var(--color-text-primary)] leading-tight">{insight.phase}</h2>
                        <p className="text-[var(--color-text-secondary)] font-semibold mb-6 text-sm md:text-base opacity-80">Day {daysProgress} of your cycle</p>

                        <div className="transform scale-90 md:scale-100 mb-4">
                            <PhaseArc phase={insight.phase} />
                        </div>

                        <p className="text-xs md:text-sm text-[var(--color-text-secondary)] mt-4 px-4 leading-relaxed font-medium bg-white/50 py-3 rounded-2xl">Your body is transitioning. Real physiological factors influence how you feel today.</p>
                    </div>

                    <FloatingBadge bottom="-10px" right="-5px" className="z-20 shadow-md bg-gradient-to-br from-white to-[var(--color-brand-secondary)] border border-white transform scale-90">
                        <span className="text-2xl font-serif leading-none mt-1 text-[var(--color-text-primary)]">{daysRemaining}</span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center mt-1">Days to<br />Period</span>
                    </FloatingBadge>
                </div>

                {/* Right Column: Insight & Check-in */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Insight Card */}
                    <GlassCard className="p-6 group shadow-sm border-white/80 rounded-3xl">
                        <div className="flex justify-between items-center mb-4">
                            <PhaseChip phase={insight.phase} />
                            <div className="flex items-center gap-1 text-[var(--color-brand-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] font-bold uppercase tracking-wider">AI Insight</span>
                                <Sparkles size={12} />
                            </div>
                        </div>
                        <div className="mt-3">
                            <h4 className="font-serif text-xl font-semibold mb-2 text-[var(--color-text-primary)]">What's happening</h4>
                            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4 font-medium text-sm md:text-base">{insight.whatsHappening}</p>

                            <HeartbeatDivider />

                            <h4 className="font-serif text-xl font-semibold mb-2 text-[var(--color-text-primary)] mt-4">Why you might feel this</h4>
                            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4 font-medium text-sm md:text-base">{insight.whyYouFeel}</p>

                            <div className="bg-gradient-to-r from-[var(--color-accent-peach)] to-white p-4 rounded-2xl mt-4 border border-white shadow-sm flex gap-3 items-start">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-[var(--color-text-primary)]">
                                    <Navigation size={14} />
                                </div>
                                <div>
                                    <h4 className="font-bold tracking-wide uppercase text-[10px] text-[var(--color-text-primary)] mb-1">One small thing</h4>
                                    <p className="text-xs md:text-sm text-[var(--color-text-secondary)] font-medium leading-relaxed">{insight.oneSmallThing}</p>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Quick Check-in Strip */}
                    <div>
                        <h3 className="font-serif text-2xl mb-4 text-[var(--color-text-primary)] pl-2">Daily Check-in</h3>
                        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[var(--color-brand-primary)] opacity-[0.05] rounded-bl-full pointer-events-none" />

                            {step === 0 && (
                                <div className="relative z-10">
                                    <p className="font-serif text-lg mb-4 text-[var(--color-text-primary)] text-center">How's your energy today?</p>
                                    <div className="flex gap-3 justify-center">
                                        <SymptomChip label="Low" onClick={() => handleLogEnergy('Low')} className="py-3 px-6 text-sm shadow-sm hover:shadow-md" />
                                        <SymptomChip label="Medium" onClick={() => handleLogEnergy('Medium')} className="py-3 px-6 text-sm shadow-sm hover:shadow-md" />
                                        <SymptomChip label="High" onClick={() => handleLogEnergy('High')} className="py-3 px-6 text-sm shadow-sm hover:shadow-md" />
                                    </div>
                                </div>
                            )}
                            {step === 1 && (
                                <div className="relative z-10">
                                    <p className="font-serif text-lg mb-4 text-[var(--color-text-primary)] text-center">Anything bothering you?</p>
                                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                                        {['Cramps', 'Bloating', 'Headache', 'Fatigue', 'Acne', 'Backache', 'Cravings'].map(symp => (
                                            <SymptomChip
                                                key={symp}
                                                label={symp}
                                                selected={selectedSymptoms.includes(symp)}
                                                onClick={() => toggleSymptom(symp)}
                                                className="py-2 px-4 text-sm shadow-sm"
                                            />
                                        ))}
                                    </div>
                                    <button onClick={submitLog} className="w-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-hover)] p-3 rounded-full text-center text-xs font-bold uppercase tracking-wider text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">Submit Log →</button>
                                </div>
                            )}
                            {step === 2 && (
                                <div className="text-center py-6 relative z-10">
                                    <div className="mb-3 flex justify-center transform scale-100">
                                        <CheckCircle />
                                    </div>
                                    <p className="font-serif text-xl text-[var(--color-text-primary)] mt-4 mb-1">Beautifully Logged!</p>
                                    <p className="font-medium text-sm text-[var(--color-text-secondary)] opacity-80">Your personalized models are updating.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;
