import React from 'react';
import { ChevronRight } from 'lucide-react';
import { mockCircles, mockCommunityPosts } from '../data/mockData';
import PostCard from '../components/features/PostCard';

const CommunityScreen = () => {
    return (
        <div className="pb-32 pt-8 px-6 animate-floatUp max-w-7xl mx-auto">
            <h2 className="text-4xl font-serif mb-6 text-[var(--color-text-primary)]">Community</h2>

            <div className="bg-[var(--color-accent-yellow)] rounded-[3rem] p-8 lg:p-12 shadow-sm mb-12 animate-float relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-40 -mr-20 -mt-20" />
                <h3 className="font-semibold text-lg lg:text-xl mb-3 relative z-10 text-[var(--color-text-primary)]">This week's prompt:</h3>
                <p className="text-3xl lg:text-5xl font-serif mb-6 leading-tight relative z-10 max-w-2xl">"Something that actually helped my cramps: ___"</p>
                <button className="bg-white text-[var(--color-text-primary)] font-semibold rounded-full px-8 py-3 text-sm lg:text-base relative z-10 transition-all transform hover:scale-105 shadow-md">
                    Answer prompt
                </button>
            </div>

            <div className="mb-12">
                <h3 className="text-2xl lg:text-3xl font-serif text-[var(--color-text-primary)] mb-6">My Circles</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {mockCircles.map((circle, i) => (
                        <div
                            key={circle.id}
                            className="rounded-[2.5rem] p-6 animate-floatUp shadow-sm hover:shadow-floating transition-all cursor-pointer flex flex-col aspect-square relative overflow-hidden group"
                            style={{ backgroundImage: circle.gradient, animationDelay: `${i * 100}ms` }}
                        >
                            {circle.ageGated && (
                                <span className="absolute top-6 right-6 bg-white bg-opacity-80 rounded-full text-[10px] font-bold px-3 py-1 shadow-sm uppercase tracking-wider">13-24s</span>
                            )}
                            <h4 className="font-serif text-xl lg:text-2xl mb-1 mt-auto text-[var(--color-text-primary)]">{circle.name}</h4>
                            <p className="text-xs text-black text-opacity-60 font-semibold mb-4">{circle.posts} posts</p>
                            <div className="w-10 h-10 rounded-full bg-white bg-opacity-70 flex items-center justify-center self-end transition-transform group-hover:translate-x-1">
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-2xl lg:text-3xl font-serif text-[var(--color-text-primary)] mb-6">Recent Posts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockCommunityPosts.map((post, i) => (
                        <PostCard key={post.id} {...post} index={i} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CommunityScreen;

