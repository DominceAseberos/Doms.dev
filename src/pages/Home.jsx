import React from 'react';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
            <header className="mb-12">
                <img
                    src="/profile.png"
                    alt="Profile"
                    className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500/30 shadow-2xl shadow-blue-500/20"
                />
                <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    DOMINCE
                </h1>
                <p className="text-xl opacity-60 mt-2 font-medium tracking-widest uppercase">
                    V4 Redesign in Progress
                </p>
            </header>

            <main className="max-w-2xl w-full grid gap-6">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                    <h2 className="text-2xl font-bold mb-4">Welcome to the New Slate</h2>
                    <p className="opacity-70 leading-relaxed">
                        The previous version has been archived. We are starting with a clean,
                        static boilerplate to build a more optimized and modern portfolio.
                    </p>
                </div>

                <div className="flex justify-center gap-4">
                    <div className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors font-bold cursor-pointer">
                        Get Started
                    </div>
                    <div className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors font-bold cursor-pointer">
                        View Projects
                    </div>
                </div>
            </main>

            <footer className="mt-20 opacity-30 text-sm">
                &copy; {new Date().getFullYear()} Doms.dev • Version 4.0.0-alpha
            </footer>
        </div>
    );
};

export default Home;
