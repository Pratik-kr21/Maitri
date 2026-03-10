import React, { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import { useToast } from '../context/ToastContext';

const PHASE_CONTENT = {
    menstrual: {
        physical: ['cramps', 'back pain', 'heavy flow', 'light flow', 'spotting', 'fatigue', 'headache', 'bloating', 'nausea'],
        emotional: ['sad', 'irritable', 'calm', 'overwhelmed', 'low confidence', 'anxious']
    },
    follicular: {
        physical: ['clear skin', 'high energy', 'light flow', 'spotting', 'headache', 'fatigue', 'bloating'],
        emotional: ['motivated', 'happy', 'calm', 'confident', 'creative', 'focused']
    },
    ovulatory: {
        physical: ['spotting', 'breast tenderness', 'glowy skin', 'increased libido', 'bloating', 'fatigue', 'headache'],
        emotional: ['happy', 'motivated', 'high confidence', 'social', 'calm', 'irritable']
    },
    luteal: {
        physical: ['bloating', 'acne', 'breast tenderness', 'headache', 'fatigue', 'nausea', 'back pain', 'spotting'],
        emotional: ['anxious', 'irritable', 'sad', 'overwhelmed', 'low confidence', 'brain fog']
    },
    default: {
        physical: ['cramps', 'bloating', 'headache', 'breast tenderness', 'acne', 'fatigue', 'nausea', 'back pain', 'spotting', 'heavy flow', 'light flow'],
        emotional: ['anxious', 'irritable', 'sad', 'happy', 'calm', 'overwhelmed', 'motivated', 'brain fog', 'low confidence']
    }
};
const FLOW = ['none', 'spotting', 'light', 'medium', 'heavy'];

export default function JournalPage() {
    const toast = useToast();

    const [tab, setTab] = useState('log'); // log | history | patterns
    const [logs, setLogs] = useState([]);
    const [patterns, setPatterns] = useState(null);
    const [cycles, setCycles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [phase, setPhase] = useState(null);

    // Form state
    const [form, setForm] = useState({
        logDate: new Date().toISOString().split('T')[0],
        flowIntensity: 'none',
        physicalSymptoms: [],
        emotionalSymptoms: [],
        energyLevel: 'medium',
        moodWord: '',
        notes: '',
    });
    const [saving, setSaving] = useState(false);

    const loadHistory = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/journal', { params: { limit: 30 } });
            setLogs(res.data.logs || []);
        } catch { } finally { setLoading(false); }
    }, []);

    const loadPatterns = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/journal/patterns');
            setPatterns(res.data.patterns);
        } catch { } finally { setLoading(false); }
    }, []);

    const loadCycles = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/cycles');
            setCycles(res.data.cycles || []);
        } catch { } finally { setLoading(false); }
    }, []);

    useEffect(() => {
        if (tab === 'history') loadHistory();
        else if (tab === 'patterns') loadPatterns();
        else if (tab === 'cycles') loadCycles();

        const fetchPhase = async () => {
            try {
                const res = await api.get('/cycles/current-phase');
                setPhase(res.data);
            } catch (err) { console.error('Error fetching phase', err); }
        };
        fetchPhase();
    }, [tab, loadHistory, loadPatterns]);

    const toggleSym = (field, val) => {
        setForm(f => ({
            ...f,
            [field]: f[field].includes(val) ? f[field].filter(v => v !== val) : [...f[field], val],
        }));
    };

    const saveLog = async () => {
        setSaving(true);
        try {
            await api.post('/journal', {
                ...form,
                physicalSymptoms: form.physicalSymptoms.map(s => s.replace(' ', '_')),
                emotionalSymptoms: form.emotionalSymptoms.map(s => s.replace(' ', '_')),
            });
            toast.success('Log saved');
            setForm({ logDate: new Date().toISOString().split('T')[0], flowIntensity: 'none', physicalSymptoms: [], emotionalSymptoms: [], energyLevel: 'medium', moodWord: '', notes: '' });
        } catch (err) { toast.error(err.response?.data?.message || 'Could not save'); }
        finally { setSaving(false); }
    };

    const deleteLog = async (id) => {
        if (!window.confirm('Delete this log?')) return;
        try {
            await api.delete(`/journal/${id}`);
            setLogs(l => l.filter(log => log._id !== id));
            toast.success('Log deleted');
        } catch { toast.error('Could not delete'); }
    };

    const TABS = [
        { id: 'log', label: "Today's log" },
        { id: 'history', label: 'History' },
        { id: 'cycles', label: 'Period History' },
        { id: 'patterns', label: 'Patterns' },
    ];

    return (
        <div className="h-full w-full overflow-y-auto">
            <div className="min-h-full max-w-7xl mx-auto p-6 lg:p-8">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="font-heading text-3xl font-semibold text-[#2C1A1D]">Health Journal</h1>
                        <p className="text-sm text-[#9E7A82] mt-1">Track your symptoms, flow, and mood each day.</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-0.5 bg-[#F0E8EA] p-1 rounded-xl mb-8 w-fit">
                    {TABS.map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)}
                            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150
              ${tab === t.id ? 'bg-white text-[#2C1A1D] shadow-sm' : 'text-[#9E7A82] hover:text-[#2C1A1D]'}`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ── Log tab ── */}
                {tab === 'log' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 flex flex-col gap-5">

                            {/* Date + Energy */}
                            <div className="bg-white rounded-2xl border border-[#EDE0E3] p-6">
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#6B4F53] mb-2">Date</label>
                                        <input type="date" className="w-full px-3 py-2.5 rounded-lg border border-[#EDE0E3] text-sm text-[#2C1A1D]
                    focus:border-[#E87A86] focus:outline-none" value={form.logDate}
                                            onChange={e => setForm(f => ({ ...f, logDate: e.target.value }))} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#6B4F53] mb-2">Energy level</label>
                                        <div className="flex gap-2">
                                            {['low', 'medium', 'high'].map(e => (
                                                <button key={e} onClick={() => setForm(f => ({ ...f, energyLevel: e }))}
                                                    className={`flex-1 py-2.5 rounded-lg border text-xs font-semibold capitalize transition-all
                          ${form.energyLevel === e ? 'border-[#E87A86] bg-[#FDE0E4] text-[#C85C6B]' : 'border-[#EDE0E3] text-[#6B4F53] hover:border-[#E87A86]'}`}>
                                                    {e}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <label className="block text-xs font-semibold text-[#6B4F53] mb-2">Flow intensity</label>
                                    <div className="flex gap-2">
                                        {FLOW.map(f => (
                                            <button key={f} onClick={() => setForm(fc => ({ ...fc, flowIntensity: f }))}
                                                className={`flex-1 py-2 rounded-lg border text-xs font-semibold capitalize transition-all
                        ${form.flowIntensity === f ? 'border-[#E87A86] bg-[#FDE0E4] text-[#C85C6B]' : 'border-[#EDE0E3] text-[#6B4F53] hover:border-[#E87A86]'}`}>
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <label className="block text-xs font-semibold text-[#6B4F53] mb-2">
                                        {phase?.phase === 'menstrual' ? 'Any period symptoms today?' :
                                            phase?.phase === 'luteal' ? 'Any PMS symptoms?' : 'Physical symptoms'}
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {(PHASE_CONTENT[phase?.phase] || PHASE_CONTENT.default).physical.map(s => (
                                            <button key={s} onClick={() => toggleSym('physicalSymptoms', s)}
                                                className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all
                        ${form.physicalSymptoms.includes(s) ? 'border-[#E87A86] bg-[#FDE0E4] text-[#C85C6B]' : 'border-[#EDE0E3] text-[#6B4F53] hover:border-[#E87A86]'}`}>
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <label className="block text-xs font-semibold text-[#6B4F53] mb-2">
                                        {phase?.phase === 'luteal' ? 'How is your mood holding up?' : 'Emotional symptoms'}
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {(PHASE_CONTENT[phase?.phase] || PHASE_CONTENT.default).emotional.map(s => (
                                            <button key={s} onClick={() => toggleSym('emotionalSymptoms', s)}
                                                className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all
                        ${form.emotionalSymptoms.includes(s) ? 'border-[#9C77C4] bg-[#F0E6FF] text-[#7A5CA3]' : 'border-[#EDE0E3] text-[#6B4F53] hover:border-[#9C77C4]'}`}>
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <label className="block text-xs font-semibold text-[#6B4F53] mb-2">Mood (one word)</label>
                                    <input className="w-full px-3 py-2.5 rounded-lg border border-[#EDE0E3] text-sm
                  focus:border-[#E87A86] focus:outline-none placeholder:text-[#C0A8AC]"
                                        type="text" placeholder="e.g. calm, hopeful, drained…" maxLength={30}
                                        value={form.moodWord} onChange={e => setForm(f => ({ ...f, moodWord: e.target.value }))} />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-xs font-semibold text-[#6B4F53] mb-2">Notes (optional)</label>
                                    <textarea className="w-full px-3 py-2.5 rounded-lg border border-[#EDE0E3] text-sm leading-relaxed resize-none
                  focus:border-[#E87A86] focus:outline-none placeholder:text-[#C0A8AC]"
                                        rows={3} maxLength={280} placeholder="Anything else you want to note…"
                                        value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                                </div>

                                <button onClick={saveLog} disabled={saving}
                                    className="w-full py-3 bg-[#E87A86] text-white text-sm font-semibold rounded-lg hover:bg-[#D66874] disabled:opacity-40 transition-colors">
                                    {saving ? 'Saving…' : 'Save today\'s log'}
                                </button>
                            </div>
                        </div>

                        {/* Sidebar tip */}
                        <div className="flex flex-col gap-4">
                            <div className="bg-[#2C1A1D] rounded-2xl p-5 text-white">
                                <p className="text-xs font-semibold text-[#E87A86] uppercase tracking-wider mb-3">Why track daily?</p>
                                <ul className="flex flex-col gap-2.5 text-sm text-white/75 leading-relaxed">
                                    {['Identifies patterns unique to your cycle', 'Helps predict next period more accurately', 'Gives Maitri AI context for personalised answers', 'Creates a health record for doctor visits'].map(t => (
                                        <li key={t} className="flex items-start gap-2">
                                            <div className="w-1 h-1 rounded-full bg-[#E87A86] mt-1.5 flex-shrink-0" />
                                            {t}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── History tab ── */}
                {tab === 'history' && (
                    <div className="bg-white rounded-2xl border border-[#EDE0E3]">
                        <div className="px-6 py-4 border-b border-[#EDE0E3]">
                            <h3 className="font-heading text-base font-semibold text-[#2C1A1D]">Log history</h3>
                            <p className="text-xs text-[#9E7A82] mt-0.5">Last 30 entries</p>
                        </div>
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="w-6 h-6 rounded-full border-2 border-[#EDE0E3] border-t-[#E87A86] animate-spin" />
                            </div>
                        ) : logs.length === 0 ? (
                            <div className="text-center py-16 text-[#9E7A82] text-sm">No logs yet — start with today's entry.</div>
                        ) : (
                            <div className="divide-y divide-[#F0E8EA]">
                                {logs.map(log => (
                                    <div key={log._id} className="px-6 py-4 flex items-start gap-4 hover:bg-[#FDFBFB]">
                                        <div className="flex-shrink-0 text-center w-12">
                                            <p className="text-xs text-[#9E7A82]">{new Date(log.logDate).toLocaleDateString('en-IN', { month: 'short' })}</p>
                                            <p className="font-heading text-xl font-semibold text-[#2C1A1D]">{new Date(log.logDate).getDate()}</p>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize
                        ${log.energyLevel === 'high' ? 'bg-[#E6F4EA] text-[#68B984]' :
                                                        log.energyLevel === 'low' ? 'bg-[#FDE0E4] text-[#E87A86]' : 'bg-[#F0E8EA] text-[#9E7A82]'}`}>
                                                    {log.energyLevel || 'medium'} energy
                                                </span>
                                                {log.flowIntensity && log.flowIntensity !== 'none' && (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFF0E6] text-[#F4A261] capitalize">
                                                        {log.flowIntensity} flow
                                                    </span>
                                                )}
                                                {log.moodWord && (
                                                    <span className="text-xs text-[#9E7A82] italic">"{log.moodWord}"</span>
                                                )}
                                            </div>
                                            {[...(log.physicalSymptoms || []), ...(log.emotionalSymptoms || [])].length > 0 && (
                                                <p className="text-xs text-[#9E7A82] truncate">
                                                    {[...(log.physicalSymptoms || []), ...(log.emotionalSymptoms || [])].join(', ')}
                                                </p>
                                            )}
                                        </div>
                                        <button onClick={() => deleteLog(log._id)}
                                            className="text-xs text-[#C0A8AC] hover:text-red-500 transition-colors flex-shrink-0 mt-0.5">
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Patterns tab ── */}
                {tab === 'patterns' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {loading ? (
                            <div className="col-span-2 flex justify-center py-12">
                                <div className="w-6 h-6 rounded-full border-2 border-[#EDE0E3] border-t-[#E87A86] animate-spin" />
                            </div>
                        ) : !patterns ? (
                            <div className="col-span-2 bg-white rounded-2xl border border-[#EDE0E3] p-12 text-center text-[#9E7A82] text-sm">
                                Not enough data yet — log for at least 7 days to see patterns.
                            </div>
                        ) : (
                            <>
                                {patterns.topPhysical?.length > 0 && (
                                    <div className="bg-white rounded-2xl border border-[#EDE0E3] p-6">
                                        <h4 className="font-heading text-base font-semibold text-[#2C1A1D] mb-4">Top physical symptoms</h4>
                                        <div className="flex flex-col gap-3">
                                            {patterns.topPhysical.slice(0, 5).map(([s, c]) => (
                                                <div key={s} className="flex items-center gap-3">
                                                    <span className="text-sm text-[#2C1A1D] w-32 capitalize shrink-0">{s.replace(/_/g, ' ')}</span>
                                                    <div className="flex-1 h-2 bg-[#F8F4F5] rounded-full overflow-hidden">
                                                        <div className="h-full bg-[#E87A86] rounded-full" style={{ width: `${Math.min(100, (c / 30) * 100)}%` }} />
                                                    </div>
                                                    <span className="text-xs text-[#9E7A82] w-8 text-right">{c}×</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {patterns.topEmotional?.length > 0 && (
                                    <div className="bg-white rounded-2xl border border-[#EDE0E3] p-6">
                                        <h4 className="font-heading text-base font-semibold text-[#2C1A1D] mb-4">Emotional patterns</h4>
                                        <div className="flex flex-col gap-3">
                                            {patterns.topEmotional.slice(0, 5).map(([s, c]) => (
                                                <div key={s} className="flex items-center gap-3">
                                                    <span className="text-sm text-[#2C1A1D] w-32 capitalize shrink-0">{s.replace(/_/g, ' ')}</span>
                                                    <div className="flex-1 h-2 bg-[#F8F4F5] rounded-full overflow-hidden">
                                                        <div className="h-full bg-[#9C77C4] rounded-full" style={{ width: `${Math.min(100, (c / 30) * 100)}%` }} />
                                                    </div>
                                                    <span className="text-xs text-[#9E7A82] w-8 text-right">{c}×</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* ── Cycles tab ── */}
                {tab === 'cycles' && (
                    <div className="bg-white rounded-2xl border border-[#EDE0E3] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#EDE0E3] flex items-center justify-between">
                            <div>
                                <h3 className="font-heading text-base font-semibold text-[#2C1A1D]">Period History</h3>
                                <p className="text-xs text-[#9E7A82] mt-0.5">Your last 6 months of cycle data</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="w-6 h-6 rounded-full border-2 border-[#EDE0E3] border-t-[#E87A86] animate-spin" />
                            </div>
                        ) : cycles.length === 0 ? (
                            <div className="text-center py-16 text-[#9E7A82] text-sm">No period history found. Start tracking on the Dashboard!</div>
                        ) : (
                            <div className="divide-y divide-[#F0E8EA]">
                                {cycles.slice(0, 6).map((c, i) => {
                                    const start = new Date(c.startDate);
                                    const end = c.endDate ? new Date(c.endDate) : null;
                                    const length = c.periodLength || (end ? Math.ceil((end - start) / (1000 * 60 * 60 * 24)) : '—');

                                    return (
                                        <div key={c._id} className="px-6 py-5 flex items-center justify-between hover:bg-[#FDFBFB] transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-[#FDE0E4] flex items-center justify-center text-[#E87A86] font-bold text-sm">
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <p className="font-heading text-sm font-semibold text-[#2C1A1D]">
                                                        {start.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </p>
                                                    <p className="text-xs text-[#9E7A82]">
                                                        {end ? `Until ${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}` : 'Ongoing cycle'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-[#E87A86]">{length} days</p>
                                                <p className="text-[10px] text-[#9E7A82] uppercase tracking-wider font-semibold">Duration</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
