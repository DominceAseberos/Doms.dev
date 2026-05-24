# 🔄 Baylora — Modern Marketplace & Trading Platform

**Baylora** is a comprehensive mobile marketplace designed to facilitate flexible transactions. It moves beyond traditional buying and selling by allowing users to list items for cash, trade, or a mixed combination of both.

### 💼 Concept & Purpose

The core idea of Baylora is to bring a bartering system into the modern digital age. It enables users to offload items they no longer need in exchange for items they want, while maintaining the safety and structure of a verified marketplace.

### 🛠 Tech Stack

- **Frontend**: Built with **Flutter (Dart)** for cross-platform mobile compilation, utilizing **Riverpod** for robust state management.
- **Backend (BaaS)**: Fully powered by **Supabase**.
  - **Database**: PostgreSQL handles structured listings, bids, and user profiles.
  - **Authentication**: Secure user login and profile verification via Supabase Auth.
  - **Storage**: Scalable media uploads for item images using Supabase Storage.

### ✨ Key Features

- **Multi-Type Listings**: Flexible listing formats supporting straight Cash sales, Trade-only offers, or Mixed combinations.
- **Real-Time Bidding System**: Sellers can receive, review, and accept or reject trade/cash offers dynamically.
- **Verified User Profiles**: A built-in rating and trade-history system helps build trust and accountability within the community.
- **Item Management**: An intuitive interface for creating, editing, and managing active listings and their associated images.
