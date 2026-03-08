import React, { useEffect, useRef } from 'react';

const sequence = [
    ['p20', 0, -18],
    ['p19', 80, -15],
    ['p18', 180, -20],
    ['p17', 260, -14],
    ['p0', 360, -25],
    ['p1', 430, -20],
    ['p2', 500, -12],
    ['p3', 560, -10],
    ['p4', 620, -15],
    ['p5', 700, -14],
    ['p6', 760, -12],
    ['p7', 820, -12],
    ['p8', 900, -16],
    ['p9', 970, -14],
    ['p10', 1060, -18],
    ['p11', 1130, -15],
    ['p12', 1220, -18],
    ['p13', 1290, -15],
    ['p21', 1370, -22],
    ['p22', 1460, -28],
    ['p23', 1530, -22],
    ['p15', 1640, -20],
    ['p14', 1730, -18],
    ['p16', 1870, -24],
];

const AnimatedLogo = () => {
    const svgRef = useRef(null);

    useEffect(() => {
        let timers = [];
        let isCancelled = false;

        const animatePiece = (id, dropY) => {
            if (isCancelled || !svgRef.current) return;
            const el = svgRef.current.querySelector(`#${id}`);
            if (!el) return;

            el.style.transition = 'none';
            el.style.opacity = '0';
            el.style.transform = `translateY(${dropY}px)`;

            void el.offsetWidth;

            el.style.transition = 'opacity 0.28s ease-out, transform 0.32s cubic-bezier(0.22, 0.61, 0.36, 1)';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0px)';
        };

        const resetAll = () => {
            if (isCancelled || !svgRef.current) return;
            sequence.forEach(([id]) => {
                const el = svgRef.current.querySelector(`#${id}`);
                if (el) {
                    el.style.transition = 'none';
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(0px)';
                }
            });
        };

        const startAnimation = () => {
            timers.forEach(clearTimeout);
            timers = [];
            resetAll();

            if (isCancelled) return;

            timers.push(setTimeout(() => {
                sequence.forEach(([id, delay, dropY]) => {
                    if (isCancelled) return;
                    timers.push(setTimeout(() => animatePiece(id, dropY), delay));
                });
            }, 120));
        };

        startAnimation();
        // Loop every 3s
        const intervalId = setInterval(startAnimation, 3000);

        return () => {
            isCancelled = true;
            clearInterval(intervalId);
            timers.forEach(clearTimeout);
        };
    }, []);

    return (
        <svg
            ref={svgRef}
            className="w-[300px] h-[336px] drop-shadow-[0_0_30px_rgba(160,193,217,0.25)]"
            viewBox="0 0 253 283"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <style>
                {`
                    svg path, svg g {
                        opacity: 0;
                        transform-origin: center;
                    }
                `}
            </style>
            {/* Group 1: Left spine base (dark blue triangle) */}
            <path id="p0" d="M0 0L8.09639 104H42L0 0Z" fill="url(#paint4_linear_228_75)" />
            <path id="p1" d="M77.75 90.5L40.75 104L0.25 0.5L77.75 90.5Z" fill="url(#paint5_linear_228_75)" />
            <path id="p2" d="M42.25 104H8.25L42.25 144V104Z" fill="url(#paint6_linear_228_75)" />
            <path id="p3" d="M63.25 147.5L42.25 104.5V144.5L57.75 155.5L63.25 147.5Z" fill="url(#paint7_linear_228_75)" />
            <path id="p4" d="M77.25 90L41.25 103.5L63.25 148L82.25 122.625L77.25 90Z" fill="url(#paint8_linear_228_75)" />
            <path id="p5" d="M10.25 200V130L29.25 163.19L10.25 200Z" fill="url(#paint9_linear_228_75)" />
            <path id="p6" d="M29.45 163L10.25 130L46.25 163H29.45Z" fill="url(#paint10_linear_228_75)" />
            <path id="p7" d="M10.25 200L29.45 163H46.25L10.25 200Z" fill="url(#paint11_linear_228_75)" />
            <path id="p8" d="M83.75 138.5L43.25 215L37.25 182.5L83.75 138.5Z" fill="url(#paint14_linear_228_75)" />
            <path id="p9" d="M84.25 210.5V137.5L42.75 216L84.25 210.5Z" fill="url(#paint15_linear_228_75)" />
            <path id="p10" d="M11.25 209.5L37.25 183L43.25 214.5L14.25 282.5L11.25 209.5Z" fill="url(#paint12_linear_228_75)" />
            <path id="p11" d="M42.75 215.5L14.25 282L84.25 210.5L42.75 215.5Z" fill="url(#paint13_linear_228_75)" />
            <path id="p12" d="M28.25 282L95.7206 249L102.25 282H28.25Z" fill="url(#paint0_linear_228_75)" />
            <path id="p13" d="M29.25 283L96.25 249L93.5264 215L29.25 283Z" fill="url(#paint1_linear_228_75)" />
            <path id="p14" d="M101.396 280.173L95.3963 248.746C95.3103 248.296 95.5236 247.853 95.9393 247.659C100.805 245.389 130.062 231.661 139.63 225.3C150.079 218.354 156.112 214.595 165.608 206.4C175.105 198.205 180.4 191.961 188.34 183.18C196.279 174.399 201.149 169.733 207.823 159.96C214.294 150.486 226.53 121.827 227.272 120.083C227.296 120.027 227.314 119.97 227.327 119.91L232.688 95.5976C232.887 94.696 234.08 94.5247 234.507 95.3434C236.558 99.2793 240.603 107.388 242.461 113.52C244.776 121.156 246.012 137.656 246.219 140.604C246.239 140.896 246.13 141.177 245.921 141.381L103.076 280.701C102.506 281.258 101.545 280.956 101.396 280.173Z" fill="url(#paint2_linear_228_75)" />
            <path id="p15" d="M95.8268 247.487L93.3452 216.2C93.2957 215.576 93.8052 215.055 94.4287 215.108C101.085 215.665 134.245 217.757 150.423 205.825C166.011 194.329 174.802 163.498 175.698 160.233C175.751 160.038 175.856 159.882 176.009 159.75L226.82 115.956C227.632 115.257 228.881 116.172 228.476 117.163C227.721 119.009 226.813 121.322 225.935 123.794C221.951 135.006 217.607 144.961 211.372 155.095C205.801 164.15 198.427 172.905 198.427 172.905C198.427 172.905 185.372 187.619 178.47 194.492C171.243 201.691 166.236 206.463 159.053 212.302C151.108 218.76 136.939 227.413 136.939 227.413L97.2897 248.293C96.6542 248.628 95.8836 248.203 95.8268 247.487Z" fill="url(#paint3_linear_228_75)" />
            <path id="p16" fillRule="evenodd" clipRule="evenodd" d="M249.35 156.462C250.27 155.561 251.875 156.032 251.989 157.402C252.827 167.458 253.995 211.694 214.529 245.885C175.695 279.527 136.442 280.327 126.717 279.948C125.29 279.892 124.786 278.225 125.736 277.296L249.35 156.462ZM234.017 189.362C233.465 189.035 232.714 189.063 232.145 189.593L156.974 259.66C156.395 260.201 156.327 260.96 156.632 261.532C156.94 262.108 157.615 262.469 158.389 262.262C166.891 259.99 188.445 253.091 205.936 237.838C223.756 222.3 232.044 199.649 234.669 191.124C234.901 190.369 234.573 189.691 234.017 189.362Z" fill="url(#paint16_linear_228_75)" />
            <path id="p17" d="M79.9697 36.8798L84.1056 72.2652C84.1677 72.7968 84.6363 73.1864 85.1706 73.1541C91.1872 72.7908 124.098 71.1902 138.803 78.5899C149.486 83.9653 159.738 99.3549 165.492 109.236C166.1 110.279 167.16 109.814 166.645 108.723C161.96 98.7775 151.937 82.5171 132.277 68.4389C106.428 49.9287 87.022 38.963 81.4071 35.8928C80.7022 35.5073 79.8764 36.0817 79.9697 36.8798Z" fill="url(#paint17_linear_228_75)" />
            <path id="p18" d="M132.713 54.2611C175.895 98.3695 167.614 124 167.614 124C167.614 124 167.614 94.7931 138.037 75.1231C108.46 55.4532 81.25 36.9754 81.25 36.9754V3C81.25 3 89.5314 10.1527 132.713 54.2611Z" fill="url(#paint18_linear_228_75)" />
            <path id="p19" d="M84.25 74L80.6907 35.2185L14.25 3L84.25 74Z" fill="url(#paint19_linear_228_75)" />
            <path id="p20" d="M82.25 36L14.25 3H82.25V36Z" fill="url(#paint20_linear_228_75)" />
            <path id="p21" d="M180.808 97.6601C180.808 120.382 169.364 147 169.364 147C169.364 147 184.311 97.6601 153.941 65.05C123.57 32.4398 92.25 1.99997 92.25 1.99997C92.25 1.99997 110.189 -0.021071 121.25 1.00005C132.311 2.02117 156.891 6.77096 156.891 6.77096C156.891 6.77096 173.816 14.0652 184.04 20.4035C194.264 26.7418 209.25 39.2314 209.25 39.2314L197.615 45.0743C197.615 45.0743 178.5 30.4602 164.001 24.2996C149.503 18.139 125.217 13.263 125.217 13.263C125.217 13.263 143.316 32.7393 156.891 48.3203C170.465 63.9013 180.808 74.9379 180.808 97.6601Z" fill="url(#paint16_linear_228_75)" opacity="0.6" />
            <path id="p22" d="M179.25 48L188.25 79.5L177.75 121.5L172.25 140.5L237.75 21L197.75 61.5L179.25 48Z" fill="url(#paint22_linear_228_75)" />
            <path id="p23" d="M237.25 22L172.25 140.5L222.25 89L237.25 22Z" fill="url(#paint23_linear_228_75)" />

            <defs>
                <linearGradient id="paint0_linear_228_75" x1="82.6929" y1="245.769" x2="82.7936" y2="278.309" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9FC1D9" />
                    <stop offset="1" stopColor="#6C8CB1" />
                </linearGradient>
                <linearGradient id="paint1_linear_228_75" x1="78.5429" y1="208.343" x2="79.0154" y2="275.392" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9FC1D9" />
                    <stop offset="1" stopColor="#6C8CB1" />
                </linearGradient>
                <linearGradient id="paint2_linear_228_75" x1="237.049" y1="123.78" x2="107.4" y2="275.649" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#CEE2F0" />
                    <stop offset="0.504248" stopColor="#A4BACD" />
                    <stop offset="1" stopColor="#BAC9DA" />
                </linearGradient>
                <linearGradient id="paint3_linear_228_75" x1="250.746" y1="103.825" x2="96.9365" y2="240.265" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#D4E3EE" />
                    <stop offset="0.695116" stopColor="#7D9DBA" />
                    <stop offset="1" stopColor="#AABACC" />
                </linearGradient>
                <linearGradient id="paint4_linear_228_75" x1="1.38689e-06" y1="-44.932" x2="20.9049" y2="104.013" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#18366D" />
                    <stop offset="1" stopColor="#9ABFD8" />
                </linearGradient>
                <linearGradient id="paint5_linear_228_75" x1="3.75" y1="-8.5" x2="38" y2="104" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3477A4" />
                    <stop offset="1" stopColor="#9ABFD8" />
                </linearGradient>
                <linearGradient id="paint6_linear_228_75" x1="42.25" y1="98" x2="31.202" y2="130.484" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9DADC4" />
                    <stop offset="1" stopColor="#7F9BC3" />
                </linearGradient>
                <linearGradient id="paint7_linear_228_75" x1="52.75" y1="104.5" x2="52.75" y2="155.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#A5BBD9" />
                    <stop offset="1" stopColor="#6E8B9F" />
                </linearGradient>
                <linearGradient id="paint8_linear_228_75" x1="61.75" y1="90" x2="65.25" y2="171.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#A6C8DF" />
                    <stop offset="1" stopColor="#728FA4" />
                </linearGradient>
                <linearGradient id="paint9_linear_228_75" x1="15.5938" y1="165" x2="0.75" y2="165" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#A0AEC0" />
                    <stop offset="1" stopColor="#737373" />
                </linearGradient>
                <linearGradient id="paint10_linear_228_75" x1="19.85" y1="134.8" x2="34.85" y2="163.6" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7A9EBE" />
                    <stop offset="1" stopColor="#C5CFD5" />
                </linearGradient>
                <linearGradient id="paint11_linear_228_75" x1="39.65" y1="155.721" x2="21.3349" y2="191.955" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#D9D9D9" />
                    <stop offset="1" stopColor="#8DABC4" />
                </linearGradient>
                <linearGradient id="paint12_linear_228_75" x1="27.25" y1="183" x2="27.25" y2="282.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#89A2C4" />
                    <stop offset="1" stopColor="#6486AC" />
                </linearGradient>
                <linearGradient id="paint13_linear_228_75" x1="65.75" y1="203.5" x2="66.25" y2="274" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9FC1D9" />
                    <stop offset="1" stopColor="#6C8CB1" />
                </linearGradient>
                <linearGradient id="paint14_linear_228_75" x1="71.4607" y1="131.01" x2="72.3223" y2="206.435" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9FC1D9" />
                    <stop offset="1" stopColor="#6C8CB1" />
                </linearGradient>
                <linearGradient id="paint15_linear_228_75" x1="73.2821" y1="129.815" x2="72.0519" y2="216.011" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#C9E9FF" />
                    <stop offset="1" stopColor="#91A9C5" />
                </linearGradient>
                <linearGradient id="paint16_linear_228_75" x1="252.25" y1="147.5" x2="136.665" y2="279.926" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#D1DBE2" />
                    <stop offset="0.5" stopColor="#B4BBC2" />
                    <stop offset="1" stopColor="#9FBCDD" />
                </linearGradient>
                <linearGradient id="paint17_linear_228_75" x1="123.97" y1="15.8921" x2="137.034" y2="123.373" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9FC1D9" />
                    <stop offset="1" stopColor="#6C8CB1" />
                </linearGradient>
                <linearGradient id="paint18_linear_228_75" x1="92.4891" y1="12.5369" x2="189.201" y2="138.965" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#B0D8F3" />
                    <stop offset="1" stopColor="#6C8CB1" />
                </linearGradient>
                <linearGradient id="paint19_linear_228_75" x1="103.826" y1="27.4622" x2="27.2871" y2="18.0278" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9FC1D9" />
                    <stop offset="1" stopColor="#6C8CB1" />
                </linearGradient>
                <linearGradient id="paint20_linear_228_75" x1="89.4712" y1="14.1964" x2="32.303" y2="30.6962" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9FC1D9" />
                    <stop offset="1" stopColor="#6C8CB1" />
                </linearGradient>
                <linearGradient id="paint22_linear_228_75" x1="237.25" y1="11" x2="181.172" y2="116.988" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#D4EEFF" />
                    <stop offset="1" stopColor="#A9B8C9" />
                </linearGradient>
                <linearGradient id="paint23_linear_228_75" x1="238.75" y1="23.5" x2="179.699" y2="132.016" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#C6D2DA" />
                    <stop offset="1" stopColor="#9DB7D5" />
                </linearGradient>
            </defs>
        </svg>
    );
};

export default AnimatedLogo;
