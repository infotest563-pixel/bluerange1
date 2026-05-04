#!/usr/bin/env node
/**
 * WordPress → Next.js Image Sync Script (Production-Ready)
 * ==========================================================
 * Fetches all images from WordPress Media Library and downloads them to /public/images/
 *
 * Features:
 * ✅ Parallel downloads for speed
 * ✅ Incremental updates (only downloads new/changed images)
 * ✅ Duplicate detection
 * ✅ Broken URL handling
 * ✅ Progress tracking
 * ✅ Manifest generation for fast lookups
 * ✅ Orphaned image cleanup (optional)
 *
 * Usage:
 *   npm run sync-images              # Manual sync
 *   npm run build                    # Auto-runs via prebuild
 *   IMAGE_MODE=local npm run build   # Use local images in production
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Configuration ──────────────────────────────────────────────────────────
const WP_BASE_URL  = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://dev-bluerange.pantheonsite.io';
const WP_API_URL   = `${WP_BASE_URL}/wp-json/wp/v2/media`;
const OUTPUT_DIR   = path.join(__dirname, '..', 'public', 'images');
const MANIFEST     = path.join(OUTPUT_DIR, 'manifest.json');
const PER_PAGE     = 100;
const MAX_PARALLEL = 10; // Download 10 images at a time
const CLEANUP_OLD  = process.env.CLEANUP_OLD_IMAGES === 'true'; // Set to 'true' to remove orphaned images

// Extra images not in WP media library (orphaned uploads)
const EXTRA_IMAGES = [
  `${WP_BASE_URL}/wp-content/uploads/2023/10/support-img.png`,
  `${WP_BASE_URL}/wp-content/uploads/2023/11/headquarter.png`,
];

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Ensure directory exists */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/** Load existing manifest */
function loadManifest() {
  if (fs.existsSync(MANIFEST)) {
    try {
      return JSON.parse(fs.readFileSync(MANIFEST, 'utf-8'));
    } catch {
      return {};
    }
  }
  return {};
}

/** Save manifest to disk */
function saveManifest(manifest) {
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
}

/** Sanitize filename */
function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
}

/** Extract filename from URL */
function getFilenameFromUrl(url) {
  const parts = url.split('/');
  return sanitizeFilename(parts[parts.length - 1].split('?')[0]);
}

/** Download a file with retry logic */
async function downloadFile(url, destPath, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await downloadFileOnce(url, destPath);
      return true;
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
    }
  }
  return false;
}

/** Download a single file */
function downloadFileOnce(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);

    protocol.get(url, { headers: { 'User-Agent': 'NextJS-Image-Sync/2.0' } }, (response) => {
      // Follow redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(destPath);
        return downloadFileOnce(response.headers.location, destPath)
          .then(resolve)
          .catch(reject);
      }

      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        return reject(new Error(`HTTP ${response.statusCode}`));
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

/** Fetch one page of media from WordPress API */
async function fetchMediaPage(page) {
  const url = `${WP_API_URL}?per_page=${PER_PAGE}&page=${page}&_fields=id,source_url,slug,mime_type,date,modified`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'NextJS-Image-Sync/2.0' },
  });

  if (!res.ok) {
    if (res.status === 400) return []; // No more pages
    throw new Error(`WP API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/** Fetch all media items from WordPress */
async function fetchAllMedia() {
  const allMedia = [];
  let page = 1;

  console.log('📡 Fetching media list from WordPress...');

  while (true) {
    const items = await fetchMediaPage(page);
    if (!items || items.length === 0) break;

    allMedia.push(...items);
    process.stdout.write(`\r   Page ${page}: ${allMedia.length} items`);

    if (items.length < PER_PAGE) break;
    page++;
  }

  console.log('\n');
  return allMedia;
}

/** Download images in parallel batches */
async function downloadBatch(tasks) {
  const results = [];
  
  for (let i = 0; i < tasks.length; i += MAX_PARALLEL) {
    const batch = tasks.slice(i, i + MAX_PARALLEL);
    const batchResults = await Promise.allSettled(batch.map(task => task()));
    results.push(...batchResults);
  }
  
  return results;
}

/** Check if image needs update */
function needsUpdate(manifest, id, filename, dateModified, destPath) {
  const entry = manifest[id];
  
  // New image
  if (!entry) return true;
  
  // File doesn't exist locally
  if (!fs.existsSync(destPath)) return true;
  
  // Filename changed
  if (entry.filename !== filename) return true;
  
  // Modified date changed
  if (entry.date_modified !== dateModified) return true;
  
  return false;
}

/** Clean up orphaned images (not in manifest) */
function cleanupOrphanedImages(manifest) {
  if (!CLEANUP_OLD) return 0;
  
  const files = fs.readdirSync(OUTPUT_DIR);
  const manifestFiles = new Set(
    Object.values(manifest).map(entry => entry.filename)
  );
  
  let removed = 0;
  
  for (const file of files) {
    if (file === 'manifest.json') continue;
    if (!manifestFiles.has(file)) {
      const filePath = path.join(OUTPUT_DIR, file);
      fs.unlinkSync(filePath);
      removed++;
      console.log(`   🗑️  Removed orphaned: ${file}`);
    }
  }
  
  return removed;
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔄 WordPress → Next.js Image Sync');
  console.log('===================================\n');

  ensureDir(OUTPUT_DIR);

  const manifest = loadManifest();
  const allMedia = await fetchAllMedia();

  // Filter to images only
  const images = allMedia.filter(item =>
    item.mime_type && item.mime_type.startsWith('image/')
  );

  console.log(`🖼️  Processing ${images.length} images...\n`);

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  // Prepare download tasks
  const tasks = [];
  
  for (const item of images) {
    const sourceUrl = item.source_url;
    if (!sourceUrl) continue;

    const filename = getFilenameFromUrl(sourceUrl);
    const destPath = path.join(OUTPUT_DIR, filename);
    const manifestKey = String(item.id);

    // Skip if up-to-date
    if (!needsUpdate(manifest, manifestKey, filename, item.modified, destPath)) {
      skipped++;
      continue;
    }

    // Create download task
    tasks.push(async () => {
      try {
        process.stdout.write(`   ⬇️  ${filename.padEnd(50)} ... `);
        await downloadFile(sourceUrl, destPath);

        // Update manifest
        manifest[manifestKey] = {
          id: item.id,
          filename,
          source_url: sourceUrl,
          local_path: `/images/${filename}`,
          date_modified: item.modified,
          synced_at: new Date().toISOString(),
        };

        downloaded++;
        console.log('✅');
      } catch (err) {
        failed++;
        console.log(`❌ ${err.message}`);
      }
    });
  }

  // Download in parallel batches
  if (tasks.length > 0) {
    await downloadBatch(tasks);
    saveManifest(manifest);
  }

  // ── Download extra orphaned images ──────────────────────────────────────
  if (EXTRA_IMAGES.length > 0) {
    console.log(`\n📎 Downloading ${EXTRA_IMAGES.length} extra images...`);
    
    for (const url of EXTRA_IMAGES) {
      const filename = getFilenameFromUrl(url);
      const destPath = path.join(OUTPUT_DIR, filename);
      const manifestKey = `extra-${filename}`;

      if (manifest[manifestKey] && fs.existsSync(destPath)) {
        console.log(`   ⏭️  ${filename} (already exists)`);
        continue;
      }

      try {
        process.stdout.write(`   ⬇️  ${filename.padEnd(50)} ... `);
        await downloadFile(url, destPath);
        
        manifest[manifestKey] = {
          id: manifestKey,
          filename,
          source_url: url,
          local_path: `/images/${filename}`,
          synced_at: new Date().toISOString(),
        };
        
        downloaded++;
        console.log('✅');
      } catch (err) {
        failed++;
        console.log(`❌ ${err.message}`);
      }
    }
    
    saveManifest(manifest);
  }

  // ── Cleanup orphaned images ─────────────────────────────────────────────
  const removed = cleanupOrphanedImages(manifest);

  // ── Summary ─────────────────────────────────────────────────────────────
  console.log('\n===================================');
  console.log(`✅ Downloaded : ${downloaded}`);
  console.log(`⏭️  Skipped   : ${skipped} (already up to date)`);
  console.log(`❌ Failed     : ${failed}`);
  if (removed > 0) console.log(`🗑️  Removed   : ${removed} (orphaned)`);
  console.log(`📄 Manifest   : ${MANIFEST}`);
  console.log('===================================\n');

  if (failed > 0) {
    console.warn(`⚠️  ${failed} image(s) failed. Build will continue with proxy fallback.`);
  }
  
  console.log('💡 To use local images, set IMAGE_MODE=local in .env.local\n');
}

main().catch((err) => {
  console.error('❌ Sync failed:', err.message);
  process.exit(1);
});
