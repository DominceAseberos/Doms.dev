# ☕ Catsy Coffee — Multi-Platform Cafe System

**Catsy Coffee** is a comprehensive, production-ready 3-tier application built to modernize cafe operations. It serves as a fully integrated ecosystem connecting customer storefronts, staff point-of-sale (POS) systems, and a central administration panel.

The platform is designed with a strong focus on real-time synchronization, offline reliability, and scalable cloud architecture.

### 👥 User Roles & Ecosystem

The platform is divided into three core experiences:

- **Customer (Web Storefront)**: Customers can browse the menu, place orders, book table reservations, and earn digital **Loyalty Stamps** for rewards.
- **Staff (Mobile POS)**: Staff members use the Flutter mobile application to handle daily operations, manage walk-in/online orders, and process reservations directly from the shop floor.
- **Admin (Web Dashboard)**: Store managers use the secure React web portal to oversee overall operations, update menus, view sales analytics, and manage staff accounts.

### 🏗 Architecture & Infrastructure

- **Backend (`catsy-backend`)**: A high-performance Python **FastAPI** server that handles complex business logic, real-time WebSocket/SSE streams, and interfaces with a Supabase PostgreSQL database.
- **Frontend (`catsy-web`)**: A modern **React + Vite** web application serving the Customer storefront and Admin dashboard.
- **Mobile (`catsy_mobile`)**: A robust **Flutter** POS application built for staff. It ensures uninterrupted service with offline-first local SQLite persistence.

### ⚡ Key Features

- **Real-Time Order Syncing**: Utilizes PostgreSQL triggers and Server-Sent Events (SSE) / WebSockets to instantly update screens across all web and mobile clients.
- **Loyalty & Reservations**: Integrated customer loyalty stamp system and dynamic table reservation management.
- **Offline-First POS**: The staff mobile app uses Drift (SQLite) to store data locally, allowing operations to continue during network outages. Data is queued and automatically synced when the connection is restored.
- **Push Notifications**: Integrated Firebase Cloud Messaging (FCM) to deliver instant order and reservation alerts directly to staff devices.

This project demonstrates advanced full-stack capabilities, bridging mobile-first architecture with high-performance web frameworks and real-time backend infrastructure.
