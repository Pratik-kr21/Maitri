import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function VaultPage() {
    const { user, logout } = useAuth();
    const toast = useToast();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmText, setConfirmText] = useState('');

    useEffect(() => {
        api.get('/vault/export').then(r => {
            const v = r.data.vault;
            setStats({
                cycleCount: v.totalCycles,
                logCount: v.totalDaysLogged,
                avgCycle: null,
                daysSincePeriod: v.cycles?.[0]?.startDate
                    ? Math.floor((Date.now() - new Date(v.cycles[0].startDate)) / (1000 * 60 * 60 * 24))
                    : null,
                topSymptoms: [
                    ...v.symptoms.physical,
                    ...v.symptoms.emotional,
                ].sort((a, b) => b[1] - a[1]).slice(0, 6),
                recentCycles: v.cycles?.slice(0, 5) || [],
            });
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const exportData = async () => {
        setExporting(true);
        try {
            const res = await api.get('/vault/export', { responseType: 'blob' });
            const url = URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = `maitri-data-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success('Data exported successfully');
        } catch { toast.error('Export failed'); }
        finally { setExporting(false); }
    };

    const deleteAccount = async () => {
        if (confirmText !== user?.username) return toast.error('Username does not match');
        setDeleting(true);
        try {
            await api.delete('/vault/account');
            toast.success('Account deleted');
            logout();
        } catch { toast.error('Could not delete account'); setDeleting(false); }
    };

    const STAT_CARDS = [
        { label: 'Cycles tracked', value: stats?.cycleCount ?? '—', sub: 'period cycles logged' },
        { label: 'Days logged', value: stats?.logCount ?? '—', sub: 'daily check-ins' },
        { label: 'Avg cycle length', value: stats?.avgCycle ? `${stats.avgCycle}d` : '—', sub: 'based on your data' },
        { label: 'Days since last period', value: stats?.daysSincePeriod ?? '—', sub: 'days' },
    ];

    return (
        <div className="h-full w-full overflow-y-auto">
            <div className="min-h-full max-w-7xl mx-auto p-6 lg:p-8">
                <div className="mb-8">
                    <h1 className="font-heading text-3xl font-semibold text-[#2C1A1D]">Health Vault</h1>
                    <p className="text-sm text-[#9E7A82] mt-1">Your data, completely under your control.</p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {STAT_CARDS.map(s => (
                        <div key={s.label} className="bg-white rounded-2xl border border-[#EDE0E3] p-5">
                            {loading ? (
                                <div className="animate-pulse">
                                    <div className="h-3 bg-[#F0E8EA] rounded mb-3 w-3/4" />
                                    <div className="h-7 bg-[#F0E8EA] rounded w-1/2" />
                                </div>
                            ) : (
                                <>
                                    <p className="text-xs text-[#9E7A82] font-medium mb-1">{s.label}</p>
                                    <p className="text-3xl font-heading font-semibold text-[#2C1A1D] leading-none">{s.value}</p>
                                    <p className="text-xs text-[#9E7A82] mt-1">{s.sub}</p>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left: Top symptoms */}
                    <div className="lg:col-span-2 flex flex-col gap-5">
                        {stats?.topSymptoms?.length > 0 && (
                            <div className="bg-white rounded-2xl border border-[#EDE0E3] p-6">
                                <h3 className="font-heading text-base font-semibold text-[#2C1A1D] mb-5">Most logged symptoms</h3>
                                <div className="flex flex-col gap-4">
                                    {stats.topSymptoms.map(([sym, count]) => (
                                        <div key={sym} className="flex items-center gap-4">
                                            <span className="text-sm text-[#2C1A1D] capitalize w-36 shrink-0">{sym.replace(/_/g, ' ')}</span>
                                            <div className="flex-1 h-2 bg-[#F8F4F5] rounded-full overflow-hidden">
                                                <div className="h-full bg-[#E87A86] rounded-full transition-all duration-700"
                                                    style={{ width: `${Math.min(100, (count / (stats.logCount || 1)) * 100)}%` }} />
                                            </div>
                                            <span className="text-xs text-[#9E7A82] w-10 text-right font-medium">{count}×</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {stats?.recentCycles?.length > 0 && (
                            <div className="bg-white rounded-2xl border border-[#EDE0E3]">
                                <div className="px-6 py-4 border-b border-[#EDE0E3]">
                                    <h3 className="font-heading text-base font-semibold text-[#2C1A1D]">Cycle history</h3>
                                </div>
                                <div className="divide-y divide-[#F0E8EA]">
                                    {stats.recentCycles.map((c, i) => (
                                        <div key={i} className="px-6 py-4 flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-[#2C1A1D]">
                                                    {new Date(c.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                                <p className="text-xs text-[#9E7A82] mt-0.5">Period start</p>
                                            </div>
                                            {c.periodLength && (
                                                <span className="px-3 py-1 bg-[#FDE0E4] text-[#C85C6B] text-xs font-semibold rounded-full">
                                                    {c.periodLength} day cycle
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!loading && !stats?.topSymptoms?.length && !stats?.recentCycles?.length && (
                            <div className="bg-white rounded-2xl border border-[#EDE0E3] py-16 text-center text-[#9E7A82] text-sm">
                                Start logging daily to see your health patterns here.
                            </div>
                        )}
                    </div>

                    {/* Right: Privacy + actions */}
                    <div className="flex flex-col gap-5">
                        {/* Privacy facts */}
                        <div className="bg-[#2C1A1D] rounded-2xl p-5 text-white">
                            <p className="text-xs font-semibold text-[#E87A86] uppercase tracking-wider mb-4">Your privacy rights</p>
                            <ul className="flex flex-col gap-3 text-sm text-white/75 leading-relaxed">
                                {[
                                    'Data is end-to-end encrypted',
                                    'Never shared with advertisers',
                                    'You can export everything',
                                    'Account deleted immediately on request',
                                ].map(t => (
                                    <li key={t} className="flex items-start gap-2">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#68B984" strokeWidth="2.5" className="mt-0.5 flex-shrink-0">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Export */}
                        <div className="bg-white rounded-2xl border border-[#EDE0E3] p-5">
                            <h4 className="font-heading text-base font-semibold text-[#2C1A1D] mb-1">Export your data</h4>
                            <p className="text-xs text-[#9E7A82] mb-4 leading-relaxed">
                                Download a complete copy of all your cycle logs, symptoms, and health data as a JSON file.
                            </p>
                            <button onClick={exportData} disabled={exporting}
                                className="w-full py-2.5 bg-[#E87A86] text-white text-sm font-semibold rounded-lg
                hover:bg-[#D66874] disabled:opacity-40 transition-colors">
                                {exporting ? 'Exporting…' : 'Download my data'}
                            </button>
                        </div>

                        {/* Delete account */}
                        <div className="bg-white rounded-2xl border border-red-200 p-5">
                            <h4 className="font-heading text-base font-semibold text-[#2C1A1D] mb-1">Delete account</h4>
                            <p className="text-xs text-[#9E7A82] mb-4 leading-relaxed">
                                Permanently deletes your account and all associated data. This cannot be undone.
                            </p>
                            {!showConfirm ? (
                                <button onClick={() => setShowConfirm(true)}
                                    className="w-full py-2.5 border border-red-300 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 transition-colors">
                                    Delete my account
                                </button>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <p className="text-xs text-[#6B4F53]">Type <strong>{user?.username}</strong> to confirm:</p>
                                    <input className="w-full px-3 py-2.5 rounded-lg border border-red-300 text-sm
                  focus:border-red-500 focus:outline-none"
                                        placeholder={user?.username}
                                        value={confirmText} onChange={e => setConfirmText(e.target.value)} />
                                    <div className="flex gap-2">
                                        <button onClick={() => { setShowConfirm(false); setConfirmText(''); }}
                                            className="flex-1 py-2 text-sm text-[#9E7A82] border border-[#EDE0E3] rounded-lg hover:bg-[#F8F4F5]">
                                            Cancel
                                        </button>
                                        <button onClick={deleteAccount} disabled={deleting || confirmText !== user?.username}
                                            className="flex-1 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg disabled:opacity-40 hover:bg-red-700">
                                            {deleting ? 'Deleting…' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
