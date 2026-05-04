# WordPress Image Sync Guide

Complete guide for handling WordPress images in your Next.js application.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Two Modes: Local vs Proxy](#two-modes-local-vs-proxy)
3. [Quick Start](#quick-start)
4. [How It Works](#how-it-works)
5. [Usage in Components](#usage-in-components)
6. [Sync Script](#sync-script)
7. [Automatic Syncing](#automatic-syncing)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)
10. [API Reference](#api-reference)

---

## Overview

This project supports **two image serving modes**:

| Mode | Description | Use Case |
|------|-------------|----------|
| **Proxy** (default) | Images served through `/wp-content/*` proxy to WordPress | Development, always-fresh images |
| **Local** | Images downloaded to `/public/images/` during build | Production, faster loading, CDN-friendly |

---

## Two Modes: Local vs Proxy

### Proxy Mode (Default)

```env
IMAGE_MODE=proxy
```

**How it works:**
- WordPress URL: `https://dev-bluerange.pantheonsite.io/wp-content/uploads/2023/09/image.png`
- Transformed to: `/wp-content/uploads/2023/09/image.png`
- Next.js proxy (in `next.config.ts`) forwards request to WordPress server

**Pros:**
- ✅ Always fresh (no sync needed)
- ✅ No build-time download
- ✅ Automatic updates when images change in WordPress

**Cons:**
- ❌ Slower (external request to WordPress)
- ❌ Depends on WordPress server availability
- ❌ Not CDN-optimized

---

### Local Mode

```env
IMAGE_MODE=local
```

**How it works:**
- WordPress URL: `https://dev-bluerange.pantheonsite.io/wp-content/uploads/2023/09/image.png`
- Downloaded to: `/public/images/image.png`
- Transformed to: `/images/image.png`
- Served directly from your Next.js server/CDN

**Pros:**
- ✅ Fast (served from your domain)
- ✅ CDN-friendly (Vercel/Netlify automatically caches)
- ✅ Independent of WordPress server

**Cons:**
- ❌ Requires sync before build
- ❌ Images may be stale until next sync
- ❌ Larger deployment size

---

## Quick Start

### 1. Install Dependencies

Already included in `package.json` — no additional packages needed!

### 2. Configure Environment

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_WORDPRESS_URL=https://dev-bluerange.pantheonsite.io
IMAGE_MODE=local  # or 'proxy'
```

### 3. Sync Images (Local Mode Only)

```bash
npm run sync-images
```

This downloads all WordPress images to `/public/images/`.

### 4. Build & Run

```bash
npm run build
npm start
```

Images are automatically synced during build (via `prebuild` script).

---

## How It Works

### Architecture

```
WordPress Media Library
         ↓
   WP REST API (/wp-json/wp/v2/media)
         ↓
   sync-wp-images.mjs (downloads images)
         ↓
   /public/images/ + manifest.json
         ↓
   localImage.ts (resolves URLs)
         ↓
   Components (render images)
```

### File Structure

```
project/
├── scripts/
│   └── sync-wp-images.mjs       # Sync script
├── lib/
│   ├── localImage.ts             # Image URL resolver
│   ├── imageUtils.ts             # Helper utilities
│   ├── wpImageTransform.ts       # Automatic URL transformation
│   └── resolveImage.ts           # ACF image resolver
├── public/
│   └── images/
│       ├── manifest.json         # Tracks downloaded images
│       ├── image1.png
│       └── image2.jpg
└── .env.local                    # Configuration
```

---

## Usage in Components

### Basic Usage

```tsx
import { wpImgUrl } from '@/lib/imageUtils';

export default function MyComponent({ page }) {
  const imageUrl = wpImgUrl(page.acf.banner_image);
  
  return (
    <img src={imageUrl} alt="Banner" />
  );
}
```

### ACF Image Fields

ACF returns images in different formats. Use `wpAcfImg()` to handle all cases:

```tsx
import { wpAcfImg } from '@/lib/imageUtils';

// Handles:
// - String URL: "https://..."
// - Object: { url: "https://...", width: 1200, height: 800 }
// - Object: { source_url: "https://..." }
const imageUrl = wpAcfImg(page.acf.some_image);
```

### HTML Content with Images

WordPress content often contains `<img>` tags with WordPress URLs. Transform them:

```tsx
import { replaceWpImagesInHtml } from '@/lib/imageUtils';

export default function Content({ page }) {
  const cleanHtml = replaceWpImagesInHtml(page.content.rendered);
  
  return (
    <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
  );
}
```

### Automatic Transformation (Recommended)

The best approach is to use `wpImageTransform.ts` which automatically transforms **all** image URLs in the WordPress API response:

```tsx
// In lib/wp.ts (already implemented)
import { transformPage } from './wpImageTransform';

export async function getPageBySlug(slug: string) {
  const res = await fetch(`${WP}/wp-json/wp/v2/pages?slug=${slug}`);
  const data = await res.json();
  
  // This transforms ALL image URLs in the entire object
  return transformPage(data[0]);
}
```

Now in your component, you can use URLs directly:

```tsx
export default function MyComponent({ page }) {
  // Already transformed by wpImageTransform!
  return (
    <img src={page.acf.banner_image} alt="Banner" />
  );
}
```

---

## Sync Script

### Manual Sync

```bash
npm run sync-images
```

### What It Does

1. Fetches all media from WordPress REST API (`/wp-json/wp/v2/media`)
2. Filters to images only (skips PDFs, videos, etc.)
3. Downloads images to `/public/images/`
4. Generates `manifest.json` for fast lookups
5. Skips already-downloaded images (incremental sync)
6. Updates changed images (checks `date_modified`)

### Features

- ✅ **Parallel downloads** (10 at a time for speed)
- ✅ **Incremental updates** (only downloads new/changed images)
- ✅ **Duplicate detection** (same filename = skip)
- ✅ **Retry logic** (3 attempts with exponential backoff)
- ✅ **Progress tracking** (real-time console output)
- ✅ **Error handling** (continues on failure, reports at end)
- ✅ **Orphaned image cleanup** (optional, set `CLEANUP_OLD_IMAGES=true`)

### Configuration

Edit `scripts/sync-wp-images.mjs`:

```js
const MAX_PARALLEL = 10;  // Download 10 images at a time
const CLEANUP_OLD  = process.env.CLEANUP_OLD_IMAGES === 'true';

// Add orphaned images not in WP media library
const EXTRA_IMAGES = [
  `${WP_BASE_URL}/wp-content/uploads/2023/10/support-img.png`,
];
```

### Output

```
🔄 WordPress → Next.js Image Sync
===================================

📡 Fetching media list from WordPress...
   Page 1: 100 items
   Page 2: 177 items

🖼️  Processing 177 images...

   ⬇️  image1.png                                      ... ✅
   ⬇️  image2.jpg                                      ... ✅
   ⬇️  image3.svg                                      ... ❌ HTTP 404

===================================
✅ Downloaded : 175
⏭️  Skipped   : 0 (already up to date)
❌ Failed     : 2
📄 Manifest   : /public/images/manifest.json
===================================

💡 To use local images, set IMAGE_MODE=local in .env.local
```

---

## Automatic Syncing

### Prebuild Hook (Recommended)

Images are automatically synced before every build:

```json
{
  "scripts": {
    "prebuild": "node scripts/sync-wp-images.mjs",
    "build": "next build"
  }
}
```

When you run `npm run build`, images sync first.

### Cron Job (Optional)

For production, sync images periodically:

```bash
# Sync every 6 hours
0 */6 * * * cd /path/to/project && npm run sync-images
```

### Webhook (Advanced)

Trigger sync when images are uploaded to WordPress:

1. Install WordPress plugin: [WP Webhooks](https://wordpress.org/plugins/wp-webhooks/)
2. Configure webhook to call your API endpoint
3. Create API route in Next.js:

```ts
// app/api/sync-images/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-webhook-secret');
  
  if (secret !== process.env.WP_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Run sync script
  exec('npm run sync-images', (error, stdout, stderr) => {
    if (error) {
      console.error('Sync failed:', error);
      return;
    }
    console.log('Sync completed:', stdout);
  });
  
  return NextResponse.json({ success: true });
}
```

---

## Best Practices

### Development

- Use **proxy mode** for development (always fresh, no sync needed)
- Set `IMAGE_MODE=proxy` in `.env.local`

### Production

- Use **local mode** for production (faster, CDN-friendly)
- Set `IMAGE_MODE=local` in production environment
- Run `npm run sync-images` before deployment
- Or use `prebuild` hook (already configured)

### Vercel Deployment

Vercel automatically runs `prebuild` before building:

```bash
npm run prebuild  # Syncs images
npm run build     # Builds Next.js
```

Images are included in the deployment and served from Vercel's CDN.

### Image Optimization

Use Next.js `<Image>` component for automatic optimization:

```tsx
import Image from 'next/image';
import { wpImgUrl } from '@/lib/imageUtils';

export default function MyComponent({ page }) {
  const imageUrl = wpImgUrl(page.acf.banner_image);
  
  return (
    <Image
      src={imageUrl}
      alt="Banner"
      width={1200}
      height={800}
      priority
    />
  );
}
```

### Fallback Strategy

The system automatically falls back to proxy mode if an image isn't found locally:

```ts
// In localImage.ts
if (IMAGE_MODE === 'local') {
  const localPath = findLocalImage(url);
  if (localPath) return localPath;
  
  // Fallback to proxy if not found
  console.warn('Image not found locally, falling back to proxy');
}
```

---

## Troubleshooting

### Images Not Loading

**Problem:** Images show broken links

**Solutions:**
1. Check `IMAGE_MODE` in `.env.local`
2. Run `npm run sync-images` (local mode)
3. Check browser console for errors
4. Verify WordPress URL is correct

### Sync Fails

**Problem:** `npm run sync-images` fails

**Solutions:**
1. Check WordPress URL is accessible
2. Verify WordPress REST API is enabled
3. Check network/firewall settings
4. Look for error messages in console

### Stale Images

**Problem:** Images don't update after changing in WordPress

**Solutions:**
1. **Proxy mode:** Images update automatically
2. **Local mode:** Run `npm run sync-images` again
3. Check `date_modified` in `manifest.json`

### Large Deployment Size

**Problem:** Deployment is too large (many images)

**Solutions:**
1. Use **proxy mode** instead of local mode
2. Enable `CLEANUP_OLD_IMAGES=true` to remove unused images
3. Optimize images in WordPress before upload
4. Use external CDN for images

### Slow Sync

**Problem:** `npm run sync-images` takes too long

**Solutions:**
1. Increase `MAX_PARALLEL` in `sync-wp-images.mjs`
2. Use incremental sync (already enabled)
3. Run sync less frequently (cron job instead of prebuild)

---

## API Reference

### `wpImgUrl(url)`

Converts WordPress image URL to local or proxy path.

```ts
wpImgUrl('https://dev-bluerange.pantheonsite.io/wp-content/uploads/2023/09/image.png')
// → '/images/image.png' (local mode)
// → '/wp-content/uploads/2023/09/image.png' (proxy mode)
```

### `wpAcfImg(field)`

Resolves ACF image field (any format) to URL.

```ts
wpAcfImg('https://...')                    // → '/images/...'
wpAcfImg({ url: 'https://...' })           // → '/images/...'
wpAcfImg({ source_url: 'https://...' })    // → '/images/...'
```

### `replaceWpImagesInHtml(html)`

Replaces all WordPress image URLs in HTML string.

```ts
const html = '<img src="https://dev-bluerange.pantheonsite.io/wp-content/uploads/image.png">';
replaceWpImagesInHtml(html);
// → '<img src="/images/image.png">'
```

### `isLocalImage(url)`

Checks if image is available locally.

```ts
isLocalImage('https://dev-bluerange.pantheonsite.io/wp-content/uploads/image.png')
// → true (if synced locally)
// → false (if not synced or proxy mode)
```

### `transformWpImages(data)`

Recursively transforms all image URLs in WordPress API response.

```ts
const page = await fetch('...').then(r => r.json());
const transformed = transformWpImages(page);
// All image URLs in page.acf, page.content, etc. are now transformed
```

---

## Summary

✅ **Two modes:** Local (fast, CDN-friendly) and Proxy (always fresh)  
✅ **Automatic sync:** Runs before every build via `prebuild` hook  
✅ **Smart caching:** Only downloads new/changed images  
✅ **Fallback:** Automatically uses proxy if local image missing  
✅ **Production-ready:** Error handling, retry logic, parallel downloads  
✅ **Easy to use:** Import helpers, use in components  

**Recommended Setup:**
- Development: `IMAGE_MODE=proxy`
- Production: `IMAGE_MODE=local` with `prebuild` hook

---

## Need Help?

- Check [Troubleshooting](#troubleshooting) section
- Review console output from `npm run sync-images`
- Verify `.env.local` configuration
- Test with a single image first

Happy coding! 🚀
