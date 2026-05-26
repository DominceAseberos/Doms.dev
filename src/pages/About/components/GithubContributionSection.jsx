import React, { useEffect, useState } from 'react';
import GitHubCalendar from 'react-github-calendar';
import portfolioData from '../../../data/portfolioData.json';
import useThemeStore from '../../../store/useThemeStore';
import './GithubContributionSection.css';

const USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'DominceAseberos';

const CACHE_TTL = 15 * 60 * 1000;

function buildHeaders() {
    return { Accept: 'application/vnd.github+json' };
}

function cacheSet(k, d) {
    try {
        localStorage.setItem('gac_' + k, JSON.stringify({ d, t: Date.now() }));
    } catch (_) {}
}

function cacheGet(k) {
    try {
        const r = JSON.parse(localStorage.getItem('gac_' + k) || 'null');
        if (r && Date.now() - r.t < CACHE_TTL) return r.d;
    } catch (_) {}
    return null;
}

function clearGitHubActivityCache() {
    try {
        const keysToRemove = [];
        for (let index = 0; index < localStorage.length; index++) {
            const key = localStorage.key(index);
            if (key?.startsWith('gac_')) keysToRemove.push(key);
        }
        keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch (_) {}
}

async function ghFetch(path) {
    const cached = cacheGet(path);
    if (cached) return cached;

    const res = await fetch('https://api.github.com' + path, { headers: buildHeaders() });
    if (!res.ok) throw new Error('GitHub API error ' + res.status);

    const data = await res.json();
    cacheSet(path, data);
    return data;
}

function getRepoFullName(githubUrl) {
    if (!githubUrl || typeof githubUrl !== 'string') return null;

    try {
        const url = new URL(githubUrl);
        if (!url.hostname.includes('github.com')) return null;

        const [owner, repo] = url.pathname
            .replace(/^\/+|\/+$/g, '')
            .split('/');

        if (!owner || !repo) return null;
        return `${owner}/${repo.replace(/\.git$/, '')}`;
    } catch (_) {
        return null;
    }
}

const PROJECT_REPOS = [
    ...new Set(
        (portfolioData.projects || [])
            .map((project) => getRepoFullName(project.githubUrl))
            .filter(Boolean)
    ),
];

async function fetchRecentCommits() {
    const cacheKey = `/recent-project-commits/${PROJECT_REPOS.join(',')}`;
    const cached = cacheGet(cacheKey);
    if (cached) return cached;

    try {
        const params = new URLSearchParams({ repos: PROJECT_REPOS.join(',') });
        const response = await fetch(`/api/github-commits?${params.toString()}`);
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data.commits)) {
                cacheSet(cacheKey, data.commits);
                return data.commits;
            }
        }
    } catch (_) {
        // Fall back to direct public GitHub calls when running outside Vercel.
    }

    const commitsByRepo = await Promise.all(
        PROJECT_REPOS.map(async (repoFullName) => {
            try {
                const rows = await ghFetch(`/repos/${repoFullName}/commits?per_page=3`);
                if (!Array.isArray(rows)) return [];
                return rows.map((item) => ({
                    message: item?.commit?.message || 'No commit message',
                    repo: repoFullName,
                    sha: item.sha,
                    time: item?.commit?.author?.date || item?.commit?.committer?.date,
                    url: item?.html_url || `https://github.com/${repoFullName}/commit/${item.sha}`,
                }));
            } catch (_) {
                return [];
            }
        })
    );

    const sorted = commitsByRepo
        .flat()
        .filter(Boolean)
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 5);

    cacheSet(cacheKey, sorted);
    return sorted;
}

function formatCommitTime(value) {
    if (!value) return '';
    try {
        return new Intl.DateTimeFormat('en', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(new Date(value));
    } catch (_) {
        return '';
    }
}

const calendarTheme = {
    dark: ['rgba(255, 255, 255, 0.08)', '#17324f', '#1f6ea7', '#39bce8', '#8be9ff'],
    light: ['rgba(18, 18, 18, 0.06)', '#d9f2ee', '#9adbd4', '#53b8c7', '#247ea8'],
};

const GithubContributionSection = () => {
    const theme = useThemeStore((state) => state.theme);
    const [status, setStatus] = useState('Loading GitHub activity...');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [recentCommits, setRecentCommits] = useState([]);
    const [activeCommitIndex, setActiveCommitIndex] = useState(0);

    async function loadLiveData(forceRefresh = false) {
        if (forceRefresh) clearGitHubActivityCache();

        setStatus(forceRefresh ? 'Refreshing GitHub activity...' : 'Loading GitHub activity...');
        setIsRefreshing(true);

        try {
            const commits = await fetchRecentCommits();
            setRecentCommits(commits);
            setActiveCommitIndex(0);
            setStatus('');
        } catch (err) {
            setRecentCommits([]);
            setStatus('Could not load GitHub activity: ' + err.message);
        } finally {
            setIsRefreshing(false);
        }
    }

    useEffect(() => {
        loadLiveData(false);
    }, []);

    useEffect(() => {
        if (recentCommits.length <= 1) return undefined;

        const interval = window.setInterval(() => {
            setActiveCommitIndex((index) => (index + 1) % recentCommits.length);
        }, 4500);

        return () => window.clearInterval(interval);
    }, [recentCommits.length]);

    const activeCommit = recentCommits[activeCommitIndex] || recentCommits[0] || null;

    return (
        <section className="github-contrib-wrap">
            <div className="github-contrib-head">
                <h2 className="github-contrib-title ns-reveal">GitHub Activity</h2>
                <p className="github-contrib-subtitle ns-reveal">
                    Contribution heat map plus latest commits pulled directly from linked public project repositories.
                </p>
            </div>

            <div className="github-contrib-actions ns-reveal">
                {status ? <p className="github-contrib-status">{status}</p> : <span />}
                <button
                    type="button"
                    className="github-contrib-refresh"
                    onClick={() => loadLiveData(true)}
                    disabled={isRefreshing}
                >
                    {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                </button>
            </div>

            <div className="github-activity-grid">
                <div className="gc-heatmap-card ns-reveal">
                    <div className="gc-card-eyebrow">Contribution Heat Map</div>
                    <GitHubCalendar
                        username={USERNAME}
                        colorScheme={theme === 'light' ? 'light' : 'dark'}
                        theme={calendarTheme}
                        blockSize={12}
                        blockMargin={4}
                        fontSize={12}
                        showWeekdayLabels
                    />
                </div>

                <div className="gc-commit-card ns-reveal">
                    <div className="gc-card-eyebrow">Latest Commits</div>
                    <h3 className="gc-card-title">@{USERNAME}</h3>
                    <div className="gc-commits-list">
                        {activeCommit ? (
                            <>
                                <article
                                    key={activeCommit.sha || activeCommitIndex}
                                    className="gc-commit-item"
                                >
                                    <div className="gc-commit-counter">
                                        {activeCommitIndex + 1} / {recentCommits.length}
                                    </div>
                                    <div className="gc-commit-repo">
                                        <span className="gc-commit-dot" />
                                        <a
                                            href={`https://github.com/${activeCommit.repo}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="gc-commit-repo-link"
                                        >
                                            {activeCommit.repo}
                                        </a>
                                    </div>
                                    <p className="gc-commit-message">{activeCommit.message.split('\n')[0]}</p>
                                    <div className="gc-commit-footer">
                                        <span>{formatCommitTime(activeCommit.time)}</span>
                                        <a
                                            href={activeCommit.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="gc-card-cta"
                                        >
                                            View Commit <span className="gc-cta-arrow">↗</span>
                                        </a>
                                    </div>
                                </article>
                                {recentCommits.length > 1 ? (
                                    <div className="gc-commit-pagination" aria-label="Commit pagination">
                                        {recentCommits.map((commit, index) => (
                                            <button
                                                key={commit.sha || index}
                                                type="button"
                                                className={`gc-commit-page-dot ${index === activeCommitIndex ? 'is-active' : ''}`}
                                                onClick={() => setActiveCommitIndex(index)}
                                                aria-label={`Show commit ${index + 1}`}
                                                aria-current={index === activeCommitIndex}
                                            />
                                        ))}
                                    </div>
                                ) : null}
                            </>
                        ) : (
                            <p className="gc-commit-unavailable">
                                No recent public commits could be loaded from the linked project repositories.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GithubContributionSection;
