import React from 'react';
import { Heart, ArrowUpRight } from 'lucide-react';
import { mockChatHistory } from '../data/mockData';

const AskMaitriScreen = () => {
    return (
        <div className="min-h-screen flex flex-col pb-24 relative bg-[var(--color-bg-primary)]">
            {/* Header */}
            <div className="pt-10 px-6 pb-6 bg-white shadow-sm z-10 rounded-b-[3rem] max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-14 h-14 bg-[var(--color-brand-primary)] rounded-full flex items-center justify-center animate-pulseGlow text-white">
                        <Heart size={24} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-serif">Ask Maitri</h2>
                        <div className="bg-[var(--color-bg-primary)] px-3 py-1 rounded-full text-[10px] font-bold text-[var(--color-brand-primary)] inline-block uppercase tracking-wider">18 questions left today</div>
                    </div>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] italic mt-2 ml-1">Maitri knows you're in your luteal phase and logged fatigue recently.</p>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-4 py-8 flex flex-col gap-6 max-w-4xl mx-auto w-full">
                {mockChatHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] md:max-w-[70%] rounded-[2rem] p-5 text-[15px] md:text-base leading-relaxed animate-floatUp shadow-sm ${msg.role === 'user'
                            ? 'bg-[var(--color-brand-secondary)] text-[var(--color-text-primary)] rounded-tr-sm'
                            : 'bg-white text-[var(--color-text-secondary)] rounded-tl-sm border border-[var(--color-border-light)]'
                            }`} style={{ animationDelay: `${i * 100}ms` }}>
                            {msg.content}
                        </div>
                    </div>
                ))}

                <div className="flex flex-wrap gap-2 mt-auto pt-8 animate-floatUp" style={{ animationDelay: '400ms' }}>
                    {["Why am I so tired?", "What is the luteal phase?", "When to see a doctor?"].map((chip) => (
                        <button key={chip} className="bg-white border border-[var(--color-border-light)] text-[var(--color-text-secondary)] rounded-full px-5 py-2.5 text-xs font-medium hover:bg-gray-50 transition-all hover:-translate-y-1 shadow-sm">
                            {chip}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input Area */}
            <div className="fixed bottom-24 left-0 right-0 px-4 md:px-32 lg:px-64 z-20">
                <div className="bg-white rounded-full p-2.5 flex items-center shadow-xl border border-[var(--color-border-light)] max-w-3xl mx-auto">
                    <input
                        type="text"
                        placeholder="Ask Maitri anything..."
                        className="flex-1 bg-transparent px-6 outline-none text-sm md:text-base font-medium"
                    />
                    <button className="w-12 h-12 rounded-full bg-[var(--color-brand-primary)] text-white flex items-center justify-center hover:bg-[var(--color-brand-hover)] transition-all transform hover:scale-105 active:scale-95">
                        <ArrowUpRight size={20} />
                    </button>
                </div>
                <p className="text-[10px] text-center mt-3 text-gray-400 font-medium tracking-wide">Maitri is not a doctor. This is information, not medical advice.</p>
            </div>
        </div>
    );
};

export default AskMaitriScreen;
