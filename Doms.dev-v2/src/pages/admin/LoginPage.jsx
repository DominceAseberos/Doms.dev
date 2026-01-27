import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { authService } from '../../services/authService';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const formRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        gsap.fromTo(formRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
        );
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await authService.signIn(email, password);
            navigate('/admin', { replace: true });
        } catch (err) {
            setError(err.message || 'Failed to sign in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0a]"
            style={{
                background: `linear-gradient(to bottom, rgba(var(--body-Linear-1-rgb)), rgba(var(--body-Linear-2-rgb)))`
            }}
        >
            <div
                ref={formRef}
                className="w-full max-w-md p-8 rounded-2xl border border-white/5 space-y-6"
                style={{
                    background: `linear-gradient(to bottom, rgba(var(--box-Linear-1-rgb)), rgba(var(--box-Linear-2-rgb)))`
                }}
            >
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black tracking-tighter" style={{ color: 'rgb(var(--contrast-rgb))' }}>
                        ADMIN ACCESS
                    </h1>
                    <p className="text-xs uppercase tracking-widest opacity-50 font-mono">
                        Portfolio Management Terminal
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-widest opacity-60">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors"
                            placeholder="admin@doms.dev"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-widest opacity-60">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="text-red-400 text-xs font-medium bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 disabled:opacity-50 hover:cursor-pointer"
                        style={{
                            background: `rgb(var(--contrast-rgb))`,
                            color: '#000'
                        }}
                    >
                        {loading ? 'Authenticating...' : 'Authorize Login'}
                    </button>
                </form>

                <div className="pt-4 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
