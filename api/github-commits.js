const CACHE_SECONDS = 10 * 60;
const MAX_REPOS = 12;
const MAX_COMMITS_PER_REPO = 3;
const MAX_COMMITS = 5;

function parseRepos(value) {
  if (!value || typeof value !== 'string') return [];

  return [
    ...new Set(
      value
        .split(',')
        .map((repo) => repo.trim())
        .filter((repo) => /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo))
    ),
  ].slice(0, MAX_REPOS);
}

async function fetchRepoCommits(repoFullName) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'doms-dev-portfolio',
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(
    `https://api.github.com/repos/${repoFullName}/commits?per_page=${MAX_COMMITS_PER_REPO}`,
    { headers }
  );

  if (!response.ok) return [];

  const rows = await response.json();
  if (!Array.isArray(rows)) return [];

  return rows.map((item) => ({
    message: item?.commit?.message || 'No commit message',
    repo: repoFullName,
    sha: item?.sha,
    time: item?.commit?.author?.date || item?.commit?.committer?.date,
    url: item?.html_url || `https://github.com/${repoFullName}/commit/${item?.sha}`,
  }));
}

export default async function handler(request, response) {
  const repos = parseRepos(request.query.repos);

  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Cache-Control', `s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS}`);

  if (request.method === 'OPTIONS') {
    response.status(204).end();
    return;
  }

  if (request.method !== 'GET') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!repos.length) {
    response.status(400).json({ error: 'No valid repositories provided' });
    return;
  }

  try {
    const commits = await Promise.all(repos.map((repo) => fetchRepoCommits(repo)));
    const sorted = commits
      .flat()
      .filter((commit) => commit.sha && commit.time)
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, MAX_COMMITS);

    response.status(200).json({ commits: sorted });
  } catch (error) {
    response.status(500).json({ error: 'Could not load GitHub commits' });
  }
}
