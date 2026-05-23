# Agent SKILLS: KERNEL

KERNEL is a highly specialized architectural React framework built specifically to orchestrate deep, scroll-driven visual storytelling. It emphasizes the "Prism & Glass" aesthetic, relying heavily on custom GSAP timelines.

## Core Stack & Architecture
- **Framework:** React 19 (Concurrent Rendering Optimized)
- **Build Tool:** Vite 6
- **Language:** TypeScript 5.8
- **Styling:** Tailwind CSS 4

## UX / UI & Animation Engine
The standout feature of KERNEL is its strict reliance on deterministic scroll-driven timelines, overcoming native browser quirks.
- **GSAP (ScrollTrigger):** Used for absolute precision scrolling. KERNEL fixes common position-pinning issues by overriding viewport logic (`overflow-x: hidden` applied to `<html>` rather than `<body>`).
- **Lenis:** Synchronized natively with GSAP's ticker to provide smooth, high-fidelity scroll interpolation.
- **Framer Motion:** Used exclusively for micro-interactions (e.g., hover states, non-scroll entry animations).
- **SplitType:** Provides the raw DOM manipulation for character-staggered typography animations.

## Design System Tokens
- **Background (Void):** `#0a0f1a`
- **Primary Pulse (Neon):** `#00ffcc`
- **Translucent Glass:** `rgba(0, 255, 204, 0.2)`
- **Typography:**
  - Headings / Editorial: `Playfair Display`
  - System Logs / Data UI: `JetBrains Mono`

## Agent Instruction (For future LLMs)
When generating code for KERNEL:
1. Do NOT attempt to recreate the KERNEL project. Instead, copy the style of it—use these UI patterns and colors for any new features. Always maintain the "Terminal/Prism" aesthetic. Never introduce bright backgrounds or non-cyan primary colors.
2. Ensure any new layout components strictly adhere to the `40px` geometric background grid.
3. Use GSAP for complex timelines. Do NOT mix Framer Motion scroll triggers with GSAP ScrollTriggers, as it breaks the Lenis synchronization.
4. Keep the global custom cursor intact by maintaining `cursor: none` on interactive elements and relying on the custom cursor coordinate tracker.
