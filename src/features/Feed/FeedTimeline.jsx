import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchFeedPosts } from '../../shared/feedService';
import useThemeStore from '../../store/useThemeStore';
import '../About/components/NarrativeSection.css'; // Reuse timeline styles
import HoverDrawBorder from '../About/components/ui/HoverDrawBorder';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const formatDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC'
    }).format(date);
};

const FeedTimeline = () => {
    const [posts, setPosts] = useState([]);
    const containerRef = useRef(null);
    const theme = useThemeStore((state) => state.theme);
    const isDark = theme === 'dark';

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await fetchFeedPosts();
                // Sort descending (newest first)
                const sorted = (data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setPosts(sorted);
            } catch (err) {
                console.error("Failed to fetch feed posts", err);
            }
        };
        loadPosts();
    }, []);

    // ScrollTrigger reveal animation
    useEffect(() => {
        if (!containerRef.current || posts.length === 0) return;

        const ctx = gsap.context(() => {
            const els = gsap.utils.toArray('.ns-reveal');
            gsap.set(els, { opacity: 0, y: 36, immediateRender: true });

            ScrollTrigger.batch(els, {
                start: 'top 90%',
                onEnter: (batch) => {
                    gsap.to(batch, {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                        ease: 'power2.out',
                        stagger: 0.1,
                    });
                },
            });
            ScrollTrigger.refresh();
        }, containerRef);

        return () => ctx.revert();
    }, [posts]);

    // Handle scroll-to-post from URL hash
    useEffect(() => {
        if (posts.length > 0 && typeof window !== 'undefined') {
            const hash = window.location.hash;
            if (hash && hash.startsWith('#post-')) {
                setTimeout(() => {
                    const el = document.querySelector(hash);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        // Add a temporary highlight effect
                        gsap.fromTo(el, 
                            { backgroundColor: isDark ? 'rgba(200, 255, 62, 0.15)' : 'rgba(100, 150, 0, 0.15)' },
                            { backgroundColor: 'transparent', duration: 2, delay: 0.5 }
                        );
                    }
                }, 500);
            }
        }
    }, [posts, isDark]);

    return (
        <div ref={containerRef} className="narrative-section" style={{ overflowX: 'hidden', minHeight: '100vh' }}>
            <section className="ns-section" style={{ paddingTop: 'clamp(100px, 15vh, 160px)', borderTop: 'none' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="ns-reveal" style={{ marginBottom: '4rem' }}>
                        <p className="ui-sub-label ns-section-label">Dev Feed</p>
                        <h1 className="ns-section-heading" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                            Posts & Updates
                        </h1>
                        <p className="ui-body-copy" style={{ fontSize: '1.1rem', opacity: 0.8, maxWidth: '600px' }}>
                            Short build notes from project work, architecture decisions, ML experiments, and interface polish.
                        </p>
                    </div>

                    <div className="ns-timeline">
                        {posts.map((post, i) => {
                            const selectedMedia = Array.isArray(post.images)
                                ? post.images.filter((src) => typeof src === 'string' && src.trim().length > 0)
                                : (typeof post.image === 'string' && post.image.trim().length > 0 ? [post.image] : []);

                            return (
                                <div key={post.id || i} id={`post-${post.id}`} className="ns-timeline-item ns-reveal ns-sketch-box lit-content-block lit-transparent" style={{ padding: '2rem', marginBottom: '2rem' }}>
                                    <HoverDrawBorder />
                                    <div className="ns-timeline-dot" style={{ top: '3rem', left: '-5.5px' }} />
                                    
                                    <div className="ns-timeline-body">
                                        <div className="ns-timeline-header">
                                            <h3 className="ns-timeline-role" style={{ fontSize: 'clamp(1.3rem, 2vw, 1.8rem)' }}>
                                                {post.title}
                                            </h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <span className="ui-sub-label" style={{ color: 'var(--accent)', opacity: 0.8 }}>
                                                    {post.type === 'image' ? 'Image Post' : 'Text Post'}
                                                </span>
                                                <span className="ns-timeline-period ui-sub-label">
                                                    {formatDate(post.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {post.tags && post.tags.length > 0 && (
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                                {post.tags.map(tag => (
                                                    <span key={tag} className="ns-ai-pill" style={{ opacity: 0.7 }}>{tag}</span>
                                                ))}
                                            </div>
                                        )}

                                        <p className="ns-timeline-desc ui-body-copy" style={{ marginTop: '1.5rem', fontSize: '1.1rem', fontWeight: 500 }}>
                                            {post.body}
                                        </p>
                                        
                                        {post.fullDescription && (
                                            <p className="ns-timeline-desc ui-body-copy" style={{ marginTop: '1rem', whiteSpace: 'pre-wrap', opacity: 0.8 }}>
                                                {post.fullDescription}
                                            </p>
                                        )}

                                        {selectedMedia.length > 0 && (
                                            <div style={{ 
                                                marginTop: '2rem', 
                                                display: 'grid', 
                                                gridTemplateColumns: selectedMedia.length > 1 ? 'repeat(auto-fit, minmax(250px, 1fr))' : '1fr',
                                                gap: '1rem',
                                                borderRadius: '1rem',
                                                overflow: 'hidden'
                                            }}>
                                                {selectedMedia.map((src, index) => (
                                                    <img
                                                        key={index}
                                                        src={src}
                                                        alt={`${post.title} image ${index + 1}`}
                                                        loading="lazy"
                                                        style={{
                                                            width: '100%',
                                                            height: 'auto',
                                                            objectFit: 'cover',
                                                            borderRadius: '0.5rem',
                                                            border: '1px solid var(--ns-card-border)'
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    {posts.length === 0 && (
                        <div className="ns-reveal" style={{ textAlign: 'center', padding: '4rem 0', opacity: 0.5 }}>
                            <p className="ui-body-copy">No posts found.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default FeedTimeline;
