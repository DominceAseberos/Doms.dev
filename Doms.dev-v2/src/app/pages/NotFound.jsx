import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[#0a0a0a] text-white space-y-6">
            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center">
                <span className="text-2xl font-black">?</span>
            </div>
            <div className="space-y-2">
                <h1 className="text-2xl font-black tracking-tighter text-white">
                    404
                </h1>
                <p className="text-xs uppercase tracking-widest opacity-50 font-mono max-w-xs mx-auto">
                    Oops! It looks like this page took a detour. Let's head back to the homepage.
                </p>
            </div>
            <button
                onClick={() => navigate('/')}
                className="px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] transition-all active:scale-95 bg-white text-black hover:bg-white/90"
            >
                Return Home
            </button>
        </div>
    );
};

export default NotFound;
