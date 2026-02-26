import React from 'react';

const ToggleSwitch = ({ on, onChange }) => (
    <button
        onClick={() => onChange(!on)}
        className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors ${on ? 'bg-[var(--color-brand-primary)]' : 'bg-gray-300'}`}
    >
        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${on ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
);

export default ToggleSwitch;
