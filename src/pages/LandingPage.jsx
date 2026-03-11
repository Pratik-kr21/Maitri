import React from 'react';
import { Link } from 'react-router-dom';

const features = [
    { emoji: '🌸', title: 'Phase-Aware Insights', desc: 'Discover what your hormones are doing each day — explained in plain language, not clinical jargon.' },
    { emoji: '📔', title: 'Micro-Journal Check-In', desc: 'Log energy, symptoms and mood in under 30 seconds. Built like a conversation, not a medical form.' },
    { emoji: '🔍', title: 'Pattern Detection', desc: 'After 2 cycles, Maitri surfaces patterns connecting your symptoms to your hormonal rhythm.' },
    { emoji: '✨', title: 'Ask Maitri AI', desc: 'Safe, honest answers to your cycle questions — with clinical guardrails and zero judgment.' },
    { emoji: '💜', title: 'Community Circles', desc: 'Connect anonymously with women at your life stage — moderated, warm, and age-gated.' },
    { emoji: '🔒', title: 'Privacy First', desc: 'Your health data is yours. No selling, no tracking, no third-party ad scripts. Ever.' },
];

const phases = [
    { phase: 'Menstrual', emoji: '🌹', color: '#E87A86', bg: '#FDE0E4', desc: 'Rest is your superpower. Your body is doing something remarkable.' },
    { phase: 'Follicular', emoji: '🌱', color: '#68B984', bg: '#E6F4EA', desc: 'Estrogen rises. Energy, clarity and optimism follow.' },
    { phase: 'Ovulatory', emoji: '✨', color: '#F4A261', bg: '#FFF0E6', desc: 'Peak energy, creativity, and social confidence.' },
    { phase: 'Luteal', emoji: '🌕', color: '#9C77C4', bg: '#F0E6FF', desc: 'Progesterone rises. Slow down and nourish yourself.' },
];

const stats = [
    { n: '5K+', l: 'Women trust Maitri' },
    { n: '80%', l: 'Prediction accuracy' },
    { n: '35%', l: 'Daily check-in rate' },
    { n: '0', l: 'Data ever sold' },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-bg-primary font-body">

            {/* ── Navbar ── */}
            <header className="sticky top-0 z-50 border-b border-maitri-border"
                style={{ background: 'rgba(255,245,248,0.93)', backdropFilter: 'blur(12px)' }}>
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <img src="/favicon.svg" alt="Maitri logo" className="w-8 h-8" />
                        <span className="font-heading text-xl font-semibold text-brand-primary">Maitri</span>
                    </div>
                    <nav className="hidden sm:flex gap-6 text-sm font-medium text-maitri-mid">
                        <a href="#features" className="hover:text-brand-primary transition-colors">Features</a>
                        <a href="#phases" className="hover:text-brand-primary transition-colors">How it works</a>
                    </nav>
                    <div className="flex items-center gap-2">
                        <Link to="/login" className="btn btn-outline btn-sm">Log in</Link>
                        <Link to="/signup" className="btn btn-primary btn-sm flex items-center gap-2">
                            Get started
                            <span className="btn-icon-circle text-xs">↗</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* ── Hero ── */}
            <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-64px)]">
                {/* Left */}
                <div className="flex flex-col gap-6">
                    <span className="badge badge-pink self-start text-xs py-1.5 px-3">
                        🌸 Privacy-first · AI-assisted · Women's health
                    </span>

                    <h1 className="font-heading text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight text-maitri-dark">
                        The period tracker that{' '}
                        <em className="text-brand-primary italic not-italic font-semibold">teaches you</em>{' '}
                        your cycle.
                    </h1>

                    <p className="text-lg text-maitri-mid leading-relaxed max-w-lg">
                        Go beyond prediction. Understand what your hormones are doing each day —
                        privately, safely, and with a community that truly gets it.
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <Link to="/signup" className="btn btn-primary btn-lg flex items-center gap-3">
                            Start for free
                            <span className="btn-icon-circle">↗</span>
                        </Link>
                        <a href="#features" className="btn btn-outline btn-lg">See how it works</a>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-8 pt-4 border-t border-maitri-border">
                        {stats.map(s => (
                            <div key={s.l} className="flex flex-col gap-0.5">
                                <span className="font-heading text-3xl font-semibold text-brand-primary leading-none">{s.n}</span>
                                <span className="text-xs text-maitri-muted font-medium">{s.l}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right — UI preview cards */}
                <div className="relative grid grid-cols-[1fr_auto] grid-rows-[1fr_auto] gap-3">
                    {/* Main card */}
                    <div className="col-span-2 bg-white rounded-3xl p-6 shadow-md-pink border border-maitri-border flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl">🌱</span>
                            <div>
                                <div className="font-semibold text-base text-maitri-dark">Follicular Phase</div>
                                <div className="text-sm text-maitri-muted">Day 8 of your cycle</div>
                            </div>
                        </div>
                        <div className="h-px bg-maitri-border" />
                        <p className="text-sm text-maitri-mid leading-relaxed">
                            ✨ <strong>Today's insight:</strong> Estrogen is rising. You may feel more energetic and creative — lean into it.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="symptom-chip selected">🌱 High energy</span>
                            <span className="symptom-chip selected">💬 Social</span>
                            <span className="symptom-chip">😴 Fatigue</span>
                        </div>
                    </div>

                    {/* Stat mini card */}
                    <div className="bg-accent-yellow rounded-2xl p-4 flex flex-col gap-1 justify-center">
                        <span className="font-heading text-3xl font-semibold text-maitri-dark leading-none">80%</span>
                        <span className="text-xs text-maitri-mid">Prediction accuracy after 7+ cycles</span>
                    </div>

                    {/* Ask mini card */}
                    <div className="bg-brand-secondary rounded-2xl p-4 flex flex-col gap-1 justify-center min-w-[130px]">
                        <span className="text-xl">✨</span>
                        <div className="text-sm font-semibold text-maitri-dark">Ask Maitri</div>
                        <div className="text-xs text-maitri-muted">Safe AI answers</div>
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section id="features" className="py-24 max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="font-heading text-4xl font-semibold text-maitri-dark mb-4">
                        Built for your whole cycle,<br />not just your period.
                    </h2>
                    <p className="text-lg text-maitri-mid max-w-xl mx-auto">
                        Maitri works across all four phases — understanding your body is a 28-day journey, not just 5 days.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map(f => (
                        <div key={f.title}
                            className="card hover:-translate-y-1 transition-transform duration-200 flex flex-col gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-brand-secondary flex items-center justify-center text-2xl">
                                {f.emoji}
                            </div>
                            <h3 className="font-heading text-lg font-semibold text-maitri-dark">{f.title}</h3>
                            <p className="text-sm text-maitri-mid leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Privacy Banner ── */}
            <section className="bg-bg-secondary py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="font-heading text-4xl font-semibold text-white mb-4">
                        Your data never leaves your control.
                    </h2>
                    <p className="text-white/75 text-lg max-w-xl mx-auto mb-10">
                        Zero third-party ad scripts. No selling your health data. Application-level encryption.
                        Full deletion in 24 hours — always.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {['🔐 Encrypted', '🚫 No Ads', '🗑️ Full Deletion', '🔒 DPDP Compliant'].map(b => (
                            <span key={b}
                                className="px-5 py-2.5 rounded-full text-sm font-semibold text-white border border-white/20"
                                style={{ background: 'rgba(255,255,255,0.12)' }}>
                                {b}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Phases ── */}
            <section id="phases" className="py-24 max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="font-heading text-4xl font-semibold text-maitri-dark mb-4">Every phase, explained.</h2>
                    <p className="text-lg text-maitri-mid max-w-xl mx-auto">
                        Maitri connects your logged symptoms to real hormonal science — in plain English, not jargon.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {phases.map(p => (
                        <div key={p.phase}
                            className="rounded-3xl p-6 flex flex-col gap-3 hover:-translate-y-1 transition-transform duration-200"
                            style={{ background: p.bg }}>
                            <span className="text-4xl">{p.emoji}</span>
                            <h4 className="font-heading text-lg font-semibold" style={{ color: p.color }}>{p.phase}</h4>
                            <p className="text-sm text-maitri-mid leading-relaxed">{p.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="bg-white py-24">
                <div className="max-w-2xl mx-auto px-6 text-center">
                    <h2 className="font-heading text-4xl font-semibold text-maitri-dark mb-3">
                        Start understanding your cycle today.
                    </h2>
                    <p className="text-lg text-maitri-mid mb-8">Free to use. No credit card. No hidden tracking.</p>
                    <Link to="/signup" className="btn btn-primary btn-lg inline-flex items-center gap-3">
                        Create your account
                        <span className="btn-icon-circle">↗</span>
                    </Link>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="border-t border-maitri-border py-6 px-6">
                <div className="max-w-6xl mx-auto flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <img src="/favicon.svg" alt="Maitri logo" className="w-7 h-7" />
                        <span className="font-heading text-lg font-semibold text-brand-primary">Maitri</span>
                    </div>
                    <p className="text-xs text-maitri-muted max-w-xl">
                        Not a medical service. Maitri provides health education, not diagnosis.
                        Always speak to a doctor for medical concerns.
                    </p>
                </div>
            </footer>
        </div>
    );
}
