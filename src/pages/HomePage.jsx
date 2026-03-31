import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const PHASE_CONTENT = {
    menstrual: {
        questions: ["How's your energy while on your period?", "Any period-specific symptoms?", "How is your spirit today?"],
        physical: ['cramps', 'back pain', 'heavy flow', 'light flow', 'spotting', 'fatigue', 'headache', 'bloating'],
        emotional: ['sad', 'irritable', 'calm', 'overwhelmed', 'low confidence', 'anxious']
    },
    follicular: {
        questions: ["Feeling that energy rise?", "Noticing any changes?", "What's your mood as you power up?"],
        physical: ['clear skin', 'high energy', 'light flow', 'spotting', 'headache', 'fatigue'],
        emotional: ['motivated', 'happy', 'calm', 'confident', 'creative', 'focused']
    },
    ovulatory: {
        questions: ["Feeling your peak energy?", "Any ovulation signs?", "How's your glow today?"],
        physical: ['spotting', 'breast tenderness', 'glowy skin', 'increased libido', 'bloating', 'fatigue'],
        emotional: ['happy', 'motivated', 'high confidence', 'social', 'calm', 'irritable']
    },
    luteal: {
        questions: ["Energy dipping a bit?", "Any PMS signs popping up?", "How are you feeling emotionally?"],
        physical: ['bloating', 'acne', 'breast tenderness', 'headache', 'fatigue', 'nausea', 'back pain'],
        emotional: ['anxious', 'irritable', 'sad', 'overwhelmed', 'low confidence', 'brain fog']
    },
    default: {
        questions: ["How is your energy today?", "Any physical symptoms?", "One word for your mood?"],
        physical: ['cramps', 'bloating', 'headache', 'breast tenderness', 'acne', 'fatigue', 'nausea', 'back pain', 'spotting', 'heavy flow', 'light flow'],
        emotional: ['anxious', 'irritable', 'sad', 'happy', 'calm', 'overwhelmed', 'motivated', 'brain fog', 'low confidence']
    }
};

const PHASE_META = {
    menstrual: { label: 'Menstrual', color: '#E87A86', bg: '#FDE0E4', bar: 'bg-[#E87A86]' },
    follicular: { label: 'Follicular', color: '#68B984', bg: '#E6F4EA', bar: 'bg-[#68B984]' },
    ovulatory: { label: 'Ovulatory', color: '#F4A261', bg: '#FFF0E6', bar: 'bg-[#F4A261]' },
    luteal: { label: 'Luteal', color: '#9C77C4', bg: '#F0E6FF', bar: 'bg-[#9C77C4]' },
};

function StatCard({ label, value, sub }) {
    return (
        <div className="bg-white rounded-xl border border-[#EDE0E3] p-4">
            <p className="text-xs text-[#9E7A82] font-medium mb-1">{label}</p>
            <p className="text-2xl font-heading font-semibold text-[#2C1A1D] leading-none">{value}</p>
            {sub && <p className="text-xs text-[#9E7A82] mt-1">{sub}</p>}
        </div>
    );
}

function QuickAction({ to, label, sub, color }) {
    return (
        <Link to={to} className="bg-white rounded-xl border border-[#EDE0E3] p-4 flex flex-col gap-1 no-underline
      hover:border-[#E87A86] hover:shadow-[0_4px_12px_rgba(232,122,134,0.12)] transition-all duration-150">
            <p className="text-sm font-semibold text-[#2C1A1D]">{label}</p>
            <p className="text-xs text-[#9E7A82]">{sub}</p>
            <div className="mt-2 w-6 h-0.5 rounded-full" style={{ background: color }} />
        </Link>
    );
}

export default function HomePage() {
    const { user } = useAuth();
    const toast = useToast();

    const [phase, setPhase] = useState(null);
    const [insight, setInsight] = useState(null);
    const [loading, setLoading] = useState(true);

    const [doingJournal, setDoingJournal] = useState(false);
    const [journalStep, setJournalStep] = useState(0);
    const [energy, setEnergy] = useState('');
    const [physSym, setPhysSym] = useState([]);
    const [moodWord, setMoodWord] = useState('');
    const [saving, setSaving] = useState(false);
    const [showStartModal, setShowStartModal] = useState(false);

    const load = useCallback(async () => {
        try {
            const [phaseRes, insightRes] = await Promise.all([
                api.get('/cycles/current-phase'),
                api.get('/insights/daily'),
            ]);
            setPhase(phaseRes.data);
            setInsight(insightRes.data.insight);
        } catch (err) {
            console.error(err);
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    const toggleSym = (list, setList, sym) =>
        setList(l => l.includes(sym) ? l.filter(s => s !== sym) : [...l, sym]);

    const submitJournal = async () => {
        if (!energy) return;
        setSaving(true);
        try {
            await api.post('/journal', {
                logDate: new Date().toISOString().split('T')[0],
                energyLevel: energy,
                physicalSymptoms: physSym.map(s => s.replace(' ', '_')),
                moodWord,
            });
            toast.success('Check-in saved');
            setDoingJournal(false); setJournalStep(0);
            setEnergy(''); setPhysSym([]); setMoodWord('');
            load();
        } catch (err) { toast.error(err.response?.data?.message || 'Could not save'); }
        finally { setSaving(false); }
    };

    const pm = phase?.phase && PHASE_META[phase.phase] ? PHASE_META[phase.phase] : { label: 'Unknown', color: '#9E7A82', bg: '#F8F4F5', bar: 'bg-[#9E7A82]' };
    const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 rounded-full border-2 border-[#EDE0E3] border-t-[#E87A86] animate-spin" />
        </div>
    );

    return (
        <div className="h-full w-full overflow-y-auto">
            <div className="min-h-full w-full p-6 lg:p-8">

                {/* ── Page header ── */}
                <div className="mb-8">
                    <p className="text-xs text-[#9E7A82] font-medium mb-1">{today}</p>
                    <h1 className="font-heading text-3xl font-semibold text-[#2C1A1D]">Hello, {user?.username}</h1>
                    <p className="text-sm text-[#9E7A82] mt-1">Here's your cycle dashboard for today.</p>
                </div>

                {/* ── Two-column layout ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ── Left column (main) ── */}
                    <div className="lg:col-span-2 flex flex-col gap-6">

                        {/* Phase card */}
                        <div className="rounded-2xl p-6 flex items-start justify-between" style={{ background: pm.bg }}>
                            <div className="flex-1">
                                {phase?.phase && (
                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                                        style={{ color: pm.color, background: `${pm.color}20` }}>
                                        {pm.label} Phase
                                    </span>
                                )}
                                <h2 className="font-heading text-2xl font-semibold text-[#2C1A1D] mt-3 mb-2">
                                    {phase?.cycleDay ? `Day ${phase.cycleDay} of your cycle` : 'Start tracking your cycle'}
                                </h2>
                                <p className="text-sm text-[#5C4A4D] leading-relaxed max-w-md">
                                    {phase?.phaseDescription || 'Log the first day of your period to unlock personalised cycle insights.'}
                                </p>
                                {!phase?.phase && (
                                    <div className="mt-4 flex gap-3">
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await api.post('/cycles', { startDate: new Date().toISOString().split('T')[0] });
                                                    toast.success("Cycle tracking started!");
                                                    load();
                                                } catch (e) {
                                                    toast.error("Couldn't start cycle");
                                                }
                                            }}
                                            className="px-4 py-2 bg-[#E87A86] text-white text-sm font-semibold rounded-lg hover:bg-[#D66874] transition-colors">
                                            Period started today 🩸
                                        </button>
                                        <Link to="/profile" className="px-4 py-2 bg-white/60 text-[#2C1A1D] text-sm font-semibold rounded-lg hover:bg-white/90 border border-[#EDE0E3] transition-colors">
                                            Pick a different date
                                        </Link>
                                    </div>
                                )}
                            </div>
                            {phase?.prediction && (
                                <div className="ml-8 text-right flex-shrink-0 bg-white/60 rounded-xl px-4 py-3">
                                    <p className="text-xs text-[#9E7A82] font-medium">Next period</p>
                                    <p className="font-heading text-xl font-semibold text-[#2C1A1D] mt-0.5">
                                        {new Date(phase.prediction.nextPeriod).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                    </p>
                                    <p className="text-xs text-[#9E7A82]">±{phase.prediction.range} days</p>
                                </div>
                            )}
                        </div>

                        {/* Insight card */}
                        {insight && (
                            <div className="bg-[#2C1A1D] rounded-2xl p-6 text-white">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#E87A86]" />
                                    <span className="text-xs font-semibold text-[#E87A86] uppercase tracking-wider">Today's insight</span>
                                </div>
                                <h3 className="font-heading text-lg font-semibold text-white mb-3">What's happening in your body</h3>
                                <p className="text-sm text-white/75 leading-relaxed">{insight.whatsHappening}</p>
                                {insight.oneSmallThing && (
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <p className="text-xs text-white/50 font-medium mb-1">Suggested for today</p>
                                        <p className="text-sm text-white/85 leading-relaxed">{insight.oneSmallThing}</p>
                                    </div>
                                )}
                                {!insight.hasLog && (
                                    <p className="mt-4 text-xs text-white/40">
                                        Log today's symptoms to get a personalised insight tomorrow.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Daily check-in */}
                        <div className="bg-white rounded-2xl border border-[#EDE0E3] p-6">
                            {insight?.hasLog && !doingJournal ? (
                                <div className="flex items-center justify-between text-[#9E7A82]">
                                    <div>
                                        <h3 className="font-heading text-lg font-semibold text-[#2C1A1D]">Check-in complete</h3>
                                        <p className="text-sm mt-0.5">You've logged your symptoms today. See you tomorrow! 💜</p>
                                    </div>
                                </div>
                            ) : !doingJournal ? (
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-heading text-lg font-semibold text-[#2C1A1D]">Daily check-in</h3>
                                        <p className="text-sm text-[#9E7A82] mt-0.5">Log how you're feeling — takes under a minute.</p>
                                    </div>
                                    <button onClick={() => setDoingJournal(true)}
                                        className="px-4 py-2 bg-[#E87A86] text-white text-sm font-semibold rounded-lg hover:bg-[#D66874] transition-colors">
                                        Start
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-5">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-heading text-lg font-semibold text-[#2C1A1D]">
                                            {(PHASE_CONTENT[phase?.phase] || PHASE_CONTENT.default).questions[journalStep]}
                                        </h3>
                                        <button onClick={() => { setDoingJournal(false); setJournalStep(0); }}
                                            className="text-[#9E7A82] hover:text-[#2C1A1D] text-lg leading-none">&times;</button>
                                    </div>

                                    {journalStep === 0 && (
                                        <>
                                            <div className="grid grid-cols-3 gap-3">
                                                {[['low', 'Low energy'], ['medium', 'Moderate'], ['high', 'High energy']].map(([val, lbl]) => (
                                                    <button key={val} onClick={() => setEnergy(val)}
                                                        className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-150
                            ${energy === val
                                                                ? 'border-[#E87A86] bg-[#FDE0E4] text-[#C85C6B] font-semibold'
                                                                : 'border-[#EDE0E3] text-[#5C4A4D] hover:border-[#E87A86]'}`}>
                                                        {lbl}
                                                    </button>
                                                ))}
                                            </div>
                                            <button onClick={() => energy && setJournalStep(1)} disabled={!energy}
                                                className="w-full py-2.5 bg-[#E87A86] text-white text-sm font-semibold rounded-lg
                        hover:bg-[#D66874] disabled:opacity-40 transition-colors">
                                                Continue
                                            </button>
                                        </>
                                    )}

                                    {journalStep === 1 && (
                                        <>
                                            <div className="flex flex-wrap gap-2">
                                                {(PHASE_CONTENT[phase?.phase] || PHASE_CONTENT.default).physical.map(s => (
                                                    <button key={s} onClick={() => toggleSym(physSym, setPhysSym, s)}
                                                        className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-150
                            ${physSym.includes(s)
                                                                ? 'border-[#E87A86] bg-[#FDE0E4] text-[#C85C6B]'
                                                                : 'border-[#EDE0E3] text-[#6B4F53] hover:border-[#E87A86]'}`}>
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="flex gap-3">
                                                <button onClick={() => setJournalStep(0)}
                                                    className="flex-1 py-2.5 text-sm font-semibold text-[#9E7A82] rounded-lg border border-[#EDE0E3] hover:bg-[#F8F4F5]">
                                                    Back
                                                </button>
                                                <button onClick={() => setJournalStep(2)}
                                                    className="flex-1 py-2.5 bg-[#E87A86] text-white text-sm font-semibold rounded-lg hover:bg-[#D66874]">
                                                    {physSym.length ? `${physSym.length} selected — Continue` : 'Skip'}
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {journalStep === 2 && (
                                        <>
                                            <input className="w-full px-4 py-3 rounded-xl border border-[#EDE0E3] text-sm text-[#2C1A1D]
                      focus:border-[#E87A86] focus:outline-none focus:ring-2 focus:ring-[#E87A86]/15 placeholder:text-[#9E7A82]"
                                                type="text" placeholder="e.g. calm, hopeful, tired…" maxLength={30}
                                                value={moodWord} onChange={e => setMoodWord(e.target.value)} autoFocus />
                                            <div className="flex gap-3">
                                                <button onClick={() => setJournalStep(1)}
                                                    className="flex-1 py-2.5 text-sm font-semibold text-[#9E7A82] rounded-lg border border-[#EDE0E3] hover:bg-[#F8F4F5]">
                                                    Back
                                                </button>
                                                <button onClick={submitJournal} disabled={saving}
                                                    className="flex-1 py-2.5 bg-[#E87A86] text-white text-sm font-semibold rounded-lg hover:bg-[#D66874] disabled:opacity-40">
                                                    {saving ? 'Saving…' : 'Save check-in'}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Right column (sidebar) ── */}
                    <div className="flex flex-col gap-4">

                        {/* Cycle progress */}
                        {phase?.cycleDay && (
                            <div className="bg-white rounded-2xl border border-[#EDE0E3] p-5">
                                <h4 className="text-sm font-semibold text-[#2C1A1D] mb-4">Cycle progress</h4>
                                <div className="flex items-center justify-between text-xs text-[#9E7A82] mb-2">
                                    <span>Day {phase.cycleDay}</span>
                                    <span>of ~{phase.cycleLength || 28} days</span>
                                </div>
                                <div className="h-2 bg-[#F8F4F5] rounded-full overflow-hidden">
                                    <div className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${Math.min(100, (phase.cycleDay / (phase.cycleLength || 28)) * 100)}%`,
                                            background: pm.color,
                                        }} />
                                </div>
                                <div className="grid grid-cols-4 gap-1 mt-4">
                                    {[
                                        { label: 'Period', days: '1–5', active: phase.phase === 'menstrual' },
                                        { label: 'Follicular', days: '6–13', active: phase.phase === 'follicular' },
                                        { label: 'Ovulation', days: '14–16', active: phase.phase === 'ovulatory' },
                                        { label: 'Luteal', days: '17–28', active: phase.phase === 'luteal' },
                                    ].map(p => (
                                        <div key={p.label} className={`text-center py-1 rounded-lg text-[10px] font-medium transition-colors
                    ${p.active ? 'text-white' : 'text-[#9E7A82]'}`}
                                            style={{ background: p.active ? pm.color : '#F8F4F5' }}>
                                            <p>{p.label}</p>
                                            <p className="opacity-70">{p.days}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-5 pt-4 border-t border-[#F0E8EA] text-center">
                                    <button
                                        onClick={() => setShowStartModal(true)}
                                        className="text-xs text-[#E87A86] font-semibold hover:text-[#D66874] transition-colors">
                                        Period started today? Log it here 🩸
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Quick navigation */}
                        <div className="bg-white rounded-2xl border border-[#EDE0E3] p-5">
                            <h4 className="text-sm font-semibold text-[#2C1A1D] mb-3">Quick access</h4>
                            <div className="flex flex-col gap-1">
                                {[
                                    { to: '/journal', label: 'View journal history', sub: 'Logs & patterns' },
                                    { to: '/community', label: 'Community circles', sub: 'Connect with others' },
                                    { to: '/ask', label: 'Ask Maitri AI', sub: 'Health questions' },
                                    { to: '/vault', label: 'Health Vault', sub: 'Your data & export' },
                                ].map(({ to, label, sub }) => (
                                    <Link key={to} to={to}
                                        className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm no-underline
                    hover:bg-[#F8F4F5] group transition-colors duration-150">
                                        <div>
                                            <p className="font-medium text-[#2C1A1D] text-sm">{label}</p>
                                            <p className="text-xs text-[#9E7A82]">{sub}</p>
                                        </div>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            strokeWidth="2" className="text-[#C0A8AC] group-hover:text-[#E87A86] transition-colors flex-shrink-0">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Privacy note */}
                        <div className="bg-[#F8F4F5] rounded-xl border border-[#EDE0E3] p-4">
                            <p className="text-xs text-[#9E7A82] leading-relaxed">
                                <span className="font-semibold text-[#6B4F53]">Your data stays yours.</span>{' '}
                                Maitri never sells your health information. Everything is encrypted and stored securely.
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            {/* Quick Start Cycle Modal */}
            {showStartModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-heading text-xl font-semibold text-[#2C1A1D]">When did it start?</h3>
                            <button onClick={() => setShowStartModal(false)} className="text-[#9E7A82] hover:text-[#2C1A1D] border-none bg-transparent text-2xl font-light">&times;</button>
                        </div>
                        <p className="text-sm text-[#9E7A82] mb-6">Maitri will adjust your cycle tracker and phases based on this date.</p>

                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { label: 'Today', date: new Date() },
                                { label: 'Yesterday', date: new Date(Date.now() - 86400000) },
                                { label: '2 days ago', date: new Date(Date.now() - 172800000) },
                                { label: '3 days ago', date: new Date(Date.now() - 259200000) },
                            ].map((opt) => (
                                <button
                                    key={opt.label}
                                    onClick={async () => {
                                        try {
                                            const d = opt.date.toISOString().split('T')[0];
                                            await api.post('/cycles', { startDate: d });
                                            toast.success(`Cycle reset to ${opt.label}!`);
                                            setShowStartModal(false);
                                            load();
                                        } catch (e) { toast.error("Couldn't update cycle"); }
                                    }}
                                    className="w-full py-3 px-4 rounded-xl border border-[#EDE0E3] bg-white text-sm font-medium text-[#2C1A1D] hover:border-[#E87A86] hover:bg-[#FDE0E4]/30 transition-all flex justify-between items-center"
                                >
                                    <span>{opt.label}</span>
                                    <span className="text-xs text-[#9E7A82]">{opt.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                </button>
                            ))}

                            <Link
                                to="/profile"
                                className="w-full py-3 px-4 rounded-xl border border-[#EDE0E3] text-sm font-medium text-[#9E7A82] hover:bg-[#F8F4F5] transition-all text-center no-underline mt-2"
                            >
                                Choose a different date...
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
