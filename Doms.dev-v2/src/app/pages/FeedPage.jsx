import React, { useState, useEffect, useCallback, useRef } from 'react';
import { profileService } from '@shared/services/profileService';
import { postService } from '@shared/services/postService';
import { ArrowLeft, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageLoader from '@app/components/PageLoader';
import { useLoader } from '@app/contexts/LoaderContext';


gsap.registerPlugin(ScrollTrigger);

const FeedPage = () => {
    const { initialLoadComplete, resetInitialLoad } = useLoader();

    // State
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isDataReady, setIsDataReady] = useState(false);
    const [revealReady, setRevealReady] = useState(initialLoadComplete);

    // Clear the flag after first render so subsequent navigations show the loader
    useEffect(() => {
        if (initialLoadComplete) {
            resetInitialLoad();
        }
    }, []);

    useEffect(() => {
        fetchData();

        // Subscribe to profile changes for real-time updates
        const subscription = postService.subscribeToProfileChanges((updatedProfile) => {
            setProfile(prev => ({ ...prev, ...updatedProfile }));
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [profileData, postsData] = await Promise.all([
                profileService.getFirstProfile(),
                postService.getAllPosts()
            ]);

            if (profileData) setProfile(profileData);
            if (postsData) setPosts(postsData);
        } catch (error) {
            console.error('Error fetching feed data:', error);
        } finally {
            setLoading(false);
            setIsDataReady(true);
        }
    };

    const handleLoadComplete = useCallback(() => {
        setRevealReady(true);
    }, []);

    // Refs for animations
    const headerRef = useRef(null);
    const feedContainerRef = useRef(null);

    // Slide-left scroll reveal for posts
    useEffect(() => {
        if (!revealReady) return;

        // Header slide in
        if (headerRef.current) {
            gsap.fromTo(headerRef.current,
                { x: -30, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
            );
        }

        // Posts slide in from left
        const postCards = feedContainerRef.current?.querySelectorAll('.feed-post');
        if (postCards?.length) {
            postCards.forEach((card, index) => {
                gsap.fromTo(card,
                    { x: -40, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.5,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 88%",
                            toggleActions: "play none none none",
                            once: true
                        },
                        delay: index * 0.08
                    }
                );
            });
        }

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [revealReady, posts]);

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
        <>
            <PageLoader
                isLoading={!isDataReady}
                onLoadComplete={() => setRevealReady(true)}
            />
            <div className="min-h-screen w-full py-8 px-4"
                style={{
                    background: `linear-gradient(to bottom, rgb(var(--body-Linear-1-rgb)), rgb(var(--body-Linear-2-rgb)))`,
                    opacity: revealReady ? 1 : 0,
                    transition: 'opacity 0.4s ease-out'
                }}>

                <div className="max-w-2xl mx-auto space-y-8">
                    {/* Header */}
                    <div ref={headerRef} className="flex items-center gap-4">
                        <Link to="/about">
                            <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white">
                                <ArrowLeft size={20} />
                            </button>
                        </Link>
                        <h1 className="text-2xl font-bold flex-1" style={{ color: 'rgb(var(--contrast-rgb))' }}>Dev Feed</h1>
                    </div>

                    {/* Feed List */}
                    <div ref={feedContainerRef} className="space-y-6">
                        {loading ? (
                            <div className="flex justify-center p-8">
                                <Loader className="animate-spin text-white/20" />
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center text-white/30 py-12">No posts yet.</div>
                        ) : (
                            posts.map(post => (
                                <div key={post.id} className="feed-post bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                                            <img src={profile?.avatar_url || "https://github.com/shadcn.png"} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{profile?.name || 'System Owner'}</div>
                                            <div className="text-xs text-white/40">{formatDate(post.created_at)}</div>
                                        </div>
                                    </div>

                                    {post.content && (
                                        <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                                            {post.content}
                                        </p>
                                    )}

                                    {post.image_url && (
                                        <div
                                            className="rounded-xl overflow-hidden border border-white/5 mt-3 cursor-zoom-in group"
                                            onClick={() => setSelectedImage(post.image_url)}
                                        >
                                            <img
                                                src={post.image_url}
                                                alt="Post content"
                                                className="w-full h-64 object-contain bg-black/40 group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Image Modal */}
                {selectedImage && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <ArrowLeft size={24} className="rotate-180" /> {/* Simulating 'close' with Back or just use close logic */}
                        </button>
                        <img
                            src={selectedImage}
                            alt="Full size"
                            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default FeedPage;
