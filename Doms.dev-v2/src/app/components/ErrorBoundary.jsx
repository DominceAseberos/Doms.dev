import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[#0a0a0a] text-white space-y-6">
                    <div className="w-16 h-16 rounded-full border border-red-500/50 flex items-center justify-center animate-pulse">
                        <span className="text-red-500 text-2xl font-black">!</span>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-black tracking-tighter" style={{ color: 'rgb(var(--contrast-rgb))' }}>
                            Something went wrong
                        </h1>
                        <p className="text-xs uppercase tracking-widest opacity-50 font-mono max-w-xs mx-auto">
                            Something went wrong on my end. I'm likely already looking into it—try refreshing!
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] transition-all active:scale-95"
                        style={{
                            background: `rgb(var(--contrast-rgb))`,
                            color: '#000'
                        }}
                    >
                        Try Refreshing
                    </button>

                    {process.env.NODE_ENV === 'development' && (
                        <pre className="text-left text-[10px] p-4 bg-white/5 rounded-xl border border-white/10 max-w-2xl overflow-auto opacity-40">
                            {this.state.error?.toString()}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
