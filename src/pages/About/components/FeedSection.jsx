import React, { useMemo, useState } from 'react';
import posts from '../../../data/feedPosts.json';
import './FeedSection.css';

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
    const [selectedId, setSelectedId] = useState(hasPosts ? sortedPosts[0].id : null);

    const selectedPost = sortedPosts.find((post) => post.id === selectedId) || sortedPosts[0] || null;

    const getPreview = (text) => {
        if (!text) {
            return 'No description.';
        }

        const compact = text.replace(/\s+/g, ' ').trim();
        if (compact.length <= 90) {
            return compact;
        }

        return `${compact.slice(0, 90)}…`;
    };

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

                            {selectedPost.image ? (
                                <div className="feed-media-wrap">
                                    <img src={selectedPost.image} alt={selectedPost.title} className="feed-media" loading="lazy" />
                                </div>
                            ) : null}

                        </article>

                        <aside className="feed-list-card" aria-label="Recent posts">
                            <div className="feed-list-head ui-sub-label">Latest posts</div>
                            <div className="feed-list-scroll">
                                {sortedPosts.map((post) => {
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
                                            <p className="feed-list-preview ui-body-copy">{getPreview(post.body)}</p>
                                        </button>
                                    );
                                })}
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
            </div>
        </section>
    );
};

export default FeedSection;
