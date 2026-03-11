import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
    const [identifier, setIdentifier] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sentToEmail, setSentToEmail] = useState('');
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Login attempt with:', identifier);
        if (!identifier) return;
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { identifier });
            setSubmitted(true);
            // res.data.email is the actual email we sent to
            if (res.data.email) setSentToEmail(res.data.email);
            toast.success('Verification code sent! Check your email.');
        } catch (err) {
            console.error('Login error details:', err);
            const status = err.response?.status;
            const msg = err.response?.data?.message || err.message;
            toast.error(`Error (${status || 'Network'}): ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-3xl p-8 shadow-md-pink border border-maitri-border">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 no-underline mb-8">
                        <img src="/favicon.svg" alt="Maitri logo" className="w-8 h-8" />
                        <span className="font-heading text-xl font-semibold text-brand-primary">Maitri</span>
                    </Link>

                    {submitted ? (
                        <div className="text-center flex flex-col items-center gap-4">
                            <div className="text-6xl">📬</div>
                            <h2 className="font-heading text-2xl font-semibold text-maitri-dark">Check your inbox</h2>
                            <p className="text-maitri-mid text-sm leading-relaxed">
                                We sent a 6-digit verification code to <strong className="text-maitri-dark">{sentToEmail || identifier}</strong>.
                            </p>

                            {/* Removed DEV MODE UI */}

                            <Link to={`/verify-email?email=${encodeURIComponent(sentToEmail || identifier)}`} className="btn btn-primary mt-2">
                                Enter verification code
                            </Link>
                            <button
                                className="btn btn-ghost btn-sm mt-4"
                                onClick={() => { setSubmitted(false); }}>
                                Try again
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6">
                                <h2 className="font-heading text-2xl font-semibold text-maitri-dark mb-1">Welcome back 💜</h2>
                                <p className="text-sm text-maitri-mid">Enter your email or username and we'll send a code to your registered email.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="id" className="form-label">Email or Username</label>
                                    <input
                                        id="id"
                                        type="text"
                                        className="form-input"
                                        placeholder="you@email.com or username"
                                        value={identifier}
                                        onChange={e => setIdentifier(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-full justify-center py-3"
                                    disabled={loading}
                                >
                                    {loading ? 'Sending code...' : 'Send verification code 📩'}
                                </button>
                            </form>

                            <p className="text-center text-sm text-maitri-muted mt-6">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-brand-primary font-semibold hover:text-brand-hover">
                                    Create one free
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
