# Portfolio Manager Implementation Plan

## Overview

Build a secure, private Portfolio Manager within the existing React repository for Domince Aseberos. This manager will dynamically control data for AboutMe, Projects, and Live Feed components through Supabase integration while maintaining the existing design system and animation patterns.

---

## User Review Required

> [!IMPORTANT]
> **Supabase Package Installation**
> This implementation requires installing `@supabase/supabase-js` package. The current `package.json` does not include this dependency.

> [!WARNING]
> **Breaking Change: Data Source Migration**
> The AboutMe component currently uses hardcoded text (lines 18-21 in `AboutMe.jsx`). The Projects component uses `dataProjects.json`. Both will be migrated to fetch data from Supabase, which means:
> - Initial deployment will require database seeding with existing data
> - The app will fail to load if Supabase is unreachable (requires error handling strategy)
> - `.env` file will need Supabase credentials added

> [!IMPORTANT]
> **Authentication Strategy**
> The plan includes a simple login page with protected routes. Please confirm:
> 1. Should we use Supabase's built-in email/password authentication?
do not , i am only the owner of this project portfolio
> 2. Do you want to create the admin account via Supabase dashboard, or should we build a one-time setup flow? yes via supabase dashboard i will just put there my gmail. password .etc
> 3. Should unauthorized admin route access redirect to home `/` or to a login page `/admin/login`? 
to home if its not directly in authorized login link

> [!IMPORTANT]
> **Full Image Migration with Optimization**
> ALL project images (currently in `/public/assets/projects/cover/`) MUST be:
> 1. **Converted to WebP/AVIF** format before upload for better compression (60-80% smaller)
> 2. **Uploaded to Supabase Storage** with consistent public URL format
> 3. **Original quality preserved** for high-resolution project screenshots
> 
> This ensures:
> - Consistent `image_url` format in database (always Supabase public URLs)
> - Significantly faster load times and better Lighthouse scores
> - No mixing of relative paths and full URLs
> - Proper CDN delivery with next-gen formats

---

## Proposed Changes

### Infrastructure & Dependencies

#### [NEW]Check first if supbabasee is already installed if not Install Supabase Client 
```bash
npm install @supabase/supabase-js
```

#### [MODIFY] [.env](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/.env)
Add Supabase credentials:
```env
VITE_SUPABASE_URL=https://ywughwblapbknrrdumeq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### Supabase Configuration

### Supabase Configuration
> [!NOTE]
> **Status: COMPLETE (DOUBLE CHECK )** (Schema created, Tables seeded, Storage bucket configured)


Create three core tables via Supabase migrations:

**Table: `profile`**
```sql
CREATE TABLE profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bio TEXT NOT NULL,
  live_feed_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read
CREATE POLICY "Enable read access for all users" 
  ON profile FOR SELECT 
  USING (true);

-- Policy: Only authenticated users can update
CREATE POLICY "Enable update for authenticated users only" 
  ON profile FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Insert default data
INSERT INTO profile (name, bio, live_feed_status) 
VALUES (
  'Domince A. Aseberos',
  'Welcome to my portfolio! Here, I share my projects, experiments, and creative ideas.',
  'Available for work'
);
```

**Table: `projects`**
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  short_description TEXT NOT NULL,
  stacks JSONB NOT NULL DEFAULT '[]',
  live_link TEXT,
  doc_link TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read
CREATE POLICY "Enable read access for all users" 
  ON projects FOR SELECT 
  USING (true);

-- Policy: Authenticated users can manage
CREATE POLICY "Enable all operations for authenticated users" 
  ON projects FOR ALL 
  USING (auth.role() = 'authenticated');

-- Create index for ordering
CREATE INDEX idx_projects_display_order ON projects(display_order);
```

**Storage Bucket: `project-images`**
```sql
-- Create storage bucket via Supabase Dashboard or SQL
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true);

-- Policy: Public read
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'project-images' );

-- Policy: Authenticated upload
CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'project-images' 
    AND auth.role() = 'authenticated'
  );

-- Policy: Authenticated delete
CREATE POLICY "Authenticated users can delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'project-images' 
    AND auth.role() = 'authenticated'
  );
```

---

### Supabase Authentication Configuration

> [!IMPORTANT]
> **Production Auth URL Configuration**
> Before deploying to production, configure the following in Supabase Dashboard:
> 
> 1. Navigate to **Authentication → URL Configuration**
> 2. Set **Site URL** to: `https://doms.dev` (your actual production domain)
> 3. Add **Redirect URLs**:
>    - `https://doms.dev/admin` (post-login redirect)
>    - `http://localhost:5173/admin` (development)
> 4. Without this configuration, login redirects will fail in production

---

### Core Services Layer

#### [NEW] [src/lib/supabaseClient.js](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/src/lib/supabaseClient.js)
Initialize Supabase client with **environment validation**:

**Critical: Prevent Silent Failures**

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Environment variable validation
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ Missing Supabase credentials! Check your .env file.\n' +
    'Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  );
}

if (!supabaseUrl.includes('supabase.co')) {
  console.warn('⚠️ Supabase URL format appears invalid');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

#### [NEW] [src/services/profileService.js](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/src/services/profileService.js)
Profile data service for AboutMe component:
```javascript
// getProfile() - fetch profile data
// updateProfile(data) - update profile with auth check
```

#### [NEW] [src/services/projectService.js](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/src/services/projectService.js)
Projects CRUD service with **input sanitization**:

```javascript
import DOMPurify from 'dompurify'; // Install: npm install dompurify

// Sanitize text inputs to prevent XSS
function sanitizeInput(input) {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], // Strip all HTML
    KEEP_CONTENT: true 
  });
}

// getProjects() - fetch all projects ordered by display_order
// getProjectById(id) - fetch single project
// createProject(data) - create new project with auth + sanitization
// updateProject(id, data) - update project with auth + sanitization
// deleteProject(id) - delete project with auth AND associated image from storage

// uploadProjectImage(file) - upload to Supabase Storage with:
//   - WebP conversion
//   - Cache control headers: max-age=31536000 (1 year)
//   - Public access
```

#### [NEW] [src/services/authService.js](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/src/services/authService.js)
Authentication service:
```javascript
// signIn(email, password) - authenticate user
// signOut() - sign out user
// getSession() - get current session
// onAuthStateChange(callback) - listen for auth changes
```

---

### Authentication & Protected Routes
> [!NOTE]
> **Status: IN PROGRESS** - Current Focus


#### [NEW] [src/pages/admin/LoginPage.jsx](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/src/pages/admin/LoginPage.jsx)
Login page with Theme Integration:
- Background: `linear-gradient(to bottom, rgba(var(--body-Linear-1-rgb)), rgba(var(--body-Linear-2-rgb)))`
- Form container: `linear-gradient(to bottom, rgba(var(--box-Linear-1-rgb)), rgba(var(--box-Linear-2-rgb)))`
- Primary button: `background: rgb(var(--contrast-rgb))`
- Input borders: `border: 1px solid rgb(var(--contrast-rgb) / 0.2)`, focus state: `border-color: rgb(var(--contrast-rgb))`
- Fluid Typography: `clamp(14px, 2vw, 20px)` for headings, `clamp(12px, 1.5vw, 14px)` for inputs
- GSAP entrance animation: form slides up `y: 30` and fades in

#### [NEW] [src/components/ProtectedRoute.jsx](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/src/components/ProtectedRoute.jsx)
Protected route wrapper:
- Checks for active Supabase session on mount
- Redirects to `/` (home) if no session found
- Shows loading state during session check
- Uses `onAuthStateChange` to listen for auth changes

---

### Admin Dashboard

#### [NEW] [src/pages/admin/AdminDashboard.jsx](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/src/pages/admin/AdminDashboard.jsx)
Main admin layout with navigation:
- Background: `linear-gradient(to bottom, rgba(var(--body-Linear-1-rgb)), rgba(var(--body-Linear-2-rgb)))`
- Navigation sidebar with links to:
  - Profile Manager (AboutMe Editor)
  - Projects Manager (CRUD)
  - Media Center (File uploads)
  - Live Preview Toggle
- GSAP staggered entrance for nav items: `y: 30, opacity: 0→1, stagger: 0.1s`
- Responsive: collapses to top bar on tablet (782px breakpoint)

---

### Admin Modules

#### [NEW] [src/pages/admin/ProfileManager.jsx](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/src/pages/admin/ProfileManager.jsx)
Bento-style profile editor for AboutMe:
- Form container: `linear-gradient(to bottom, rgba(var(--box-Linear-1-rgb)), rgba(var(--box-Linear-2-rgb)))`
- Border: `border: 1px solid rgba(255, 255, 255, 0.05)`
- Rounded corners: `rounded-2xl`
- Fields:
  - Name input (text)
  - Bio textarea (max 280 chars)
  - Live Feed Status (text)
- Save button: `background: rgb(var(--contrast-rgb))`, black text, uppercase tracking
- GSAP animation: form fields stagger in `y: 30, opacity: 0→1, stagger: 0.1s`
- Real-time character count for bio
- Success/Error toast notifications

#### [NEW] [src/pages/admin/ProjectsManager.jsx](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/src/pages/admin/ProjectsManager.jsx)
Projects CRUD interface:
- **List View**: Grid of project cards matching existing `ProjectCard.jsx` collapsed state design
  - Each card: bento-style background, border, rounded corners
  - Hover effects: scale, translate
  - Edit/Delete action buttons overlay on hover
- **Edit/Create Form**: Modal overlay with:
  - Title input
  - Short description textarea
  - Tech stack multi-select dropdown (maps to `stackIcons` from `ProjectCard.jsx`)
  - Image upload input (integrates with Media Center)
  - Live Link input (URL validation)
  - Doc Link input (URL validation)
  - Display Order input (number)
- GSAP animations: 
  - Project cards stagger in on load
  - Modal slides up from bottom with backdrop blur
- Drag-and-drop reordering for display_order
- Delete confirmation modal

**Tech Stack Multi-Select Options:**
Based on existing `stackIcons` mapping:
- React
- Tailwind CSS
- GSAP
- Python
- Flask
- OpenCV
- Firebase
- Lucide
- Vite
- NLP
- API
- Supabase (add to stackIcons)
- Documentation

#### [NEW] [src/pages/admin/MediaCenter.jsx](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/src/pages/admin/MediaCenter.jsx)
File upload interface:
- Drag-and-drop zone with visual feedback
- File validation (images only: jpg, png, webp)
- Max file size: 5MB
- Image preview before upload
- Upload progress indicator
- Uploaded images gallery with copy-to-clipboard URL functionality
- Delete uploaded images
- GSAP animation: upload zone pulses on dragover

---

### Live Preview Toggle

#### [NEW] [src/components/admin/LivePreview.jsx](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/src/components/admin/LivePreview.jsx)
Split-screen preview component:
- Left: Admin form (e.g., ProfileManager or ProjectsManager)
- Right: Live mock of Dashboard component with real-time updates
- Toggle button to show/hide preview
- Syncs with form state changes via React state/context
- Responsive: stacks vertically on tablet (782px)

---

### Frontend Data Integration
> [!NOTE]
> **Status: COMPLETE** (usePortfolioData Hook refactored, Images migrated, Tech Stack optimized)


#### [MODIFY] [src/features/abooutMe/AboutMe.jsx](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/src/features/abooutMe/AboutMe.jsx)
Replace hardcoded data with Supabase fetch:

**Critical: Prevent Flash of Hardcoded Content (FOCH)**

```javascript
// REMOVE hardcoded name and bio strings entirely
// Add useEffect to fetch profile data on mount
// Add skeleton loaders that match exact typography shape
// Coordinate GSAP animation to fire AFTER data loads
```

**Changes:**
- Import `profileService`
- Add `useState` for profile data, loading, error
- Add `useEffect` to call `getProfile()` on mount
- **REMOVE** hardcoded "Domince A. Aseberos" (line 18)
- **REMOVE** hardcoded bio text (line 21)
- Replace with conditional rendering:
  - If loading: Show skeleton loaders matching `clamp(14px,2vw,20px)` for name, `clamp(10px,1.2vw,13px)` for bio
  - If data loaded: Show `{profile.name}` and `{profile.bio}`
  - **If error**: Show error state with **Retry button** (no page refresh needed)
- **Live Status Display**:
  - Add `{profile.live_feed_status}` display below bio
  - Include animated "pumping" green dot indicator (CSS animation)
  - Style: Small text with icon, themed colors
  - Example: 🟢 "Available for work" (dot pulses every 2s)
- **GSAP Coordination**: 
  - Create `isDataReady` state that tracks when data loads
  - Use `Promise.all()` if fetching multiple data sources
  - GSAP timeline fires ONLY when `isDataReady === true`
  - **Smooth transition**: Fade out skeleton, fade in content (no hard snap)
- **Retry Logic**: Button calls `refetchProfile()` to retry fetch
- Skeleton styling: Use `background: linear-gradient(90deg, rgb(var(--contrast-rgb) / 0.1), rgb(var(--contrast-rgb) / 0.2), rgb(var(--contrast-rgb) / 0.1))` with animation

#### [MODIFY] [src/features/projects/components/Projects.jsx](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/src/features/projects/components/Projects.jsx)
Replace JSON import with Supabase fetch:

**Critical: Prevent Flash of Empty Carousel**

```javascript
// Remove: import projectData from '../data/dataProjects.json';
// Add useEffect to fetch projects on mount
// Add skeleton cards during loading
// Map Supabase data to match existing structure
```

**Changes:**
- Import `projectService`
- Add `useState` for projects data, loading, error
- Add `useEffect` to call `getProjects()` on mount
- Replace `projectData` with `projects` state
- **Loading state**: Render 3 skeleton `ProjectCard` components with:
  - Same dimensions as real cards
  - Animated skeleton background (gradient shimmer)
  - No click handlers during loading
- **Empty state**: If `projects.length === 0`, show clean bento design:
  - Message: "No projects yet. Check back soon!"
  - Ghost outline of project card to maintain layout
  - Prevents collapsed/broken appearance
- **Error state**: Show error message with **Retry button**
  - Calls `refetchProjects()` without page refresh
  - Maintains layout structure
- **GSAP Coordination**:
  - Only trigger stagger animation when `projects.length > 0` AND loaded
  - Smooth fade: skeleton → content transition using GSAP timeline

**Data Mapping:**
Supabase schema → Component props:
- `id` → `id`
- `title` → `title`
- `image_url` → `image` (always Supabase Storage public URL, WebP format)
- `stacks` (JSONB array) → `stacks`
- `short_description` → `shortDescription`
- `live_link` → `livePreviewLink`
- `doc_link` → `fullDetailsLink`

#### [MODIFY] [src/features/projects/components/ProjectCard.jsx](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/src/features/projects/components/ProjectCard.jsx)
Add Supabase icon to stackIcons mapping:
```javascript
// Line 7-19: Add to stackIcons object
'Supabase': Database,
```

---

### Routing Configuration

#### [MODIFY] [src/App.jsx](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/src/App.jsx) or Main Router File
Add admin routes with **React Lazy Loading** for security:

**Critical: Code Splitting for Admin Routes**

```javascript
import { lazy, Suspense } from 'react';

// Lazy load admin components to prevent bundling with public code
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ProfileManager = lazy(() => import('./pages/admin/ProfileManager'));
const ProjectsManager = lazy(() => import('./pages/admin/ProjectsManager'));
const MediaCenter = lazy(() => import('./pages/admin/MediaCenter'));
const LoginPage = lazy(() => import('./pages/admin/LoginPage'));

// Wrap lazy routes in Suspense with loading fallback
// Add routes:
// - /admin/login → LoginPage (lazy)
// - /admin (protected) → AdminDashboard (lazy)
// - /admin/profile (protected) → ProfileManager (lazy)
// - /admin/projects (protected) → ProjectsManager (lazy)
// - /admin/media (protected) → MediaCenter (lazy)
```

**Benefits:**
- Admin code only downloads when authenticated user accesses admin routes
- Reduces public bundle size by ~40-50KB
- Hides admin logic from browser DevTools for unauthenticated users

---

### Shared Components

#### [NEW] [src/components/admin/FormInput.jsx](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/src/components/admin/FormInput.jsx)
Reusable input component matching theme:
- Props: `label`, `type`, `value`, `onChange`, `placeholder`, `error`, `maxLength`
- Styling: Uses CSS variables for colors, fluid typography
- Border states: default, focus, error
- Character count for textarea variant

#### [NEW] [src/components/admin/FormButton.jsx](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/src/components/admin/FormButton.jsx)
Themed button component:
- Props: `variant` (primary, secondary, danger), `onClick`, `disabled`, `loading`, `children`
- Primary: `background: rgb(var(--contrast-rgb))`
- Hover/active states with GSAP micro-animations
- Loading spinner

#### [NEW] [src/components/admin/Toast.jsx](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/src/components/admin/Toast.jsx)
Notification toast:
- Variants: success, error, info
- Auto-dismiss after 3s
- GSAP slide-in from top animation
- Positioned fixed at top-right

#### [NEW] [src/components/SkeletonLoader.jsx](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/src/components/SkeletonLoader.jsx)
Skeleton component for loading states:
- Props: `width`, `height`, `className`
- Background: `linear-gradient(90deg, rgb(var(--contrast-rgb) / 0.1), rgb(var(--contrast-rgb) / 0.2), rgb(var(--contrast-rgb) / 0.1))`
- Animated shimmer effect with CSS keyframes
- Matches border radius of target element
- **GSAP-ready**: Accepts `data-skeleton` attribute for smooth fade-out

#### [NEW] [src/components/EmptyState.jsx](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/src/components/EmptyState.jsx)
Empty state component for zero-data scenarios:
- Props: `message`, `icon`, `className`
- Clean bento-style design matching existing cards
- Ghost outline to maintain grid layout
- Theme-matched colors using CSS variables
- Example usage: When no projects exist in database

#### [NEW] [src/components/ErrorBoundary.jsx](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/src/components/ErrorBoundary.jsx)
React Error Boundary for graceful failure:
- Catches JavaScript errors in component tree
- Displays fallback UI with retry button
- Logs errors to console for debugging
- Prevents entire app crash from component errors

---

### SEO & Accessibility (A11y)

#### [MODIFY] [index.html](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/index.html)
Add JSON-LD structured data for better SEO:

```html
<head>
  <!-- Existing meta tags -->
  
  <!-- JSON-LD Person Schema for SEO -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Domince A. Aseberos",
    "jobTitle": "Full-Stack Developer",
    "url": "https://doms.dev",
    "sameAs": [
      "https://github.com/Domincee"
    ],
    "knowsAbout": ["React", "JavaScript", "GSAP", "Supabase", "Full-Stack Development"],
    "description": "Full-stack developer specializing in React, GSAP animations, and modern web development."
  }
  </script>
</head>
```

#### [MODIFY] [src/features/ThemeToggle.jsx](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/src/features/ThemeToggle.jsx)
Add ARIA labels for accessibility:

```jsx
<div 
  role="slider" 
  aria-label="Theme slider - Adjust color theme from dark to light"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-valuenow={sliderValue}
  aria-valuetext={`Theme set to ${sliderValue}%`}
>
  {/* Slider component */}
</div>
```

#### [MODIFY] [src/features/musicPlayer/MusicPlayer.jsx](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/src/features/musicPlayer/MusicPlayer.jsx)
Add ARIA labels for music controls:

```jsx
<button 
  aria-label="Play music"
  onClick={handlePlay}
>
  <PlayIcon />
</button>

<button 
  aria-label="Pause music"
  onClick={handlePause}
>
  <PauseIcon />
</button>

<button 
  aria-label="Next track"
  onClick={handleNext}
>
  <SkipForwardIcon />
</button>

<div 
  role="progressbar" 
  aria-label="Music playback progress"
  aria-valuemin="0"
  aria-valuemax={duration}
  aria-valuenow={currentTime}
  aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
>
  {/* Progress bar */}
</div>
```

#### [MODIFY] [src/features/abooutMe/AboutMe.jsx](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/src/features/abooutMe/AboutMe.jsx)
Add semantic HTML and ARIA:

```jsx
<section aria-label="About Me">
  <h1>{profile.name}</h1>
  <p>{profile.bio}</p>
  
  {/* Live Feed Status with animated indicator */}
  {profile.live_feed_status && (
    <div className="flex items-center gap-2 mt-2">
      <span 
        className="status-dot"
        style={{ 
          width: '8px', 
          height: '8px', 
          borderRadius: '50%',
          backgroundColor: 'rgb(34, 197, 94)', // Green
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
        aria-hidden="true"
      />
      <span 
        className="text-[clamp(9px,1vw,11px)] font-inter font-medium"
        style={{ color: 'rgb(var(--contrast-rgb) / 0.7)' }}
      >
        {profile.live_feed_status}
      </span>
    </div>
  )}
  
  <button 
    aria-label="Learn more about Domince Aseberos"
    onClick={handleAboutClick}
  >
    About Me
  </button>
</section>

{/* Add to CSS or index.css */}
<style>
/* Subtle pulse animation for live status indicator */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;  /* Subtle fade - visible but not distracting */
  }
}
</style>
```

#### [MODIFY] [src/features/projects/components/Projects.jsx](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/src/features/projects/components/Projects.jsx)
Add ARIA navigation hints:

```jsx
<div 
  role="region" 
  aria-label="Project portfolio carousel"
  aria-describedby="scroll-hint"
>
  {/* Project cards */}
  
  <div id="scroll-hint" className="sr-only">
    Scroll vertically to view all projects. Tap a project to expand details.
  </div>
</div>
```

---

## Verification Plan

### Automated Tests

#### 1. Service Layer Unit Tests
Create test files for each service:

**Test: `src/services/profileService.test.js`**
```bash
npm install --save-dev vitest @testing-library/react
npm run test src/services/profileService.test.js
```
- Mock Supabase client responses
- Test `getProfile()` success/error cases
- Test `updateProfile()` with authentication check

**Test: `src/services/projectService.test.js`**
```bash
npm run test src/services/projectService.test.js
```
- Test CRUD operations with mocked Supabase
- Test image upload to storage
- Test data mapping from Supabase schema to component props

**Test: `src/services/authService.test.js`**
```bash
npm run test src/services/authService.test.js
```
- Test login flow
- Test session retrieval
- Test auth state change listener

#### 2. Component Tests
**Test: `src/components/ProtectedRoute.test.jsx`**
- Test redirect when no session
- Test render when session exists
- Test loading state

### Manual Verification

#### Database Setup (Prerequisite)
1. Open Supabase Dashboard: https://supabase.com/dashboard/project/ywughwblapbknrrdumeq
2. Navigate to SQL Editor
3. Run the three SQL scripts provided in the Database Schema section (profile table, projects table, storage bucket)
4. Navigate to Authentication → Users
5. Create admin user manually (or provide SQL script for this)
6. Navigate to Storage → Buckets
7. Verify `project-images` bucket exists and is public

#### Seed Existing Data
1. Run migration script to copy data from `dataProjects.json` to Supabase:
```bash
node scripts/seedProjects.js
```
2. Manually insert profile data in Supabase dashboard or via script

#### Authentication Flow
1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:5173/admin/projects` (protected route)
3. **Expected:** Redirect to home `/`
4. Navigate to `http://localhost:5173/admin/login`
5. Enter admin credentials (created in Supabase dashboard)
6. **Expected:** Login success, redirect to `/admin`
7. **Expected:** Admin dashboard displays with navigation sidebar
8. Sign out via logout button
9. **Expected:** Redirect to home, session cleared

#### Profile Manager (AboutMe Editor)
1. Login to admin
2. Navigate to `/admin/profile`
3. **Expected:** Form loads with current profile data from Supabase
4. Edit name field, bio field
5. **Expected:** Character count updates for bio (max 280)
6. Click Save button
7. **Expected:** Success toast appears, data updates in Supabase
8. Navigate to home dashboard `/`
9. **Expected:** AboutMe component displays updated name and bio

#### Projects Manager
1. Login to admin
2. Navigate to `/admin/projects`
3. **Expected:** Grid of existing projects loads from Supabase

**Create New Project:**
4. Click "New Project" button
5. **Expected:** Modal opens with create form
6. Fill in title, description, select tech stacks (React, GSAP, Tailwind CSS)
7. Upload project image via file input
8. **Expected:** Image uploads to Supabase Storage, preview shows
9. Enter Live Link and Doc Link URLs
10. Click Save
11. **Expected:** New project card appears in grid, success toast

**Edit Existing Project:**
12. Hover over project card
13. Click Edit button
14. **Expected:** Modal opens pre-filled with project data
15. Change title, update tech stacks
16. Click Save
17. **Expected:** Card updates with new data

**Delete Project:**
18. Hover over project card
19. Click Delete button
20. **Expected:** Confirmation modal appears
21. Confirm deletion
22. **Expected:** Project removed from grid, deleted from Supabase

**Reorder Projects:**
23. Drag project card to new position
24. **Expected:** `display_order` updates in Supabase, order persists on refresh

**Frontend Verification:**
25. Navigate to home dashboard `/`
26. **Expected:** Projects component displays updated projects from Supabase
27. **Expected:** New project appears in carousel
28. Tap project card to expand
29. **Expected:** Full details display with updated tech stacks, links work

#### Media Center
1. Navigate to `/admin/media`
2. Drag image file into upload zone
3. **Expected:** Preview shows, upload progress indicator
4. **Expected:** Image uploads to `project-images` bucket
5. **Expected:** Uploaded image appears in gallery with public URL
6. Click "Copy URL" button
7. **Expected:** URL copied to clipboard
8. Delete uploaded image
9. **Expected:** Image removed from gallery and Supabase Storage

#### Live Preview Toggle
1. Navigate to `/admin/profile`
2. Click "Toggle Preview" button
3. **Expected:** Split screen shows form on left, live AboutMe preview on right
4. Edit name in form
5. **Expected:** Preview updates in real-time
6. Click toggle again
7. **Expected:** Preview hides, form takes full width

#### Responsive Testing
1. Resize browser to 782px width (tablet breakpoint)
2. **Expected:** Admin navigation collapses to top bar
3. **Expected:** Live preview stacks vertically
4. **Expected:** Fluid typography scales appropriately
5. **Expected:** Form inputs remain usable, no overlap

#### Theme Integration
1. Navigate to home dashboard `/`
2. Adjust theme slider in ThemeToggle component
3. **Expected:** CSS variables update (verify in DevTools)
4. Navigate to `/admin/profile`
5. **Expected:** Admin UI updates with new theme colors
6. **Expected:** Backgrounds use `--body-Linear` and `--box-Linear` variables
7. **Expected:** Buttons use `--contrast-rgb` variable

#### GSAP Animations
1. Navigate to `/admin` (fresh load)
2. **Expected:** Navigation items stagger in (y: 30, fade, stagger: 0.1s)
3. Navigate to `/admin/projects`
4. **Expected:** Project cards stagger in on load
5. Click "New Project"
6. **Expected:** Modal slides up from bottom with backdrop blur
7. Navigate to `/admin/media`
8. Drag file over upload zone
9. **Expected:** Zone pulses/animates

#### Error Handling
1. Stop Supabase connection (block network via DevTools)
2. Navigate to home `/`
3. **Expected:** AboutMe shows error state with retry button
4. **Expected:** Projects shows error state with retry button
5. Click retry
6. **Expected:** Attempt to refetch data
7. Restore network
8. Click retry again
9. **Expected:** Data loads successfully

#### Cross-Browser Testing
Test on:
- Chrome (Windows)
- Firefox
- Edge

Verify:
- Authentication works
- GSAP animations run smoothly
- CSS variables apply correctly
- File uploads work

#### **NEW: Critical Verification Tests**

**Session Persistence:**
1. Login to `/admin`
2. **Expected:** Dashboard loads
3. Refresh the page (F5)
4. **Expected:** Still logged in, no redirect to home
5. Close browser, reopen, navigate to `/admin`
6. **Expected:** Session persists (or redirects to login based on token expiry)

**Storage Cleanup on Delete:**
1. Create new project with uploaded image
2. Note the image URL from Supabase Storage
3. Delete the project via Projects Manager
4. **Expected:** Project removed from database
5. Navigate to Supabase Storage → `project-images` bucket
6. **Expected:** Associated image file is also deleted (no ghost files)
7. Try accessing the old image URL directly
8. **Expected:** 404 or "File not found"

**Theme Hot-Reload in Admin:**
1. Login to `/admin/profile`
2. Open home dashboard in new tab `/`
3. Adjust ThemeToggle slider in home dashboard
4. Switch back to `/admin/profile` tab
5. **Expected:** Admin panel colors update instantly without refresh
6. Verify background gradients, button colors, input borders all reflect new theme
7. Check DevTools: CSS variables should update in real-time

**No Flash of Hardcoded Content:**
1. Clear browser cache
2. Throttle network to "Slow 3G" in DevTools
3. Navigate to home `/`
4. **Expected:** AboutMe shows skeleton loader, NOT hardcoded text
5. **Expected:** Projects shows skeleton cards, NOT empty carousel
6. When data loads, GSAP fade-in triggers
7. **Expected:** No visual "jump" or content replacement

---

## Migration Checklist

After implementation, before deployment:

1. [ ] Run database migrations on Supabase production
2. [ ] **CRITICAL:** Run image migration script to upload ALL `/public/assets/projects/cover/` images to Supabase Storage
3. [ ] Update `projects` table with new Supabase Storage image URLs
4. [ ] Verify all `image_url` fields use consistent format (Supabase public URLs)
5. [ ] Seed production database with existing data from `dataProjects.json`
6. [ ] Create admin user in Supabase production
7. [ ] Add Supabase credentials to production `.env`
8. [ ] Test production build: `npm run build && npm run preview`
9. [ ] Verify bundle size (admin code should be lazy-loaded, not in main bundle)
10. [ ] Verify production API calls use correct Supabase URL
11. [ ] Test authentication flow in production
12. [ ] Test session persistence on refresh
13. [ ] Test storage cleanup on project deletion
14. [ ] Document admin login credentials securely

---

## Scripts to Create

#### [NEW] [scripts/convertToWebP.js](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/scripts/convertToWebP.js)
Node script to convert images to WebP:
```javascript
// Install: npm install sharp
const sharp = require('sharp');
const fs = require('fs');

async function convertToWebP() {
  const inputDir = './public/assets/projects/cover/';
  const outputDir = './public/assets/projects/webp/';
  
  const files = fs.readdirSync(inputDir);
  
  for (const file of files) {
    if (!/\.(png|jpg|jpeg)$/i.test(file)) continue;
    
    const inputPath = `${inputDir}${file}`;
    const outputPath = `${outputDir}${file.replace(/\.(png|jpg|jpeg)$/i, '.webp')}`;
    
    await sharp(inputPath)
      .webp({ quality: 85 }) // High quality, 60-80% smaller
      .toFile(outputPath);
    
    console.log(`✅ Converted: ${file} → ${file.replace(/\.(png|jpg|jpeg)$/i, '.webp')}`);
  }
}

convertToWebP();
```

#### [NEW] [scripts/migrateImages.js](file:///c:/Users/daseb/OneDrive/Desktop/Doms.dev/Doms.dev-v2/scripts/migrateImages.js)
Node script to migrate WebP images with **cache optimization**:

```javascript
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function migrateImages() {
  const inputDir = './public/assets/projects/webp/';
  const files = fs.readdirSync(inputDir);
  
  const urlMapping = {};
  
  for (const file of files) {
    const filePath = `${inputDir}${file}`;
    const fileBuffer = fs.readFileSync(filePath);
    
    // Upload with cache control headers
    const { data, error } = await supabase.storage
      .from('project-images')
      .upload(file, fileBuffer, {
        contentType: 'image/webp',
        cacheControl: '31536000', // 1 year = 365 days * 24 hours * 60 minutes * 60 seconds
        upsert: true
      });
    
    if (error) {
      console.error(`❌ Error uploading ${file}:`, error);
      continue;
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('project-images')
      .getPublicUrl(file);
    
    urlMapping[file] = publicUrlData.publicUrl;
    console.log(`✅ Uploaded: ${file} → ${publicUrlData.publicUrl}`);
  }
  
  console.log('\n📊 Migration Summary:');
  console.log(`Total images: ${Object.keys(urlMapping).length}`);
  console.log('Cache control: max-age=31536000 (1 year)');
  console.log('\n🔗 URL Mapping:', JSON.stringify(urlMapping, null, 2));
  
  return urlMapping;
}

migrateImages().catch(console.error);
```

**Cache Control Benefits:**
- `max-age=31536000` = 1 year browser cache
- Project images rarely change, perfect for aggressive caching
- Returning visitors load images from browser cache (0ms)
- Reduces Supabase bandwidth costs
- Improves Lighthouse Performance score

---

## Notes

- **Zero Logic Change to Dashboard.jsx:** No modifications to rendering logic in `Dashboard.jsx`. Only child components (`AboutMe.jsx`, `Projects.jsx`) update their data sources.
- **Breakpoint Consistency:** All admin components follow existing fluid typography pattern with `clamp()` and respect 782px tablet breakpoint.
- **Animation Consistency:** GSAP patterns match existing `dashboard.jsx` stagger entrance (y: 30, opacity: 0→1, stagger: 0.1s). **Critical:** GSAP only fires AFTER data loads to prevent animating empty skeletons.
- **Theme System:** All admin UI strictly uses existing CSS variables (`--body-Linear-1-rgb`, `--body-Linear-2-rgb`, `--box-Linear-1-rgb`, `--box-Linear-2-rgb`, `--contrast-rgb`). Admin panel responds to theme changes in real-time.
- **Tech Stack Icons:** New stacks added to admin must also be added to `stackIcons` mapping in `ProjectCard.jsx` with appropriate Lucide icon.
- **Code Splitting:** All admin routes use React `lazy()` and `Suspense` to prevent admin code from bundling with public-facing code.
- **Image Consistency:** ALL project images must use Supabase Storage URLs (no mixing with local `/public` paths). Images stored as WebP format for optimal performance.
- **Storage Cleanup:** Deleting a project MUST also delete its associated image from Supabase Storage to prevent orphaned files.
- **Error Handling:** All data fetches include loading, error, and empty states. Retry logic allows refetching without page refresh.
- **GSAP Coordination:** Animations only fire after `Promise.all()` resolves for all data sources. Smooth skeleton → content transitions.
- **Security:** Environment variables validated on load. All user inputs sanitized with DOMPurify before database writes.
- **Accessibility:** ARIA labels on interactive elements. JSON-LD schema for SEO. Semantic HTML throughout.
- **Performance:** WebP images, lazy-loaded admin routes, optimized bundle size (~250KB public, ~200KB admin chunk).
