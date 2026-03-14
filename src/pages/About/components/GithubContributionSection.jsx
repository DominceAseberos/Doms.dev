import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './GithubContributionSection.css';

const USERNAME = import.meta.env.VITE_GITHUB_USERNAME;
const TOKEN    = import.meta.env.VITE_GITHUB_TOKEN;
const CACHE_TTL = 15 * 60 * 1000;
const MAX_REPOS = 100;
const SNAPSHOT_KEY = 'gsc_snapshot_repos';
const SNAPSHOT_TTL = 24 * 60 * 60 * 1000;

function buildHeaders() {
    const headers = { 'Accept': 'application/vnd.github+json' };
    if (TOKEN) headers['Authorization'] = 'Bearer ' + TOKEN;
    return headers;
}

function cacheSet(k, d) {
    try { localStorage.setItem('gsc_' + k, JSON.stringify({ d, t: Date.now() })); } catch (_) {}
}
function cacheGet(k) {
    try {
        const r = JSON.parse(localStorage.getItem('gsc_' + k) || 'null');
        if (r && Date.now() - r.t < CACHE_TTL) return r.d;
    } catch (_) {}
    return null;
}

function saveSnapshot(repos) {
    try {
        localStorage.setItem(SNAPSHOT_KEY, JSON.stringify({ repos, t: Date.now() }));
    } catch (_) {}
}

function loadSnapshot() {
    try {
        const raw = localStorage.getItem(SNAPSHOT_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.repos) || !parsed.t) return null;
        if (Date.now() - parsed.t > SNAPSHOT_TTL) return null;
        return parsed.repos;
    } catch (_) {
        return null;
    }
}

function clearGitHubLocalCache() {
    try {
        const keysToRemove = [];
        for (let index = 0; index < localStorage.length; index++) {
            const key = localStorage.key(index);
            if (!key) continue;
            if (key === SNAPSHOT_KEY || key.startsWith('gsc_')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (_) {}
}

function nameToHex(name) {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
    const hue = Math.abs(h) % 360;
    const s = 0.7, l = 0.62;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if      (hue < 60)  { r = c; g = x; }
    else if (hue < 120) { r = x; g = c; }
    else if (hue < 180) { g = c; b = x; }
    else if (hue < 240) { g = x; b = c; }
    else if (hue < 300) { r = x; b = c; }
    else                { r = c; b = x; }
    const toH = v => Math.round((v + m) * 255).toString(16).padStart(2, '0');
    return '#' + toH(r) + toH(g) + toH(b);
}

async function ghFetch(path) {
    const cached = cacheGet(path);
    if (cached) return cached;
    const headers = buildHeaders();
    const res = await fetch('https://api.github.com' + path, { headers });
    if (!res.ok) throw new Error('GitHub API error ' + res.status);
    const data = await res.json();
    cacheSet(path, data);
    return data;
}

async function ghFetchAllPages(basePath, maxPages = 10) {
    const cacheKey = `${basePath}::all-pages`;
    const cached = cacheGet(cacheKey);
    if (cached) return cached;

    const headers = buildHeaders();
    const rows = [];

    for (let page = 1; page <= maxPages; page++) {
        const joiner = basePath.includes('?') ? '&' : '?';
        const url = `https://api.github.com${basePath}${joiner}page=${page}`;
        const res = await fetch(url, { headers });
        if (!res.ok) throw new Error('GitHub API error ' + res.status);
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) break;
        rows.push(...data);
        if (data.length < 100) break;
    }

    cacheSet(cacheKey, rows);
    return rows;
}

async function getCommitCountFromStats(repoName) {
    const cacheKey = `/repos/${USERNAME}/${repoName}/stats/contributors/count`;
    const cached = cacheGet(cacheKey);
    if (typeof cached === 'number') return cached;

    const headers = buildHeaders();
    const path = `/repos/${USERNAME}/${repoName}/stats/contributors`;

    for (let attempt = 0; attempt < 4; attempt++) {
        const res = await fetch('https://api.github.com' + path, { headers });

        if (res.status === 202) {
            await new Promise(resolve => setTimeout(resolve, 1200));
            continue;
        }

        if (res.status === 409 || res.status === 404) {
            cacheSet(cacheKey, 0);
            return 0;
        }

        if (!res.ok) throw new Error('GitHub stats API error ' + res.status);

        const data = await res.json();
        const count = Array.isArray(data)
            ? data.reduce((sum, contributor) => sum + (contributor.total || 0), 0)
            : 0;
        cacheSet(cacheKey, count);
        return count;
    }

    throw new Error('GitHub stats API still processing');
}

async function getCommitCount(repoName) {
    const cacheKey = `/repos/${USERNAME}/${repoName}/commits/count`;
    const cached = cacheGet(cacheKey);
    if (typeof cached === 'number') return cached;

    try {
        const statsCount = await getCommitCountFromStats(repoName);
        cacheSet(cacheKey, statsCount);
        return statsCount;
    } catch (_) {
        const headers = buildHeaders();
        const res = await fetch(`https://api.github.com/repos/${USERNAME}/${repoName}/commits?per_page=1`, { headers });

        if (res.status === 409 || res.status === 404) {
            cacheSet(cacheKey, 0);
            return 0;
        }

        if (!res.ok) throw new Error('GitHub commits API error ' + res.status);

        const link = res.headers.get('link') || '';
        const lastPageMatch = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
        if (lastPageMatch) {
            const count = parseInt(lastPageMatch[1], 10) || 0;
            cacheSet(cacheKey, count);
            return count;
        }

        const data = await res.json();
        const count = Array.isArray(data) ? data.length : 0;
        cacheSet(cacheKey, count);
        return count;
    }
}

async function fetchRepos() {
    let repoList = [];
    if (TOKEN) {
        repoList = await ghFetchAllPages('/user/repos?visibility=all&affiliation=owner&sort=pushed&per_page=100');
        repoList = repoList.filter(r => (r?.owner?.login || '').toLowerCase() === String(USERNAME || '').toLowerCase());
    } else {
        repoList = await ghFetchAllPages('/users/' + USERNAME + '/repos?sort=pushed&per_page=100');
    }

    const filtered = repoList
        .filter(r => !r.fork)
        .slice(0, MAX_REPOS);
    const loaded = [];

    for (const r of filtered) {
        let contribs = [];
        try {
            const cs = await ghFetch(`/repos/${USERNAME}/${r.name}/contributors?per_page=5`);
            if (Array.isArray(cs)) {
                contribs = cs.slice(0, 4).map(c => ({ name: c.login, color: nameToHex(c.login) }));
            }
        } catch (_) {}
        if (!contribs.length) contribs = [{ name: USERNAME, color: nameToHex(USERNAME) }];

        let commits = 0;
        try {
            commits = await getCommitCount(r.name);
        } catch (_) {}

        const pushed = r.pushed_at ? Math.floor((Date.now() - new Date(r.pushed_at)) / 86400000) : 0;
        loaded.push({
            name: r.name,
            lang: r.language || 'Unknown',
            commits,
            stars: r.stargazers_count || 0,
            desc: r.description || '',
            lastActive: Math.max(0, pushed),
            contribs,
        });
    }
    return loaded;
}

const GithubContributionSection = () => {
    const iframeRef = useRef(null);
    const reposRef  = useRef(null);
    const iframeReadyRef = useRef(false);
    const [status, setStatus] = useState('Loading your constellation…');
    const [isRefreshing, setIsRefreshing] = useState(false);

    function postDataToIframe() {
        if (!iframeReadyRef.current) return;
        if (!reposRef.current) return;
        iframeRef.current?.contentWindow?.postMessage(
            { type: 'REPOS_DATA', repos: reposRef.current },
            '*'
        );
    }

    async function loadLiveData(forceRefresh = false) {
        if (forceRefresh) {
            clearGitHubLocalCache();
        }

        setStatus(forceRefresh ? 'Refreshing GitHub data…' : 'Loading your constellation…');
        setIsRefreshing(true);

        try {
            const repos = await fetchRepos();
            reposRef.current = repos;
            saveSnapshot(repos);
            setStatus('');
            postDataToIframe();
        } catch (err) {
            reposRef.current = [];
            setStatus('Could not load live data: ' + err.message);
            postDataToIframe();
        } finally {
            setIsRefreshing(false);
        }
    }

    // Fetch repos once
    useEffect(() => {
        const snapshot = loadSnapshot();
        if (snapshot && snapshot.length) {
            reposRef.current = snapshot;
            setStatus('');
            postDataToIframe();
            return;
        }

        loadLiveData(false);
    }, []);

    // Listen for iframe "ready" signal
    useEffect(() => {
        function onMsg(e) {
            if (e.data?.type === 'CONSTELLATION_READY') {
                iframeReadyRef.current = true;
                postDataToIframe();
            }
        }
        window.addEventListener('message', onMsg);
        return () => window.removeEventListener('message', onMsg);
    }, []);

    return (
        <section className="github-contrib-wrap">
            <div className="github-contrib-head">
                <h2 className="github-contrib-title">Interactive GitHub Constellation</h2>
                <p className="github-contrib-subtitle">
                    Live repository activity mapped as a navigable star system.
                </p>
            </div>
            <div className="github-contrib-actions">
                {status ? <p className="github-contrib-status">{status}</p> : <span />}
                <div className="github-contrib-buttons">
                    <button
                        type="button"
                        className="github-contrib-refresh"
                        onClick={() => loadLiveData(true)}
                        disabled={isRefreshing}
                    >
                        {isRefreshing ? 'Refreshing…' : 'Refresh Data'}
                    </button>
                    <Link to="/lab" className="github-contrib-lab-btn">
                        Open Lab
                    </Link>
                </div>
            </div>
            <div className="github-contrib-card">
                <iframe
                    ref={iframeRef}
                    className="github-contrib-frame"
                    src="/github-constellation.html"
                    title="Commit Constellation"
                    loading="lazy"
                />
            </div>
            <div className="github-contrib-footer">
                <p className="github-contrib-footer-title">Now Building: GitHub Population Universe</p>
                <div className="github-contrib-footer-legend" aria-label="GitHub population visualization legend">
                    <span className="github-contrib-footer-pill">Country = Universe</span>
                    <span className="github-contrib-footer-pill">City = Planet</span>
                    <span className="github-contrib-footer-pill">Users = Population</span>
                    <span className="github-contrib-footer-pill">Repo = Individual Star</span>
                </div>
                <div className="github-contrib-footer-actions">
                    <a
                        href="https://gremote-universe.vercel.app/"
                        target="_blank"
                        rel="noreferrer"
                        className="github-contrib-footer-link"
                    >
                        Visit GRemote Universe
                    </a>
                    <Link to="/lab" className="github-contrib-footer-link">Explore My Lab</Link>
                </div>
            </div>
        </section>
    );
};

export default GithubContributionSection;
