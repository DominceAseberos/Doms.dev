import React from "react";
import LiquidBackground from "../../shared/components/LiquidBackground";

const TextFeed = ({ textFeedRef }) => {
    const text = "FEED";
    const sub = ["POST", "SHARE", "KNOWLEDGE"]

    return (
        <LiquidBackground
            innerRef={textFeedRef}
            className="flex flex-col h-full w-full rounded-2xl items-center justify-center py-2"
        >
            <h1
                className="font-bold text-2xl font-playfair text-reveal"
                style={{
                    color: 'rgb(var(--contrast-rgb))',
                    opacity: 0
                }}
            >
                {text}
            </h1>

            <div className="flex flex-row gap-2">
                {sub.map((item, index) => (
                    <p
                        key={index}
                        className="text-gray-400 w-full font-medium mt-1 text-reveal"
                        style={{ fontSize: 'clamp(12px, 2vw, 14px)', opacity: 0 }}
                    >
                        {item}
                    </p>
                ))}
            </div>

        </LiquidBackground>
    );
};

export default TextFeed;
