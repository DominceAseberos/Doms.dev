import React from "react";
import LiquidBackground from "../../shared/components/LiquidBackground";

const TextAboutMe = ({ textAboutMeRef }) => {
    const text = "ABOUTME"
    const sub = " GET TO KNOW ME "

    return (
        <LiquidBackground
            innerRef={textAboutMeRef}
            className="flex flex-col p-2 w-full rounded-2xl items-center justify-center relative text-center min-h-[inherit]"
        >
            <h1
                className="font-bold text-1xl tracking-tight font-playfair w-full text-reveal"
                style={{
                    color: 'rgb(var(--contrast-rgb))',
                    fontSize: 'clamp(15px, 2vw, 24px)',
                    opacity: 0
                }}
            >
                {text}
            </h1>

            <p
                className="text-gray-400 w-full font-medium mt-1 text-reveal"
                style={{ fontSize: 'clamp(12px, 2vw, 14px)', opacity: 0 }}
            >
                {sub}
            </p>
        </LiquidBackground>
    )
}
export default TextAboutMe;
