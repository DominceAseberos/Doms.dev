import React from 'react';

/**
 * SafeErrorBoundary
 * Catches errors in complex animation or WebGL components and prevents the whole app from crashing.
 */
export default class SafeErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error safely so it can be debugged without white-screening the site
        console.error("SafeErrorBoundary caught an error in a child component:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Render the provided fallback, or null if nothing is provided
            return this.props.fallback || null;
        }

        return this.props.children;
    }
}
