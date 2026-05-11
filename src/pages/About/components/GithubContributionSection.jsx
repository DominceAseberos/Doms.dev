import React, { useEffect, useState } from 'react';
import GitHubCalendar from 'react-github-calendar';
import './GithubContributionSection.css';

const USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'DominceAseberos';
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const CACHE_TTL = 15 * 60 * 1000;

function buildHeaders() {
    const headers = { Accept: 'application/vnd.github+json' };
    if (TOKEN) headers.Authorization = 'Bearer ' + TOKEN;
    return headers;
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

async function fetchRecentCommits() {
    const cacheKey = `/recent-commits/${USERNAME}`;
    const cached = cacheGet(cacheKey);
    if (cached) return cached;

    let allCommits = [];

    if (TOKEN) {
        const ownedRepos = await ghFetch('/user/repos?visibility=all&affiliation=owner&sort=pushed&per_page=20');
        const ownLogin = USERNAME.toLowerCase();
        const repos = Array.isArray(ownedRepos)
            ? ownedRepos
                .filter((repo) => !repo?.fork)
                .filter((repo) => (repo?.owner?.login || '').toLowerCase() === ownLogin)
                .slice(0, 8)
            : [];

        const commitsByRepo = await Promise.all(
            repos.map(async (repo) => {
                try {
                    const rows = await ghFetch(`/repos/${repo.full_name}/commits?per_page=3`);
                    if (!Array.isArray(rows)) return [];
                    return rows.map((item) => ({
                        message: item?.commit?.message || 'No commit message',
                        repo: repo.full_name,
                        sha: item.sha,
                        time: item?.commit?.author?.date || item?.commit?.committer?.date,
                        url: item?.html_url || `https://github.com/${repo.full_name}/commit/${item.sha}`,
                    }));
                } catch (_) {
                    return [];
                }
            })
        );

        allCommits = commitsByRepo.flat().filter(Boolean);
    } else {
        const events = await ghFetch(`/users/${USERNAME}/events/public?per_page=40`);
        if (Array.isArray(events)) {
            events.forEach((event) => {
                if (event?.type !== 'PushEvent' || !event?.payload?.commits || !event?.repo?.name) return;
                event.payload.commits.forEach((commit) => {
                    allCommits.push({
                        message: commit.message || 'No commit message',
                        repo: event.repo.name,
                        sha: commit.sha,
                        time: event.created_at,
                        url: `https://github.com/${event.repo.name}/commit/${commit.sha}`,
                    });
                });
            });
        }
    }

    const sorted = allCommits
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
    dark: ['rgba(255,255,255,0.08)', '#375a32', '#5f8f3f', '#9acd5a', '#c8ff3e'],
    light: ['rgba(18,18,18,0.08)', '#d8e8c4', '#a8ca70', '#76a83f', '#3f7c22'],
};

const GithubContributionSection = () => {
    const [status, setStatus] = useState('Loading GitHub activity...');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [recentCommits, setRecentCommits] = useState([]);

    async function loadLiveData(forceRefresh = false) {
        if (forceRefresh) clearGitHubActivityCache();

        setStatus(forceRefresh ? 'Refreshing GitHub activity...' : 'Loading GitHub activity...');
        setIsRefreshing(true);

        try {
            const commits = await fetchRecentCommits();
            setRecentCommits(commits);
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

    return (
        <section className="github-contrib-wrap">
            <div className="github-contrib-head">
                <h2 className="github-contrib-title">GitHub Activity</h2>
                <p className="github-contrib-subtitle">
                    Contribution heat map and latest commits pulled from GitHub.
                </p>
            </div>

            <div className="github-contrib-actions">
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
                <div className="gc-heatmap-card">
                    <div className="gc-card-eyebrow">Contribution Heat Map</div>
                    <GitHubCalendar
                        username={USERNAME}
                        colorScheme="dark"
                        theme={calendarTheme}
                        blockSize={12}
                        blockMargin={4}
                        fontSize={12}
                        showWeekdayLabels
                    />
                </div>

                <div className="gc-commit-card">
                    <div className="gc-card-eyebrow">Latest Commits</div>
                    <h3 className="gc-card-title">@{USERNAME}</h3>
                    <div className="gc-commits-list">
                        {recentCommits.length > 0 ? (
                            recentCommits.map((commit, idx) => (
                                <div key={commit.sha || idx} className="gc-commit-item">
                                    <div className="gc-commit-repo">
                                        <span className="gc-commit-dot" />
                                        <a
                                            href={`https://github.com/${commit.repo}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="gc-commit-repo-link"
                                        >
                                            {commit.repo}
                                        </a>
                                    </div>
                                    <p className="gc-commit-message">{commit.message.split('\n')[0]}</p>
                                    <div className="gc-commit-footer">
                                        <span>{formatCommitTime(commit.time)}</span>
                                        <a
                                            href={commit.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="gc-card-cta"
                                        >
                                            View Commit <span className="gc-cta-arrow">↗</span>
                                        </a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="gc-commit-unavailable">No recent public commits found.</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GithubContributionSection;
