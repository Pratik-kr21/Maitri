import React, { useState, useRef, useEffect } from 'react';
import { Heart, ArrowUpRight, Loader2, Sparkles } from 'lucide-react';
import axios from 'axios';

const AskMaitriScreen = () => {
    const [messages, setMessages] = useState([
        { role: 'system_response', content: 'Hi there! I\'m Maitri. How can I support your health journey today?' }
    ]);
    const [inputStr, setInputStr] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSend = async (messageText = inputStr) => {
        if (!messageText.trim()) return;

        const newMessages = [...messages, { role: 'user', content: messageText }];
        setMessages(newMessages);
        setInputStr('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/ai/ask', {
                question: messageText,
                context: "Use plain English. Be supportive and concise."
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessages([...newMessages, { role: 'system_response', content: res.data.reply }]);
        } catch (error) {
            const errStr = error.response ? (error.response.status === 429 ? "The LLaMA AI model provider is currently experiencing high free-tier traffic. Please try again in a few moments!" : error.response.data?.message || 'Server error.') : "Sorry, I'm having trouble connecting right now.";
            setMessages([...newMessages, { role: 'system_response', content: errStr }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col pb-24 relative bg-[var(--color-bg-primary)]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--color-brand-secondary)] rounded-full blur-[80px] opacity-40 -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-accent-peach)] rounded-full blur-[60px] opacity-30 -ml-20 pointer-events-none" />

            {/* Header */}
            <div className="pt-6 px-4 md:px-6 pb-4 bg-white/70 backdrop-blur-xl shadow-sm z-10 rounded-b-3xl max-w-7xl mx-auto w-full sticky top-0 border-b border-white/50">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-hover)] rounded-full flex items-center justify-center animate-pulseGlow shadow-sm">
                        <Heart size={20} className="text-white fill-current animate-heartbeat" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-serif text-[var(--color-text-primary)] leading-none">Ask Maitri</h2>
                        <div className="flex items-center gap-1 mt-1">
                            <span className="bg-[var(--color-accent-peach)] px-2 py-0.5 rounded-full text-[9px] font-bold text-[var(--color-text-secondary)] tracking-wider uppercase flex items-center gap-1 shadow-sm"><Sparkles size={10} /> AI Powered</span>
                        </div>
                    </div>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] font-medium mt-1 ml-1 leading-relaxed opacity-80">Maitri provides physiological explanations. Ask anything.</p>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4 max-w-3xl mx-auto w-full mb-12 relative z-10">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-floatUp`} style={{ animationDelay: `${i * 30}ms` }}>
                        <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 text-[14px] md:text-[15px] leading-relaxed font-medium shadow-sm transition-all hover:scale-[1.01] ${msg.role === 'user'
                            ? 'bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-hover)] text-white rounded-br-sm shadow-[0_4px_12px_rgba(232,122,134,0.2)]'
                            : 'bg-white/80 backdrop-blur-md text-[var(--color-text-secondary)] rounded-tl-sm border border-white/60 hover:shadow-sm'
                            }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start animate-fade-in">
                        <div className="max-w-[80%] rounded-2xl p-4 rounded-tl-sm bg-white/80 backdrop-blur-md border border-white/60 shadow-sm flex items-center gap-2">
                            <Loader2 className="animate-spin text-[var(--color-brand-primary)]" size={18} />
                            <span className="text-xs font-medium text-[var(--color-text-secondary)] animate-pulse">Maitri is thinking...</span>
                        </div>
                    </div>
                )}

                {messages.length === 1 && (
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2 mt-auto pt-6 items-start">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1 w-full">Suggested Topics</span>
                        {["Why am I so tired during my luteal phase?", "How can I reduce period cramps naturally?", "What foods help with estrogen balance?"].map((chip) => (
                            <button
                                key={chip}
                                onClick={() => handleSend(chip)}
                                className="bg-white/90 backdrop-blur-md border border-[var(--color-border-light)] text-[var(--color-text-secondary)] rounded-full px-4 py-2 text-xs font-semibold hover:bg-[var(--color-brand-secondary)] hover:text-[var(--color-brand-primary)] transition-all transform hover:-translate-y-0.5 shadow-sm text-left flex-1 min-w-[180px]"
                            >
                                {chip}
                            </button>
                        ))}
                    </div>
                )}
                <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Input Area */}
            <div className="fixed bottom-[70px] left-0 right-0 px-4 md:px-16 lg:px-32 z-20 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-xl rounded-full p-1.5 flex items-center shadow-md border border-white max-w-2xl mx-auto transition-all focus-within:shadow-[0_4px_20px_rgba(232,122,134,0.15)] pointer-events-auto">
                    <input
                        type="text"
                        value={inputStr}
                        onChange={(e) => setInputStr(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your question..."
                        className="flex-1 bg-transparent px-4 py-2 outline-none text-sm font-medium text-[var(--color-text-primary)] placeholder-gray-400"
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={loading || !inputStr.trim()}
                        className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-hover)] text-white flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-sm"
                    >
                        <ArrowUpRight size={20} strokeWidth={2.5} />
                    </button>
                </div>
                <div className="px-2 pb-1 pt-2 pointer-events-auto text-center">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider backdrop-blur-sm px-3 py-1 rounded-full inline-block">Maitri is an AI logic system. Information provided is not medical advice.</p>
                </div>
            </div>
        </div>
    );
};

export default AskMaitriScreen;
