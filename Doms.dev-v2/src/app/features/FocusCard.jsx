import React, { useEffect, useState, useRef } from "react";
import { SiGithub } from "react-icons/si";
import { gsap } from "gsap";
import { usePortfolioData } from "@shared/hooks/usePortfolioData";
import { useGitHubStore } from "./github/store/useGitHubStore";

const FocusCard = () => {
  const cardRef = useRef(null);
  const [data, setData] = useState({ commit: "", repo: "", languages: [] });
  const [loading, setLoading] = useState(true);
  const { profile } = usePortfolioData();
  const username = profile.githubUsername;

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      scale: 1.1,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      scale: 1,
      duration: 0.6,
      ease: "elastic.out(1, 0.3)"
    });
  };

  // Use centralized store
  const { repos = [], events = [], loading: storeLoading, lastChecked, fetchGitHubData } = useGitHubStore();

  // Calculate relative time for "synced X ago"
  const getSyncedAgo = () => {
    if (!lastChecked) return null;
    const mins = Math.floor((Date.now() - lastChecked) / 60000);
    if (mins < 1) return 'just now';
    if (mins === 1) return '1 min ago';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    return hrs === 1 ? '1 hr ago' : `${hrs} hrs ago`;
  };

  // Trigger fetch if needed (store handles throttling)
  useEffect(() => {
    if (username) fetchGitHubData(username);
  }, [username, fetchGitHubData]);

  // Derive data from store and fetch commit message if needed
  useEffect(() => {
    if (storeLoading) return;

    setLoading(false);

    if (!repos || !events) return;

    // Find latest PushEvent
    const lastPush = Array.isArray(events)
      ? events.find(e => e.type === "PushEvent")
      : null;

    const langMap = Array.isArray(repos) ? repos.reduce((acc, repo) => {
      if (repo.language) acc[repo.language] = (acc[repo.language] || 0) + 1;
      return acc;
    }, {}) : {};

    const topLangs = Object.entries(langMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    const repoName = lastPush?.repo?.name?.split('/')?.[1] || "Development";

    // Truncate long commit messages
    const truncateMsg = (msg, maxLen = 30) =>
      msg.length > maxLen ? msg.slice(0, maxLen).trim() + '...' : msg;

    // If commits array exists, use it directly
    if (lastPush?.payload?.commits?.[0]?.message) {
      setData({ repo: repoName, commit: truncateMsg(lastPush.payload.commits[0].message), languages: topLangs });
      return;
    }

    // Otherwise fetch the commit using the SHA
    if (lastPush?.payload?.head && lastPush?.repo?.name) {
      const repoFullName = lastPush.repo.name;
      const commitSha = lastPush.payload.head;

      fetch(`https://api.github.com/repos/${repoFullName}/commits/${commitSha}`)
        .then(res => res.ok ? res.json() : null)
        .then(commitData => {
          const msg = commitData?.commit?.message || `Pushed to ${lastPush.payload?.ref?.replace('refs/heads/', '') || 'main'}`;
          setData(prev => ({ ...prev, repo: repoName, commit: truncateMsg(msg), languages: topLangs }));
        })
        .catch(() => {
          setData({ repo: repoName, commit: `Pushed to ${lastPush.payload?.ref?.replace('refs/heads/', '') || 'main'}`, languages: topLangs });
        });
    } else {
      setData({ repo: repoName, commit: "Architecting solutions.", languages: topLangs });
    }
  }, [repos, events, storeLoading]);

  // Cleanup GSAP animations on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      gsap.killTweensOf(cardRef.current);
    };
  }, []);

  if (loading) return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseEnter}
      onTouchEnd={handleMouseLeave}
      className="flex flex-col h-full w-full p-3 justify-between overflow-hidden bento-card border border-white/5 shadow-xl"
      style={{
        background: `linear-gradient(to bottom, rgba(var(--box-Linear-1-rgb)), rgba(var(--box-Linear-2-rgb)))`
      }}
    >
      <div className="space-y-3 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-white/10" />
            <div className="h-2 w-12 bg-white/10 rounded" />
          </div>
          <div className="h-4 w-4 bg-white/5 rounded" />
        </div>
        <div>
          <div className="h-2 w-20 bg-green-400/20 rounded mb-1" />
          <div className="h-3 w-full bg-white/5 rounded" />
          <div className="h-3 w-3/4 bg-white/5 rounded mt-1" />
        </div>
        <div className="space-y-2">
          <div className="h-2 w-8 bg-white/5 rounded" />
          {[1, 2].map((i) => (
            <div key={i}>
              <div className="flex justify-between mb-0.5">
                <div className="h-2 w-12 bg-white/10 rounded" />
                <div className="h-2 w-4 bg-white/10 rounded" />
              </div>
              <div className="h-0.5 w-full bg-white/5 rounded-full" />
            </div>
          ))}
        </div>
      </div>
      <div className="h-2 w-16 bg-white/5 rounded mt-2" />
    </div>
  );

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseEnter}
      onTouchEnd={handleMouseLeave}
      className="flex flex-col h-full w-full p-3 justify-between overflow-hidden bento-card border border-white/5 shadow-xl"
      style={{
        background: `linear-gradient(to bottom, rgba(var(--box-Linear-1-rgb)), rgba(var(--box-Linear-2-rgb)))`
      }}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
            <span className="text-[8px] md:text-[12px]  font-bold uppercase tracking-wider" style={{ color: 'rgb(var(--contrast-rgb))' }}>Live Feed</span>
          </div>
          <SiGithub className="text-white/10 text-base" />
        </div>

        <div>
          <p className="text-[9px] md:text-[14px] text-green-400 font-mono mb-0.5 uppercase opacity-80 tracking-tight truncate">
            {data.repo}
          </p>
          <p className="text-[11px] md:text-[15px] text-gray-100 font-medium leading-tight line-clamp-2 italic">
            "{data.commit}"
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-[8px] md:text-[12px] text-gray-500 font-bold uppercase tracking-widest" style={{ color: 'rgb(var(--contrast-rgb))' }}>Stack</p>
          {data.languages.map(([name, count], idx) => (
            <div
              key={name}
              // This hide/show logic ensures mobile stays clean (first 2) 
              // while desktop fills the space (all 4)
              className={`w-full ${idx >= 2 ? 'hidden md:block' : 'block'}`}
            >
              <div className="flex justify-between text-[9px] md:text-[14px] text-gray-300 mb-0.5 font-mono">
                <span>{name}</span>
                <span className="opacity-50">{count}</span>
              </div>
              <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.4)] transition-all duration-1000"
                  style={{ width: `${Math.min((count / 10) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[8px] md:text-[12px] font-mono uppercase mt-2 italic opacity-50" style={{ color: 'rgb(var(--contrast-rgb))' }}>
        Synced {getSyncedAgo() || '...'}
      </p>
    </div>
  );
};

export default FocusCard;