
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Environment
const SUPABASE_URL = 'https://ywughwblapbknrrdumeq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3dWdod2JsYXBia25ycmR1bWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyODMzOTEsImV4cCI6MjA4NDg1OTM5MX0.PdD7DHG_nB4w9ScEiNKu0G5jlsZFBSRky2LL26hVVEc';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(PROJECT_ROOT, 'src/data/portfolioData.json');

async function main() {
    console.log('🔄 Syncing Content...');

    // Read JSON data
    const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
    const { projects } = JSON.parse(rawData);

    for (const project of projects) {
        console.log(`Updating: ${project.id}`);

        const { error } = await supabase
            .from('projects')
            .update({
                full_documentation: project.fullDocumentation,
                short_description: project.shortDescription,
                title: project.title,
                live_preview_link: project.livePreviewLink,
                github_link: project.githubLink
            })
            .eq('id', project.id);

        if (error) {
            console.error(`❌ Failed ${project.id}:`, error.message);
        } else {
            console.log(`✅ Synced ${project.id}`);
        }
    }

    console.log('🏁 Sync Complete');
}

main();
