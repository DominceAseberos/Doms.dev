import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import axios from 'axios';
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

const StatsGitHub = () => {
  const username = 'Domincee';

  const containerRef = useRef(null);
  const calendarDataRef = useRef([]);

  const [stats, setStats] = useState({
    repos: 0,
    followers: 0,
    following: 0,
    totalContributions: 0
  });

  const [contribData, setContribData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGitHubStats = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://api.github.com/users/${username}`
      );

      setStats(prev => ({
        ...prev,
        repos: data.public_repos,
        followers: data.followers,
        following: data.following
      }));
    } catch (err) {
      console.error('GitHub fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGitHubStats();
  }, []);

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
    setStats(prev => ({ ...prev, totalContributions: total }));
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
    light: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
    dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']
  };

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
      <div className="flex justify-around pt-3  mt-2">
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
