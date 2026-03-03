import React, { useState, useEffect } from 'react';
import { ChevronRight, Loader2, MessageSquarePlus, Sparkles } from 'lucide-react';
import axios from 'axios';

const PostCard = ({ content, user, circle, postType, createdAt }) => {
    return (
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-white/60 relative z-10 flex flex-col h-full group">
            <div className="flex justify-between items-start mb-3">
                <span className="bg-gradient-to-r from-[var(--color-brand-secondary)] to-white px-2.5 py-1 rounded-full text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider shadow-sm border border-white">{postType}</span>
                <span className="text-xs text-gray-400 font-medium">{new Date(createdAt).toLocaleDateString()}</span>
            </div>

            <p className="text-[var(--color-text-primary)] text-sm md:text-base leading-relaxed mb-4 font-medium flex-1">{content}</p>

            <div className="flex items-center justify-between border-t border-[var(--color-border-light)] pt-3 mt-auto">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-accent-peach)] to-[var(--color-accent-yellow)] flex items-center justify-center font-bold text-xs text-[var(--color-text-primary)] shadow-sm">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-[var(--color-text-primary)]">{user?.username || 'User'}</span>
                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{circle?.name || 'General'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CommunityScreen = () => {
    const [circles, setCircles] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newPostContent, setNewPostContent] = useState('');
    const [selectedCircle, setSelectedCircle] = useState('');

    useEffect(() => {
        const fetchCommunity = async () => {
            try {
                const cRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/community/circles`);
                setCircles(cRes.data);
                if (cRes.data.length > 0) setSelectedCircle(cRes.data[0]._id);

                const pRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/community/posts`);
                setPosts(pRes.data);
            } catch (err) {
                console.error(err);
                // Fallback to static data if backend is offline so it doesn't look totally broken
                setCircles([
                    { _id: '1', name: 'Teen Talk', description: 'Restricted for ages 13-24', ageRestricted: true },
                    { _id: '2', name: 'PCOS Warriors', description: 'Support for PCOS' },
                    { _id: '3', name: 'Working & Cycling', description: 'Balancing work and health' },
                    { _id: '4', name: 'General Wellness', description: 'General health and habits' },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchCommunity();
    }, []);

    const handleCreatePost = async () => {
        if (!newPostContent.trim()) return;
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/community/posts`, {
                circleId: selectedCircle,
                content: newPostContent,
                postType: 'experience'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setPosts([res.data, ...posts]);
            setNewPostContent('');
        } catch (err) {
            console.error('Error creating post', err);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[var(--color-brand-primary)]" size={40} /></div>;

    const gradients = [
        "linear-gradient(135deg, var(--color-brand-secondary) 0%, rgba(255,255,255,0.7) 100%)",
        "linear-gradient(135deg, var(--color-accent-peach) 0%, rgba(255,255,255,0.7) 100%)",
        "linear-gradient(135deg, var(--color-accent-yellow) 0%, rgba(255,255,255,0.7) 100%)",
        "linear-gradient(135deg, #FFEDF0 0%, rgba(255,255,255,0.7) 100%)",
    ];

    return (
        <div className="pb-24 pt-6 px-4 md:px-8 max-w-7xl mx-auto relative overflow-hidden">
            <div className="fixed top-0 right-0 w-[40vw] h-[40vh] bg-[var(--color-accent-yellow)] rounded-full blur-[120px] opacity-20 pointer-events-none z-[-1]" />
            <h2 className="text-3xl md:text-4xl font-serif mb-6 text-[var(--color-text-primary)]">Community</h2>

            <div className="bg-gradient-to-r from-[var(--color-accent-yellow)] to-[var(--color-accent-peach)] rounded-3xl p-6 md:p-8 shadow-sm mb-12 relative overflow-hidden group border border-white/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-40 -mr-16 -mt-16 pointer-events-none" />
                <div className="flex items-center gap-2 mb-3 relative z-10">
                    <Sparkles className="text-[var(--color-brand-primary)]" size={18} />
                    <h3 className="font-bold text-xs tracking-wider uppercase text-[var(--color-text-primary)]">This week's prompt</h3>
                </div>
                <p className="text-2xl md:text-3xl font-serif mb-6 leading-tight relative z-10 max-w-2xl text-[var(--color-text-primary)]">"Something that actually helped my cramps: ___"</p>
                <div className="flex flex-col md:flex-row gap-3 relative z-10 max-w-2xl">
                    <input
                        className="bg-white/90 backdrop-blur-md flex-1 rounded-2xl md:rounded-full px-6 py-3 outline-none border border-white shadow-inner focus:shadow-[0_0_0_3px_rgba(232,122,134,0.2)] transition-all text-sm md:text-base font-medium text-[var(--color-text-primary)] placeholder-gray-400"
                        placeholder="Type your experience here..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                    />
                    <button onClick={handleCreatePost} className="bg-[var(--color-text-primary)] text-white w-full md:w-auto px-6 py-3 flex items-center justify-center rounded-2xl md:rounded-full hover:bg-[var(--color-text-secondary)] transition-all shadow-sm shrink-0">
                        <MessageSquarePlus size={20} className="mr-2 md:mr-0" />
                        <span className="md:hidden font-medium">Post</span>
                    </button>
                </div>
            </div>

            <div className="mb-12">
                <h3 className="text-2xl font-serif text-[var(--color-text-primary)] mb-6">Explore Circles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {circles.map((circle, i) => (
                        <div
                            key={circle._id || i}
                            className="rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col relative overflow-hidden group border border-white/60 min-h-[160px]"
                            style={{ background: gradients[i % 4] || gradients[0] }}
                        >
                            {circle.ageRestricted && (
                                <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full text-[9px] font-bold px-2 py-0.5 shadow-sm uppercase tracking-wider text-[var(--color-text-primary)]">13-24s</span>
                            )}
                            <h4 className="font-serif text-xl mb-1 mt-auto text-[var(--color-text-primary)] leading-tight">{circle.name}</h4>
                            <p className="text-xs text-[var(--color-text-secondary)] font-medium mb-4 opacity-90">{circle.description}</p>
                            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center self-end transition-all group-hover:bg-[var(--color-text-primary)] group-hover:text-white mt-auto">
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-2xl font-serif text-[var(--color-text-primary)] mb-6">Recent Stories</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {posts.length > 0 ? posts.map((post) => (
                        <PostCard key={post._id} {...post} />
                    )) : (
                        <div className="col-span-full py-10 text-center bg-white/50 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm">
                            <p className="text-[var(--color-text-secondary)] font-medium text-sm">No posts yet. Be the first to start a conversation!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommunityScreen;
