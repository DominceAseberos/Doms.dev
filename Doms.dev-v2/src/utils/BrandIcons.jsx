import React from 'react';

// Helper to handle size prop like Lucide
// Default to 24 if not provided, but allow override
const IconBase = ({ color, size = 24, style, children, viewBox, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: color, ...style }}
        {...props}
    >
        {children}
    </svg>
);

export const ReactIcon = (props) => (
    <IconBase viewBox="-10.5 -9.45 21 18.9" strokeWidth="1" {...props}>
        <circle cx="0" cy="0" r="2" fill="currentColor"></circle>
        <g stroke="currentColor" strokeWidth="1" fill="none">
            <ellipse rx="10" ry="4.5"></ellipse>
            <ellipse rx="10" ry="4.5" transform="rotate(60)"></ellipse>
            <ellipse rx="10" ry="4.5" transform="rotate(120)"></ellipse>
        </g>
    </IconBase>
);

export const NextJsIcon = (props) => (
    <IconBase viewBox="0 0 180 180" fill="currentColor" strokeWidth="0" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M128.166 153.303L66.7118 52.8876H52V127.112H64.9126V74.8028L119.578 163.7C122.569 161.944 125.438 159.988 128.166 157.846V153.303ZM90 14.8071C48.4735 14.8071 14.8071 48.4735 14.8071 90C14.8071 131.527 48.4735 165.193 90 165.193C131.527 165.193 165.193 131.527 165.193 90C165.193 48.4735 131.527 14.8071 90 14.8071ZM0 90C0 40.2944 40.2944 0 90 0C139.706 0 180 40.2944 180 90C180 139.706 139.706 180 90 180C40.2944 180 0 139.706 0 90ZM115.087 127.112H127.999V52.8876H115.087V127.112Z" />
    </IconBase>
);

export const TailwindIcon = (props) => (
    <IconBase viewBox="0 0 24 24" fill="currentColor" strokeWidth="0" {...props}>
        <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
    </IconBase>
);

export const FigmaIcon = (props) => (
    <IconBase viewBox="0 0 15 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
        <path d="M5 15H10V10H5C2.23858 10 0 12.2386 0 15C0 17.7614 2.23858 20 5 20V15Z" fill="currentColor" stroke="none" />
        <path d="M0 5C0 2.23858 2.23858 0 5 0H10V5H5C2.23858 5 0 2.76142 0 5Z" fill="currentColor" stroke="none" />
        <path d="M10 0H15V5H10V0Z" fill="currentColor" stroke="none" />
        <path d="M10 5H15V10H10V5Z" fill="currentColor" stroke="none" />
        <path d="M5 10C2.23858 10 0 12.2386 0 15C0 17.7614 2.23858 20 5 20V15Z" stroke="none" />
        <circle cx="7.5" cy="12.5" r="2.5" fill="currentColor" stroke="none" />
    </IconBase>
);

export const GSAPIcon = (props) => (
    <IconBase viewBox="0 0 24 24" fill="currentColor" strokeWidth="0" {...props}>
        <path d="M10.8 17.525c.375 1.5 2.1 2.4 4.5 2.4 2.475 0 4.125-1.05 4.125-2.625 0-1.5-1.05-2.25-3.3-2.775l-2.025-.45c-4.2-.975-5.925-2.625-5.925-5.925C8.175 4.65 11.175 3 14.85 3c3.9 0 6.6 2.025 6.675 5.025h-3.9c-.15-1.35-1.275-2.025-2.775-2.025-1.575 0-2.625.825-2.625 2.175 0 1.35.975 1.95 3.3 2.475l2.025.45c4.35 1.05 5.925 2.925 5.925 6.075 0 3.75-3.225 5.625-7.125 5.625-4.575 0-7.725-2.1-7.8-5.25h3.075z" />
    </IconBase>
);

export const SupabaseIcon = (props) => (
    <IconBase viewBox="0 0 24 24" fill="currentColor" strokeWidth="0" {...props}>
        <path d="M14.658 2.316a1.107 1.107 0 0 1 1.942.502L18 10h-5.23l2.805-7.684Zm-4.99 3.064-7.58 13.9a1.096 1.096 0 0 0 1.258 1.54l10.278-3.08-1.574 5.2a1.107 1.107 0 0 0 1.97 1.008l4.472-8.312a1.107 1.107 0 0 0-.964-1.626h-4.887l1.722-5.696a1.107 1.107 0 0 0-1.89-1.09l-2.815 5.156Z" />
    </IconBase>
);
