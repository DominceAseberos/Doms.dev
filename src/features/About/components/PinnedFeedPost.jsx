import React, { useEffect, useState, useMemo } from 'react';
import { fetchFeedPosts } from '../../../shared/feedService';
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

const PinnedFeedPost = () => {
    const [posts, setPosts] = useState([]);

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

    const pinnedPost = useMemo(() => {
        if (!Array.isArray(posts) || posts.length === 0) return null;
        // Get the latest post
        const sorted = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return sorted[0];
    }, [posts]);

    if (!pinnedPost) return null;

    const selectedMedia = Array.isArray(pinnedPost.images)
        ? pinnedPost.images.filter((src) => typeof src === 'string' && src.trim().length > 0)
        : (typeof pinnedPost.image === 'string' && pinnedPost.image.trim().length > 0 ? [pinnedPost.image] : []);

    return (
        <section className="ns-section ns-reveal" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                <div>
                    <p className="ui-sub-label ns-section-label">Latest Update</p>
                    <h2 className="ns-section-heading" style={{ fontSize: '1.8rem' }}>Dev Log</h2>
                </div>
            </div>
            
            <article className="feed-detail-card lit-content-block lit-transparent" style={{ width: '100%', margin: '0' }}>
                <div className="feed-detail-meta ui-sub-label ns-reveal" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <span className="feed-type" style={{ color: 'var(--accent-color, #7C3AED)', fontWeight: 'bold' }}>
                            {pinnedPost.type === 'image' ? 'Image Post' : 'Text Post'}
                        </span>
                        <time dateTime={pinnedPost.createdAt}>{formatDate(pinnedPost.createdAt)}</time>
                    </div>
                    <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', border: '1px solid rgba(160,168,208,0.3)', borderRadius: '12px' }}>
                        Pinned
                    </span>
                </div>

                <div className="feed-card-copy" style={{ marginTop: '1rem' }}>
                    <h3 className="feed-card-title ns-reveal" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{pinnedPost.title}</h3>
                    {pinnedPost.body && (
                        <p className="feed-card-body ui-body-copy ns-reveal" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {pinnedPost.body}
                        </p>
                    )}
                </div>

                {selectedMedia.length > 0 && (
                    <div className={`feed-media-wrap ns-reveal ${selectedMedia.length > 1 ? 'feed-media-grid' : ''}`} style={{ marginTop: '1.5rem' }}>
                        {selectedMedia.slice(0, 2).map((src, index) => (
                            <div key={index} className="feed-media-item" style={{ maxHeight: '300px', overflow: 'hidden' }}>
                                <img
                                    src={src}
                                    alt={pinnedPost.title}
                                    className="feed-media"
                                    loading="lazy"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </article>
        </section>
    );
};

export default React.memo(PinnedFeedPost);
