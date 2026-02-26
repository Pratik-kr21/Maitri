import React from 'react';

const PhaseChip = ({ phase }) => {
    const phaseColors = {
        "Menstrual": "bg-[#E87A86] text-white",
        "Follicular": "bg-[#A8D8B9] text-gray-800",
        "Ovulatory": "bg-[#FFF3CD] text-gray-800",
        "Luteal": "bg-[#C084FC] text-white"
    };
    return (
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${phaseColors[phase] || 'bg-[var(--color-brand-secondary)]'}`}>
            {phase} Phase
        </span>
    );
};

export default PhaseChip;
