# KERNEL | Refokus Edition

> **The Core Engine for High-End Digital Experiences.**

A sophisticated React-based framework designed for immersive, scroll-driven storytelling. **KERNEL** blends a "Terminal-Glass" aesthetic with elite performance, featuring seamless GSAP orchestration and a signature boot-sequence entry.

---

## ◈ System Architecture & Stack

### Core Mechanics
- **Framework**: React 19 (Concurrent mode optimized)
- **Build Engine**: Vite 6 for high-speed HMR
- **Language**: TypeScript 5.8 for strict runtime type safety

### Motion Engine
- **GSAP 3.14**: Orchestrates hardware-accelerated scroll sequences. Features critical viewport overrides (`overflow-x: hidden` strictly on `<html>`) to prevent positioning recalculation errors during fixed pinning phases.
- **Lenis**: High-performance smooth scrolling engine, perfectly synchronized with GSAP's ticker.
- **Framer Motion**: Manages declarative component-level transitions and micro-interactions.

---

## ◈ Design System (Prism & Glass)

The visual system is built on the principle of *Atmospheric Contrast*, where a deep void is punctuated by high-frequency light.

- **Color Palette**: 
  - **Void Navy**: `#0a0f1a` (Background canvas)
  - **Neon Cyan**: `#00ffcc` (Primary interactive pulse)
  - **Accent Translucence**: `rgba(0, 255, 204, 0.2)` (Glass UI containers)
- **Grid Layout**: A strict `40px` geometric background grid layered via CSS linear-gradients.
- **Typography**: 
  - *Serif*: `Playfair Display` for high-fashion editorial narrative.
  - *Mono*: `JetBrains Mono` for system logs and technical UI components.

---

## ◈ Core Modules
1. **Boot Sequence (Preloader)**: A terminal-style initialization sequence (`KERNEL_OS v2.1`) that builds anticipation.
2. **Audio-Active UI**: Real-time synchronization between scroll velocity and ambient audio.
3. **Custom Precision Cursor**: Multi-layered interactive cursor providing tactile feedback for data-nodes.

*Built for the next generation of web interfaces.*
