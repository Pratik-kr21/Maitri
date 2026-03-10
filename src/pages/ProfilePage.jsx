import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AVATARS = ['lotus', 'moon', 'sun', 'star', 'flower', 'leaf'];
const EMOJI_MAP = { lotus: '🪷', moon: '🌙', sun: '🌞', star: '⭐', flower: '🌸', leaf: '🍃' };
const COLORS = ['#E87A86', '#9C77C4', '#68B984', '#F4A261', '#6BA3BE', '#D4956A'];

export default function ProfilePage() {
    const { user, updateUser, logout } = useAuth();
    const toast = useToast();

    const [avatar, setAvatar] = useState(user?.avatar || 'lotus');
    const [avatarColor, setAvatarColor] = useState(user?.avatarColor || '#E87A86');
    const [notifs, setNotifs] = useState(user?.notificationsEnabled ?? true);
    const [patternDet, setPatternDet] = useState(user?.patternDetectionEnabled ?? true);
    const [aiHistory, setAiHistory] = useState(user?.aiHistoryEnabled ?? true);
    const [saving, setSaving] = useState(false);

    const [cycleId, setCycleId] = useState(null);
    const [cycleStart, setCycleStart] = useState('');
    const [savingCycle, setSavingCycle] = useState(false);

    useEffect(() => {
        const fetchCycle = async () => {
            try {
                const res = await api.get('/cycles');
                if (res.data.cycles && res.data.cycles.length > 0) {
                    const latest = res.data.cycles[0];
                    setCycleId(latest._id);
                    setCycleStart(new Date(latest.startDate).toISOString().split('T')[0]);
                }
            } catch (err) { console.error('Error fetching cycles', err); }
        };
        fetchCycle();
    }, []);

    const saveCycle = async () => {
        if (!cycleStart) return;
        setSavingCycle(true);
        try {
            await api.post('/cycles', { startDate: cycleStart });
            toast.success('Cycle tracking updated');
        } catch {
            toast.error('Could not update cycle');
        } finally {
            setSavingCycle(false);
        }
    };

    const save = async () => {
        setSaving(true);
        try {
            const res = await api.put('/auth/profile', { avatar, avatarColor, notificationsEnabled: notifs, patternDetectionEnabled: patternDet, aiHistoryEnabled: aiHistory });
            if (updateUser) updateUser(res.data.user);
            toast.success('Profile saved');
        } catch { toast.error('Could not save'); }
        finally { setSaving(false); }
    };

    const urlBase64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    const handleNotifToggle = async (enabled) => {
        if (!enabled) {
            setNotifs(false);
            try { await api.post('/auth/push-subscribe', { subscription: null }); } catch (e) { }
            return;
        }

        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            toast.error('Push notifications are not supported in your browser.');
            return;
        }

        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                toast.error('Permission denied for notifications.');
                setNotifs(false);
                return;
            }

            const registration = await navigator.serviceWorker.register('/sw.js');
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY || '')
            });

            await api.post('/auth/push-subscribe', { subscription });
            setNotifs(true);
            toast.success('Push notifications enabled!');
        } catch (error) {
            console.error('Push sub error:', error);
            toast.error('Failed to subscribe to push notifications.');
            setNotifs(false);
        }
    };

    const toggle = (val, setVal) => () => setVal(!val);

    const Toggle = ({ label, sub, value, onChange }) => (
        <div className="flex items-center justify-between py-4 border-b border-[#F0E8EA] last:border-0">
            <div>
                <p className="text-sm font-semibold text-[#2C1A1D]">{label}</p>
                <p className="text-xs text-[#9E7A82] mt-0.5 leading-relaxed">{sub}</p>
            </div>
            <button onClick={() => onChange(!value)}
                className={`flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 relative
          ${value ? 'bg-[#E87A86]' : 'bg-[#EDE0E3]'}`}
                role="switch" aria-checked={value}>
                <span className={`absolute top-[2px] left-[2px] w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200
          ${value ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
        </div>
    );

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        : '—';

    return (
        <div className="h-full w-full overflow-y-auto">
            <div className="min-h-full max-w-7xl mx-auto p-6 lg:p-8">
                <div className="mb-8">
                    <h1 className="font-heading text-3xl font-semibold text-[#2C1A1D]">Profile & Settings</h1>
                    <p className="text-sm text-[#9E7A82] mt-1">Manage your account and privacy preferences.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left: Account info + avatar */}
                    <div className="flex flex-col gap-5">

                        {/* Identity card */}
                        <div className="bg-white rounded-2xl border border-[#EDE0E3] p-6">
                            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-[#F0E8EA]">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                                    style={{ background: `${avatarColor}25` }}>
                                    {EMOJI_MAP[avatar] || '????'}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-heading text-lg font-semibold text-[#2C1A1D] truncate">{user?.username}</p>
                                    <p className="text-xs text-[#9E7A82] truncate">{user?.email}</p>
                                    <p className="text-xs text-[#9E7A82] mt-0.5">{user?.isMinor ? 'Minor account' : 'Adult account'}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-[#9E7A82]">Member since</span>
                                    <span className="font-medium text-[#2C1A1D]">{memberSince}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#9E7A82]">Account type</span>
                                    <span className="font-medium text-[#2C1A1D]">{user?.ageBracket === 'teen' ? 'Teen' : 'Adult'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Avatar picker */}
                        <div className="bg-white rounded-2xl border border-[#EDE0E3] p-6">
                            <h4 className="font-heading text-base font-semibold text-[#2C1A1D] mb-4">Avatar</h4>
                            <div className="grid grid-cols-3 gap-3 mb-5">
                                {AVATARS.map(a => (
                                    <button key={a} onClick={() => setAvatar(a)}
                                        className={`aspect-square rounded-xl flex items-center justify-center text-2xl transition-all duration-150
                    ${avatar === a
                                                ? 'ring-2 ring-[#E87A86] ring-offset-1 scale-105'
                                                : 'bg-[#F8F4F5] hover:bg-[#F0E8EA]'}`}
                                        style={avatar === a ? { background: `${avatarColor}20` } : {}}>
                                        {EMOJI_MAP[a]}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-[#9E7A82] mb-2 font-medium">Accent colour</p>
                            <div className="flex gap-2.5 flex-wrap">
                                {COLORS.map(c => (
                                    <button key={c} onClick={() => setAvatarColor(c)}
                                        className={`w-8 h-8 rounded-full transition-all duration-150 ${avatarColor === c ? 'ring-2 ring-offset-1 ring-[#2C1A1D] scale-110' : 'hover:scale-105'}`}
                                        style={{ background: c }} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Privacy settings */}
                    <div className="lg:col-span-2 flex flex-col gap-5">
                        <div className="bg-white rounded-2xl border border-[#EDE0E3] p-6">
                            <h4 className="font-heading text-base font-semibold text-[#2C1A1D] mb-1">Privacy & notifications</h4>
                            <p className="text-xs text-[#9E7A82] mb-4">Control how Maitri uses your data.</p>

                            <Toggle
                                label="Push notifications"
                                sub="Reminders for daily check-ins and cycle predictions."
                                value={notifs}
                                onChange={handleNotifToggle}
                            />
                            <Toggle
                                label="Pattern detection"
                                sub="Allow Maitri to identify recurring symptom patterns from your logs."
                                value={patternDet}
                                onChange={setPatternDet}
                            />
                            <Toggle
                                label="AI history"
                                sub="Retain your Ask Maitri conversation history to improve responses."
                                value={aiHistory}
                                onChange={setAiHistory}
                            />
                        </div>

                        {/* Cycle settings */}
                        <div className="bg-white rounded-2xl border border-[#EDE0E3] p-6">
                            <h4 className="font-heading text-base font-semibold text-[#2C1A1D] mb-1">Cycle tracking</h4>
                            <p className="text-xs text-[#9E7A82] mb-4">Set the start date of your most recent period.</p>

                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-semibold text-[#2C1A1D]">First day of last period</label>
                                <div className="flex gap-3">
                                    <input
                                        type="date"
                                        className="form-input flex-1 px-4 py-2 border border-[#EDE0E3] rounded-lg focus:outline-none focus:border-[#E87A86] text-sm text-[#2C1A1D]"
                                        value={cycleStart}
                                        max={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setCycleStart(e.target.value)}
                                    />
                                    <button
                                        onClick={saveCycle}
                                        disabled={savingCycle || !cycleStart}
                                        className="px-4 py-2 bg-[#F8F4F5] text-[#2C1A1D] text-sm font-semibold rounded-lg border border-[#EDE0E3] hover:bg-[#F0E8EA] disabled:opacity-50 transition-colors">
                                        {savingCycle ? 'Saving...' : 'Update'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* What we collect notice */}
                        <div className="bg-[#F8F4F5] rounded-2xl border border-[#EDE0E3] p-6">
                            <h4 className="font-heading text-base font-semibold text-[#2C1A1D] mb-4">What we collect</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Cycle dates', stored: true },
                                    { label: 'Symptom logs', stored: true },
                                    { label: 'Device ID', stored: false },
                                    { label: 'Location', stored: false },
                                    { label: 'Chat history', stored: aiHistory },
                                    { label: 'Email address', stored: true },
                                ].map(item => (
                                    <div key={item.label} className="flex items-center gap-2 text-sm">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={item.stored ? '#68B984' : '#E87A86'} strokeWidth="2.5">
                                            {item.stored
                                                ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                : <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            }
                                        </svg>
                                        <span className={item.stored ? 'text-[#2C1A1D]' : 'text-[#9E7A82] line-through'}>{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Save button */}
                        <div className="flex items-center justify-between">
                            <button onClick={logout}
                                className="text-sm text-[#9E7A82] hover:text-[#2C1A1D] transition-colors">
                                Sign out of this device
                            </button>
                            <button onClick={save} disabled={saving}
                                className="px-6 py-2.5 bg-[#E87A86] text-white text-sm font-semibold rounded-lg hover:bg-[#D66874] disabled:opacity-40 transition-colors">
                                {saving ? 'Saving…' : 'Save changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
