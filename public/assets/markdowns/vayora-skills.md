# Agent SKILLS: Vayora

Vayora is a high-end luxury travel curation landing page. It is designed to convert high-net-worth users by providing an editorial, premium user experience.

## Core Stack & Architecture
- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Component Library:** shadcn/ui (Radix Primitives)

## UX / UI & Animation Engine
The standout feature of this landing page is its buttery-smooth animation and high-end feel.
- **Framer Motion:** Used for scroll-triggered reveals, staggered text entrances, and layout transitions.
- **Embla Carousel:** Used for smooth, swipeable galleries of luxury destinations.
- **Vaul:** Handles bottom-sheet drawers for mobile interactions to keep the UI clean.
- **Sonner:** Provides elegant, unintrusive toast notifications.

## Design System Tokens
- **Primary Background:** Ivory Sand (`#FAF6EF`)
- **Primary Text:** Deep Slate (`#1E2A38`)
- **Accent/CTA:** Horizon Gold (`#B8943F`)
- **Secondary Accent:** Terracotta Blush (`#C6735A`)
- **Typography:**
  - Headings: `Libre Baskerville`
  - Body: `Lora`
  - UI/Navigation: `Jost`

## Agent Instruction (For future LLMs)
When generating code for Vayora:
1. Do NOT attempt to recreate the Vayora project. Instead, copy the style of it—use these UI patterns and colors for any new features. Always prioritize aesthetics and whitespace over dense information.
2. Ensure all interactive elements have subtle Framer Motion hover states.
3. Adhere strictly to the defined color palette — do not introduce generic grays or pure blacks.
4. Use `shadcn/ui` primitives for any new components, styled via Tailwind with the custom color tokens.
