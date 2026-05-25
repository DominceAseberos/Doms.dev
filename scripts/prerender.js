import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import express from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../dist');

// Extract project IDs from portfolioData.json
const portfolioData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/portfolioData.json'), 'utf-8'));
const projectIds = portfolioData.projects.map(p => p.id);

const routes = [
    '/',
    '/projects',
    '/contact',
    ...projectIds.map(id => `/projects/${id}`)
];

async function prerender() {
    console.log('Starting prerender server...');
    const app = express();
    
    // Serve static files from dist
    app.use(express.static(distPath));
    
    // Fallback to index.html for SPA routes
    app.use((req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });

    const server = app.listen(0, async () => {
        const port = server.address().port;
        const baseUrl = `http://localhost:${port}`;
        
        console.log(`Server running on ${baseUrl}`);
        console.log('Launching Puppeteer...');
        
        const browser = await puppeteer.launch({ 
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        });
        
        for (const route of routes) {
            console.log(`Prerendering ${route}...`);
            const page = await browser.newPage();
            
            // Wait for network to be idle
            await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
            
            // Extra wait to ensure the global loader has disappeared
            try {
                await page.waitForFunction(() => {
                    const loader = document.querySelector('.global-loader-wrap');
                    // In your app, the loader sets pointer-events-none and opacity-0 when done
                    return !loader || window.getComputedStyle(loader).opacity === '0' || window.getComputedStyle(loader).display === 'none' || loader.classList.contains('pointer-events-none');
                }, { timeout: 10000 });
                // Add a small 1s buffer for GSAP animations to settle in their initial state
                await new Promise(r => setTimeout(r, 1000));
            } catch (e) {
                console.log(`Wait timeout for ${route}, proceeding anyway.`);
            }

            const html = await page.content();
            
            // Prepare output path
            const routePath = route === '/' ? 'index.html' : `${route.substring(1)}/index.html`;
            const fullPath = path.join(distPath, routePath);
            const dir = path.dirname(fullPath);
            
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            fs.writeFileSync(fullPath, html);
            console.log(`Saved ${fullPath}`);
            
            await page.close();
        }
        
        await browser.close();
        server.close();
        console.log('Prerendering complete!');
    });
}

prerender().catch(err => {
    console.error('Prerender error:', err);
    process.exit(1);
});
