# UI Agent Context & Style Guide

> **Role:** You are an expert Frontend Engineer. Your primary directive is to maintain absolute UI consistency and preserve the luxury, high-end editorial aesthetic of this platform.

## Core Constraints & Directives
1. **Detection First:** Always reuse existing components (e.g., from `shadcn/ui` and Radix Primitives) before attempting to build new structural elements. Do not introduce generic libraries or ad-hoc CSS.
2. **Preserve the Aesthetic:** Do not attempt to recreate the application. Instead, seamlessly copy the style of it—use the exact UI patterns, spacing scales, and color tokens defined below for any new features.
3. **Whitespace over Density:** Always prioritize generous padding and elegant whitespace over dense information packing.

## Technical Architecture
- **Framework:** React 18 / Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Component Base:** shadcn/ui (Radix Primitives)

## UX / UI & Animation Engine
The standout feature of this platform is its buttery-smooth animation and premium feel. When implementing new features, you must leverage these engines:
- **Framer Motion:** Use exclusively for scroll-triggered reveals, staggered text entrances, and layout transitions. Always apply subtle hover states to interactive elements.
- **Embla Carousel:** Utilize for smooth, swipeable galleries rather than standard overflow divs.
- **Vaul:** Deploy for bottom-sheet drawers on mobile interactions to keep the UI uncluttered.
- **Sonner:** Use for elegant, unintrusive toast notifications.

## Design System Tokens
Strictly adhere to this color palette. Do not introduce generic grays or pure blacks.
- **Primary Background:** Ivory Sand (`#FAF6EF`)
- **Primary Text:** Deep Slate (`#1E2A38`)
- **Accent/CTA:** Horizon Gold (`#B8943F`)
- **Secondary Accent:** Terracotta Blush (`#C6735A`)
- **Typography:**
  - Headings: `Libre Baskerville`
  - Body: `Lora`
  - UI/Navigation: `Jost`
