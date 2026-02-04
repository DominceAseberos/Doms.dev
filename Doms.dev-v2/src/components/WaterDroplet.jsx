import React, { forwardRef } from 'react';

const WaterDroplet = forwardRef((props, ref) => {
    return (
        <div className="fixed inset-0 pointer-events-none z-[5]" aria-hidden="true">
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid slice"
                className="overflow-visible"
            >
                <circle
                    ref={el => { if (ref) ref.current[0] = el }}
                    cx="50"
                    cy="50"
                    r="0"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="0.5"
                />
                <circle
                    ref={el => { if (ref) ref.current[1] = el }}
                    cx="50"
                    cy="50"
                    r="0"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="0.5"
                />
                <circle
                    ref={el => { if (ref) ref.current[2] = el }}
                    cx="50"
                    cy="50"
                    r="0"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="0.5"
                />
            </svg>
        </div>
    );
});

export default WaterDroplet;
