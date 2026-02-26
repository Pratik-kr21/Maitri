import React from 'react';

const FloatingBadge = ({ top, bottom, left, right, children, className = '' }) => {
    return (
        <div
            className={`absolute w-[120px] h-[120px] rounded-full bg-[var(--color-accent-yellow)] flex flex-col justify-center items-center animate-float shadow-md ${className}`}
            style={{ top, bottom, left, right }}
        >
            {children}
        </div>
    );
};

export default FloatingBadge;
