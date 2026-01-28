import React, { useState, useRef, useEffect } from "react";
import { X, MessageSquare } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import ChatBot from "./ChatBot";

const FloatingChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const closeBtnRef = useRef(null);
    const iconRef = useRef(null);
    const welcomeRef = useRef(null);
    const timelineRef = useRef(null);

    const { contextSafe } = useGSAP({ scope: containerRef });

    const onContainerEnter = contextSafe(() => {
        if (!isOpen) {
            gsap.to(containerRef.current, {
                scale: 1.1,
                borderColor: "rgba(255, 255, 255, 0.4)",
                boxShadow: "0 0 20px rgba(var(--contrast-rgb), 0.3)",
                duration: 0.3
            });
            if (showWelcome) {
                gsap.to(welcomeRef.current, { opacity: 0, scale: 0.8, y: 10, duration: 0.2 });
            }
        }
    });

    const onContainerLeave = contextSafe(() => {
        if (!isOpen) {
            gsap.to(containerRef.current, {
                scale: 1,
                borderColor: "rgba(255, 255, 255, 0.1)",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                duration: 0.3
            });
        }
    });

    const onCloseEnter = contextSafe(() => {
        gsap.to(closeBtnRef.current, { backgroundColor: "rgba(0, 0, 0, 0.4)", duration: 0.3 });
    });

    const onCloseLeave = contextSafe(() => {
        gsap.to(closeBtnRef.current, { backgroundColor: "rgba(0, 0, 0, 0.2)", duration: 0.3 });
    });

    useEffect(() => {
        // Show welcome bubble after 3s
        const timer = setTimeout(() => {
            if (!isOpen) {
                setShowWelcome(true);
                gsap.fromTo(welcomeRef.current,
                    { opacity: 0, y: 20, scale: 0.5 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
                );
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [isOpen]);

    useEffect(() => {
        if (timelineRef.current) timelineRef.current.kill();
        const tl = gsap.timeline();
        timelineRef.current = tl;

        if (isOpen) {
            // ============ OPENING SEQUENCE ============
            setShowWelcome(false);
            gsap.set(closeBtnRef.current, { opacity: 0, scale: 0.5 });
            gsap.set(contentRef.current, { display: "flex", opacity: 0 });

            tl.to(iconRef.current, { opacity: 0, scale: 0, duration: 0.2 })
                .to(containerRef.current, {
                    width: window.innerWidth > 768 ? "400px" : "90vw",
                    height: "460px",
                    borderRadius: "24px",
                    duration: 0.5,
                    ease: "power3.inOut",
                })
                .to(contentRef.current, {
                    opacity: 1,
                    duration: 0.3
                }, "-=0.2")
                .to(closeBtnRef.current, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                }, "-=0.2");
        } else {
            // ============ CLOSING SEQUENCE ============
            tl.to([closeBtnRef.current, contentRef.current], {
                opacity: 0,
                duration: 0.2
            })
                .to(containerRef.current, {
                    width: "56px",
                    height: "56px",
                    borderRadius: "100%",
                    duration: 0.4,
                    ease: "power3.inOut",
                })
                .set(contentRef.current, { display: "none" })
                .to(iconRef.current, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" });
        }
    }, [isOpen]);

    return (
        <div className="fixed bottom-8 right-8 z-[100] pointer-events-none flex flex-col items-end gap-3">
            {/* Proactive Welcome Bubble */}
            {showWelcome && !isOpen && (
                <div
                    ref={welcomeRef}
                    className="pointer-events-auto bg-white text-black px-4 py-2 rounded-2xl rounded-br-none text-xs font-bold shadow-xl border border-white/20 whitespace-nowrap mb-1"
                >
                    Hi! Ask me anything! 👋
                </div>
            )}

            <div
                ref={containerRef}
                onClick={() => !isOpen && setIsOpen(true)}
                onMouseEnter={onContainerEnter}
                onMouseLeave={onContainerLeave}
                role="dialog"
                aria-expanded={isOpen}
                aria-label="Chat interface"
                className={`pointer-events-auto cursor-pointer border border-white/10 shadow-2xl relative ${isOpen ? "cursor-default" : "rounded-full"}`}
                style={{
                    width: "56px",
                    height: "56px",
                    background: `linear-gradient(135deg, rgba(var(--box-Linear-1-rgb)), rgba(var(--box-Linear-2-rgb)))`,
                    backdropFilter: "blur(12px)",
                    transformOrigin: "bottom right",
                }}
            >
                {/* Launcher Icon */}
                {!isOpen && (
                    <div
                        ref={iconRef}
                        className="absolute inset-0 flex items-center justify-center text-[rgba(var(--contrast-rgb))]"
                    >
                        <MessageSquare size={24} fill="currentColor" fillOpacity={0.2} />
                    </div>
                )}

                {/* Close Button */}
                <button
                    ref={closeBtnRef}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                    }}
                    onMouseEnter={onCloseEnter}
                    onMouseLeave={onCloseLeave}
                    aria-label="Close chat"
                    className={`absolute top-4 right-4 z-[110] p-2 bg-black/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors ${!isOpen ? 'hidden' : 'block'}`}
                >
                    <X size={20} className="text-white" />
                </button>

                {/* Chat Content */}
                <div ref={contentRef} className="w-full h-full flex flex-col" style={{ display: "none" }}>
                    <ChatBot />
                </div>
            </div >
        </div >
    );
};

export default FloatingChat;
