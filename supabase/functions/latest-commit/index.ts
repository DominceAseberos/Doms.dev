// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GITHUB_TOKEN = Deno.env.get("GITHUB_TOKEN");
const GITHUB_USERNAME = Deno.env.get("GITHUB_USERNAME");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
};

function ghHeaders() {
    return {
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${GITHUB_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
    };
}

async function ghFetch(path: string) {
    const res = await fetch(`https://api.github.com${path}`, { headers: ghHeaders() });
    if (!res.ok) {
        throw new Error(`GitHub API error ${res.status} for ${path}`);
    }
    return await res.json();
}

type CommitInfo = {
    message: string;
    repo: string;
    sha: string;
    time: string;
    url: string;
};

serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        if (!GITHUB_TOKEN) {
            return new Response(JSON.stringify({ error: "Missing GITHUB_TOKEN in function secrets" }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const repos = await ghFetch("/user/repos?visibility=all&affiliation=owner&sort=pushed&per_page=25");
        if (!Array.isArray(repos) || repos.length === 0) {
            return new Response(JSON.stringify({ latestCommit: null }), {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const login = String(GITHUB_USERNAME || "").toLowerCase();
        const ownedRepos = repos
            .filter((repo) => !repo?.fork)
            .filter((repo) => {
                if (!login) return true;
                return String(repo?.owner?.login || "").toLowerCase() === login;
            })
            .slice(0, 15);

        const commits = await Promise.all(
            ownedRepos.map(async (repo): Promise<CommitInfo | null> => {
                try {
                    const rows = await ghFetch(`/repos/${repo.full_name}/commits?per_page=1`);
                    if (!Array.isArray(rows) || rows.length === 0) return null;
                    const row = rows[0];
                    const time = row?.commit?.author?.date || row?.commit?.committer?.date;
                    if (!row?.sha || !time) return null;

                    return {
                        message: row?.commit?.message || "No commit message",
                        repo: repo.full_name,
                        sha: row.sha,
                        time,
                        url: row?.html_url || `https://github.com/${repo.full_name}/commit/${row.sha}`,
                    };
                } catch (_) {
                    return null;
                }
            })
        );

        const latestCommit = commits
            .filter(Boolean)
            .sort((a, b) => new Date(b!.time).getTime() - new Date(a!.time).getTime())[0] || null;

        return new Response(JSON.stringify({ latestCommit }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("[latest-commit]", error);
        return new Response(
            JSON.stringify({ error: (error as Error).message || "Internal server error" }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
