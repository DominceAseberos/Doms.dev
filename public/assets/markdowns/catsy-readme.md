# ☕ Catsy Coffee — Multi-Platform Cafe System

**Catsy Coffee** is a comprehensive, production-ready 3-tier application built to modernize cafe operations. It serves as a fully integrated ecosystem connecting customer storefronts, staff point-of-sale (POS) systems, and a central administration panel.

The platform is designed with a strong focus on real-time synchronization, offline reliability, and scalable cloud architecture.

### 🏗 Architecture & Ecosystem

The system is divided into three core applications working seamlessly together:

- **`catsy-backend`**: A high-performance Python **FastAPI** server that handles complex business logic, real-time WebSocket/SSE streams, and interfaces with a Supabase PostgreSQL database.
- **`catsy-web`**: A modern **React + Vite** web application serving both as a customer-facing storefront and a secure administrative dashboard for menu and order management.
- **`catsy_mobile`**: A robust **Flutter** POS application built for staff. It ensures uninterrupted service with offline-first local SQLite persistence and queue-based data synchronization.

### ⚡ Key Features

- **Real-Time Order Syncing**: Utilizes PostgreSQL triggers and Server-Sent Events (SSE) / WebSockets to instantly update screens across all web and mobile clients when an order is placed or updated.
- **Offline-First POS**: The Flutter mobile app uses Drift (SQLite) to store data locally, allowing staff to process transactions even during network outages. Data is queued and automatically synced when the connection is restored.
- **Multi-Platform Deployment**: Engineered for modern cloud environments—backend hosted on Render, web app distributed via Vercel, and a unified API bridge for seamless local device testing.
- **Push Notifications**: Integrated Firebase Cloud Messaging (FCM) to deliver instant order alerts directly to staff devices.

This project demonstrates advanced full-stack capabilities, bridging mobile-first architecture with high-performance web frameworks and real-time backend infrastructure.
