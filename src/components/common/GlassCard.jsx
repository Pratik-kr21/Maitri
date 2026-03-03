import React from 'react';

const GlassCard = ({ children, className = '', index = 0 }) => {
    return (
        <div
            className={`bg-white/70 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border border-white/40 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_32px_0_rgba(232,122,134,0.15)] animate-floatUp ${className}`}
            style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
        >
            {children}
        </div>
    );
};

export default GlassCard;
