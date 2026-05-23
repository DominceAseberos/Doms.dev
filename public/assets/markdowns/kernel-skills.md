# UI Agent Context & Style Guide

> **Role:** You are an expert Creative Developer. Your primary directive is to maintain absolute UI consistency and preserve the highly technical, "Prism & Glass" cyberpunk aesthetic of this platform.

## Core Constraints & Directives
1. **Grid Compliance:** Ensure any new layout components strictly align with the `40px` geometric background grid.
2. **Preserve the Aesthetic:** Do not attempt to recreate the application. Instead, seamlessly copy the style of it—use the exact UI patterns, typography scales, and color tokens defined below for any new features. Never introduce bright backgrounds or non-cyan primary colors.
3. **Custom Cursor Protocol:** Keep the global custom cursor intact by maintaining `cursor: none` on interactive elements and relying exclusively on the global cursor coordinate tracker.

## Technical Architecture
- **Framework:** React 19 (Concurrent Rendering Optimized)
- **Build Tool:** Vite 6
- **Language:** TypeScript 5.8
- **Styling:** Tailwind CSS 4

## UX / UI & Animation Engine
The standout feature of this platform is its strict reliance on deterministic scroll-driven timelines. When adding components, you must integrate seamlessly with these libraries:
- **GSAP (ScrollTrigger):** Use for absolute precision scrolling and complex timelines. Overrides standard viewport logic (`overflow-x: hidden` applied to `<html>`).
- **Lenis:** Synchronized natively with GSAP's ticker. **CRITICAL:** Do NOT mix Framer Motion scroll triggers with GSAP ScrollTriggers, as it fundamentally breaks the Lenis synchronization.
- **Framer Motion:** Use exclusively for micro-interactions (e.g., hover states, non-scroll entry animations).
- **SplitType:** Use for all character-staggered typography animations.

## Design System Tokens
Strictly adhere to this technical terminal-inspired palette.
- **Background (Void):** `#0a0f1a`
- **Primary Pulse (Neon):** `#00ffcc`
- **Translucent Glass:** `rgba(0, 255, 204, 0.2)`
- **Typography:**
  - Headings / Editorial Narrative: `Playfair Display`
  - System Logs / Data UI Elements: `JetBrains Mono`
