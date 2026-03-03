import React from 'react';

const SymptomChip = ({ label, selected, onClick }) => (
    <button
        onClick={onClick}
        className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${selected
            ? 'bg-[var(--color-brand-secondary)] text-[var(--color-text-primary)] border border-[var(--color-brand-primary)]'
            : 'bg-white text-[var(--color-text-secondary)] border border-[var(--color-border-light)]'
            }`}
    >
        {label}
    </button>
);

export default SymptomChip;
