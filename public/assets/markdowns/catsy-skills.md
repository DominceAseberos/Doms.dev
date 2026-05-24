## ⚙️ High-Level Engineering Skills

Building Catsy Coffee required solving complex data-flow and architectural challenges across a multi-platform environment.

### 1. Offline-First Mobile Architecture
Designing for reliability in high-traffic environments, I implemented an offline-first data model in the Flutter POS application. Using Drift (SQLite) alongside a robust queue-based syncing system, the POS remains operational during network drops, ensuring zero data loss and seamless transaction handling.

### 2. Real-Time Distributed Systems
I built a reactive backend architecture using FastAPI and PostgreSQL triggers. By implementing Server-Sent Events (SSE) and WebSockets, the system instantly broadcasts database mutations (like new orders or inventory changes) across all connected Web and Mobile clients without aggressive polling.

### 3. Full-Stack API Design & Integration
Engineered a scalable REST API boundary with FastAPI to serve drastically different client needs (a React storefront and a Flutter admin/POS app). This involved strict type validation, structured error handling, and robust CORS/Origin management across diverse deployment targets (Render, Vercel, and local networks).

### 4. Cloud Infrastructure & FCM Push
Successfully bridged complex cloud integrations including automated Supabase auth flows and Firebase Cloud Messaging (FCM). Set up secure background services to deliver critical push notifications directly to staff devices dynamically based on order state changes.
