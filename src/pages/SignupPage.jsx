import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { useToast } from '../context/ToastContext';

const AVATARS = ['lotus', 'moon', 'sun', 'star', 'flower', 'leaf'];
const AVATAR_EMOJIS = { lotus: '🪷', moon: '🌙', sun: '☀️', star: '⭐', flower: '🌸', leaf: '🍃' };
const COLORS = ['#E87A86', '#68B984', '#F4A261', '#9C77C4', '#4EA8DE', '#F6B93B'];

const steps = ['Your details', 'About you', 'Your avatar', 'All done!'];

export default function SignupPage() {
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [devOtp, setDevOtp] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [usernameAvailability, setUsernameAvailability] = useState(null); // null | checking | available | taken
    const toast = useToast();

    const [form, setForm] = useState({
        email: '', username: '', displayName: '', dateOfBirth: '',
        parentEmail: '', avatar: 'lotus', avatarColor: '#E87A86',
        lastPeriodDate: '',
    });
    const [errors, setErrors] = useState({});

    const age = form.dateOfBirth
        ? new Date().getFullYear() - new Date(form.dateOfBirth).getFullYear()
        : null;
    const isMinor = age !== null && age < 18;

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    React.useEffect(() => {
        if (!form.username || form.username.length < 3) {
            setUsernameAvailability(null);
            return;
        }

        setUsernameAvailability('checking');
        const timer = setTimeout(async () => {
            try {
                const res = await api.get(`/auth/check-username/${form.username}`);
                setUsernameAvailability(res.data.available ? 'available' : 'taken');
            } catch {
                setUsernameAvailability(null);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [form.username]);

    const validateStep0 = () => {
        const e = {};
        if (!form.email) e.email = 'Email is required';
        if (!form.displayName) e.displayName = 'Full name is required';
        if (!form.username || form.username.length < 3) e.username = 'Username must be at least 3 characters';
        else if (!/^[a-zA-Z0-9._]+$/.test(form.username)) e.username = 'Only letters, numbers, dots (.) and underscores (_) allowed';
        else if (usernameAvailability === 'taken') e.username = 'Username is already taken';
        if (!form.dateOfBirth) e.dateOfBirth = 'Date of birth is required';
        if (isMinor && !form.parentEmail) e.parentEmail = 'Parent/guardian email is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleNext = () => {
        if (step === 0 && !validateStep0()) return;
        setStep(s => s + 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await api.post('/auth/signup', {
                email: form.email,
                username: form.username,
                displayName: form.displayName,
                dateOfBirth: form.dateOfBirth,
                parentEmail: isMinor ? form.parentEmail : undefined,
                avatar: form.avatar,
                avatarColor: form.avatarColor,
                lastPeriodDate: form.lastPeriodDate || undefined,
            });
            if (res.data.devOtp) setDevOtp(res.data.devOtp);
            setSubmitted(true);
            setStep(3);
            toast.success('Account created! Check your email for the code.');
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Something went wrong';
            toast.error(msg);

            // Map common errors back to fields and go back to first step
            if (msg.toLowerCase().includes('email')) {
                setErrors(prev => ({ ...prev, email: msg }));
                setStep(0);
            } else if (msg.toLowerCase().includes('username')) {
                setErrors(prev => ({ ...prev, username: msg }));
                setStep(0);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl p-8 shadow-md-pink border border-maitri-border">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 no-underline mb-6">
                        <img src="/favicon.svg" alt="Maitri logo" className="w-8 h-8" />
                        <span className="font-heading text-xl font-semibold text-brand-primary">Maitri</span>
                    </Link>

                    {/* Progress */}
                    <div className="flex gap-2 mb-6">
                        {steps.map((s, i) => (
                            <div key={s}
                                className={`h-1.5 flex-1 rounded-full transition-all duration-300
                  ${i <= step ? 'bg-brand-primary' : 'bg-maitri-border'}`} />
                        ))}
                    </div>
                    <p className="text-xs text-maitri-muted font-medium mb-6">Step {step + 1} of {steps.length} — {steps[step]}</p>

                    {/* ── Step 0: Details ── */}
                    {step === 0 && (
                        <div className="flex flex-col gap-5">
                            <h2 className="font-heading text-2xl font-semibold text-maitri-dark">Create your account 🌸</h2>

                            <div className="flex flex-col gap-1.5">
                                <label className="form-label">Email address</label>
                                <input className="form-input" type="email" placeholder="you@example.com"
                                    value={form.email} onChange={e => set('email', e.target.value)} />
                                {errors.email && <p className="form-error">⚠ {errors.email}</p>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="form-label">Full name</label>
                                <input className="form-input" type="text" placeholder="e.g. Priya Sharma"
                                    value={form.displayName} onChange={e => set('displayName', e.target.value)} />
                                {errors.displayName && <p className="form-error">⚠ {errors.displayName}</p>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="form-label">Your username</label>
                                <input className={`form-input transition-colors duration-200 ${usernameAvailability === 'available' ? 'border-green-500 focus:border-green-600 focus:ring-green-100' :
                                    usernameAvailability === 'taken' ? 'border-red-500 focus:border-red-600 focus:ring-red-100' : ''
                                    }`} type="text" placeholder="e.g. moonrise_priya"
                                    value={form.username}
                                    onChange={e => {
                                        const val = e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, '');
                                        set('username', val);
                                    }} />
                                {usernameAvailability === 'checking' && <p className="text-[10px] text-maitri-muted animate-pulse">Checking availability...</p>}
                                {usernameAvailability === 'available' && <p className="text-[10px] text-green-600 font-medium">✓ Username is available</p>}
                                {usernameAvailability === 'taken' && <p className="text-[10px] text-red-500 font-medium">✗ Username is already taken</p>}
                                <p className="text-xs text-maitri-muted">Use letters, numbers, dots (.) or underscores (_). No @ or spaces.</p>
                                {errors.username && <p className="form-error">⚠ {errors.username}</p>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="form-label">Date of birth</label>
                                <input className="form-input" type="date"
                                    value={form.dateOfBirth}
                                    onChange={e => set('dateOfBirth', e.target.value)}
                                    max={new Date().toISOString().split('T')[0]} />
                                {errors.dateOfBirth && <p className="form-error">⚠ {errors.dateOfBirth}</p>}
                            </div>

                            {isMinor && (
                                <div className="rounded-2xl bg-accent-yellow p-4 flex flex-col gap-3">
                                    <p className="text-sm font-medium text-amber-900">
                                        👋 Since you're under 18, we need a parent or guardian's email for consent.
                                    </p>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="form-label">Parent/guardian email</label>
                                        <input className="form-input" type="email" placeholder="parent@example.com"
                                            value={form.parentEmail} onChange={e => set('parentEmail', e.target.value)} />
                                        {errors.parentEmail && <p className="form-error">⚠ {errors.parentEmail}</p>}
                                    </div>
                                </div>
                            )}

                            <button onClick={handleNext} className="btn btn-primary w-full justify-center py-3">
                                Continue →
                            </button>
                        </div>
                    )}

                    {/* ── Step 1: About you ── */}
                    {step === 1 && (
                        <div className="flex flex-col gap-6">
                            <h2 className="font-heading text-2xl font-semibold text-maitri-dark">A quick hello 💜</h2>

                            <div className="rounded-3xl bg-brand-secondary p-5 flex flex-col gap-3">
                                <p className="font-semibold text-maitri-dark">Your privacy promise from Maitri:</p>
                                <ul className="text-sm text-maitri-mid flex flex-col gap-2">
                                    {[
                                        'Your full name is private and never shown to the community',
                                        'Tracking adapts dynamically to your current cycle phase',
                                        'Personalized AI insights generated from your daily logs',
                                        'Encrypted storage for your 6-month cycle history',
                                        'Secure passwordless login via email verification code',
                                    ].map(i => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="text-brand-primary mt-0.5">✓</span>
                                            <span>{i}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex flex-col gap-1.5 mt-2">
                                <label className="form-label">When did your last period start? (Optional)</label>
                                <input className="form-input" type="date"
                                    value={form.lastPeriodDate}
                                    onChange={e => set('lastPeriodDate', e.target.value)}
                                    max={new Date().toISOString().split('T')[0]} />
                                <p className="text-xs text-maitri-muted mt-1">This sets up your cycle insights immediately.</p>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setStep(0)} className="btn btn-ghost flex-1">← Back</button>
                                <button onClick={handleNext} className="btn btn-primary flex-1">Sounds good →</button>
                            </div>
                        </div>
                    )}

                    {/* ── Step 2: Avatar ── */}
                    {step === 2 && (
                        <div className="flex flex-col gap-6">
                            <h2 className="font-heading text-2xl font-semibold text-maitri-dark">Choose your avatar ✨</h2>

                            {/* Avatar preview */}
                            <div className="flex justify-center">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-md-pink"
                                    style={{ background: form.avatarColor }}>
                                    {AVATAR_EMOJIS[form.avatar]}
                                </div>
                            </div>

                            {/* Avatar choice */}
                            <div className="grid grid-cols-6 gap-2">
                                {AVATARS.map(a => (
                                    <button key={a} onClick={() => set('avatar', a)}
                                        className={`rounded-2xl p-2.5 aspect-square flex items-center justify-center text-2xl
                      border-2 transition-all duration-150
                      ${form.avatar === a ? 'border-brand-primary bg-brand-secondary scale-105' : 'border-maitri-border hover:border-brand-primary'}`}>
                                        {AVATAR_EMOJIS[a]}
                                    </button>
                                ))}
                            </div>

                            {/* Color choice */}
                            <div className="flex gap-2.5 justify-center">
                                {COLORS.map(c => (
                                    <button key={c} onClick={() => set('avatarColor', c)}
                                        className="w-8 h-8 rounded-full border-2 transition-all duration-150 hover:scale-110"
                                        style={{
                                            background: c,
                                            borderColor: form.avatarColor === c ? '#2C1A1D' : 'transparent',
                                            boxShadow: form.avatarColor === c ? '0 0 0 2px white, 0 0 0 4px ' + c : 'none',
                                        }} />
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setStep(1)} className="btn btn-ghost flex-1">← Back</button>
                                <button onClick={handleSubmit} className="btn btn-primary flex-1" disabled={loading}>
                                    {loading ? <span className="spinner" /> : 'Create my account 🌸'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Step 3: Done ── */}
                    {step === 3 && (
                        <div className="text-center flex flex-col items-center gap-4">
                            <div className="text-6xl animate-bounce">🎉</div>
                            <h2 className="font-heading text-2xl font-semibold text-maitri-dark">
                                Welcome to Maitri, {form.username}!
                            </h2>
                            <p className="text-sm text-maitri-mid leading-relaxed">
                                We sent a 6-digit verification code to <strong className="text-maitri-dark">{form.email}</strong>.
                            </p>

                            {/* Removed DEV MODE UI */}

                            <Link to={`/verify-email?email=${encodeURIComponent(form.email)}`} className="btn btn-primary mt-2">
                                Enter verification code
                            </Link>
                        </div>
                    )}

                    {step < 3 && (
                        <p className="text-center text-sm text-maitri-muted mt-6">
                            Already have an account?{' '}
                            <Link to="/login" className="text-brand-primary font-semibold hover:text-brand-hover">Log in</Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
