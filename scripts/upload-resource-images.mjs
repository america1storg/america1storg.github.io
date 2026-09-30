import { put } from '@vercel/blob';
import { readFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { homedir } from 'os';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get the directory of this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, '..', '.env.local') });

// Image mapping: filename -> resource domain
const imageMapping = {
  'Gemini_Generated_Image_475soz475soz475s.jpeg': 'constitutioncenter.org',
  'Gemini_Generated_Image_8sk41o8sk41o8sk4.jpeg': 'senate.gov',
  'Gemini_Generated_Image_9g4f969g4f969g4f.jpeg': 'whitehouse.gov-factsheets',
  'Gemini_Generated_Image_bqf6r0bqf6r0bqf6.jpeg': 'govtrack.us',
  'Gemini_Generated_Image_cp86z7cp86z7cp86.jpeg': 'ballotpedia.org',
  'Gemini_Generated_Image_gxjz5fgxjz5fgxjz.jpeg': 'whitehouse.gov',
  'Gemini_Generated_Image_namm3unamm3unamm.jpeg': 'america.gov',
  'Gemini_Generated_Image_px23h6px23h6px23.jpeg': 'congress.gov',
  'Gemini_Generated_Image_yq5g8iyq5g8iyq5g.jpeg': 'guides.vote',
  'Gemini_Generated_Image_z9w6abz9w6abz9w6.jpeg': 'votesmart.org',
};

async function uploadImages() {
  const downloadsPath = resolve(homedir(), 'Downloads', 'AF images for cards');
  const results = {};

  // Check if token is available
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error('❌ BLOB_READ_WRITE_TOKEN not found in environment variables');
    console.log('Make sure .env.local is loaded or run: source .env.local');
    process.exit(1);
  }

  console.log('🚀 Starting upload of resource images to Vercel Blob...\n');
  console.log(`📦 Found token: ${token.substring(0, 20)}...`);

  for (const [filename, domain] of Object.entries(imageMapping)) {
    try {
      const filePath = resolve(downloadsPath, filename);
      const fileBuffer = await readFile(filePath);

      console.log(`⏳ Uploading ${domain}... (${(fileBuffer.length / 1024 / 1024).toFixed(2)}MB)`);

      // Upload to Vercel Blob with explicit token
      const blob = await put(`resources/${domain}.jpg`, fileBuffer, {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'image/jpeg',
        token: token,
      });

      results[domain] = blob.url;
      console.log(`✅ ${domain}: ${blob.url}\n`);
    } catch (error) {
      console.error(`❌ Failed to upload ${filename}:`, error.message);
      console.error(error);
    }
  }

  console.log('\n📋 Upload complete! Copy these URLs:\n');
  console.log(JSON.stringify(results, null, 2));

  return results;
}

uploadImages().catch(console.error);
