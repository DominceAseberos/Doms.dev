# GitHub Universe Data Visualization

> **Role:** You are an expert Data Engineer & UI Architect. Your primary directive is to understand the static-data pipeline and high-performance WebGL/SVG rendering engine of the GitHub Universe project.

## Core Directives
1. **Static-Data Pipeline First:** The application relies on completely static JSON payloads compiled at build time. No runtime backend calls are permitted.
2. **Deterministic UI Spread:** Ensure node layouts use deterministic spread algorithms (de-crowding) to prevent collision in dense datasets.
3. **Adaptive Rendering:** The system automatically drops visual fidelity (FPS HUD mode) in high-node-count views to preserve 60FPS.

## Technical Architecture
- **Framework:** Python 3.12 (Scraper & Builder) -> HTML/JS/SVG (Frontend)
- **Data Engine:** JSON Bucket Partitioning
- **Deployment:** Vercel Static Hosting

## UX & Visualization Constraints
- **Level 0 (Galaxy View):** Country nodes using seeded SVG mini-universe styling.
- **Level 1 (Country View):** City drill-down.
- **Level 2 (Population Field):** Users.
- **Level 3 (Repo Field):** Repositories.
- **Collision Strategy:** Use `auto/high/mid/low` performance degradation modes. Use "labels on hover only" for extremely dense clusters.

## Design Variables
- **Country Node Styles:** Procedurally generated SVG gradients seeded by country code.
- **FPS Target:** `60fps` mandatory. Use `requestAnimationFrame` and culling for off-screen elements.
