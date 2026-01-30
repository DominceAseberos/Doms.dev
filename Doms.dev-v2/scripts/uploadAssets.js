
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
// Using Service Role key if available for bypassing RLS, otherwise Anon key might fail if RLS blocks inserts
// Assuming user is authenticated in browser but here we are in node. 
// If Anon key fails, we might need SERVICE_ROLE_KEY or user needs to use the Admin UI to upload.
// For now, let's try Anon key, but usually uploads require auth.
// Actually, if we use the stored admin credentials or just assume public bucket policies allowing inserts?
// "project-images" usually has public read, but restricted write.
// IF this script fails, I'll instruct the user to upload via the UI I just fixed.

// Better approach: Instruct user to use the UI since I can't easily authenticate as them in a script without their password/token.
// BUT, the user explicitly asked me to put it inside the storage bucket.
// I will try to read the 'hero-image.png' and if I can't upload via script (due to auth), 
// I will just tell the user to use the newly fixed Media Vault upload button.

// Wait, I can use the existing `mediaService` if I run it in the browser context? No.
// Let's assume the user has a service role key in .env or I can try the anon key.

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadAsset(filePath, bucket, targetName) {
    try {
        if (!fs.existsSync(filePath)) {
            console.error(`File not found: ${filePath}`);
            return;
        }

        const fileBuffer = fs.readFileSync(filePath);

        console.log(`Uploading ${targetName} to ${bucket}...`);

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(targetName, fileBuffer, {
                contentType: 'image/png',
                upsert: true
            });

        if (error) {
            console.error('Upload error:', error);
        } else {
            console.log(`Success! File uploaded to ${bucket}/${targetName}`);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

// Upload hero image
const heroPath = path.resolve(__dirname, '../src/assets/hero-image.png');
uploadAsset(heroPath, 'project-images', 'hero-image.png');
