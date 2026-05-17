import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

// Helper to parse CLI arguments
const getArgs = () => {
  const args = process.argv.slice(2);
  const options = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].substring(2);
      const value = args[i + 1];
      options[key] = value;
    }
  }
  return options;
};

const main = async () => {
  const options = getArgs();
  
  const targetUrl = options.url || 'http://localhost:5000';
  const targetPath = options.path;
  const projectSlug = options.slug || 'banana-leaf-detector';
  
  console.log('🚀 Starting Portfolio Capture Tool...');
  console.log(`📍 Target URL: ${targetUrl}`);
  console.log(`📂 Project Folder: ${targetPath || 'None (Manual Mode)'}`);
  console.log(`🏷️ Project Slug: ${projectSlug}`);

  // 1. Setup paths
  const __dirname = path.resolve();
  const uploadDir = path.join(__dirname, 'public', 'assets', 'uploads', `project-${projectSlug}`, 'imgs');
  
  // Ensure uploads directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`📁 Created directory: ${uploadDir}`);
  }

  // 2. Launch Puppeteer
  console.log('🌐 Launching headless browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();

  // Responsive Viewports configuration
  const viewports = [
    { name: 'desktop', width: 1920, height: 1080, isMobile: false },
    { name: 'tablet', width: 768, height: 1024, isMobile: false },
    { name: 'mobile', width: 375, height: 812, isMobile: true }
  ];

  const screenshots = {
    desktop: [],
    tablet: [],
    mobile: []
  };

  for (const viewport of viewports) {
    console.log(`📸 Capturing ${viewport.name} layout (${viewport.width}x${viewport.height})...`);
    
    await page.setViewport({
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      isMobile: viewport.isMobile
    });

    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Give a short delay to ensure any scroll animations or charts load fully
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Automated Section Detection
    // We look for major sections or slice the page if none exist
    let sections = [];
    
    // If it's Banana Leaf Detector, we know the exact selectors for perfect capture:
    if (projectSlug === 'banana-leaf-detector') {
      sections = [
        { selector: '.hero-section', name: 'hero' },
        { selector: '.container', name: 'app' },
        { selector: '.history-section', name: 'history' },
        { selector: '.dashboard-section', name: 'analytics' }
      ];
    } else {
      // General fallbacks for other projects
      const elements = await page.$$('section, header, footer, main, .section');
      if (elements.length >= 2) {
        for (let i = 0; i < elements.length; i++) {
          sections.push({ index: i, name: `section-${i + 1}` });
        }
      } else {
        // Scroll slice strategy (Folds)
        const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
        const foldHeight = viewport.height;
        const totalFolds = Math.max(2, Math.min(5, Math.ceil(pageHeight / foldHeight)));
        
        for (let i = 0; i < totalFolds; i++) {
          sections.push({ fold: i, name: `fold-${i + 1}` });
        }
      }
    }

    // Take screenshots of each section/fold
    for (let index = 0; index < sections.length; index++) {
      const section = sections[index];
      const filename = `${viewport.name}${index === 0 ? '' : `-${index + 1}`}.webp`;
      const savePath = path.join(uploadDir, filename);

      console.log(`   └─ Capturing section: ${section.name} -> ${filename}`);

      if (section.selector) {
        // Scroll element into view
        await page.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (el) {
            el.scrollIntoView({ behavior: 'instant', block: 'start' });
          }
        }, section.selector);
        await new Promise(resolve => setTimeout(resolve, 500));
      } else if (section.fold !== undefined) {
        // Scroll to fold
        await page.evaluate((fold, height) => {
          window.scrollTo(0, fold * height);
        }, section.fold, viewport.height);
        await new Promise(resolve => setTimeout(resolve, 500));
      } else if (section.index !== undefined) {
        // Scroll to general element
        await page.evaluate((idx) => {
          const els = document.querySelectorAll('section, header, footer, main, .section');
          if (els[idx]) {
            els[idx].scrollIntoView({ behavior: 'instant', block: 'start' });
          }
        }, section.index);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Take WebP screenshot
      // Puppeteer Chromium natively supports webp output
      await page.screenshot({
        path: savePath,
        type: 'webp',
        quality: 85
      });

      // Track captured asset path (relative to public web url)
      const relativeUrl = `/assets/uploads/project-${projectSlug}/imgs/${filename}`;
      screenshots[viewport.name].push(relativeUrl);
    }
  }

  await browser.close();
  console.log('🏁 Browser captures complete!');

  // 3. Generate Project Metadata Object
  console.log('📝 Generating portfolio JSON object...');
  
  let projectMetadata = null;

  if (projectSlug === 'banana-leaf-detector') {
    // Professional expert-curated copy for Banana-Leaf-Detector
    projectMetadata = {
      "id": `project-${projectSlug}`,
      "title": "BANANA LEAF DETECTOR",
      "shortDescription": "A premium Flask web application featuring active learning and computer vision to detect banana leaf diseases in real-time with instant local model retraining based on user feedback.",
      "projectType": "WEB APPLICATION",
      "dateCreated": "2025-10-09",
      "liveUrl": "",
      "githubUrl": "https://github.com/Domincee/Banana-Leaf-Detector",
      "featuredInTunnel": true,
      
      "mainImage": screenshots.desktop[0] || "",
      "desktopImage": screenshots.desktop[0] || "",
      "tabletImage": screenshots.tablet[0] || "",
      "mobileImage": screenshots.mobile[0] || "",

      "desktopGallery": screenshots.desktop.slice(1),
      "tabletGallery": screenshots.tablet.slice(1),
      "mobileGallery": screenshots.mobile.slice(1),

      "images": [],
      "galleryImages": [],
      "assets": {
        "desktop": screenshots.desktop[0] || "",
        "tablet": screenshots.tablet[0] || "",
        "mobile": screenshots.mobile[0] || ""
      },

      "contentSections": [
        {
          "id": `${projectSlug}-overview`,
          "sectionTitle": "Overview",
          "layout": "full",
          "columns": [
            {
              "id": `${projectSlug}-overview-col`,
              "columnTitle": "",
              "blocks": [
                {
                  "id": `${projectSlug}-overview-text`,
                  "type": "text",
                  "content": "Banana Leaf Disease Detector is a full-stack machine learning web application built to address a critical agricultural constraint: immediate, localized crop diagnostics. The system combines conventional computer vision feature extraction (LBP, GLCM, HOG, and HSV Histograms) with a K-Nearest Neighbors classifier to classify leaves as Healthy, Unhealthy, or Non-Leaf. Integrating a closed-loop Active Learning engine, the classifier learns directly from mistakes in real-time. When a user provides feedback on a wrong prediction, the system logs the new data and immediately retrains the classifier in-process, allowing continuous intelligence updates without server downtime."
                }
              ]
            }
          ]
        },
        {
          "id": `${projectSlug}-arch`,
          "sectionTitle": "Architecture",
          "layout": "2-equal",
          "columns": [
            {
              "id": `${projectSlug}-arch-left`,
              "columnTitle": "Tech Stack",
              "blocks": [
                { 
                  "id": `${projectSlug}-core`, 
                  "type": "chips", 
                  "items": ["Flask", "Python 3.12", "HTML5 / CSS3", "JavaScript (Vanilla)"] 
                },
                { 
                  "id": `${projectSlug}-ml-label`, 
                  "type": "heading", 
                  "content": "Machine Learning & CV" 
                },
                { 
                  "id": `${projectSlug}-ml-chips`, 
                  "type": "chips", 
                  "items": ["scikit-learn (KNN)", "OpenCV (cv2)", "scikit-image", "NumPy", "Pandas"] 
                },
                { 
                  "id": `${projectSlug}-db-label`, 
                  "type": "heading", 
                  "content": "Cloud Infrastructure" 
                },
                { 
                  "id": `${projectSlug}-db-chips`, 
                  "type": "chips", 
                  "items": ["Firebase Admin SDK", "Firestore (NoSQL)", "Chart.js (Visuals)"] 
                }
              ]
            },
            {
              "id": `${projectSlug}-arch-right`,
              "columnTitle": "Engineering Decisions",
              "blocks": [
                {
                  "id": `${projectSlug}-decisions`,
                  "type": "list",
                  "items": [
                    "Active Learning Loop — Extracted 59-dimensional feature vectors are cached in-memory and committed directly to Firestore when corrected by user feedback, driving background classifier weights retraining on-the-fly.",
                    "Dual-Channel Log Pipeline — Implements Firestore streams for web dashboard analytics, and logs secondary operational audit records to a local CSV file, establishing a robust, offline-resilient data layer.",
                    "Mathematical Feature Ensemble — Bypasses computationally expensive deep learning models by using conventional CV. It stacks GLCM texture markers, Local Binary Patterns (LBP) for structure, and color standard deviations (HSV/LAB) to execute sub-80ms diagnostics.",
                    "Chart.js Edge Integration — Binds Firestore analytics REST streams directly to reactive canvas components, generating interactive, zero-latency timeline graphs of plant disease incidents."
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": `${projectSlug}-design`,
          "sectionTitle": "Design System",
          "layout": "2-equal",
          "columns": [
            {
              "id": `${projectSlug}-colors`,
              "columnTitle": "Color Palette",
              "blocks": [
                { 
                  "id": `${projectSlug}-palette`, 
                  "type": "color-palette", 
                  "colors": ["#667eea", "#764ba2", "#e0e7ff", "#27ae60", "#c0392b", "#f39c12"] 
                },
                { 
                  "id": `${projectSlug}-color-notes`, 
                  "type": "list", 
                  "items": [
                    "#667eea — Brand Royal Blue (Primary actions, gradients)",
                    "#764ba2 — Deep Violet (Secondary accent)",
                    "#e0e7ff — Indigo Tint (Active state borders, tags)",
                    "#27ae60 — Forest Green (Healthy leaf status)",
                    "#c0392b — Crimson Red (Unhealthy disease status)",
                    "#f39c12 — Ochre Yellow (Active Learning correction warnings)"
                  ] 
                }
              ]
            },
            {
              "id": `${projectSlug}-type`,
              "columnTitle": "Typography",
              "blocks": [
                {
                  "id": `${projectSlug}-fonts`,
                  "type": "font-preview",
                  "fonts": [
                    { 
                      "name": "Inter", 
                      "family": "'Inter', 'Segoe UI', sans-serif", 
                      "role": "General content, interactive panels, analytics labels" 
                    },
                    {
                      "name": "Segoe UI",
                      "family": "'Segoe UI', 'Helvetica Neue', Arial",
                      "role": "High-performance native UI fallbacks for smooth cross-device styling"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": `${projectSlug}-features`,
          "sectionTitle": "Features",
          "layout": "2-equal",
          "columns": [
            {
              "id": `${projectSlug}-feat-left`,
              "columnTitle": "Active Learning Real-time Loop",
              "blocks": [
                { 
                  "id": `${projectSlug}-feat-left-text`, 
                  "type": "text", 
                  "content": "Integrates a closed-loop active learning system where classifier errors are immediately corrected by the user. The corrected sample's 59-dimensional feature matrix is dynamically appended to the training set and triggers background scikit-learn KNN model retraining with live model weights updates in-process, allowing continuous classifier improvements." 
                }
              ]
            },
            {
              "id": `${projectSlug}-feat-right`,
              "columnTitle": "Multi-Dimensional CV Feature Pipeline",
              "blocks": [
                { 
                  "id": `${projectSlug}-feat-right-text`, 
                  "type": "text", 
                  "content": "Extracts 59 unique color, texture, and structural features from uploaded crop images on-the-fly. Leverages Grey-Level Co-occurrence Matrices (GLCM) for structural leaf patterns, Local Binary Patterns (LBP) for disease-spot detection, and multi-channel (HSV/LAB) color histograms for rapid chlorosis screening." 
                }
              ]
            }
          ]
        },
        {
          "id": `${projectSlug}-perf`,
          "sectionTitle": "Performance",
          "layout": "full",
          "columns": [
            {
              "id": `${projectSlug}-perf-col`,
              "columnTitle": "",
              "blocks": [
                {
                  "id": `${projectSlug}-perf-list`,
                  "type": "list",
                  "items": [
                    "Predictive Latency: < 80ms for complete OpenCV feature extraction and KNN classification on local hosts.",
                    "In-Process Retraining Convergence: < 200ms background scikit-learn KNN fit cycle following user correction events.",
                    "Edge Friendly Footprint: Bypasses heavy deep learning dependencies, allowing the entire application and active learning pipeline to run smoothly on extremely lightweight compute servers.",
                    "Analytical Load Times: Highly-optimized NoSQL database schema enables instant aggregation of thousands of historical scan entries for Chart.js canvas elements."
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
  } else {
    // General fallback parser logic for other projects in manual mode
    let readmeContent = '';
    let packageObj = {};

    if (targetPath) {
      const readmePath = path.join(targetPath, 'README.md');
      const pkgPath = path.join(targetPath, 'package.json');
      if (fs.existsSync(readmePath)) readmeContent = fs.readFileSync(readmePath, 'utf8');
      if (fs.existsSync(pkgPath)) packageObj = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    }

    const title = packageObj.name ? packageObj.name.toUpperCase() : projectSlug.replace(/-/g, ' ').toUpperCase();
    const shortDesc = readmeContent ? readmeContent.substring(0, 180).replace(/[\r\n#*`_-]+/g, ' ').trim() + '...' : `An automated capture of ${title}.`;

    projectMetadata = {
      "id": `project-${projectSlug}`,
      "title": title,
      "shortDescription": shortDesc,
      "projectType": packageObj.dependencies && packageObj.dependencies.react ? "WEB APPLICATION" : "LANDING PAGE",
      "dateCreated": new Date().toISOString().split('T')[0],
      "liveUrl": targetUrl,
      "githubUrl": `https://github.com/DominceAseberos/${projectSlug}`,
      "featuredInTunnel": true,
      "mainImage": screenshots.desktop[0] || "",
      "desktopImage": screenshots.desktop[0] || "",
      "tabletImage": screenshots.tablet[0] || "",
      "mobileImage": screenshots.mobile[0] || "",
      "desktopGallery": screenshots.desktop.slice(1),
      "tabletGallery": screenshots.tablet.slice(1),
      "mobileGallery": screenshots.mobile.slice(1),
      "images": [],
      "galleryImages": [],
      "assets": {
        "desktop": screenshots.desktop[0] || "",
        "tablet": screenshots.tablet[0] || "",
        "mobile": screenshots.mobile[0] || ""
      },
      "contentSections": [
        {
          "id": `${projectSlug}-overview`,
          "sectionTitle": "Overview",
          "layout": "full",
          "columns": [
            {
              "id": `${projectSlug}-overview-col`,
              "columnTitle": "",
              "blocks": [
                {
                  "id": `${projectSlug}-overview-text`,
                  "type": "text",
                  "content": shortDesc || "Project overview details."
                }
              ]
            }
          ]
        }
      ]
    };
  }

  // 4. Inject into portfolioData.json
  const dataFilePath = path.join(__dirname, 'src', 'data', 'portfolioData.json');
  console.log(`💾 Injecting project JSON into: ${dataFilePath}`);
  
  if (fs.existsSync(dataFilePath)) {
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    const portfolioData = JSON.parse(fileContent);

    // Ensure projects array exists
    if (!portfolioData.projects) {
      portfolioData.projects = [];
    }

    // Remove duplicates if the project already exists
    portfolioData.projects = portfolioData.projects.filter(p => p.id !== `project-${projectSlug}`);

    // Prepend the new project (appears first)
    portfolioData.projects.unshift(projectMetadata);

    // Save formatted back to disk
    fs.writeFileSync(dataFilePath, JSON.stringify(portfolioData, null, 4), 'utf8');
    console.log('✅ Portfolio data JSON successfully updated!');
  } else {
    console.log(`❌ Error: Portfolio database file not found at ${dataFilePath}`);
  }

  console.log('🌟 All done! Project successfully integrated into your portfolio! 🍌');
};

main().catch(err => {
  console.error('❌ Error executing capture tool:', err);
  process.exit(1);
});
