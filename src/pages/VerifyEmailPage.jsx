import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function VerifyEmailPage() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();
    const toast = useToast();

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    useEffect(() => {
        const emailParam = params.get('email');
        if (emailParam) setEmail(emailParam);
    }, [params]);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!email || !otp) return;
        setLoading(true);
        try {
            const res = await api.post('/auth/verify-email', { email, otp });
            toast.success('Welcome to Maitri! 🌸');
            login(res.data.token, res.data.user);
            navigate('/home');
        } catch (err) {
            const msg = err.response?.data?.message || '';
            if (msg.includes('expired')) {
                toast.error('This code has expired. Please request a new one.');
            } else if (msg.includes('Invalid')) {
                toast.error('Wrong code! Please check and try again.');
            } else {
                toast.error(msg || 'Verification failed');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0 || resending) return;
        setResending(true);
        try {
            await api.post('/auth/resend-otp', { email });
            toast.success('New code sent to your email!');
            setResendTimer(60); // 60s cooldown
        } catch (err) {
            toast.error(err.response?.data?.message || 'Could not resend code');
        } finally {
            setResending(false);
        }
    };

    useEffect(() => {
        if (resendTimer > 0) {
            const t = setInterval(() => setResendTimer(prev => prev - 1), 1000);
            return () => clearInterval(t);
        }
    }, [resendTimer]);

    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-md-pink border border-maitri-border">
                <Link to="/" className="flex justify-center items-center gap-2 no-underline mb-6">
                    <img src="/favicon.svg" alt="Maitri logo" className="w-8 h-8" />
                    <span className="font-heading text-xl font-semibold text-brand-primary">Maitri</span>
                </Link>

                <div className="text-center mb-6">
                    <h2 className="font-heading text-2xl font-semibold text-maitri-dark mb-2">Check your email</h2>
                    <p className="text-sm text-maitri-mid">We sent a 6-digit code to <strong>{email || 'your email'}</strong>. Enter it below.</p>
                </div>

                <form onSubmit={handleVerify} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="form-label">Email address</label>
                        <input className="form-input bg-gray-50 text-gray-500" type="email" value={email} readOnly disabled />
                    </div>

                    <div className="flex flex-col gap-1.5 focus-within:text-brand-primary">
                        <label className="form-label">Verification Code (6 digits)</label>
                        <input
                            className="form-input text-center text-2xl tracking-[0.5em] font-bold"
                            type="text"
                            maxLength={6}
                            placeholder="••••••"
                            value={otp}
                            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full justify-center py-3 mt-2" disabled={loading || otp.length !== 6}>
                        {loading ? <span className="spinner" /> : 'Verify Code →'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-maitri-border text-center">
                    <p className="text-sm text-maitri-mid mb-3">Didn't get the code?</p>
                    <button
                        onClick={handleResend}
                        disabled={resending || resendTimer > 0}
                        className={`text-sm font-semibold transition-colors ${resendTimer > 0 ? 'text-maitri-muted cursor-not-allowed' : 'text-brand-primary hover:text-brand-hover'
                            }`}
                    >
                        {resending ? 'Sending...' : resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend verification code'}
                    </button>
                    <div className="mt-4">
                        <Link to="/login" className="text-xs text-maitri-muted hover:text-maitri-dark no-underline">
                            Try a different account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
