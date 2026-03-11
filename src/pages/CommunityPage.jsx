import React, { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function CommunityPage() {
    const { user } = useAuth();
    const toast = useToast();

    const [tab, setTab] = useState('feed');
    const [circle, setCircle] = useState('general');
    const [posts, setPosts] = useState([]);
    const [saved, setSaved] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const [newPost, setNewPost] = useState({ title: '', body: '', type: 'experience' });
    const [posting, setPosting] = useState(false);
    const [expanded, setExpanded] = useState(null);
    const [replies, setReplies] = useState({});
    const [replyText, setReplyText] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null); // holds post id to confirm

    const CIRCLES = [
        { id: 'general', label: 'General' },
        { id: 'teens', label: 'Teens' },
        { id: 'endometriosis', label: 'Endo' },
        { id: 'pcos', label: 'PCOS' },
        { id: 'perimenopause', label: 'Perimenopause' },
    ];
    const POST_TYPES = ['experience', 'question', 'win', 'resource'];
    const TYPE_COLORS = {
        experience: 'bg-[#FDE0E4] text-[#C85C6B]',
        question: 'bg-[#E6EEFF] text-[#3B5BDB]',
        win: 'bg-[#FFF3CD] text-[#92700C]',
        resource: 'bg-[#E6F4EA] text-[#2D7A4F]',
    };

    const loadPosts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/community/posts', { params: { circle, limit: 20 } });
            setPosts(res.data.posts || []);
        } catch { } finally { setLoading(false); }
    }, [circle]);

    const loadSaved = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/community/saved');
            setSaved(res.data.posts || []);
        } catch { } finally { setLoading(false); }
    }, []);

    useEffect(() => { if (tab === 'feed') loadPosts(); else loadSaved(); }, [tab, loadPosts, loadSaved]);
    useEffect(() => { if (tab === 'feed') loadPosts(); }, [circle]);

    const createPost = async () => {
        if (!newPost.title.trim() || !newPost.body.trim()) return toast.error('Title and body are required');
        setPosting(true);
        try {
            await api.post('/community/posts', { ...newPost, circle, isAnonymous: true });
            toast.success('Post shared');
            setShowNew(false);
            setNewPost({ title: '', body: '', type: 'experience' });
            loadPosts();
        } catch (err) { toast.error(err.response?.data?.message || 'Could not post'); }
        finally { setPosting(false); }
    };

    const upvote = async (id) => {
        try {
            await api.post(`/community/posts/${id}/upvote`);
            setPosts(ps => ps.map(p => p._id === id ? { ...p, isUpvoted: !p.isUpvoted, upvotes: Math.max(0, (p.upvotes || 0) + (p.isUpvoted ? -1 : 1)) } : p));
        } catch { }
    };

    const toggleSave = async (id) => {
        try {
            await api.post(`/community/posts/${id}/save`);
            toast.success('Saved');
        } catch { }
    };

    const loadReplies = async (postId) => {
        if (expanded === postId) { setExpanded(null); return; }
        setExpanded(postId);
        try {
            const res = await api.get(`/community/posts/${postId}/replies`);
            setReplies(r => ({ ...r, [postId]: res.data.replies || [] }));
        } catch { }
    };

    const isReplying = React.useRef(false);

    const submitReply = async (postId) => {
        if (!replyText.trim() || isReplying.current) return;
        isReplying.current = true;
        try {
            const res = await api.post(`/community/posts/${postId}/replies`, { body: replyText, isAnonymous: true });
            setReplies(r => ({ ...r, [postId]: [...(r[postId] || []), res.data.reply] }));
            setReplyText('');
            toast.success('Reply posted');
        } catch (err) { toast.error(err.response?.data?.message || 'Could not post reply'); }
        finally { isReplying.current = false; }
    };

    const deletePost = async (id) => {
        try {
            // Optimistically remove from UI
            setPosts(ps => ps.filter(p => p._id !== id));
            setSaved(sv => sv.filter(p => p._id !== id));
            await api.delete(`/community/posts/${id}`);
            toast.success('Post deleted');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Could not delete post');
            // Reload to restore state
            loadPosts();
        }
    };

    const PostCard = ({ p }) => (
        <div className="bg-white rounded-2xl border border-[#EDE0E3] p-5 hover:shadow-[0_4px_16px_rgba(92,61,70,0.07)] transition-shadow">
            <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${TYPE_COLORS[p.type] || TYPE_COLORS.experience}`}>{p.type}</span>
                    </div>
                    <h3 className="font-heading text-base font-semibold text-[#2C1A1D] leading-snug mb-1">{p.title}</h3>
                    <p className="text-sm text-[#5C4A4D] leading-relaxed line-clamp-3">{p.body}</p>
                </div>
            </div>
            <div className="flex items-center gap-4 pt-3 border-t border-[#F0E8EA]">
                <button onClick={() => upvote(p._id)}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${p.isUpvoted ? 'text-[#E87A86]' : 'text-[#9E7A82] hover:text-[#E87A86]'}`}>
                    <svg width="14" height="14" fill={p.isUpvoted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                    {p.upvotes || 0}
                </button>
                <button onClick={() => loadReplies(p._id)}
                    className="flex items-center gap-1.5 text-xs font-medium text-[#9E7A82] hover:text-[#E87A86] transition-colors">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    {p.replyCount || 0} replies
                </button>
                <button onClick={() => toggleSave(p._id)}
                    className="ml-auto text-xs font-medium text-[#9E7A82] hover:text-[#E87A86] transition-colors flex items-center gap-1">
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                    Save
                </button>
                {p.isOwner && (
                    <button
                        onClick={() => setConfirmDelete(p._id)}
                        title="Delete post"
                        className="flex items-center gap-1 text-xs font-medium text-[#9E7A82] hover:text-red-500 transition-colors"
                    >
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                    </button>
                )}
                <span className="text-xs text-[#B0909A]">
                    Anonymous · {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
            </div>

            {/* Replies */}
            {expanded === p._id && (
                <div className="mt-4 pt-4 border-t border-[#F0E8EA]">
                    {(replies[p._id] || []).map(r => (
                        <div key={r._id} className="flex gap-3 mb-3">
                            <div className="w-7 h-7 rounded-full bg-[#F0E8EA] flex items-center justify-center text-xs font-bold text-[#9E7A82] flex-shrink-0">
                                ?
                            </div>
                            <div className="flex-1 bg-[#F8F4F5] rounded-xl px-3 py-2.5">
                                <p className="text-xs font-semibold text-[#6B4F53] mb-0.5">
                                    Anonymous
                                </p>
                                <p className="text-sm text-[#2C1A1D]">{r.body}</p>
                            </div>
                        </div>
                    ))}
                    <div className="flex flex-col gap-2 mt-3">
                        <div className="flex gap-2">
                            <input className="flex-1 px-3 py-2 rounded-lg border border-[#EDE0E3] text-sm focus:border-[#E87A86] focus:outline-none placeholder:text-[#C0A8AC]"
                                placeholder="Write a reply…" value={replyText} onChange={e => setReplyText(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); submitReply(p._id); } }} />
                            <button type="button" onClick={() => submitReply(p._id)}
                                className="px-3 py-2 bg-[#E87A86] text-white text-sm font-semibold rounded-lg hover:bg-[#D66874] whitespace-nowrap">
                                Reply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="h-full w-full overflow-y-auto">
            <div className="min-h-full max-w-7xl mx-auto p-6 lg:p-8">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="font-heading text-3xl font-semibold text-[#2C1A1D]">Community</h1>
                        <p className="text-sm text-[#9E7A82] mt-1">Connect with others on their cycle journey.</p>
                    </div>
                    <button onClick={() => setShowNew(true)}
                        className="px-4 py-2 bg-[#E87A86] text-white text-sm font-semibold rounded-lg hover:bg-[#D66874] transition-colors">
                        New post
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* Circles sidebar */}
                    <div className="flex flex-col gap-3">
                        <div className="bg-white rounded-2xl border border-[#EDE0E3] p-4">
                            <h4 className="text-xs font-semibold text-[#9E7A82] uppercase tracking-wider mb-3">Circles</h4>
                            <div className="flex flex-col gap-0.5">
                                {CIRCLES.map(c => (
                                    <button key={c.id} onClick={() => { setCircle(c.id); setTab('feed'); }}
                                        className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${circle === c.id && tab === 'feed' ? 'bg-[#FDE0E4] text-[#C85C6B] font-semibold' : 'text-[#6B4F53] hover:bg-[#F8F4F5]'}`}>
                                        {c.label}
                                    </button>
                                ))}
                            </div>
                            <div className="border-t border-[#EDE0E3] mt-3 pt-3">
                                <button onClick={() => setTab('saved')}
                                    className={`text-left w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${tab === 'saved' ? 'bg-[#FDE0E4] text-[#C85C6B] font-semibold' : 'text-[#6B4F53] hover:bg-[#F8F4F5]'}`}>
                                    Saved posts
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Feed */}
                    <div className="lg:col-span-3 flex flex-col gap-4">
                        <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-heading text-base font-semibold text-[#2C1A1D] capitalize">
                                {tab === 'saved' ? 'Saved posts' : `${circle} circle`}
                            </h4>
                            {loading && <div className="w-4 h-4 rounded-full border-2 border-[#EDE0E3] border-t-[#E87A86] animate-spin" />}
                        </div>

                        {!loading && (tab === 'feed' ? posts : saved).length === 0 ? (
                            <div className="bg-white rounded-2xl border border-[#EDE0E3] py-16 text-center text-[#9E7A82] text-sm">
                                No posts yet — be the first to share.
                            </div>
                        ) : (
                            (tab === 'feed' ? posts : saved).map(p => <PostCard key={p._id} p={p} />)
                        )}
                    </div>
                </div>

                {/* New Post Modal */}
                {showNew && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-heading text-xl font-semibold text-[#2C1A1D]">New post</h3>
                                <button onClick={() => setShowNew(false)} className="text-[#9E7A82] hover:text-[#2C1A1D] text-xl">&times;</button>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-2 flex-wrap">
                                    {POST_TYPES.map(t => (
                                        <button key={t} onClick={() => setNewPost(p => ({ ...p, type: t }))}
                                            className={`px-3 py-1.5 rounded-full border text-xs font-semibold capitalize transition-all
                      ${newPost.type === t ? TYPE_COLORS[t] + ' border-transparent' : 'border-[#EDE0E3] text-[#6B4F53] hover:border-[#E87A86]'}`}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                                <input className="w-full px-3 py-2.5 rounded-lg border border-[#EDE0E3] text-sm
                focus:border-[#E87A86] focus:outline-none placeholder:text-[#C0A8AC]"
                                    placeholder="Title" value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} />
                                <textarea className="w-full px-3 py-2.5 rounded-lg border border-[#EDE0E3] text-sm leading-relaxed resize-none
                focus:border-[#E87A86] focus:outline-none placeholder:text-[#C0A8AC]"
                                    rows={4} placeholder="Share your experience…"
                                    value={newPost.body} onChange={e => setNewPost(p => ({ ...p, body: e.target.value }))} />
                                <div className="flex gap-3 mt-1">
                                    <button onClick={() => setShowNew(false)}
                                        className="flex-1 py-2.5 text-sm font-semibold text-[#9E7A82] rounded-lg border border-[#EDE0E3] hover:bg-[#F8F4F5]">
                                        Cancel
                                    </button>
                                    <button onClick={createPost} disabled={posting}
                                        className="flex-1 py-2.5 bg-[#E87A86] text-white text-sm font-semibold rounded-lg hover:bg-[#D66874] disabled:opacity-40">
                                        {posting ? 'Posting…' : 'Post'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirm Modal */}
                {confirmDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                            <div className="flex flex-col items-center gap-4 text-center">
                                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-heading text-lg font-semibold text-[#2C1A1D] mb-1">Delete post?</h3>
                                    <p className="text-sm text-[#9E7A82]">This will permanently delete the post and all its replies. This action cannot be undone.</p>
                                </div>
                                <div className="flex gap-3 w-full mt-1">
                                    <button
                                        onClick={() => setConfirmDelete(null)}
                                        className="flex-1 py-2.5 text-sm font-semibold text-[#9E7A82] rounded-lg border border-[#EDE0E3] hover:bg-[#F8F4F5] transition-colors">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => { deletePost(confirmDelete); setConfirmDelete(null); }}
                                        className="flex-1 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
