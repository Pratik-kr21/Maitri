import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import GlassCard from '../common/GlassCard';

const PostCard = ({ type, username, content, upvotes, replies, timeAgo, index }) => {
    const typeColors = {
        Question: 'bg-[#FDE0E4] text-[#E87A86]',
        Win: 'bg-[#FFF3CD] text-[#B8860B]',
        Experience: 'bg-[#FFDAB9] text-[#D2691E]',
        Resource: 'bg-[#A8D8B9] text-[#2E8B57]'
    };

    return (
        <GlassCard index={index} className="mb-4">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${typeColors[type] || 'bg-gray-100'}`}>
                        {type}
                    </span>
                    <span className="text-sm font-semibold text-[var(--color-text-secondary)]">@{username}</span>
                </div>
                <span className="text-xs text-gray-400">{timeAgo}</span>
            </div>
            <p className="text-[var(--color-text-primary)] mb-4 leading-relaxed line-clamp-3">
                {content}
            </p>
            <div className="flex justify-between items-center text-[var(--color-text-secondary)]">
                <div className="flex gap-4">
                    <button className="flex items-center gap-1 hover:text-[var(--color-brand-primary)] transition-colors">
                        <Heart size={16} /> <span className="text-sm font-medium">{upvotes}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-[var(--color-brand-primary)] transition-colors">
                        <MessageCircle size={16} /> <span className="text-sm font-medium">{replies}</span>
                    </button>
                </div>
                <p className="text-[10px] text-gray-400 italic">Not medical advice</p>
            </div>
        </GlassCard>
    );
};

export default PostCard;
