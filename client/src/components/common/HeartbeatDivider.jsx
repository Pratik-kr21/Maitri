import React from 'react';

const HeartbeatDivider = () => (
    <svg width="100" height="20" viewBox="0 0 100 20" className="opacity-50 my-2">
        <path
            d="M0 10 L40 10 L45 0 L55 20 L60 10 L100 10"
            fill="none"
            stroke="var(--color-brand-primary)"
            strokeWidth="2"
            className="animate-heartbeat"
            strokeDasharray="100"
        />
    </svg>
);

export default HeartbeatDivider;
