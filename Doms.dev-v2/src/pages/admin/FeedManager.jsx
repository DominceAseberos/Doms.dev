import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { ArrowLeft, Send, Image as ImageIcon, Loader, X, Trash2, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import adminStrings from '../../config/adminStrings.json';
import { useAdminStore } from '../../store/adminStore';
import { useQueryClient } from '@tanstack/react-query';
import { compressImage } from '../../utils/imageUtils';

const FeedManager = () => {
    const navigate = useNavigate();
    const { setAdminLoading, setSuccessMessage, setErrorMessage } = useAdminStore();
    const queryClient = useQueryClient();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Live Status State
    const [liveStatus, setLiveStatus] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState(false);

    // New Post State
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostImage, setNewPostImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [posting, setPosting] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetchPosts();
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase
                .from('profiles')
                .select('live_feed_status')
                .eq('id', user.id)
                .maybeSingle();

            if (data) {
                setLiveStatus(data.live_feed_status || '');
            }
        }
    };



    const updateLiveStatus = async () => {
        setUpdatingStatus(true);

        try {
            // Get the first (and only) profile row
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('id')
                .limit(1)
                .single();

            if (!existingProfile) {
                throw new Error('No profile found');
            }

            // Update only that profile's live_feed_status
            const { error } = await supabase
                .from('profiles')
                .update({ live_feed_status: liveStatus })
                .eq('id', existingProfile.id);

            if (error) throw error;

            setSuccessMessage('Live Status Updated');
            queryClient.invalidateQueries({ queryKey: ['portfolioData'] });
        } catch (err) {
            console.error('Status update failed:', err);
            setErrorMessage('Failed to update status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const fetchPosts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setPosts(data);
        }
        setLoading(false);
    };

    const handleImageSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            // Compress the image before setting it
            const compressedFile = await compressImage(file);
            setNewPostImage(compressedFile);
            setPreviewUrl(URL.createObjectURL(compressedFile));
        } catch (error) {
            console.error('Image compression failed, using original:', error);
            // Fallback to original file
            setNewPostImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setNewPostImage(null);
        setPreviewUrl(null);
    };

    const handlePost = async () => {
        if (!newPostContent.trim() && !newPostImage) return;
        setPosting(true);

        let imageUrl = null;

        if (newPostImage) {
            const fileExt = newPostImage.name.split('.').pop();
            const fileName = `feed_${Date.now()}.${fileExt}`;
            const { data, error } = await supabase.storage
                .from('project-images')
                .upload(fileName, newPostImage); // Upload to root for simplicity, matching mediaService pattern

            if (data) {
                const { data: { publicUrl } } = supabase.storage
                    .from('project-images')
                    .getPublicUrl(fileName);
                imageUrl = publicUrl;
            }
        }

        const { error } = await supabase
            .from('posts')
            .insert([{
                content: newPostContent,
                image_url: imageUrl,
                user_id: (await supabase.auth.getUser()).data.user?.id
            }]);

        if (!error) {
            setNewPostContent('');
            handleRemoveImage();
            fetchPosts();
        }
        setPosting(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);

        if (!error) {
            fetchPosts();
        }
    };

    // Helper to format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-4 md:gap-6">
                    <button
                        onClick={() => navigate('/admin')}
                        className="px-6 py-2 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-all flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest hover:border-white/10 cursor-pointer group w-fit"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        {adminStrings.common.backToAdmin}
                    </button>

                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Feed Manager</h1>
                        <p className="text-white/40 mt-1 md:mt-2 text-sm md:text-base">Create and manage your feed posts.</p>
                    </div>
                </div>

                {/* Live Status - Independent Section */}
                <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 space-y-4 shadow-xl">
                    <div className="flex items-center gap-3 text-green-400 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <h3 className="text-xs font-black uppercase tracking-widest">Live Status</h3>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                        <input
                            type="text"
                            value={liveStatus}
                            onChange={(e) => setLiveStatus(e.target.value)}
                            placeholder="What are you working on?"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-all font-mono"
                        />
                        <button
                            onClick={updateLiveStatus}
                            disabled={updatingStatus}
                            className="w-full md:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            {updatingStatus ? <Loader size={14} className="animate-spin" /> : <Save size={14} />}
                            Update
                        </button>
                    </div>
                </div>

                {/* Create Post */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4">
                    <textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="What's currently happening?"
                        className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-white/30 resize-none h-24 text-lg"
                    />

                    {previewUrl && (
                        <div className="relative w-fit">
                            <img src={previewUrl} alt="Preview" className="h-48 rounded-xl object-cover border border-white/10" />
                            <button onClick={handleRemoveImage} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <label className="cursor-pointer p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white">
                            <ImageIcon size={20} />
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                        </label>

                        <button
                            onClick={handlePost}
                            disabled={posting || (!newPostContent.trim() && !newPostImage)}
                            className="px-6 py-2 bg-white text-black font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:bg-gray-200 transition-colors"
                        >
                            {posting ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                            <span>Post Update</span>
                        </button>
                    </div>
                </div>

                {/* Posts Management List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold tracking-wide text-white/80">Recent Posts</h2>

                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader className="animate-spin text-white/20" />
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center text-white/30 py-12 bg-white/5 rounded-2xl border border-white/5">
                            No posts yet. Start writing above!
                        </div>
                    ) : (
                        posts.map(post => (
                            <div key={post.id} className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col gap-4 group hover:border-white/10 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-3 items-center">
                                        <div className="text-sm text-white/40 font-mono">{formatDate(post.created_at)}</div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="p-2 text-white/20 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        title="Delete Post"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                {post.content && (
                                    <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                                        {post.content}
                                    </p>
                                )}

                                {post.image_url && (
                                    <div
                                        className="rounded-xl overflow-hidden border border-white/5 max-w-sm cursor-zoom-in"
                                        onClick={() => setSelectedImage(post.image_url)}
                                    >
                                        <img
                                            src={post.image_url}
                                            alt="Post content"
                                            className="w-full h-48 object-contain bg-black/40 hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Image Modal */}
                {selectedImage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedImage(null)}
                    >
                        <div className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden bg-black border border-white/10">
                            <img src={selectedImage} className="w-full h-full object-contain" />
                            <button className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-white/20 transition-all">
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};

export default FeedManager;
