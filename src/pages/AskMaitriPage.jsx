import React, { useState, useRef, useEffect, useCallback } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const DAILY_LIMIT = 25;

const renderMessage = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
            ? <strong key={i}>{part.slice(2, -2)}</strong>
            : <span key={i}>{part}</span>
    );
};

function TypingIndicator() {
    return (
        <div className="flex gap-3 items-end">
            <div className="w-7 h-7 rounded-full bg-[#FDE0E4] flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-[#E87A86]" />
            </div>
            <div className="bg-white border border-[#EDE0E3] rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map(n => (
                        <div key={n} className="w-1.5 h-1.5 rounded-full bg-[#E87A86] animate-bounce"
                            style={{ animationDelay: `${n * 0.18}s` }} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function AskMaitriPage() {
    const { user } = useAuth();
    const toast = useToast();
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingSugg, setLoadingSugg] = useState(true);
    const [phase, setPhase] = useState(null);
    const [queriesLeft, setQueriesLeft] = useState(DAILY_LIMIT);
    const [history, setHistory] = useState([]);

    const loadSuggestions = useCallback(async () => {
        try {
            const res = await api.get('/ask-maitri/suggestions');
            setSuggestions(res.data.suggestions || []);
            if (res.data.phase) setPhase(res.data.phase);
            if (res.data.queriesLeft !== undefined) setQueriesLeft(res.data.queriesLeft);
        } catch {
            setSuggestions([
                'Why do I feel tired before my period?',
                'What is the luteal phase?',
                'How does ovulation affect my mood?',
                'Is an irregular cycle normal?',
                'What foods help with cramps?',
            ]);
        } finally { setLoadingSugg(false); }
    }, []);

    useEffect(() => { loadSuggestions(); }, [loadSuggestions]);
    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

    const sendMessage = async (text) => {
        const q = (text || input).trim();
        if (!q || loading || queriesLeft <= 0) return;
        setMessages(m => [...m, { role: 'user', content: q, ts: Date.now() }]);
        setInput('');
        setLoading(true);
        try {
            const res = await api.post('/ask-maitri/chat', { message: q, history: history.slice(-10) });
            const aiMsg = { role: 'assistant', content: res.data.response, ts: Date.now() };
            setMessages(m => [...m, aiMsg]);
            setHistory(h => [...h, { role: 'user', content: q }, { role: 'assistant', content: res.data.response }]);
            if (res.data.phase) setPhase(res.data.phase);
            if (res.data.queriesLeft !== undefined) setQueriesLeft(res.data.queriesLeft);
        } catch (err) {
            const msg = err.response?.data?.message || 'Something went wrong';
            setMessages(m => [...m, { role: 'error', content: msg, ts: Date.now() }]);
            toast.error(msg);
        } finally {
            setLoading(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const PHASE_LABELS = { menstrual: 'Menstrual', follicular: 'Follicular', ovulatory: 'Ovulatory', luteal: 'Luteal' };
    const PHASE_COLORS = { menstrual: '#E87A86', follicular: '#68B984', ovulatory: '#F4A261', luteal: '#9C77C4' };

    return (
        <div className="flex flex-col bg-[#F8F4F5] flex-1 h-full overflow-hidden">

            {/* Header */}
            <div className="bg-white border-b border-[#EDE0E3] px-6 py-4 flex-shrink-0">
                <div className="w-full flex items-center justify-between gap-6">
                    <div>
                        <h1 className="font-heading text-xl font-semibold text-[#2C1A1D]">Ask Maitri</h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                            <p className="text-xs text-[#9E7A82]">AI health companion · Powered by OpenRouter</p>
                            {phase && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold ml-1"
                                    style={{ background: `${PHASE_COLORS[phase.phase]}20`, color: PHASE_COLORS[phase.phase] }}>
                                    {PHASE_LABELS[phase.phase]} phase · Day {phase.cycleDay}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-semibold text-[#2C1A1D]">{queriesLeft} / {DAILY_LIMIT} questions</p>
                        </div>
                        <div className="w-20 h-1.5 bg-[#EDE0E3] rounded-full overflow-hidden">
                            <div className="h-full bg-[#E87A86] rounded-full transition-all duration-500"
                                style={{ width: `${(queriesLeft / DAILY_LIMIT) * 100}%` }} />
                        </div>
                    </div>
                </div>

                {/* Disclaimer bar */}
                <div className="w-full mt-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-amber-600 flex-shrink-0"
                        stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <p className="text-xs text-amber-800">Maitri provides <strong>health education, not medical advice.</strong> For urgent symptoms, please consult a doctor.</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto min-h-0">
                <div className="w-full px-4 md:px-6 py-6 flex flex-col gap-4">

                    {messages.length === 0 && (
                        <div className="flex flex-col items-center text-center py-10 gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-[#FDE0E4] flex items-center justify-center">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E87A86" strokeWidth="1.8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="font-heading text-2xl font-semibold text-[#2C1A1D] mb-1">
                                    Hello, {user?.username}
                                </h2>
                                <p className="text-sm text-[#9E7A82] leading-relaxed max-w-sm">
                                    Ask me anything about your cycle, hormones, or symptoms. I'll give you honest, educational answers.
                                </p>
                            </div>

                            {phase && (
                                <div className="w-full max-w-sm bg-white rounded-xl border border-[#EDE0E3] p-4 text-left">
                                    <p className="text-xs font-semibold text-[#9E7A82] mb-2">CURRENT CONTEXT</p>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                                            style={{ background: `${PHASE_COLORS[phase.phase]}20`, color: PHASE_COLORS[phase.phase] }}>
                                            {PHASE_LABELS[phase.phase]}
                                        </span>
                                        <span className="text-sm text-[#5C4A4D]">Day {phase.cycleDay} of your cycle</span>
                                    </div>
                                </div>
                            )}

                            <div className="w-full max-w-md text-left">
                                <p className="text-xs font-semibold text-[#9E7A82] mb-2 uppercase tracking-wide">
                                    {phase ? `Suggested for ${PHASE_LABELS[phase.phase]?.toLowerCase()} phase` : 'Suggested questions'}
                                </p>
                                {loadingSugg ? (
                                    <div className="flex flex-col gap-2">
                                        {[1, 2, 3].map(i => <div key={i} className="h-10 rounded-xl bg-[#F0E8EA] animate-pulse" />)}
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {suggestions.map(s => (
                                            <button key={s} onClick={() => sendMessage(s)}
                                                className="text-left px-4 py-3 rounded-xl border border-[#EDE0E3] bg-white text-sm text-[#5C4A4D]
                          hover:border-[#E87A86] hover:text-[#C85C6B] transition-all duration-150 flex items-center gap-2 group">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                                    className="text-[#E87A86] flex-shrink-0">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                                                </svg>
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-3 items-end ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                ${msg.role === 'user' ? 'text-white' : 'bg-[#FDE0E4]'}`}
                                style={msg.role === 'user' ? { background: user?.avatarColor || '#E87A86' } : {}}>
                                {msg.role === 'user'
                                    ? user?.username?.[0]?.toUpperCase()
                                    : msg.role === 'error'
                                        ? <span className="text-red-500 font-bold text-xs">!</span>
                                        : <div className="w-3 h-3 rounded-full bg-[#E87A86]" />
                                }
                            </div>

                            <div className={`max-w-[80%] flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`px-4 py-3 text-sm leading-relaxed rounded-2xl
                  ${msg.role === 'user'
                                        ? 'text-white rounded-br-sm'
                                        : msg.role === 'error'
                                            ? 'bg-red-50 border border-red-200 text-red-700 rounded-bl-sm'
                                            : 'bg-white border border-[#EDE0E3] text-[#2C1A1D] rounded-bl-sm shadow-sm'}`}
                                    style={msg.role === 'user' ? { background: user?.avatarColor || '#E87A86' } : {}}>
                                    {msg.role === 'assistant'
                                        ? <div className="whitespace-pre-wrap">{renderMessage(msg.content)}</div>
                                        : msg.content}
                                </div>
                                <span className="text-[10px] text-[#B0909A] px-1">
                                    {new Date(msg.ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}

                    {loading && <TypingIndicator />}
                    <div ref={bottomRef} />
                </div>
            </div>

            {/* Follow-up chips */}
            {messages.length > 0 && !loading && suggestions.length > 0 && (
                <div className="border-t border-[#EDE0E3] bg-white/70 px-6 py-2 flex-shrink-0">
                    <div className="w-full flex gap-2 overflow-x-auto scrollbar-hide">
                        <span className="text-xs text-[#9E7A82] font-medium flex-shrink-0 self-center">Ask more:</span>
                        {suggestions.slice(0, 4).map(s => (
                            <button key={s} onClick={() => sendMessage(s)}
                                className="flex-shrink-0 px-3 py-1.5 rounded-full border border-[#EDE0E3] bg-white text-xs text-[#6B4F53]
                  hover:border-[#E87A86] hover:text-[#C85C6B] transition-all whitespace-nowrap">
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="border-t border-[#EDE0E3] bg-white px-6 py-4 flex-shrink-0">
                <div className="w-full">
                    {queriesLeft <= 0 ? (
                        <p className="text-center text-sm text-[#9E7A82] py-2">
                            You've reached your daily limit of {DAILY_LIMIT} questions. Come back tomorrow.
                        </p>
                    ) : (
                        <div className="flex gap-3 items-end">
                            <textarea ref={inputRef} rows={1}
                                className="flex-1 px-4 py-3 rounded-xl border border-[#EDE0E3] text-sm text-[#2C1A1D] bg-[#F8F4F5]
                  focus:border-[#E87A86] focus:outline-none focus:bg-white resize-none leading-relaxed placeholder:text-[#B0909A]
                  transition-all duration-150"
                                placeholder="Ask about your cycle, symptoms, or how you're feeling…"
                                value={input}
                                onChange={e => {
                                    setInput(e.target.value);
                                    e.target.style.height = 'auto';
                                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                                }}
                                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                                style={{ minHeight: '48px', maxHeight: '120px' }}
                                disabled={loading} />
                            <button onClick={() => sendMessage()}
                                disabled={!input.trim() || loading}
                                className="w-11 h-11 rounded-xl bg-[#E87A86] flex items-center justify-center
                  hover:bg-[#D66874] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
                                </svg>
                            </button>
                        </div>
                    )}
                    <p className="text-center text-[10px] text-[#C0A8AC] mt-2">
                        Maitri provides health education only · Not a substitute for professional medical advice
                    </p>
                </div>
            </div>
        </div>
    );
}
