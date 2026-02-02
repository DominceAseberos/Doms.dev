import React from "react";

const TextFeed = ({ textFeedRef }) => {
    const text = "FEED";

    return (
        <div
            ref={textFeedRef}
            className="flex flex-col h-full w-full rounded-2xl items-center justify-center py-2"
            style={{
                background: `linear-gradient(to bottom, rgb(var(--box-Linear-1-rgb)), rgb(var(--box-Linear-2-rgb)))`
            }}
        >
            <div className="flex flex-col gap-1">
                {text.split("").map((letter, index) => (
                    <span
                        key={index}
                        className="font-bold text-2xl font-playfair text-reveal"
                        style={{
                            color: 'rgb(var(--contrast-rgb))',
                            opacity: 0
                        }}
                    >
                        {letter}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default TextFeed;
