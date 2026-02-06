import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { postService } from '@shared/services/postService';
import { MessageSquare, ArrowUpRight } from 'lucide-react';

const AboutMeStatusCard = ({ feedCard }) => {
    const [latestPost, setLatestPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestPost = async () => {
            try {
                const data = await postService.getLatestPost();
                setLatestPost(data);
            } catch (error) {
                console.error('Error fetching status:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestPost();
    }, []);

    return (
        <Link
            to="/feed"
            className="
                scroll-reveal
                group relative w-full h-full
                flex flex-col justify-between
                rounded-2xl border p-6
                border-white/5 overflow-hidden
                hover:border-white/10 transition-colors cursor-pointer"
            style={{
                background: `linear-gradient(to bottom, rgb(var(--box-Linear-1-rgb)), rgb(var(--box-Linear-2-rgb)))`
            }}
            ref={feedCard}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Latest Update
                </div>
                <ArrowUpRight size={16} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>

            <div className="flex-1 flex flex-col justify-center">
                {loading ? (
                    <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-white/10 rounded w-3/4"></div>
                        <div className="h-4 bg-white/10 rounded w-1/2"></div>
                    </div>
                ) : latestPost ? (
                    <div className="space-y-3">
                        <p className="text-sm md:text-base font-medium leading-relaxed line-clamp-4 opacity-90">
                            {latestPost.content}
                        </p>
                        {latestPost.image_url && (
                            <div className="text-xs text-white/40 flex items-center gap-2 mt-2">
                                <span className="px-2 py-1 rounded bg-white/5 border border-white/5">Has Image attachment</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center opacity-40 text-sm">
                        No recent updates.
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs opacity-60">
                <span>View full feed</span>
                <MessageSquare size={14} />
            </div>
        </Link>
    );
};

export default AboutMeStatusCard;
