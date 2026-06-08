import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

const LiveIframePreview = ({ project, activeView }) => {
    const [isIframeInteractive, setIsIframeInteractive] = useState(false);
    
    const desktopIframeRef = useRef(null);
    const mobileIframeRef = useRef(null);

    // Draggable state for Mobile Iframe
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [hasGrabbed, setHasGrabbed] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const initialPosRef = useRef({ x: 0, y: 0 });

    // Reset position and state when navigating to a new project or before Astro page transition
    useEffect(() => {
        const resetState = () => {
            setPosition({ x: 0, y: 0 });
            setHasGrabbed(false);
        };

        // Reset on project ID change
        resetState();

        // Reset right before Astro takes its View Transition snapshot!
        // This completely prevents the Astro "squished ghost" bug caused by taking 
        // a snapshot of an element with heavy inline transforms.
        document.addEventListener('astro:before-preparation', resetState);
        return () => document.removeEventListener('astro:before-preparation', resetState);
    }, [project?.id]);

    // Magic Card Glow State
    const mouseX = useMotionValue(-500);
    const mouseY = useMotionValue(-500);

    const handleMouseMoveGlow = (e) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    };

    const handleMouseLeaveGlow = () => {
        mouseX.set(-500);
        mouseY.set(-500);
    };

    const handlePointerDown = (e) => {
        setIsDragging(true);
        setHasGrabbed(true);
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        initialPosRef.current = { ...position };
        e.target.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        
        setPosition({
            x: initialPosRef.current.x + dx,
            y: initialPosRef.current.y + dy
        });
    };

    const handlePointerUp = (e) => {
        setIsDragging(false);
        e.target.releasePointerCapture(e.pointerId);
    };

    // Sync state between desktop and mobile iframes
    useEffect(() => {
        if (!isIframeInteractive || activeView !== 'desktop') return;
        
        const handleMessage = (e) => {
            if (!e.data || e.data.type !== 'SYNC_STATE') return;
            
            const isFromDesktop = desktopIframeRef.current && e.source === desktopIframeRef.current.contentWindow;
            const isFromMobile = mobileIframeRef.current && e.source === mobileIframeRef.current.contentWindow;
            
            if (isFromDesktop && mobileIframeRef.current) {
                mobileIframeRef.current.contentWindow.postMessage({ type: 'UPDATE_STATE', payload: e.data.payload }, '*');
            } else if (isFromMobile && desktopIframeRef.current) {
                desktopIframeRef.current.contentWindow.postMessage({ type: 'UPDATE_STATE', payload: e.data.payload }, '*');
            }
        };
        
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [isIframeInteractive, activeView]);

    if (activeView === 'mobile') {
        return (
            <div className="relative w-full pt-10 flex justify-center pb-16">
                {isIframeInteractive && (
                    <div className="absolute top-0 right-4 z-20">
                        <button 
                            onClick={() => setIsIframeInteractive(false)}
                            className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg hover:bg-red-600 transition-colors uppercase tracking-wider flex items-center gap-2"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                            Stop Live View
                        </button>
                    </div>
                )}
                <div className="relative group p-0 overflow-hidden bg-black w-[430px] max-w-full" style={{ height: '932px', borderRadius: '50px', border: '16px solid #121212' }}>
                    <iframe 
                        src={project.liveUrl} 
                        title={`${project.title} Mobile Preview`}
                        className="h-full border-none bg-white"
                        loading="lazy"
                        style={{ 
                            width: 'calc(100% + 20px)',
                            pointerEvents: isIframeInteractive ? 'auto' : 'none' 
                        }}
                    />
                    {!isIframeInteractive && (
                        <div 
                            className="absolute inset-0 z-10 flex items-center justify-center transition-all cursor-pointer bg-black/10 hover:bg-black/30 backdrop-blur-[1px] hover:backdrop-blur-[2px]" 
                            onClick={() => setIsIframeInteractive(true)}
                        >
                            <button className="px-6 py-3 bg-[#c8ff3e] text-black font-bold rounded-full shadow-[0_0_20px_rgba(200,255,62,0.3)] flex items-center gap-2 transform hover:scale-105 transition-transform uppercase tracking-wider text-sm">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                Live Interact
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full pt-10 pb-16">
            {isIframeInteractive && (
                <div className="absolute top-0 right-4 z-20">
                    <button 
                        onClick={() => setIsIframeInteractive(false)}
                        className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg hover:bg-red-600 transition-colors uppercase tracking-wider flex items-center gap-2"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                        Stop Live View
                    </button>
                </div>
            )}
            {/* Desktop View container */}
            <div 
                className={`hoverable transition-all duration-500 w-full ${isIframeInteractive ? 'opacity-100' : 'opacity-80 cursor-pointer'} aspect-video relative rounded-[34px] shadow-[0_0_50px_rgba(0,0,0,0.6)] bg-white/5 group p-[2px]`}
                onMouseMove={handleMouseMoveGlow}
                onMouseLeave={handleMouseLeaveGlow}
            >
                {/* Magic Card Glowing Border Effect */}
                <motion.div
                    className="pointer-events-none absolute inset-0 rounded-[34px] opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-0"
                    style={{
                        background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(200, 255, 62, 0.8), transparent 100%)`,
                    }}
                />

                <div className="relative z-10 w-full h-full rounded-[32px] overflow-hidden bg-black">
                    <iframe 
                        ref={desktopIframeRef}
                        src={project.liveUrl} 
                        title={`${project.title} Desktop Preview`}
                        className="w-full h-full border-none bg-white"
                        loading="lazy"
                        style={{ pointerEvents: isIframeInteractive ? 'auto' : 'none' }}
                    />
                    
                    {/* Interaction Overlay */}
                    {!isIframeInteractive && (
                        <div 
                            className="absolute inset-0 z-20 flex items-center justify-center transition-all group-hover:bg-black/40 backdrop-blur-[2px] group-hover:backdrop-blur-md"
                            onClick={() => setIsIframeInteractive(true)}
                        >
                            <button className="px-6 py-3 bg-[#c8ff3e] text-black font-bold uppercase tracking-wider rounded-full shadow-[0_0_30px_rgba(200,255,62,0.4)] transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                Live Interact
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Mobile Composite Iframe - Draggable Wrapper */}
            <div 
                className={`hidden lg:block absolute -bottom-4 left-0 xl:left-8 z-30 origin-bottom-left w-[430px] ${isDragging ? '' : 'transition-transform duration-100'}`}
                style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(0.7)` }}
            >
                {/* Drag Hint Tooltip (Outside the Phone) */}
                <div className={`absolute -top-[70px] w-full flex justify-center z-50 pointer-events-none transition-opacity duration-700 ${hasGrabbed ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="flex flex-col items-center animate-bounce">
                        <div className="bg-[#c8ff3e] text-black text-[22px] font-bold px-8 py-3.5 rounded-full uppercase tracking-wider shadow-[0_0_20px_rgba(200,255,62,0.4)] whitespace-nowrap">
                            Grab notch to move
                        </div>
                        <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[12px] border-transparent border-t-[#c8ff3e] -mt-[1px]"></div>
                    </div>
                </div>

                {/* The Mobile Phone */}
                <div 
                    className="hoverable w-[430px] h-[932px] rounded-[50px] shadow-2xl bg-[#121212] relative group p-[16px]"
                    onMouseMove={handleMouseMoveGlow}
                    onMouseLeave={handleMouseLeaveGlow}
                >
                    {/* Magic Card Glowing Bezel Effect */}
                    <motion.div
                        className="pointer-events-none absolute inset-0 rounded-[50px] opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-0"
                        style={{
                            background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(200, 255, 62, 0.4), transparent 100%)`,
                        }}
                    />

                    {/* Phone Inner Container */}
                    <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-black z-10 border border-white/5">
                        {/* Dynamic Island Drag Handle */}
                        <div 
                            className="absolute top-2 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-full z-50 cursor-grab active:cursor-grabbing flex items-center justify-center hover:bg-[#1a1a1a] transition-colors shadow-inner group/handle"
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            onPointerCancel={handlePointerUp}
                            title="Drag to move"
                        >
                            <div className="w-10 h-1.5 bg-[#333] rounded-full group-hover/handle:bg-[#666] transition-colors" />
                        </div>

                        <iframe 
                            ref={mobileIframeRef}
                            src={project.liveUrl} 
                            title={`${project.title} Mobile Preview`}
                            className="h-full border-none bg-white"
                            loading="lazy"
                            style={{ 
                                width: 'calc(100% + 20px)',
                                pointerEvents: isIframeInteractive ? 'auto' : 'none' 
                            }}
                        />
                        {!isIframeInteractive && (
                            <div 
                                className="absolute inset-0 z-20 flex items-center justify-center transition-all cursor-pointer bg-black/10 hover:bg-black/30 backdrop-blur-[1px] hover:backdrop-blur-[2px]" 
                                onClick={() => setIsIframeInteractive(true)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveIframePreview;
