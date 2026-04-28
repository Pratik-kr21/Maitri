import React from 'react';

const LoadingScreen = ({ text = "Loading..." }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-bg-primary text-maitri-dark w-full h-full z-50">
            <div className="relative flex items-center justify-center mb-8">
                {/* Outer rotating dashed ring */}
                <svg className="w-24 h-24 absolute animate-spin-fast text-brand-secondary" viewBox="0 0 100 100">
                    <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="3" 
                        strokeDasharray="10 10" 
                    />
                </svg>
                {/* Inner pulsing solid circle */}
                <svg className="w-16 h-16 animate-pulse-glow text-brand-primary" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="currentColor" />
                </svg>
                {/* Heart icon in the center */}
                <svg className="w-8 h-8 absolute text-white animate-float" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            </div>
            <h2 className="font-heading text-2xl font-semibold animate-pulse">{text}</h2>
            <p className="font-body text-maitri-muted mt-3 text-sm text-center max-w-xs leading-relaxed">
                Take a deep breath. We're getting things ready for you.
            </p>
        </div>
    );
};

export default LoadingScreen;
