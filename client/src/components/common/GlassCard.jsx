import React from 'react';

const GlassCard = ({ children, className = '', index = 0 }) => {
    return (
        <div
            className={`bg-white rounded-3xl p-6 shadow-sm border border-[var(--color-border-light)] transform transition-transform duration-200 hover:-translate-y-2 hover:shadow-floating animate-floatUp ${className}`}
            style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
        >
            {children}
        </div>
    );
};

export default GlassCard;
