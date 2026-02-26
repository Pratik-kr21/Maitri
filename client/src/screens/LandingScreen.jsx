import React from 'react';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import PillButton from '../components/common/PillButton';
import HeartbeatDivider from '../components/common/HeartbeatDivider';
import FloatingBadge from '../components/common/FloatingBadge';

const LandingScreen = ({ onNavigate }) => (
    <div className="min-h-screen pb-20 overflow-x-hidden pt-12 max-w-7xl mx-auto">
        <div className="lg:flex lg:items-center lg:gap-12 lg:px-12">
            {/* Hero */}
            <div className="px-6 relative mb-16 lg:mb-0 lg:flex-1">
                <HeartbeatDivider />
                <h1 className="text-5xl lg:text-7xl font-serif text-[var(--color-text-primary)] leading-tight tracking-tight mt-6 mb-4 animate-floatUp" style={{ animationDelay: '100ms', opacity: 0 }}>
                    Your cycle, explained.<br />Finally.
                </h1>
                <p className="text-lg lg:text-xl text-[var(--color-text-secondary)] mb-8 max-w-sm animate-floatUp" style={{ animationDelay: '200ms', opacity: 0 }}>
                    Maitri connects the dots between what you feel and what your cycle is doing — privately, safely, and in plain language.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 animate-floatUp" style={{ animationDelay: '300ms', opacity: 0 }}>
                    <PillButton label="Get started free" icon={ArrowUpRight} onClick={() => onNavigate('auth')} />
                    <PillButton label="See how it works" variant="outline" onClick={() => onNavigate('onboarding')} />
                </div>

                <FloatingBadge right="-10px" top="100px" className="z-10 lg:hidden">
                    <span className="text-3xl font-serif leading-none mt-2">5,000+</span>
                    <span className="text-[10px] font-medium text-center px-2 leading-tight mt-1">women trust Maitri</span>
                </FloatingBadge>
            </div>

            {/* Bento Grid / Feature Image area */}
            <div className="px-6 mb-16 lg:mb-0 grid grid-cols-2 gap-4 lg:flex-1">
                <div className="col-span-2 bg-[var(--color-brand-secondary)] rounded-3xl p-6 h-40 lg:h-64 flex items-center justify-center animate-floatUp" style={{ animationDelay: '400ms', opacity: 0 }}>
                    <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-[#A8D8B9] animate-drift opacity-80" />
                    <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-[#E87A86] -ml-8 animate-drift opacity-80" />
                    <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-[#C084FC] -ml-8 animate-drift opacity-80" />
                </div>

                <div className="bg-[var(--color-accent-yellow)] rounded-3xl p-6 flex flex-col justify-center animate-floatUp" style={{ animationDelay: '500ms', opacity: 0 }}>
                    <h2 className="text-4xl lg:text-5xl font-serif leading-none mb-2">80%</h2>
                    <p className="text-sm lg:text-base font-medium">accuracy after 3 cycles logged</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-[var(--color-border-light)] animate-floatUp" style={{ animationDelay: '600ms', opacity: 0 }}>
                    <ShieldCheck size={28} className="text-[var(--color-brand-primary)] mb-2" />
                    <h3 className="font-serif text-lg lg:text-xl leading-tight mb-1">100% private</h3>
                    <p className="text-xs text-[var(--color-text-secondary)]">No data selling promise</p>
                </div>

                <div className="col-span-2 bg-white rounded-3xl p-6 border border-[var(--color-border-light)] shadow-sm animate-floatUp" style={{ animationDelay: '700ms', opacity: 0 }}>
                    <h3 className="text-2xl lg:text-3xl font-serif mb-2">Understand your phase, not just your date</h3>
                    <p className="text-sm lg:text-base text-[var(--color-text-secondary)]">Maitri translates hormone shifts into plain language so you know exactly why you feel the way you do.</p>
                </div>
            </div>
        </div>

        {/* Dark Section */}
        <div className="bg-[var(--color-bg-secondary)] text-white py-16 px-6 lg:px-12 -mb-6 relative mt-12 lg:rounded-t-[4rem]">
            <h2 className="text-4xl lg:text-6xl font-serif mb-12 text-center">Built for how you actually live</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {[
                    { title: 'Cycle Tracking', color: 'text-[var(--color-text-primary)] bg-[var(--color-accent-yellow)]' },
                    { title: 'Ask Maitri AI', color: 'text-[var(--color-text-primary)] bg-white' },
                    { title: 'Community Circles', color: 'text-[var(--color-text-primary)] bg-[var(--color-brand-secondary)]' },
                ].map((item, i) => (
                    <div key={item.title} className={`${item.color} rounded-2xl p-8 shadow-lg transform hover:-translate-y-2 transition-transform h-32 flex items-center justify-center`}>
                        <h3 className="text-xl lg:text-2xl font-serif text-center">{item.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default LandingScreen;
