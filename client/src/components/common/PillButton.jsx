import React from 'react';

const PillButton = ({ label, icon: Icon, variant = 'primary', onClick, className = '' }) => {
    const isPrimary = variant === 'primary';
    return (
        <button
            onClick={onClick}
            className={`relative rounded-full px-6 py-3 font-semibold flex items-center gap-3 transition-transform hover:-translate-y-1 ${isPrimary
                ? 'bg-[var(--color-brand-primary)] text-white hover:animate-pulseGlow'
                : 'border-2 border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]'
                } ${className}`}
        >
            <span>{label}</span>
            {Icon && (
                <span className={`flex justify-center items-center w-8 h-8 rounded-full ${isPrimary ? 'bg-white text-[var(--color-brand-primary)]' : ''}`}>
                    <Icon size={16} strokeWidth={3} />
                </span>
            )}
        </button>
    );
};

export default PillButton;
