-- Sync Profile
UPDATE profiles SET 
  name = 'Domince A. Aseberos',
  role = 'Web Developer',
  bio = 'I build real-world, interactive web applications using modern JavaScript frameworks, focusing on performance, clean UI, and practical features.',
  location = 'Davao City, Philippines',
  avatar_url = 'https://ywughwblapbknrrdumeq.supabase.co/storage/v1/object/public/avatars/profile.png',
  github_username = 'Domincee'
WHERE id IS NOT NULL;

-- Sync Education
UPDATE education SET 
  school = 'University of Mindanao ΓÇô Tagum City',
  degree = 'Bachelor of Science in Computer Science',
  level = 'Undergraduate',
  year_level = 3,
  logo_url = '/assets/umtc-logo.png'
WHERE id IS NOT NULL;

-- Sync Contacts
UPDATE contacts SET 
  email = 'daseberos@gmail.com',
  github = 'https://github.com/Domincee',
  linkedin = 'https://linkedin.com/in/domincee/',
  facebook = 'https://facebook.com/domince.aseberos',
  messenger = 'https://www.messenger.com/t/domince.aseberos'
WHERE id IS NOT NULL;

-- Sync Tech Stack
INSERT INTO tech_stacks (name, icon_name, type, color, display_order) VALUES (
  'React', 'React', 'core', '#61DAFB', 1
) ON CONFLICT (name) DO UPDATE SET 
  icon_name = EXCLUDED.icon_name,
  type = EXCLUDED.type,
  color = EXCLUDED.color,
  display_order = EXCLUDED.display_order;

INSERT INTO tech_stacks (name, icon_name, type, color, display_order) VALUES (
  'Next.js', 'Next.js', 'core', '#ffffff', 2
) ON CONFLICT (name) DO UPDATE SET 
  icon_name = EXCLUDED.icon_name,
  type = EXCLUDED.type,
  color = EXCLUDED.color,
  display_order = EXCLUDED.display_order;

INSERT INTO tech_stacks (name, icon_name, type, color, display_order) VALUES (
  'GSAP', 'GSAP', 'core', '#88CE02', 3
) ON CONFLICT (name) DO UPDATE SET 
  icon_name = EXCLUDED.icon_name,
  type = EXCLUDED.type,
  color = EXCLUDED.color,
  display_order = EXCLUDED.display_order;

INSERT INTO tech_stacks (name, icon_name, type, color, display_order) VALUES (
  'Tailwind', 'Tailwind', 'tool', '#06B6D4', 4
) ON CONFLICT (name) DO UPDATE SET 
  icon_name = EXCLUDED.icon_name,
  type = EXCLUDED.type,
  color = EXCLUDED.color,
  display_order = EXCLUDED.display_order;

INSERT INTO tech_stacks (name, icon_name, type, color, display_order) VALUES (
  'Figma', 'Palette', 'tool', '#F24E1E', 5
) ON CONFLICT (name) DO UPDATE SET 
  icon_name = EXCLUDED.icon_name,
  type = EXCLUDED.type,
  color = EXCLUDED.color,
  display_order = EXCLUDED.display_order;

INSERT INTO tech_stacks (name, icon_name, type, color, display_order) VALUES (
  'Supabase', 'Supabase', 'tool', '#3ECF8E', 6
) ON CONFLICT (name) DO UPDATE SET 
  icon_name = EXCLUDED.icon_name,
  type = EXCLUDED.type,
  color = EXCLUDED.color,
  display_order = EXCLUDED.display_order;

INSERT INTO tech_stacks (name, icon_name, type, color, display_order) VALUES (
  'Python', 'Python', 'learning', '#FFE873', 7
) ON CONFLICT (name) DO UPDATE SET 
  icon_name = EXCLUDED.icon_name,
  type = EXCLUDED.type,
  color = EXCLUDED.color,
  display_order = EXCLUDED.display_order;

INSERT INTO tech_stacks (name, icon_name, type, color, display_order) VALUES (
  'Three.js', 'Box', 'learning', '#ffffff', 8
) ON CONFLICT (name) DO UPDATE SET 
  icon_name = EXCLUDED.icon_name,
  type = EXCLUDED.type,
  color = EXCLUDED.color,
  display_order = EXCLUDED.display_order;

INSERT INTO tech_stacks (name, icon_name, type, color, display_order) VALUES (
  'Docker', 'Layers', 'learning', '#2496ED', 9
) ON CONFLICT (name) DO UPDATE SET 
  icon_name = EXCLUDED.icon_name,
  type = EXCLUDED.type,
  color = EXCLUDED.color,
  display_order = EXCLUDED.display_order;

INSERT INTO tech_stacks (name, icon_name, type, color, display_order) VALUES (
  'JavaScript (ES6+)', 'Code2', 'core', NULL, 10
) ON CONFLICT (name) DO UPDATE SET 
  icon_name = EXCLUDED.icon_name,
  type = EXCLUDED.type,
  color = EXCLUDED.color,
  display_order = EXCLUDED.display_order;

INSERT INTO tech_stacks (name, icon_name, type, color, display_order) VALUES (
  'Node.js', 'Server', 'core', NULL, 11
) ON CONFLICT (name) DO UPDATE SET 
  icon_name = EXCLUDED.icon_name,
  type = EXCLUDED.type,
  color = EXCLUDED.color,
  display_order = EXCLUDED.display_order;

INSERT INTO tech_stacks (name, icon_name, type, color, display_order) VALUES (
  'TanStack Query', 'Zap', 'core', NULL, 12
) ON CONFLICT (name) DO UPDATE SET 
  icon_name = EXCLUDED.icon_name,
  type = EXCLUDED.type,
  color = EXCLUDED.color,
  display_order = EXCLUDED.display_order;

INSERT INTO tech_stacks (name, icon_name, type, color, display_order) VALUES (
  'Zustand', 'Layers', 'core', NULL, 13
) ON CONFLICT (name) DO UPDATE SET 
  icon_name = EXCLUDED.icon_name,
  type = EXCLUDED.type,
  color = EXCLUDED.color,
  display_order = EXCLUDED.display_order;

INSERT INTO tech_stacks (name, icon_name, type, color, display_order) VALUES (
  'Axios', 'Globe', 'core', NULL, 14
) ON CONFLICT (name) DO UPDATE SET 
  icon_name = EXCLUDED.icon_name,
  type = EXCLUDED.type,
  color = EXCLUDED.color,
  display_order = EXCLUDED.display_order;

INSERT INTO tech_stacks (name, icon_name, type, color, display_order) VALUES (
  'Git', 'Github', 'tool', NULL, 15
) ON CONFLICT (name) DO UPDATE SET 
  icon_name = EXCLUDED.icon_name,
  type = EXCLUDED.type,
  color = EXCLUDED.color,
  display_order = EXCLUDED.display_order;

-- Sync Projects
INSERT INTO projects (id, title, short_description, project_type, date_created, image_url, images, stacks, live_preview_link, github_link, full_documentation, documentation_files, display_order) VALUES (
  'banana-leaf-detection', 'Banana Leaf Disease Detector', 'A machine learning web application built with Python, OpenCV, scikit-learn, and Flask to detect whether a banana leaf is Healthy, Unhealthy, or Not a Leaf using image processing and KNN classification.', 'AI/Research', '2023-11-20', 'https://ywughwblapbknrrdumeq.supabase.co/storage/v1/object/public/project-images/banana-leaf.png', '["/assets/projects/cover/BananaLeaf.png"]', '["Python","OpenCV","Flask","scikit-learn"]', 'https://banana-leaf-detector.onrender.com/', 'https://github.com/Domincee/Banana-Leaf-Detector', '## Project Overview

This project extracts texture and color-based features
 (using **GLCM**, **LBP**, and **HOG**) from banana leaf images, trains a **K-Nearest Neighbors (KNN)** classifier, and serves the prediction through a simple Flask web app.

### Key Features

- Trained KNN model for 3-class classification
- Uses advanced image feature extraction (GLCM, LBP, HOG)
- Visualizes feature importance and class balance
- Flask web interface for uploading and detecting banana leaves
- Dataset augmentation and scaling with MinMaxScaler

## Project Structure

```
project/
Γö£ΓöÇΓöÇ app.py                  # Flask app (main entry)
Γö£ΓöÇΓöÇ extract_features.py     # Feature extraction functions
Γö£ΓöÇΓöÇ generate_aug.py         # Data augmentation script
Γö£ΓöÇΓöÇ knn_trainer.py         # Model training script
Γö£ΓöÇΓöÇ scale.py               # Feature scaling and preprocessing
Γö£ΓöÇΓöÇ visualization.ipynb    # Data visualization and analysis
Γö£ΓöÇΓöÇ dataset/               # Dataset organization
Γöé   Γö£ΓöÇΓöÇ raw_data/         # Original dataset
Γöé   Γöé   Γö£ΓöÇΓöÇ Diseased_leaf/
Γöé   Γöé   Γö£ΓöÇΓöÇ Healthy_leaf/
Γöé   Γöé   ΓööΓöÇΓöÇ Non_leaf/
Γöé   Γö£ΓöÇΓöÇ train_data/       # Training dataset
Γöé   ΓööΓöÇΓöÇ test_data/        # Testing dataset
Γö£ΓöÇΓöÇ static/               # Static files for web interface
Γöé   ΓööΓöÇΓöÇ styles.css        # CSS styling
Γö£ΓöÇΓöÇ templates/            # HTML templates
Γöé   ΓööΓöÇΓöÇ index.html       # Main web interface
Γö£ΓöÇΓöÇ uploads/             # Temporary storage for uploaded images
Γö£ΓöÇΓöÇ requirements.txt     # Python dependencies
ΓööΓöÇΓöÇ README.md           # Project documentation
```

## How to Run the App

### 1. Clone the repository

```bash
git clone https://github.com/Domincee/Banana-Leaf-Detector.git
cd Banana-Leaf-Detector
```

### 2. Create a virtual environment (recommended)

```bash
# Windows
python -m venv venv
.\\venv\\Scripts\\Activate.ps1

# Linux/MacOS
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the Flask app

```bash
python app.py
```

### 5. Open in your browser

```
http://127.0.0.1:5000
```

## Model Performance

| Metric | Training Accuracy | Test Accuracy |
|--------|------------------|---------------|
| **KNN** | 0.9991 | 0.90423 |

### Classification Report (Test Set)

```
                precision    recall  f1-score   support

  Healthy Leaf       0.91      0.94      0.92       149
     None-leaf       0.93      0.87      0.90       150
Unhealthy leaf       0.88      0.90      0.89       150

      accuracy                           0.90       449
     macro avg       0.90      0.90      0.90       449
  weighted avg       0.90      0.90      0.90       449
```

## Dataset Information

The dataset consists of **2,245 images** resized to **128├ù128**, organized into three categories:

| Category | Image Count | Description |
|----------|-------------|-------------|
| **Healthy Leaf** | 745 | Augmented images of healthy banana leaves |
| **Unhealthy Leaf** | 750 | Actual images of diseased banana leaves |
| **Non-Leaf** | 750 | Negative samples (self-collected) |
| **Total** | **2,245** | Complete dataset |

### Dataset Split

- **Training Set**: 1,796 images (80%)
- **Test Set**: 449 images (20%)

> **Note**: Raw and training datasets are not included in this repository due to file size limits. You can download them from: [Google Drive](https://drive.google.com/drive/folders/1mng06d0Y_U4hC7WM5hnbBNbuC5ohulcq?usp=sharing)

## Technologies Used

- **Python 3.11**
- **OpenCV** - Computer vision and image processing
- **NumPy & Pandas** - Data manipulation
- **scikit-learn** - Machine learning algorithms
- **scikit-image** - Image processing utilities
- **Matplotlib / Seaborn** - Data visualization
- **Flask** - Web framework

## License

┬⌐ 2025 Domince Aseberos. All rights reserved.

This project is released under the **MIT License**.

You are free to use, copy, modify, and distribute this software for educational or research purposes, provided that proper credit is given to the author.

> **Note**: The dataset and sample images are for demonstration and research purposes only. They may contain content collected from public sources and are **not included in this repository** to comply with data-sharing and copyright policies.', '[{"label":"Project Dataset","path":"https://drive.google.com/drive/folders/1mng06d0Y_U4hC7WM5hnbBNbuC5ohulcq?usp=sharing"}]', 1
) ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  project_type = EXCLUDED.project_type,
  date_created = EXCLUDED.date_created,
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  stacks = EXCLUDED.stacks,
  live_preview_link = EXCLUDED.live_preview_link,
  github_link = EXCLUDED.github_link,
  full_documentation = EXCLUDED.full_documentation,
  documentation_files = EXCLUDED.documentation_files,
  display_order = EXCLUDED.display_order;

INSERT INTO projects (id, title, short_description, project_type, date_created, image_url, images, stacks, live_preview_link, github_link, full_documentation, documentation_files, display_order) VALUES (
  'focus-quest', 'Focus Quest App', 'A productivity RPG app turning tasks into quests with XP and stats.', 'Productivity/Personal', '2024-02-15', 'https://ywughwblapbknrrdumeq.supabase.co/storage/v1/object/public/project-images/focus-quest.png', '["/assets/projects/cover/FocusQuest.png"]', '["React","Tailwind CSS","GSAP"]', 'https://domincee-portfolio.vercel.app/', 'https://github.com/Domincee', '## Introduction

**Focus Quest** gamifies productivity by transforming your daily tasks into RPG-style quests. Level up your character, unlock achievements, and watch your stats grow as you complete real-world goals.

## Core Features

- Task-to-Quest conversion system
- XP and level progression
- Character stats (Focus, Productivity, Consistency)
- Achievement badges
- Streak tracking
- GSAP-powered animations

## Technology

Built with React for a responsive SPA experience, styled with Tailwind CSS for rapid UI development, and animated with GSAP for smooth, engaging interactions.', NULL, 2
) ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  project_type = EXCLUDED.project_type,
  date_created = EXCLUDED.date_created,
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  stacks = EXCLUDED.stacks,
  live_preview_link = EXCLUDED.live_preview_link,
  github_link = EXCLUDED.github_link,
  full_documentation = EXCLUDED.full_documentation,
  documentation_files = EXCLUDED.documentation_files,
  display_order = EXCLUDED.display_order;

INSERT INTO projects (id, title, short_description, project_type, date_created, image_url, images, stacks, live_preview_link, github_link, full_documentation, documentation_files, display_order) VALUES (
  'baylora', 'Baylora', 'A modern marketplace and trading platform where users can sell, trade, or mix transactions, with bidding, verified profiles, and secure authentication.', 'E-commerce/Platform', '2024-05-10', 'https://ywughwblapbknrrdumeq.supabase.co/storage/v1/object/public/project-images/baylora.png', '["/assets/projects/cover/Baylora.png"]', '["React","Supabase","Tailwind"]', 'https://domincee-portfolio.vercel.app/', 'https://github.com/Domincee', '## Platform Overview

**Baylora** is a next-generation marketplace that combines traditional buying/selling with modern trading mechanics. Users can list items for direct sale, open trades, or enable hybrid transactions.

## Key Capabilities

- **Multi-Transaction Modes**: Buy, Sell, Trade, or Mix
- **Real-time Bidding**: Live auction system powered by Supabase Realtime
- **Verified Profiles**: Trust system with user ratings
- **Secure Auth**: Supabase authentication with email and social logins
- **Responsive Design**: Mobile-first Tailwind CSS implementation

## Technical Stack

Built on Supabase for backend (PostgreSQL + Realtime + Auth), React for frontend state management, and Tailwind for a modern, consistent design system.', NULL, 3
) ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  project_type = EXCLUDED.project_type,
  date_created = EXCLUDED.date_created,
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  stacks = EXCLUDED.stacks,
  live_preview_link = EXCLUDED.live_preview_link,
  github_link = EXCLUDED.github_link,
  full_documentation = EXCLUDED.full_documentation,
  documentation_files = EXCLUDED.documentation_files,
  display_order = EXCLUDED.display_order;

INSERT INTO projects (id, title, short_description, project_type, date_created, image_url, images, stacks, live_preview_link, github_link, full_documentation, documentation_files, display_order) VALUES (
  'templyx', 'Templyx', 'A modern portfolio platform for developers with authentication, real-time features, and community interaction.', 'Platform/Community', '2024-08-22', 'https://ywughwblapbknrrdumeq.supabase.co/storage/v1/object/public/project-images/templyx.png', '["/assets/projects/cover/Templyx.png"]', '["React","Lucide","Vite"]', 'https://domincee-portfolio.vercel.app/', 'https://github.com/Domincee', '## About Templyx

**Templyx** is a portfolio showcase platform designed for developers to share their work, connect with peers, and discover inspiration.

## Features

- User authentication and profiles
- Project showcase with rich media
- Community interaction (likes, comments)
- Real-time updates
- Lucide icon system for consistent UI

## Built With

Vite for lightning-fast development, React for component-based architecture, and Lucide for a beautiful icon set.', NULL, 4
) ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  project_type = EXCLUDED.project_type,
  date_created = EXCLUDED.date_created,
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  stacks = EXCLUDED.stacks,
  live_preview_link = EXCLUDED.live_preview_link,
  github_link = EXCLUDED.github_link,
  full_documentation = EXCLUDED.full_documentation,
  documentation_files = EXCLUDED.documentation_files,
  display_order = EXCLUDED.display_order;

INSERT INTO projects (id, title, short_description, project_type, date_created, image_url, images, stacks, live_preview_link, github_link, full_documentation, documentation_files, display_order) VALUES (
  'ai-text-summarizer', 'AI Text Summarizer', 'A web application that generates concise summaries from long text or articles using an AI-powered NLP API.', 'AI/Utility', '2024-10-05', 'https://ywughwblapbknrrdumeq.supabase.co/storage/v1/object/public/project-images/summarizer.png', '["/assets/projects/cover/summarizer.png"]', '["React","NLP","API"]', 'https://domincee-portfolio.vercel.app/', 'https://github.com/Domincee', '## AI-Powered Summarization

The **AI Text Summarizer** uses state-of-the-art Natural Language Processing to condense lengthy articles, documents, or text into concise, readable summaries.

## How It Works

1. User pastes or uploads text content
2. Text is sent to NLP API for processing
3. AI extracts key sentences and concepts
4. Summary is generated and displayed
5. User can adjust summary length

## Use Cases

- Research paper summarization
- News article digests
- Document review
- Content curation

## Technology

React frontend integrated with third-party NLP API for intelligent text processing.', NULL, 5
) ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  project_type = EXCLUDED.project_type,
  date_created = EXCLUDED.date_created,
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  stacks = EXCLUDED.stacks,
  live_preview_link = EXCLUDED.live_preview_link,
  github_link = EXCLUDED.github_link,
  full_documentation = EXCLUDED.full_documentation,
  documentation_files = EXCLUDED.documentation_files,
  display_order = EXCLUDED.display_order;


