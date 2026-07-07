import React, { useEffect, useState, useMemo } from 'react';
import { fetchFeedPosts } from '../../../shared/feedService';
import useThemeStore from '../../../store/useThemeStore';
import './FeedSection.css'; // Reusing FeedSection styles

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

const PushPinSVG = ({ color, className, style }) => (
    <svg 
        width="36" 
        height="36" 
        viewBox="0 0 24 24" 
        className={className} 
        style={{ 
            ...style, 
            filter: 'drop-shadow(2px 4px 4px rgba(0,0,0,0.3))' 
        }}
    >
        {/* Needle */}
        <path d="M12 14 L12 22" stroke="#888" strokeWidth="2" strokeLinecap="round" />
        
        {/* Pin Head */}
        <path d="M16 8 C16 11, 14 14, 12 14 C10 14, 8 11, 8 8 C8 5, 10 2, 12 2 C14 2, 16 5, 16 8 Z" fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
        
        {/* Highlight */}
        <ellipse cx="11" cy="5" rx="2" ry="3" fill="rgba(255,255,255,0.6)" transform="rotate(-30 11 5)" />
    </svg>
);

const PinnedFeedPost = () => {
    const [posts, setPosts] = useState([]);
    const theme = useThemeStore((state) => state.theme);
    const isDark = theme === 'dark';

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await fetchFeedPosts();
                setPosts(data || []);
            } catch (err) {
                console.error("Failed to fetch feed posts", err);
            }
        };
        loadPosts();
    }, []);

    const pinnedPosts = useMemo(() => {
        if (!Array.isArray(posts) || posts.length === 0) return [];
        // Get the latest 2 posts
        const sorted = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return sorted.slice(0, 2);
    }, [posts]);

    if (pinnedPosts.length === 0) return null;

    return (
        <section className="ns-section ns-reveal" style={{ marginTop: '2rem', borderTop: 'none', paddingTop: '40px' }}>
            <style>{`
                .pinned-sticky-note {
                    transition: transform 0.3s ease, filter 0.3s ease, box-shadow 0.3s ease;
                }
                .pinned-sticky-note:hover {
                    transform: scale(1.02) translateY(-5px) !important;
                    filter: brightness(1.35) drop-shadow(0 10px 20px rgba(0,0,0,0.4)) !important;
                    z-index: 20;
                }
            `}</style>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                <div>
                    <p className="ui-sub-label ns-section-label">Latest Update</p>
                    <h2 className="ns-section-heading" style={{ fontSize: '1.8rem' }}>Dev Log</h2>
                </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(0.5rem, 2vw, 2rem)' }}>
                {pinnedPosts.map((post, idx) => {
                    const selectedMedia = Array.isArray(post.images)
                        ? post.images.filter((src) => typeof src === 'string' && src.trim().length > 0)
                        : (typeof post.image === 'string' && post.image.trim().length > 0 ? [post.image] : []);

                    // Different sticky note colors
                    const noteColorsLight = ['#f4b4ce', '#ffed99', '#a9def9', '#d0f4de'];
                    const noteColorsDark = ['#6a4052', '#6b5f40', '#405a6a', '#426850'];
                    const noteColors = isDark ? noteColorsDark : noteColorsLight;
                    const bgColor = noteColors[idx % noteColors.length];
                    const textColor = isDark ? '#eaeaea' : '#1a1a1a';
                    const mutedTextColor = isDark ? '#bbb' : '#555';

                    return (
                        <article key={post.id || idx} className="pinned-sticky-note lit-content-block lit-transparent" style={{ width: '100%', margin: '0', '--note-color': bgColor, color: textColor }}>
                            <PushPinSVG color="#66cc66" style={{ position: 'absolute', top: '5px', left: 'clamp(5px, 2vw, 15px)', zIndex: 10 }} />
                            <PushPinSVG color="#ffdd44" style={{ position: 'absolute', top: '5px', right: 'clamp(5px, 2vw, 15px)', zIndex: 10 }} />
                            
                            <div className="feed-detail-meta ui-sub-label ns-reveal" style={{ display: 'flex', justifyContent: 'space-between', color: mutedTextColor, fontSize: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <span className="feed-type" style={{ fontWeight: 'bold' }}>
                                        {post.type === 'image' ? 'Image Post' : 'Text Post'}
                                    </span>
                                    <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                                </div>
                            </div>

                            <div className="feed-card-copy" style={{ marginTop: 'clamp(0.5rem, 2vw, 1rem)' }}>
                                <h3 className="feed-card-title ns-reveal" style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1.5rem)', marginBottom: '0.5rem' }}>{post.title}</h3>
                                {post.body && (
                                    <p className="feed-card-body ui-body-copy ns-reveal" style={{ fontSize: 'clamp(0.6rem, 2vw, 0.85rem)', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {post.body}
                                    </p>
                                )}
                            </div>

                            {selectedMedia.length > 0 && (
                                <div className={`feed-media-wrap ns-reveal ${selectedMedia.length > 1 ? 'feed-media-grid' : ''}`} style={{ marginTop: '1.5rem', border: 'none', background: 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                    {selectedMedia.slice(0, 2).map((src, index) => (
                                        <div key={index} className="feed-media-item" style={{ width: '100%', aspectRatio: '16 / 10', overflow: 'hidden', borderRadius: '4px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.03)' }}>
                                            <img
                                                src={src}
                                                alt={post.title}
                                                className="feed-media"
                                                loading="lazy"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </article>
                    );
                })}
            </div>
        </section>
    );
};

export default React.memo(PinnedFeedPost);
