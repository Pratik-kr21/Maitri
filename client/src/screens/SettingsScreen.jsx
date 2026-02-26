import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import ToggleSwitch from '../components/common/ToggleSwitch';
import HeartbeatDivider from '../components/common/HeartbeatDivider';

const SettingsScreen = () => {
    const [reminders, setReminders] = useState(true);
    const [privacy, setPrivacy] = useState(false);

    return (
        <div className="pb-32 pt-8 px-6 animate-floatUp max-w-4xl mx-auto">
            <h2 className="text-4xl font-serif mb-8 text-[var(--color-text-primary)]">Settings</h2>

            <div className="lg:grid lg:grid-cols-2 lg:gap-12">
                <div className="mb-12 lg:mb-0">
                    <h3 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4 px-2">Account Profile</h3>
                    <GlassCard className="p-0 overflow-hidden !rounded-[2rem]">
                        <div className="p-6 flex justify-between items-center border-b border-[var(--color-border-light)]">
                            <span className="font-medium text-[var(--color-text-secondary)]">Username</span>
                            <span className="font-medium text-[var(--color-text-primary)]">priya_m</span>
                        </div>
                        <div className="p-6 flex justify-between items-center bg-gray-50 opacity-70">
                            <span className="font-medium text-[var(--color-text-secondary)] flex items-center gap-2"><Lock size={14} /> Age Bracket</span>
                            <span className="font-medium text-[var(--color-text-primary)]">26</span>
                        </div>
                    </GlassCard>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4 px-2">Notifications</h3>
                    <GlassCard className="!rounded-[2rem] flex flex-col gap-6 p-6">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-[var(--color-text-primary)]">Phase change alerts</span>
                            <ToggleSwitch on={reminders} onChange={setReminders} />
                        </div>
                        <HeartbeatDivider />
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-[var(--color-text-primary)]">Ask Maitri History</span>
                            <ToggleSwitch on={privacy} onChange={setPrivacy} />
                        </div>
                    </GlassCard>
                </div>
            </div>

            <div className="text-center py-16 opacity-60">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-brand-primary)]">Maitri v1.0.</p>
            </div>
        </div>
    );
};

export default SettingsScreen;
