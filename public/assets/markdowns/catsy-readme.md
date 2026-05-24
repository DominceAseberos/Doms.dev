# ☕ Catsy Coffee — Multi-Platform Cafe System

**Catsy Coffee** is a comprehensive, production-ready 3-tier application built to modernize cafe operations. It serves as a fully integrated ecosystem connecting customer storefronts, staff point-of-sale (POS) systems, and a central administration panel.

The platform is designed with a strong focus on real-time synchronization, offline reliability, and scalable cloud architecture.

### 👥 User Roles & Ecosystem

The platform is divided into three core experiences:

- **Customer (Web Storefront)**: Customers can browse the menu, place orders, book table reservations, and earn digital **Loyalty Stamps** for rewards.
- **Staff (Mobile POS)**: Staff members use the Flutter mobile application to handle daily operations, manage walk-in/online orders, and process reservations directly from the shop floor.
- **Admin (Web Dashboard)**: Store managers use the secure React web portal to oversee overall operations, update menus, view sales analytics, and manage staff accounts.

### 🏗 Architecture (3-Tier & Monorepo)

Catsy Coffee follows a strict **3-Tier Architecture**, organized as a **Monorepo** (a single repository containing all projects, deployed separately to specialized hosting providers).

- **Presentation Layer (Frontend)**: 
  - **`catsy-web` (React + Vite)**: The responsive customer and admin web interface.
  - **`catsy_mobile` (Flutter)**: The robust, offline-capable mobile POS for staff.
- **Logic / Business Layer (Backend)**: 
  - **`catsy-backend` (FastAPI)**: A high-performance Python server that handles core business logic, real-time WebSocket/SSE streams, and authentication handshakes.
- **Data Layer (Database)**: 
  - **Supabase (PostgreSQL)**: The central cloud database driving the entire ecosystem.
  - **Drift (SQLite)**: The local database powering the offline-first Flutter mobile POS.

### ⚡ Key Features

- **Real-Time Order Syncing**: Utilizes PostgreSQL triggers and Server-Sent Events (SSE) / WebSockets to instantly update screens across all web and mobile clients.
- **Loyalty & Reservations**: Integrated customer loyalty stamp system and dynamic table reservation management.
- **Offline-First POS**: The staff mobile app uses Drift (SQLite) to store data locally, allowing operations to continue during network outages. Data is queued and automatically synced when the connection is restored.
- **Push Notifications**: Integrated Firebase Cloud Messaging (FCM) to deliver instant order and reservation alerts directly to staff devices.

This project demonstrates advanced full-stack capabilities, bridging mobile-first architecture with high-performance web frameworks and real-time backend infrastructure.
