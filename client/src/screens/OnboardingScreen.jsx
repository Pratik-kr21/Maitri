import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import PillButton from '../components/common/PillButton';

const OnboardingScreen = ({ onNavigate }) => {
    const [step, setStep] = useState(1);
    const nextStep = () => {
        if (step < 3) setStep(step + 1);
        else onNavigate('home');
    };

    return (
        <div className="min-h-screen flex flex-col p-6 animate-floatUp max-w-4xl mx-auto">
            <div className="flex gap-2 justify-center mb-12 mt-8">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`h-2 rounded-full transition-all duration-300 ${step === i ? 'w-8 bg-[var(--color-brand-primary)]' : 'w-2 bg-[var(--color-border-light)]'}`} />
                ))}
            </div>

            <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
                {step === 1 && (
                    <div className="animate-floatUp">
                        <div className="w-full h-48 bg-gradient-to-br from-[var(--color-brand-secondary)] to-[var(--color-accent-peach)] rounded-3xl mb-8 flex items-center justify-center animate-drift">
                            <Heart size={48} className="text-[var(--color-brand-primary)] opacity-50" />
                        </div>
                        <h2 className="text-3xl font-serif mb-4">Welcome to Maitri, priya_m</h2>
                        <p className="text-[var(--color-text-secondary)] mb-10 leading-relaxed text-lg">Let's set up your cycle tracker. It takes 2 minutes and helps us give you insights right away.</p>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-floatUp delay-100">
                        <h3 className="text-3xl font-serif mb-8 text-center">When did your last period start?</h3>
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[var(--color-border-light)] mb-6">
                            <input type="date" className="w-full text-xl font-medium outline-none text-center bg-transparent" defaultValue={new Date().toISOString().split('T')[0]} />
                        </div>
                        <button className="text-[var(--color-text-secondary)] text-sm underline text-center w-full mb-10">I'm not exactly sure</button>
                        <p className="text-xs text-center text-gray-400 px-6">This helps us give you a starting prediction — we'll get more accurate as you log more.</p>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-floatUp delay-100">
                        <h3 className="text-3xl font-serif mb-8 text-center">How long is your cycle usually?</h3>
                        <div className="bg-[var(--color-brand-secondary)] rounded-3xl p-8 flex items-center justify-center mb-6">
                            <h1 className="text-6xl font-serif text-[var(--color-brand-primary)]">28</h1>
                            <span className="text-xl ml-2 text-[var(--color-brand-hover)] mt-4">days</span>
                        </div>
                        <input type="range" min="21" max="35" defaultValue="28" className="w-full accent-[var(--color-brand-primary)] mb-6" />
                        <button className="text-[var(--color-text-secondary)] text-sm underline text-center w-full mb-10">I don't know</button>
                    </div>
                )}
            </div>

            <div className="mt-auto pt-6 border-t border-[var(--color-border-light)] max-w-sm mx-auto w-full">
                <PillButton label={step === 3 ? "Take me to Maitri" : "Let's go"} onClick={nextStep} className="w-full justify-between" />
            </div>
        </div>
    );
};

export default OnboardingScreen;
