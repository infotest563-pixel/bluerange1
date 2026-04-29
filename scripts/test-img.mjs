// Test script — checks if wpImgUrl converts WP URLs to local paths
import fs from 'fs';
import path from 'path';

// Simulate what localImage.ts does
const manifestPath = './public/images/manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

// Build filename map (same logic as localImage.ts)
const map = {};
for (const entry of Object.values(manifest)) {
    if (entry.filename && entry.local_path) {
        map[entry.filename.toLowerCase()] = entry.local_path;
        map[entry.source_url] = entry.local_path;
    }
}

function sanitize(name) {
    return name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
}

function extractFilename(url) {
    const parts = url.split('/');
    return parts[parts.length - 1].split('?')[0];
}

function wpImgUrl(url) {
    if (!url) return '';
    
    // 1. Direct source_url match
    if (map[url]) {
        console.log('  ✓ Matched by source_url');
        return map[url];
    }
    
    // 2. By sanitized filename
    const rawFilename = extractFilename(url);
    const safeFilename = sanitize(rawFilename);
    if (map[safeFilename]) {
        console.log('  ✓ Matched by sanitized filename:', safeFilename);
        return map[safeFilename];
    }
    
    // 3. By original filename lowercase
    if (map[rawFilename.toLowerCase()]) {
        console.log('  ✓ Matched by lowercase filename:', rawFilename.toLowerCase());
        return map[rawFilename.toLowerCase()];
    }
    
    console.log('  ✗ NOT FOUND in manifest');
    console.log('    rawFilename:', rawFilename);
    console.log('    safeFilename:', safeFilename);
    return url; // fallback
}

// Test
const testUrl = 'https://dev-bluerange.pantheonsite.io/wp-content/uploads/2023/09/Virtuell-Server.svg';
console.log('Testing URL:', testUrl);
const result = wpImgUrl(testUrl);
console.log('Result:', result);
console.log('');
console.log('IMAGE_MODE env:', process.env.IMAGE_MODE || 'NOT SET');
console.log('');
console.log('Map has', Object.keys(map).length, 'entries');
console.log('Sample keys:', Object.keys(map).slice(0, 5));
