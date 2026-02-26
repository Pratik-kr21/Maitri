import React, { useState } from 'react';
import { Bell, User } from 'lucide-react';
import PhaseArc from '../components/features/PhaseArc';
import FloatingBadge from '../components/common/FloatingBadge';
import GlassCard from '../components/common/GlassCard';
import PhaseChip from '../components/common/PhaseChip';
import HeartbeatDivider from '../components/common/HeartbeatDivider';
import SymptomChip from '../components/common/SymptomChip';
import CheckCircle from '../components/common/CheckCircle';
import { mockInsightCard } from '../data/mockData';

const HomeScreen = () => {
    const [step, setStep] = useState(0);

    return (
        <div className="pb-32 pt-6 px-6 relative animate-floatUp max-w-7xl mx-auto">
            {/* Top bar */}
            <div className="flex justify-between items-center mb-6">
                <div className="font-serif text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Maitri.</div>
                <div className="flex gap-3">
                    <button className="w-10 h-10 rounded-full bg-white border border-[var(--color-border-light)] flex items-center justify-center">
                        <Bell size={18} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-[var(--color-brand-primary)] flex items-center justify-center text-white">
                        <User size={18} />
                    </button>
                </div>
            </div>

            <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-start">
                {/* Left Column: Hero Card */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-[var(--color-border-light)] relative mb-12 lg:mb-0 lg:h-full flex flex-col justify-center">
                    <div className="flex flex-col items-center text-center relative z-10">
                        <h2 className="text-5xl font-serif mb-2">Luteal Phase</h2>
                        <p className="text-[var(--color-text-secondary)] font-medium mb-6">Day 21 of your cycle</p>

                        <PhaseArc phase="Luteal" />

                        <p className="text-sm text-[var(--color-text-secondary)] mt-4 px-4 leading-relaxed font-medium">Your body is preparing for a new cycle. Energy dips are normal as progesterone rises.</p>
                    </div>

                    <FloatingBadge bottom="-20px" right="-10px" className="z-20">
                        <span className="text-2xl font-serif leading-none mt-2">7</span>
                        <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider text-center mt-1">Days to<br />Period</span>
                    </FloatingBadge>
                </div>

                {/* Right Column: Insight & Check-in */}
                <div className="space-y-8">
                    {/* Insight Card */}
                    <GlassCard>
                        <PhaseChip phase={mockInsightCard.phase} />
                        <div className="mt-4">
                            <h4 className="font-semibold mb-1 text-[var(--color-text-primary)]">What's happening</h4>
                            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">{mockInsightCard.whatsHappening}</p>

                            <HeartbeatDivider />

                            <h4 className="font-semibold mb-1 text-[var(--color-text-primary)] mt-3">Why you might feel this</h4>
                            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">{mockInsightCard.whyYouFeel}</p>

                            <div className="bg-[var(--color-accent-peach)] bg-opacity-30 p-3 rounded-xl mt-4 border border-[var(--color-accent-peach)]">
                                <h4 className="font-semibold text-[var(--color-text-primary)] text-sm mb-1">One small thing</h4>
                                <p className="text-xs text-[var(--color-text-secondary)]">{mockInsightCard.oneSmallThing}</p>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Quick Check-in Strip */}
                    <div>
                        <h3 className="font-serif text-2xl mb-4 text-[var(--color-text-primary)]">Quick check-in</h3>
                        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[var(--color-border-light)]">
                            {step === 0 && (
                                <div className="animate-floatUp">
                                    <p className="font-semibold mb-4 text-[var(--color-text-secondary)] text-center">How's your energy today?</p>
                                    <div className="flex gap-2 justify-center">
                                        <SymptomChip label="Low" onClick={() => setStep(1)} />
                                        <SymptomChip label="Medium" onClick={() => setStep(1)} />
                                        <SymptomChip label="High" onClick={() => setStep(1)} />
                                    </div>
                                </div>
                            )}
                            {step === 1 && (
                                <div className="animate-floatUp">
                                    <p className="font-semibold mb-4 text-[var(--color-text-secondary)] text-center">Anything bothering you?</p>
                                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                                        <SymptomChip label="Cramps" selected onClick={() => { }} />
                                        <SymptomChip label="Bloating" onClick={() => { }} />
                                        <SymptomChip label="Headache" onClick={() => { }} />
                                        <SymptomChip label="Fatigue" selected onClick={() => { }} />
                                    </div>
                                    <button className="w-full text-center text-sm font-semibold text-[var(--color-brand-primary)]" onClick={() => setStep(2)}>Next →</button>
                                </div>
                            )}
                            {step === 2 && (
                                <div className="animate-floatUp text-center py-4">
                                    <CheckCircle />
                                    <p className="font-serif text-xl text-[var(--color-text-primary)] mt-2">Logged for today.</p>
                                    <p className="text-xs text-[var(--color-text-secondary)]">Your patterns are updating.</p>
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
