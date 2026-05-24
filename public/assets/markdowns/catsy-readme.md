# ☕ CUTshier — Modern POS & Management System for Catsy Coffee

**CUTshier** (Catsy Coffee POS) is a comprehensive, production-ready 3-tier application designed to modernize and automate café operations. Originally built to replace inefficient manual processes—such as tracking sales on paper and managing reservations via Facebook Messenger—it now serves as a fully integrated ecosystem connecting customer storefronts, staff operations, and central administration.

The platform is designed with a strong focus on real-time synchronization, offline reliability, and scalable cloud architecture.

### 👥 User Roles & Ecosystem

The platform solves specific problems for three distinct user groups:

- **Customer (Web Storefront)**: Customers can browse the menu, view **live café seat availability**, and book table reservations by pre-ordering and uploading payment references. They earn **QR-based Loyalty Stamps** on purchases and can leave post-purchase reviews and ratings.
- **Staff / Cashier (Mobile POS)**: Staff use the Flutter mobile application to handle daily operations. They can quickly process on-site orders, automatically deduct inventory, scan customer QR codes to award loyalty stamps, and track upcoming online reservations directly from the shop floor.
- **Admin / Owner (Web Dashboard)**: Store managers use the secure React portal to oversee the entire business. Admins can perform CRUD operations on the menu/inventory, receive low-stock alerts, and view **daily, weekly, and monthly sales analytics** alongside predictive performance metrics to guide restocking decisions.

### 🏗 Architecture (3-Tier Layered)

CUTshier follows a strict **3-Tier Client-Server Architecture** featuring an Offline-First Mobile Sync capability.

- **Presentation Layer (Frontend)**: 
  - **`catsy-web` (React + Vite)**: The responsive customer storefront and admin dashboard.
  - **`catsy_mobile` (Flutter / Riverpod)**: The robust mobile POS designed specifically for café staff.
- **Business Logic Layer (Backend)**: 
  - **`catsy-backend` (FastAPI / Python)**: A high-performance server handling core business logic, validation, real-time WebSockets/SSE streams, and authentication handshakes.
- **Data Layer (Database)**: 
  - **Supabase (PostgreSQL)**: The central cloud database driving the entire ecosystem.
  - **Drift (SQLite)**: A local database powering the offline-first Flutter mobile POS.

### ⚡ Key Features

- **Automated Inventory & Analytics**: Automatically tracks stock levels and generates real-time product performance insights to identify best-selling vs. slow-moving items.
- **Live Reservation & Seat Tracking**: Eliminates manual chat bookings by allowing customers to book online while checking live seat availability.
- **QR-Based Loyalty System**: A digital stamp card progression system that tracks customer rewards efficiently.
- **Real-Time Order Syncing**: Utilizes PostgreSQL triggers and Server-Sent Events (SSE) to instantly update screens across all web and mobile clients.
- **Offline-First POS Capability**: The mobile app caches transactions via SQLite during network outages and automatically queues them for syncing once the connection is restored.

Developed using the **Waterfall Methodology**, this project demonstrates advanced full-stack capabilities, bridging mobile-first architecture with high-performance web frameworks to solve real-world business bottlenecks.
