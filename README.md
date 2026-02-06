# Doms.dev - Portfolio v2

[![Code Quality](https://img.shields.io/badge/Code%20Quality-A%2B%20(98%25)-success)](AUDIT_ACHIEVEMENTS.md)
[![Security](https://img.shields.io/badge/Security-9%2F10-green)](AUDIT_ACHIEVEMENTS.md)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF)](https://vitejs.dev)

Modern, high-performance portfolio website showcasing projects, skills, and professional experience with a powerful admin dashboard for content management.

---

## 🎯 Overview

**Doms.dev** is a full-stack portfolio application built with React and Supabase, featuring:

- **Public Portfolio**: Interactive showcase of projects, skills, education, and experience
- **Admin Dashboard**: Comprehensive CMS for managing all portfolio content
- **Real-time Features**: Live GitHub activity, AI-powered chat, mood-based music player
- **Professional Grade**: A+ code quality with production-ready security

---

## ✨ Key Features

### 🌐 Public Portfolio

**Interactive Dashboard**
- Hero section with animated logo and dynamic greetings
- Real-time GitHub activity feed
- Mood-based music player with track management
- AI-powered chat assistant (Gemini + OpenRouter)
- Smooth GSAP animations throughout

**Content Sections**
- **Projects**: Filterable gallery with detailed case studies
- **About Me**: Professional background and skills showcase
- **Tech Stack**: Organized by categories with proficiency levels
- **Education**: Academic background and certifications
- **Contact**: Social media links and professional profiles

**Performance Features**
- ⚡ Lazy-loaded routes with code splitting
- 🎨 GPU-accelerated animations (GSAP)
- 📦 Optimized data fetching (TanStack Query)
- 🔄 Smart caching with fallbacks
- 📱 Fully responsive across all devices

---

### 🔐 Admin Dashboard

Secure, feature-rich content management system accessible at `/admin`.

**Authentication**
- Supabase Auth integration
- Email/password authentication
- Protected routes with session management
- Automatic session refresh

**Content Management**

**Projects Manager**
- Create, edit, delete projects
- Image upload to Supabase Storage
- Tech stack association
- GitHub repository linking
- Live preview with markdown support

**Music Manager**
- Upload and manage music tracks
- Mood-based categorization (Calm, Energetic, Focus, etc.)
- Audio file upload to Supabase Storage
- Track metadata management (title, artist, duration)
- Bulk operations support

**Education Manager**
- Add/edit education entries
- Institution and degree management
- Date range tracking
- Field of study categorization

**Tech Stack Manager**
- Organize technologies by category
- Proficiency level tracking
- Icon/logo management
- Category grouping (Frontend, Backend, Tools, etc.)

**Analytics Dashboard**
- Real-time site analytics
- Page visit tracking
- User journey visualization
- Error log monitoring

**AI Chat Manager**
- Review chat conversations
- Monitor AI model performance
- Analyze user interactions

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework with hooks |
| **Vite** | Build tool & dev server |
| **TailwindCSS** | Utility-first styling |
| **GSAP** | High-performance animations |
| **Lucide React** | Icon library |
| **React Router** | Client-side routing |

### State Management
| Technology | Purpose |
|------------|---------|
| **Zustand** | Lightweight state management |
| **TanStack Query** | Server state & caching |
| **Local Storage** | Persistent client state |

### Backend & Services
| Technology | Purpose |
|------------|---------|
| **Supabase** | Backend-as-a-Service |
| ├─ PostgreSQL | Database with RLS |
| ├─ Auth | User authentication |
| ├─ Storage | File uploads (images, audio) |
| └─ Edge Functions | Serverless AI proxy |

### AI Integration
| Service | Use Case |
|---------|----------|
| **Google Gemini** | Primary chat AI |
| **OpenRouter** | Fallback AI (Mistral, DeepSeek) |

---

## 📁 Project Structure

```
src/
├── app/                    # Public portfolio application
│   ├── features/          # Feature modules
│   │   ├── about/        # About me page
│   │   ├── chat/         # AI chat assistant
│   │   ├── contact/      # Contact form
│   │   ├── dashboard/    # Main dashboard
│   │   ├── education/    # Education showcase
│   │   ├── github/       # GitHub integration
│   │   ├── musicPlayer/  # Music player
│   │   ├── projects/     # Project gallery
│   │   └── techStack/    # Tech stack display
│   ├── pages/            # Route pages
│   └── layout/           # Layout components
│
├── admin/                 # Admin dashboard
│   ├── components/       # Admin-specific components
│   ├── pages/            # Admin pages
│   │   ├── ProjectsManager.jsx
│   │   ├── MusicManager.jsx
│   │   ├── EducationManager.jsx
│   │   └── (more managers...)
│   └── layout/           # Admin layout
│
└── shared/               # Shared resources
    ├── components/       # Reusable UI components
    ├── services/         # API & data services
    ├── hooks/            # Custom React hooks
    ├── lib/              # Utilities & config
    └── styles/           # Global styles
```

---


## 🔒 Security

**Production-Grade Security (9/10 Score)**

- ✅ **Row Level Security (RLS)** enabled on all Supabase tables
- ✅ **Public Read, Admin Write** security model
- ✅ API keys secured server-side in Edge Functions
- ✅ Protected admin routes with authentication
- ✅ Input validation and XSS protection
- ✅ No sensitive data in client-side code

See [Audit Achievements](AUDIT_ACHIEVEMENTS.md) for detailed security analysis.

---

## 📊 Database Schema

**Tables** (9 total, all with RLS enabled):
- `projects` - Portfolio projects
- `tech_stacks` - Technologies and tools
- `education` - Educational background
- `profiles` - User profiles
- `tracks` - Music library
- `posts` - Blog posts (future use)
- `contacts` - Contact messages
- `site_analytics` - Analytics data (admin-only)
- `error_logs` - Error tracking (admin-only)

**Storage Buckets**:
- `project-images` - Project screenshots
- `profile-assets` - Profile images
- `music-tracks` - Audio files

---

## 🎨 Design Features

**Animations**
- GSAP ScrollTrigger for scroll-based reveals
- Smooth page transitions
- Hover effects and micro-interactions
- Optimized for 30fps performance

**Responsive Design**
- Mobile-first approach
- Breakpoints: sm, md, lg, xl, 2xl
- Verified across all device sizes

**Theming**
- CSS custom properties
- Consistent color palette

---

## 🏆 Code Quality

This project has been professionally audited and achieved an **A+ grade (98/100)**.

**Highlights**:
- ✅ Clean architecture with separation of concerns
- ✅ Industry-standard security practices
- ✅ Optimized performance (lazy loading, caching)
- ✅ Fully responsive and accessible
- ✅ Comprehensive error handling

See [Audit Achievements](AUDIT_ACHIEVEMENTS.md) for complete details.

---

## 📝 License

© 2026 Domince Aseberos. All rights reserved.

---

## 🤝 Contact

**Domince Aseberos**
- Portfolio: [doms.dev](https://doms.dev)
- GitHub: [@domince](https://github.com/yourusername)
- Email: daseberos@gmail.com

---

*Built with ❤️ using React, Vite, and Supabase*