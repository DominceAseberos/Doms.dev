// src/features/chat/FloatingChat.jsx
import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { gsap } from "gsap";
import ChatBot from "./ChatBot";

const FloatingChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const closeBtnRef = useRef(null);
    const dotsRef = useRef(null);
    const timelineRef = useRef(null);

    useEffect(() => {
        let idleTween;
        // Idle Animation for the horizontal dots
        if (!isOpen && dotsRef.current) {
            const dots = dotsRef.current.children;
            idleTween = gsap.to(dots, {
                opacity: 0.2,
                scale: 0.8,
                duration: 0.5,
                stagger: {
                    each: 0.15,
                    repeat: -1,
                    yoyo: true
                },
                ease: "sine.inOut"
            });
        }

        if (timelineRef.current) timelineRef.current.kill();
        const tl = gsap.timeline();
        timelineRef.current = tl;

        if (isOpen) {
            // ============ OPENING SEQUENCE ============
            gsap.set(closeBtnRef.current, { opacity: 0, scale: 0.5 });

            tl.to(dotsRef.current, { opacity: 0, duration: 0.1 })
                .to(containerRef.current, {
                    width: window.innerWidth > 768 ? "450px" : "90vw",
                    duration: 0.4,
                    ease: "power2.inOut",
                })
                .to(containerRef.current, {
                    height: "550px",
                    duration: 0.4,
                    ease: "power3.out",
                })
                .to(contentRef.current, {
                    opacity: 1,
                    display: "flex",
                    duration: 0.2
                }, "-=0.1")
                .to(closeBtnRef.current, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
        } else {
            // ============ CLOSING SEQUENCE ============
            tl.to([closeBtnRef.current, contentRef.current], {
                opacity: 0,
                duration: 0.2
            })
                .to(containerRef.current, {
                    height: "40px",
                    duration: 0.3,
                    ease: "power3.in",
                })
                .to(containerRef.current, {
                    width: "60px",
                    duration: 0.3,
                    ease: "power2.inOut",
                })
                .to(dotsRef.current, { opacity: 1, duration: 0.2 });
        }

        return () => {
            if (idleTween) idleTween.kill();
        };
    }, [isOpen]);

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none flex flex-col items-start">
            <div
                ref={containerRef}
                onClick={() => !isOpen && setIsOpen(true)}
                className={`rounded-2xl 
                    pointer-events-auto cursor-pointer overflow-hidden border-2 border-white/10 shadow-2xl relative ${isOpen ? "cursor-default" : "hover:border-white/40"}`}
                style={{
                    width: "60px",
                    height: "40px",
                    background: `linear-gradient(to bottom, rgba(var(--box-Linear-1-rgb)), rgba(var(--box-Linear-2-rgb)))`,
                    transformOrigin: "left bottom",
                }}
            >
                {/* 3 Dots Horizontal Indicator */}
                {!isOpen && (
                    <div
                        ref={dotsRef}
                        /* Changed to flex-row and reduced gap for the 25px width */
                        className="absolute inset-0 flex flex-row items-center justify-center gap-0.5"
                    >
                        <div className="w-1 h-1 bg-white rounded-full" />
                        <div className="w-1 h-1 bg-white rounded-full" />
                        <div className="w-1 h-1 bg-white rounded-full" />
                    </div>
                )}

                <button
                    ref={closeBtnRef}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                    }}
                    className={`absolute top-4 right-4 z-[110] p-1 bg-black/20 hover:bg-black/40 rounded-md transition-colors ${!isOpen ? 'pointer-events-none' : 'pointer-events-auto'}`}
                >
                    <X size={20} className="text-white" />
                </button>

                <div ref={contentRef} className="w-full h-full flex-col" style={{ opacity: 0, display: "none" }}>
                    <ChatBot />
                </div>
            </div>
        </div>
    );
};

export default FloatingChat;