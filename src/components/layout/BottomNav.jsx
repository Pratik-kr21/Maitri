import React from 'react';
import { Home, Activity, MessageCircle, Heart, User } from 'lucide-react';

const BottomNav = ({ active, onChange }) => {
    const navItems = [
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'health', icon: Activity, label: 'Health' },
        { id: 'askMaitri', icon: MessageCircle, label: 'Ask' },
        { id: 'community', icon: Heart, label: 'Community' },
        { id: 'settings', icon: User, label: 'Settings' }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-10px_20px_rgba(92,61,70,0.05)] pt-3 pb-6 px-6 z-50 rounded-t-3xl max-w-[430px] md:max-w-xl lg:max-w-2xl mx-auto border-t border-[var(--color-border-light)] transform">
            <div className="flex justify-between items-center">
                {navItems.map(item => {
                    const isActive = active === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onChange(item.id)}
                            className={`flex flex-col items-center gap-1 w-16 transition-colors ${isActive ? 'text-[var(--color-brand-primary)]' : 'text-[#8A797D] hover:text-[var(--color-brand-hover)]'
                                }`}
                        >
                            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'animate-pulse' : ''} />
                            <span className={`text-[10px] font-medium ${isActive ? 'opacity-100' : 'opacity-80'}`}>{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
