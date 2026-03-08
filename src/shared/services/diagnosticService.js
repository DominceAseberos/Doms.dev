import { supabase } from '@shared/lib/supabaseClient';

/**
 * diagnosticService - Production diagnostic and analytics system
 * Features:
 * - Breadcrumb tracking (last 5 pages in sessionStorage)
 * - Visit logging (once per session)
 * - Error logging with journey context
 * - Admin queries for dashboard
 */

const STORAGE_KEYS = {
    BREADCRUMBS: 'diag:paths',
    VISIT_LOGGED: 'diag:visit_logged',
    SESSION_ID: 'diag:session_id'
};

const MAX_BREADCRUMBS = 5;

/**
 * Generates a unique session ID
 */
const getOrCreateSessionId = () => {
    try {
        let sessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION_ID);
        if (!sessionId) {
            sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            sessionStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
        }
        return sessionId;
    } catch (e) {
        // Fallback if sessionStorage unavailable
        return `fallback-${Date.now()}`;
    }
};

/**
 * Tracks page visit in breadcrumb trail
 * @param {string} pathname - Current page path
 */
export const trackPageVisit = (pathname) => {
    if (typeof window === 'undefined') return;

    try {
        const raw = sessionStorage.getItem(STORAGE_KEYS.BREADCRUMBS);
        const breadcrumbs = raw ? JSON.parse(raw) : [];

        // Only add if different from last entry
        const lastPath = breadcrumbs[breadcrumbs.length - 1];
        if (lastPath !== pathname) {
            breadcrumbs.push(pathname);
        }

        // Keep only last N paths
        const trimmed = breadcrumbs.slice(-MAX_BREADCRUMBS);
        sessionStorage.setItem(STORAGE_KEYS.BREADCRUMBS, JSON.stringify(trimmed));
    } catch (e) {
        console.warn('[diagnosticService] trackPageVisit error:', e);
    }
};

/**
 * Gets current breadcrumb trail
 * @returns {string[]} Array of last visited paths
 */
const getBreadcrumbs = () => {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEYS.BREADCRUMBS);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
};

/**
 * Logs a site visit (once per session)
 */
// In-memory cache to prevent duplicate logs for the same path/session overlap
let lastLoggedPath = null;
let lastLoggedTime = 0;

/**
 * Logs a site visit (once per session)
 */
export const logVisit = async () => {
    if (typeof window === 'undefined') return;

    try {
        const sessionId = getOrCreateSessionId();
        const pagePath = window.location.pathname;
        const now = Date.now();

        // DEBOUNCE / DEDUPE:
        // If we successfully logged this path recently (within 500ms), skip it.
        // This handles React Strict Mode double-invocation and rapid re-renders.
        if (lastLoggedPath === pagePath && (now - lastLoggedTime < 500)) {
            if (import.meta.env.DEV) {
                console.log('[diagnosticService] Skipping duplicate logVisit for:', pagePath);
            }
            return;
        }

        // 1. Get current breadcrumbs from session storage (this is the most up-to-date local state)
        // We use the existing trackPageVisit logic which already maintains the breadcrumbs
        let breadcrumbs = getBreadcrumbs();

        // If the current page isn't in breadcrumbs yet (first load edge case), add it
        if (breadcrumbs[breadcrumbs.length - 1] !== pagePath) {
            trackPageVisit(pagePath);
            breadcrumbs = getBreadcrumbs();
        }

        // Update cache before async call to prevent race conditions
        lastLoggedPath = pagePath;
        lastLoggedTime = now;

        // 2. Upsert the session row
        // We use upsert so it creates row if new, or updates journey if existing
        const { error } = await supabase
            .from('site_analytics')
            .upsert({
                session_id: sessionId,
                page_path: pagePath, // Current page
                journey: breadcrumbs, // Full history
                // We don't update created_at, so we know when session started
            }, { onConflict: 'session_id' });

        if (error) {
            console.error('[diagnosticService] logVisit error:', error);
            // Invalidate cache on error so we can try again if needed
            lastLoggedPath = null;
        }
    } catch (err) {
        console.error('[diagnosticService] logVisit exception:', err);
    }
};

/**
 * Logs an error with breadcrumb context
 * @param {Error} error - The error object
 * @param {Object} errorInfo - React error info (componentStack)
 */
export const logError = async (error, errorInfo = {}) => {
    if (import.meta.env.DEV) {
        console.warn('[diagnosticService] Error caught:', error);
    }

    try {
        const breadcrumbs = getBreadcrumbs();

        await supabase
            .from('error_logs')
            .insert([{
                message: error?.message || 'Unknown Error',
                stack_trace: errorInfo?.componentStack || error?.stack || 'No stack trace available',
                url: typeof window !== 'undefined' ? window.location.href : null,
                journey: breadcrumbs,
                user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
                component_name: errorInfo?.component || null,
                resolved: false
            }]);
    } catch (e) {
        // Failsafe: If logging fails, don't crash the app further
        console.error('[diagnosticService] Failed to send error log:', e);
    }
};

/**
 * Fetches all error logs (Admin only)
 * @param {boolean} resolved - Filter by resolved status
 */
export const getLogs = async (resolved = false) => {
    const { data, error } = await supabase
        .from('error_logs')
        .select('*')
        .eq('resolved', resolved)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

/**
 * Gets count of unresolved errors (Admin only)
 */
export const getUnresolvedCount = async () => {
    const { count, error } = await supabase
        .from('error_logs')
        .select('*', { count: 'exact', head: true })
        .eq('resolved', false);

    if (error) throw error;
    return count || 0;
};

/**
 * Gets total visit count (Admin only)
 */
export const getVisitCount = async () => {
    const { count, error } = await supabase
        .from('site_analytics')
        .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
};

/**
 * Marks an error log as resolved (Admin only)
 * @param {string} id - Log ID
 */
export const resolveLog = async (id) => {
    const { error } = await supabase
        .from('error_logs')
        .update({ resolved: true })
        .eq('id', id);

    if (error) throw error;
    return true;
};

export const diagnosticService = {
    trackPageVisit,
    logVisit,
    logError,
    getLogs,
    getUnresolvedCount,
    getVisitCount,
    resolveLog,
    resolveLogs: async (ids) => {
        const { error } = await supabase
            .from('error_logs')
            .update({ resolved: true })
            .in('id', ids);
        if (error) throw error;
        return true;
    },
    deleteLogs: async (ids) => {
        const { error } = await supabase
            .from('error_logs')
            .delete()
            .in('id', ids);
        if (error) throw error;
        return true;
    }
};
