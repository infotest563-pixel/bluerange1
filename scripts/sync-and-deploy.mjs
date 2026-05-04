#!/usr/bin/env node
/**
 * WordPress Image Sync + Vercel Deploy
 * =====================================
 * 1. Syncs images from WordPress to public/images/
 * 2. Commits changes to git
 * 3. Triggers Vercel deploy via deploy hook
 *
 * Usage:
 *   node scripts/sync-and-deploy.mjs
 *
 * Environment Variables:
 *   VERCEL_DEPLOY_HOOK - Your Vercel deploy hook URL
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// ─── Config ───────────────────────────────────────────────────────────────────
const VERCEL_DEPLOY_HOOK = process.env.VERCEL_DEPLOY_HOOK || '';
const SYNC_SCRIPT = './scripts/sync-wp-images.mjs';
const IMAGES_DIR = './public/images';
const MANIFEST = './public/images/manifest.json';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function log(message, emoji = '📝') {
  console.log(`${emoji} ${message}`);
}

function runCommand(command) {
  try {
    log(`Running: ${command}`, '⚡');
    const result = execSync(command, { encoding: 'utf-8', stdio: 'inherit' });
    return result;
  } catch (err) {
    console.error(`❌ Command failed: ${command}`);
    throw err;
  }
}

function hasChanges() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });
    return status.trim().length > 0;
  } catch {
    return false;
  }
}

async function triggerVercelDeploy() {
  if (!VERCEL_DEPLOY_HOOK) {
    log('VERCEL_DEPLOY_HOOK not set - skipping deploy trigger', '⚠️');
    return false;
  }

  log('Triggering Vercel deploy...', '🚀');
  try {
    const response = await fetch(VERCEL_DEPLOY_HOOK, { method: 'POST' });
    if (response.ok) {
      log('Vercel deploy triggered successfully!', '✅');
      return true;
    } else {
      log(`Vercel deploy hook failed: ${response.status}`, '❌');
      return false;
    }
  } catch (err) {
    log(`Failed to trigger Vercel deploy: ${err.message}`, '❌');
    return false;
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  log('WordPress Image Sync + Vercel Deploy', '🔄');
  log('======================================\n');

  // Step 1: Run the image sync
  log('Step 1: Syncing images from WordPress...', '1️⃣');
  runCommand(`node ${SYNC_SCRIPT}`);

  // Step 2: Check if there are changes
  log('\nStep 2: Checking for changes...', '2️⃣');
  if (!hasChanges()) {
    log('No changes detected - sync complete, no deploy needed', '🎉');
    process.exit(0);
  }

  log('Changes detected!', '📦');

  // Step 3: Commit changes
  log('\nStep 3: Committing changes...', '3️⃣');
  try {
    runCommand('git config user.name "Image Sync Bot"');
    runCommand('git config user.email "sync-bot@example.com"');
    runCommand(`git add ${IMAGES_DIR}`);
    runCommand('git commit -m "chore: sync images from WordPress [auto]"');
    log('Changes committed successfully!', '✅');
  } catch (err) {
    log('Could not commit (maybe in detached HEAD?)', '⚠️');
  }

  // Step 4: Push changes (if possible)
  log('\nStep 4: Pushing to remote...', '4️⃣');
  try {
    runCommand('git push');
    log('Pushed successfully!', '✅');
  } catch (err) {
    log('Could not push (no permission or detached HEAD)', '⚠️');
  }

  // Step 5: Trigger Vercel deploy
  log('\nStep 5: Triggering Vercel deploy...', '5️⃣');
  await triggerVercelDeploy();

  log('\n======================================');
  log('All done! 🎉', '✨');
}

main().catch((err) => {
  console.error('\n❌ Sync + Deploy failed:', err.message);
  process.exit(1);
});
