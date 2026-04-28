/**
 * sync-images.js
 * ==============
 * Downloads all WordPress media to /public/images/
 * and writes a manifest.json for the localImage resolver.
 *
 * Usage:
 *   node scripts/sync-images.js
 *   npm run sync-images
 *
 * Set IMAGE_MODE=local in .env.local to use local images.
 */

const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');

const WP_API   = 'https://dev-bluerange.pantheonsite.io/wp-json/wp/v2/media';
const OUT_DIR  = path.join(__dirname, '..', 'public', 'images');
const MANIFEST = path.join(OUT_DIR, 'manifest.json');
const PER_PAGE = 100;

// Ensure output directory exists
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function sanitize(name) {
    return name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
}

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, { headers: { 'User-Agent': 'NextJS-Sync/1.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve({ body: JSON.parse(data), headers: res.headers }); }
                catch (e) { reject(e); }
            });
        }).on('error', reject);
    });
}

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(dest)) { resolve(false); return; } // skip if exists
        const client = url.startsWith('https') ? https : http;
        const file = fs.createWriteStream(dest);
        client.get(url, { headers: { 'User-Agent': 'NextJS-Sync/1.0' } }, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                file.close();
                fs.unlinkSync(dest);
                downloadFile(res.headers.location, dest).then(resolve).catch(reject);
                return;
            }
            res.pipe(file);
            file.on('finish', () => { file.close(); resolve(true); });
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

async function getAllMedia() {
    const all = [];
    let page = 1;
    while (true) {
        const url = `${WP_API}?per_page=${PER_PAGE}&page=${page}`;
        console.log(`Fetching page ${page}...`);
        const { body, headers } = await fetchJson(url);
        if (!Array.isArray(body) || body.length === 0) break;
        all.push(...body);
        const totalPages = parseInt(headers['x-wp-totalpages'] || '1', 10);
        if (page >= totalPages) break;
        page++;
    }
    return all;
}

async function main() {
    console.log('Starting image sync from WordPress...\n');

    const media = await getAllMedia();
    console.log(`Found ${media.length} media items\n`);

    // Load existing manifest
    let manifest = {};
    if (fs.existsSync(MANIFEST)) {
        manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf-8'));
    }

    let downloaded = 0;
    let skipped = 0;

    for (const item of media) {
        const sourceUrl = item.source_url;
        if (!sourceUrl) continue;

        const rawFilename  = path.basename(sourceUrl.split('?')[0]);
        const safeFilename = sanitize(rawFilename);
        const localPath    = `/images/${safeFilename}`;
        const destPath     = path.join(OUT_DIR, safeFilename);

        try {
            const wasDownloaded = await downloadFile(sourceUrl, destPath);
            if (wasDownloaded) {
                console.log(`✓ Downloaded: ${safeFilename}`);
                downloaded++;
            } else {
                skipped++;
            }

            manifest[item.id] = {
                id:         item.id,
                filename:   safeFilename,
                source_url: sourceUrl,
                local_path: localPath,
                synced_at:  new Date().toISOString(),
            };
        } catch (err) {
            console.error(`✗ Failed: ${safeFilename} — ${err.message}`);
        }
    }

    fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));

    console.log(`\nDone!`);
    console.log(`  Downloaded: ${downloaded}`);
    console.log(`  Skipped (already exist): ${skipped}`);
    console.log(`  Manifest: ${MANIFEST}`);
    console.log(`\nTo use local images, set IMAGE_MODE=local in .env.local`);
}

main().catch(console.error);
