
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Environment - Hardcoded for script simplicity (or use dotenv if you prefer)
const SUPABASE_URL = 'https://ywughwblapbknrrdumeq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3dWdod2JsYXBia25ycmR1bWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyODMzOTEsImV4cCI6MjA4NDg1OTM5MX0.PdD7DHG_nB4w9ScEiNKu0G5jlsZFBSRky2LL26hVVEc';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');

async function uploadFile(localRelPath, bucket, fileName) {
    // Safely verify path
    // Remove leading slash if present for path.join to work reliably on all OS
    const safeRelPath = localRelPath.startsWith('/') ? localRelPath.slice(1) : localRelPath;
    const filePath = path.join(PUBLIC_DIR, safeRelPath);

    console.log(`[DEBUG] Attempting upload: ${filePath}`);

    if (!fs.existsSync(filePath)) {
        console.error(`[ERROR] File not found: ${filePath}`);
        return null;
    }

    try {
        const fileBuffer = fs.readFileSync(filePath);

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, fileBuffer, {
                upsert: true,
                contentType: 'image/png'
            });

        if (error) {
            console.error(`[UPLOAD ERROR] ${error.message}`);
            throw error;
        }

        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
        console.log(`✅ Uploaded ${fileName} to: ${publicUrl}`);
        return publicUrl;
    } catch (e) {
        console.error(`FATAL ERROR uploading ${localRelPath}:`);
        console.error(e.stack);
        return null;
    }
}

async function main() {
    console.log('🚀 Starting Image Migration...');

    // 1. Upload Project Images
    const projectUpdates = [
        { id: 'banana-leaf-detection', file: 'banana-leaf.png', local: '/assets/projects/cover/BananaLeaf.png' },
        { id: 'focus-quest', file: 'focus-quest.png', local: '/assets/projects/cover/FocusQuest.png' },
        { id: 'baylora', file: 'baylora.png', local: '/assets/projects/cover/Baylora.png' },
        { id: 'templyx', file: 'templyx.png', local: '/assets/projects/cover/Templyx.png' },
        { id: 'ai-text-summarizer', file: 'summarizer.png', local: '/assets/projects/cover/summarizer.png' },
    ];

    for (const p of projectUpdates) {
        const publicUrl = await uploadFile(p.local, 'project-images', p.file);
        if (publicUrl) {
            // Update DB
            const { error } = await supabase
                .from('projects')
                .update({ image_url: publicUrl, images: [publicUrl] })
                .eq('id', p.id);

            if (error) console.error(`Failed to update DB for ${p.id}:`, error.message);
            else console.log(`Updated DB project: ${p.id}`);
        }
    }

    // 2. Upload Profile Avatar
    const avatarUrl = await uploadFile('/profile.png', 'avatars', 'profile.png');
    if (avatarUrl) {
        const { error } = await supabase
            .from('profiles')
            .update({ avatar_url: avatarUrl })
            .eq('github_username', 'Domincee');
        if (error) console.error(`Failed to update Profile Avatar`, error.message);
        else console.log(`Updated Profile Avatar`);
    }

    console.log('🏁 Migration Complete.');
}

main();
