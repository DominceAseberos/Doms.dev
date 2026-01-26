import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { usePortfolioData } from '../../hooks/usePortfolioData';

import { useGitHubStore } from './store/useGitHubStore';

const StatsGitHub = () => {
  const { profile } = usePortfolioData();
  const username = profile.githubUsername;

  // Use the persistent store
  const { profile: githubProfile, loading, fetchGitHubData, error } = useGitHubStore();

  const containerRef = useRef(null);
  const calendarDataRef = useRef([]);

  // Trigger fetch on mount
  useEffect(() => {
    fetchGitHubData(username);
  }, [username, fetchGitHubData]);

  // Local state for contributions which comes from the calendar, not the store
  const [totalContributions, setTotalContributions] = useState(0);

  // Derive stats from the store data safely
  const stats = {
    repos: githubProfile?.public_repos ?? 0,
    followers: githubProfile?.followers ?? 0,
    following: githubProfile?.following ?? 0,
    totalContributions: totalContributions // Use local state
  };

  const [contribData, setContribData] = useState([]);
  // Loading state is now handled by the store, but we can also use local derivative if needed
  // implementation details...

  const handleTransformData = useCallback((weeks = []) => {
    calendarDataRef.current = weeks;
    return weeks; // ❗ NO setState here
  }, []);

  useEffect(() => {
    const weeks = calendarDataRef.current;
    if (!weeks.length) return;

    const data = weeks.map((week, idx) => ({
      week: `W${idx + 1}`,
      contributions: week.contributionDays?.reduce(
        (sum, d) => sum + (d.contributionCount || 0),
        0
      ) ?? 0
    }));

    const total = data.reduce((sum, w) => sum + w.contributions, 0);

    setContribData(data);
    setTotalContributions(total);
  }, [loading]);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.from(containerRef.current.querySelectorAll('.stat-item'), {
      y: 15,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 90%',
        once: true
      }
    });
  }, { scope: containerRef });

  const theme = {
    dark: ['#4e4e4eff', '#babab1ff', '#dfdec3ff', '#eceaa5ff', '#7bff00ff']
  };

  if (loading) return (
    <div
      ref={containerRef}
      className="relative rounded-2xl w-full h-full p-4 flex flex-col overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, rgba(var(--box-Linear-1-rgb)), rgba(var(--box-Linear-2-rgb)))`
      }}
    >
      <div className="animate-pulse space-y-4">
        {/* Title ghost */}
        <div className="h-6 w-32 bg-white/10 rounded mx-auto" />

        {/* Calendar ghost */}
        <div className="w-full h-32 bg-white/5 rounded" />

        {/* Stats Row Ghost */}
        <div className="flex justify-around pt-3 mt-2 border-t border-white/5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center space-y-1">
              <div className="h-2 w-12 bg-white/10 rounded mx-auto" />
              <div className="h-3 w-8 bg-white/10 rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl w-full h-full p-4 flex flex-col overflow-hidden"
      style={{
        background: `linear-gradient(
          to bottom,
          rgba(var(--box-Linear-1-rgb)),
          rgba(var(--box-Linear-2-rgb))
        )`
      }}
    >
      {/* Title */}
      <h3 className="text-center font-playfair font-black text-xl text-white mb-2">
        GitHub Stats
      </h3>

      {/* Calendar */}
      <div className="calendar-wrapper w-full overflow-x-auto py-2 no-scrollbar">
        <GitHubCalendar
          username={username}
          blockSize={10}
          blockMargin={4}
          fontSize={11}
          theme={theme}
          transformData={handleTransformData}
        />
      </div>


      {/* Stats */}
      <div className="flex justify-around pt-3  mt-2 md:mt-0 md:pt-2">
        {[
          ['Repos', stats.repos],
          ['Followers', stats.followers],
          ['Following', stats.following],
        ].map(([label, value]) => (
          <div key={label} className="stat-item text-center">
            <p className="text-[9px] uppercase text-white/40">{label}</p>
            <p className="text-sm font-bold text-white">
              {loading ? '…' : value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsGitHub;
