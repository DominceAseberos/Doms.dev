import React, { useEffect, useState } from "react";
import { SiGithub } from "react-icons/si";

const FocusCard = () => {
  const [data, setData] = useState({ commit: "", repo: "", languages: [] });
  const [loading, setLoading] = useState(true);
  const username = "Domincee"; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventRes = await fetch(`https://api.github.com/users/${username}/events/public`);
        const events = await eventRes.json();
        
        const lastPush = Array.isArray(events) 
          ? events.find(e => e.type === "PushEvent" && e.payload?.commits?.length > 0) 
          : null;

        const repoRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=50&sort=updated`);
        const repos = await repoRes.json();
        
        const langMap = Array.isArray(repos) ? repos.reduce((acc, repo) => {
          if (repo.language) acc[repo.language] = (acc[repo.language] || 0) + 1;
          return acc;
        }, {}) : {};

        const topLangs = Object.entries(langMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 2); // Reduced to top 2 to save vertical space

        const commitMsg = lastPush?.payload?.commits?.[0]?.message || "Architecting solutions."; 
        const repoName = lastPush?.repo?.name?.split('/')?.[1] || "Development";

        setData({ repo: repoName, commit: commitMsg, languages: topLangs });
      } catch (e) {
        console.error("GitHub Fetch Error:", e);
        setData(prev => ({ ...prev, commit: "Pushing code...", repo: "Dev Lab" }));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex flex-col h-full w-full p-3 space-y-3 animate-pulse overflow-hidden">
       <div className="h-3 w-16 bg-white/10 rounded" />
       <div className="h-12 w-full bg-white/5 rounded-lg" />
       <div className="space-y-2">
          <div className="h-1.5 w-full bg-white/5 rounded" />
          <div className="h-1.5 w-full bg-white/5 rounded" />
       </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full p-3 justify-between overflow-hidden bento-card"
    
     style={{
          background: `linear-gradient(
                         to bottom,
                          rgba(var(--box-Linear-1-rgb))  ,
                          rgba(var(--box-Linear-2-rgb))  
                     )`
        }}>

      <div className="space-y-3">
        {/* Header - Tightened spacing */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Live Feed</span>
          </div>
          <SiGithub className="text-white/10 text-base" />
        </div>

        <div>
          <p className="text-[9px] text-green-400 font-mono mb-0.5 uppercase opacity-80 tracking-tight truncate">
            {data.repo}
          </p>
          <p className="text-[11px] text-gray-100 font-medium leading-tight line-clamp-2 italic">
            "{data.commit}"
          </p>
        </div>

        {/* Languages - Thinner bars and smaller text */}
        <div className="space-y-2">
          <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Stack</p>
          {data.languages.map(([name, count]) => (
            <div key={name} className="w-full">
              <div className="flex justify-between text-[9px] text-gray-300 mb-0.5 font-mono">
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
      
      <p className="text-[8px] text-gray-600 font-mono uppercase mt-2 italic opacity-50">GitHub Sync</p>
    </div>
  );
};

export default FocusCard;