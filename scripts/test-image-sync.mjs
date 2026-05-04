#!/usr/bin/env node
/**
 * Test Image Sync Setup
 * ======================
 * Verifies that image syncing is configured correctly.
 *
 * Usage: node scripts/test-image-sync.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images');
const MANIFEST = path.join(OUTPUT_DIR, 'manifest.json');

console.log('🧪 Testing Image Sync Setup\n');

// Test 1: Check if output directory exists
console.log('1️⃣  Checking output directory...');
if (fs.existsSync(OUTPUT_DIR)) {
  console.log('   ✅ /public/images/ exists');
} else {
  console.log('   ❌ /public/images/ does not exist');
  console.log('   💡 Run: npm run sync-images');
}

// Test 2: Check if manifest exists
console.log('\n2️⃣  Checking manifest...');
if (fs.existsSync(MANIFEST)) {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf-8'));
  const count = Object.keys(manifest).length;
  console.log(`   ✅ manifest.json exists (${count} images tracked)`);
  
  // Show sample entries
  const samples = Object.values(manifest).slice(0, 3);
  if (samples.length > 0) {
    console.log('\n   Sample entries:');
    samples.forEach(entry => {
      console.log(`   - ${entry.filename}`);
      console.log(`     Source: ${entry.source_url}`);
      console.log(`     Local:  ${entry.local_path}`);
    });
  }
} else {
  console.log('   ❌ manifest.json does not exist');
  console.log('   💡 Run: npm run sync-images');
}

// Test 3: Check environment variables
console.log('\n3️⃣  Checking environment variables...');
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  
  if (envContent.includes('IMAGE_MODE')) {
    const match = envContent.match(/IMAGE_MODE=(\w+)/);
    const mode = match ? match[1] : 'not set';
    console.log(`   ✅ IMAGE_MODE=${mode}`);
    
    if (mode === 'local') {
      console.log('   💡 Local mode: Images served from /public/images/');
      console.log('   💡 Run "npm run sync-images" to download images');
    } else if (mode === 'proxy') {
      console.log('   💡 Proxy mode: Images proxied through /wp-content/*');
      console.log('   💡 No sync needed, always fresh from WordPress');
    }
  } else {
    console.log('   ⚠️  IMAGE_MODE not set (defaults to proxy)');
    console.log('   💡 Add IMAGE_MODE=local or IMAGE_MODE=proxy to .env.local');
  }
  
  if (envContent.includes('NEXT_PUBLIC_WORDPRESS_URL')) {
    const match = envContent.match(/NEXT_PUBLIC_WORDPRESS_URL=(.+)/);
    const url = match ? match[1].trim() : 'not set';
    console.log(`   ✅ NEXT_PUBLIC_WORDPRESS_URL=${url}`);
  } else {
    console.log('   ❌ NEXT_PUBLIC_WORDPRESS_URL not set');
  }
} else {
  console.log('   ⚠️  .env.local does not exist');
  console.log('   💡 Copy .env.local.example to .env.local');
}

// Test 4: Check image files
console.log('\n4️⃣  Checking image files...');
if (fs.existsSync(OUTPUT_DIR)) {
  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f !== 'manifest.json');
  console.log(`   ✅ ${files.length} image files found`);
  
  if (files.length > 0) {
    const totalSize = files.reduce((sum, file) => {
      const filePath = path.join(OUTPUT_DIR, file);
      return sum + fs.statSync(filePath).size;
    }, 0);
    const sizeMB = (totalSize / 1024 / 1024).toFixed(2);
    console.log(`   📦 Total size: ${sizeMB} MB`);
    
    // Show sample files
    console.log('\n   Sample files:');
    files.slice(0, 5).forEach(file => {
      const filePath = path.join(OUTPUT_DIR, file);
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(1);
      console.log(`   - ${file} (${sizeKB} KB)`);
    });
  } else {
    console.log('   ⚠️  No images downloaded yet');
    console.log('   💡 Run: npm run sync-images');
  }
}

// Test 5: Check package.json scripts
console.log('\n5️⃣  Checking npm scripts...');
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

if (packageJson.scripts['sync-images']) {
  console.log('   ✅ npm run sync-images configured');
}
if (packageJson.scripts['prebuild']) {
  console.log('   ✅ prebuild hook configured (auto-syncs before build)');
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 Summary\n');

const hasImages = fs.existsSync(OUTPUT_DIR) && fs.readdirSync(OUTPUT_DIR).length > 1;
const hasManifest = fs.existsSync(MANIFEST);
const hasEnv = fs.existsSync(envPath);

if (hasImages && hasManifest && hasEnv) {
  console.log('✅ Everything looks good!');
  console.log('\n💡 Next steps:');
  console.log('   - Run "npm run dev" to start development');
  console.log('   - Run "npm run build" to build for production');
} else {
  console.log('⚠️  Setup incomplete\n');
  console.log('💡 To complete setup:');
  if (!hasEnv) {
    console.log('   1. Copy .env.local.example to .env.local');
    console.log('   2. Set IMAGE_MODE=local or IMAGE_MODE=proxy');
  }
  if (!hasImages || !hasManifest) {
    console.log('   3. Run "npm run sync-images" to download images');
  }
}

console.log('\n📖 For more info, see IMAGE_SYNC_GUIDE.md\n');
