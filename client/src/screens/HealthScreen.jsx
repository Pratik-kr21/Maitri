import React, { useState } from 'react';
import { Activity, Lock, BookOpen, HelpCircle } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import PillButton from '../components/common/PillButton';
import { mockPatterns } from '../data/mockData';

const HealthScreen = () => {
    const [tab, setTab] = useState('Patterns');

    return (
        <div className="pb-32 pt-8 px-6 animate-floatUp max-w-7xl mx-auto">
            <h2 className="text-4xl font-serif mb-6">My Health</h2>

            {/* Sub Tabs */}
            <div className="flex overflow-x-auto gap-2 pb-2 mb-6 scrollbar-hide">
                {['History', 'Patterns', 'Stories', 'Vault'].map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-colors ${tab === t ? 'bg-[var(--color-bg-secondary)] text-white' : 'bg-white text-[var(--color-text-secondary)] border border-[var(--color-border-light)]'
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {tab === 'Patterns' && (
                <div>
                    <div className="bg-[var(--color-brand-secondary)] rounded-2xl p-4 flex gap-3 items-center border border-[var(--color-border-light)] mb-8">
                        <Activity className="text-[var(--color-brand-primary)]" />
                        <p className="text-sm font-medium text-[var(--color-text-secondary)]">Patterns surface automatically after you log 2 full cycles.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockPatterns.map((pattern, i) => (
                            <GlassCard key={pattern.id} index={i} className="h-full flex flex-col">
                                <div className="inline-block px-2 py-1 bg-[var(--color-bg-primary)] rounded text-xs font-semibold text-[var(--color-text-secondary)] mb-3 w-fit">
                                    Observed over {pattern.cycles} cycles
                                </div>
                                <h3 className="text-xl font-serif mb-2 text-[var(--color-text-primary)]">{pattern.headline}</h3>
                                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 flex-1">{pattern.explanation}</p>
                                <div className="border-t border-[var(--color-border-light)] pt-3 flex items-center gap-2 text-gray-400">
                                    <HelpCircle size={12} />
                                    <span className="text-[10px] uppercase font-bold tracking-wider">Information, not medical diagnosis</span>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            )}

            {tab === 'Vault' && (
                <div className="space-y-6 animate-floatUp max-w-2xl mx-auto">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-[var(--color-accent-yellow)] rounded-full flex items-center justify-center animate-drift shadow-md">
                            <Lock size={32} className="text-[var(--color-text-primary)]" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-serif text-center mb-2">Your Private Vault</h3>
                    <p className="text-center text-sm text-[var(--color-text-secondary)] mb-8 px-4">Your health data is encrypted. We do not sell or share it with third parties.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <GlassCard>
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-semibold">Export all data (PDF)</span>
                                <BookOpen size={20} className="text-[var(--color-text-secondary)]" />
                            </div>
                            <PillButton label="Download Report" variant="outline" className="w-full justify-center py-2 text-sm" />
                        </GlassCard>

                        <GlassCard>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-red-800">Delete all my data</span>
                            </div>
                            <p className="text-xs text-[var(--color-text-secondary)] mt-2 mb-4">This permanently removes your account and all history from Maitri.</p>
                            <button className="w-full border-2 border-[var(--color-border-dark)] text-[var(--color-border-dark)] rounded-full py-2 font-medium">Delete account</button>
                        </GlassCard>
                    </div>
                </div>
            )}

            {/* Fallback for empty tabs */}
            {(tab === 'History' || tab === 'Stories') && (
                <div className="text-center py-12 text-[var(--color-text-secondary)] opacity-50 animate-floatUp">
                    <Activity size={48} className="mx-auto mb-4" />
                    <h3 className="text-xl font-serif">Coming Soon</h3>
                </div>
            )}
        </div>
    );
};

export default HealthScreen;
