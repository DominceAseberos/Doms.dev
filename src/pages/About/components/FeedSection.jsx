import React, { useEffect, useMemo, useRef, useState } from 'react';
import posts from '../../../data/feedPosts.json';
import './FeedSection.css';

const MOBILE_LIST_LIMIT = 4;

const formatDate = (value) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(date);
};

const FeedSection = () => {
    const sortedPosts = useMemo(() => {
        if (!Array.isArray(posts)) {
            return [];
        }

        return [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, []);

    const hasPosts = sortedPosts.length > 0;
    const recentPost = hasPosts ? sortedPosts[0] : null;
    const pastPosts = hasPosts ? sortedPosts.slice(1) : [];
    const [selectedId, setSelectedId] = useState(hasPosts ? sortedPosts[0].id : null);
    const [showAllPastMobile, setShowAllPastMobile] = useState(false);
    const [expandedImage, setExpandedImage] = useState(null);
    const listScrollRef = useRef(null);

    const selectedPost = sortedPosts.find((post) => post.id === selectedId) || sortedPosts[0] || null;

    const selectedMedia = useMemo(() => {
        if (!selectedPost) {
            return [];
        }

        const multiImages = Array.isArray(selectedPost.images)
            ? selectedPost.images.filter((src) => typeof src === 'string' && src.trim().length > 0)
            : [];

        if (multiImages.length) {
            return multiImages;
        }

        if (typeof selectedPost.image === 'string' && selectedPost.image.trim().length > 0) {
            return [selectedPost.image];
        }

        return [];
    }, [selectedPost]);

    const visiblePastPosts = showAllPastMobile
        ? pastPosts
        : pastPosts.slice(0, MOBILE_LIST_LIMIT);



    useEffect(() => {
        if (!expandedImage) return;

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                setExpandedImage(null);
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [expandedImage]);

    return (
        <section className="feed-section relative z-10">
            <div className="feed-shell mx-auto w-full">
                <div className="feed-head">
                    <p className="ui-sub-label">Feed</p>
                    <h2 className="feed-title">Posts and updates from me.</h2>
                    <p className="feed-intro ui-body-copy">
                        A blog-style section where I share whatever I want to publish, including text posts, images, and progress updates.
                    </p>
                </div>

                {hasPosts && selectedPost ? (
                    <div className="feed-layout">
                        <article className="feed-detail-card">
                            <div className="feed-detail-meta ui-sub-label">
                                <span className="feed-type">{selectedPost.type === 'image' ? 'Image Post' : 'Text Post'}</span>
                                <time dateTime={selectedPost.createdAt}>{formatDate(selectedPost.createdAt)}</time>
                            </div>

                            <div className="feed-card-copy">
                                <h3 className="feed-card-title">{selectedPost.title}</h3>
                                {selectedPost.body ? <p className="feed-card-body ui-body-copy">{selectedPost.body}</p> : null}
                            </div>

                            {selectedMedia.length ? (
                                <div className={`feed-media-wrap ${selectedMedia.length > 1 ? 'feed-media-grid' : ''}`}>
                                    {selectedMedia.map((src, index) => (
                                        <button
                                            key={`${src}-${index}`}
                                            type="button"
                                            className="feed-media-item feed-media-trigger"
                                            onClick={() => setExpandedImage({ src, alt: `${selectedPost.title} ${index + 1}` })}
                                            aria-label={`Expand image ${index + 1}`}
                                        >
                                            <img
                                                src={src}
                                                alt={`${selectedPost.title} ${index + 1}`}
                                                className="feed-media"
                                                loading="lazy"
                                            />
                                        </button>
                                    ))}
                                </div>
                            ) : null}

                        </article>

                        <aside className="feed-list-card" aria-label="Recent posts">
                            <div className="feed-list-head ui-sub-label">Past posts</div>
                            <div
                                ref={listScrollRef}
                                className="feed-list-scroll"
                            >
                                {recentPost && selectedId !== recentPost.id ? (
                                    <button
                                        type="button"
                                        className="feed-list-item"
                                        onClick={() => setSelectedId(recentPost.id)}
                                        aria-pressed="false"
                                    >
                                        <div className="feed-list-meta ui-sub-label">Back to most recent</div>
                                        <h4 className="feed-list-title">{recentPost.title}</h4>
                                    </button>
                                ) : null}

                                {visiblePastPosts.map((post) => {
                                    const isActive = post.id === selectedPost.id;
                                    return (
                                        <button
                                            key={post.id}
                                            type="button"
                                            className={`feed-list-item ${isActive ? 'is-active' : ''}`}
                                            onClick={() => setSelectedId(post.id)}
                                            aria-pressed={isActive}
                                        >
                                            <div className="feed-list-meta ui-sub-label">{formatDate(post.createdAt)}</div>
                                            <h4 className="feed-list-title">{post.title}</h4>
                                        </button>
                                    );
                                })}

                                {!pastPosts.length ? (
                                    <p className="feed-list-empty ui-body-copy">No past posts yet.</p>
                                ) : null}

                                {pastPosts.length > MOBILE_LIST_LIMIT ? (
                                    <button
                                        type="button"
                                        className="feed-list-toggle"
                                        onClick={() => setShowAllPastMobile((value) => !value)}
                                        aria-expanded={showAllPastMobile}
                                    >
                                        {showAllPastMobile ? 'Show less' : 'See all'}
                                    </button>
                                ) : null}
                            </div>
                        </aside>
                    </div>
                ) : (
                    <div className="feed-empty">
                        <p className="feed-empty-title">No published posts yet.</p>
                        <p className="feed-empty-copy ui-body-copy">
                            Once posts are added, this section will automatically show them here for visitors.
                        </p>
                    </div>
                )}

                {expandedImage ? (
                    <div
                        className="feed-lightbox"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Expanded feed image"
                        onClick={() => setExpandedImage(null)}
                    >
                        <div className="feed-lightbox-inner" onClick={(event) => event.stopPropagation()}>
                            <button
                                type="button"
                                className="feed-lightbox-close"
                                onClick={() => setExpandedImage(null)}
                                aria-label="Close image preview"
                            >
                                ×
                            </button>
                            <img src={expandedImage.src} alt={expandedImage.alt} className="feed-lightbox-image" />
                        </div>
                    </div>
                ) : null}
            </div>
        </section>
    );
};

export default FeedSection;
