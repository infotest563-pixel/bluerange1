# 🖼️ WordPress → Next.js Image Sync System (Complete Guide)

A production-ready automated image sync system for your Next.js + Vercel project.

---

## 📋 System Overview

### What it Does:
1. **Downloads images** from WordPress ACF fields and Media Library
2. **Saves images** to `public/images/` with preserved filenames
3. **Updates existing images** when they change in WordPress
4. **Triggers Vercel deploy** automatically after sync
5. **Supports both manual and webhook-based sync**

---

## 📁 Folder Structure

```
bluerange1/
├── public/
│   └── images/              # ✅ Synced images stored here
│       └── manifest.json     # ✅ Tracks downloaded images
├── scripts/
│   ├── sync-wp-images.mjs    # ✅ Core sync script (existing)
│   └── sync-and-deploy.mjs   # ✅ New: Sync + deploy
├── app/
│   └── api/
│       └── wp-image-webhook/  # ✅ Webhook endpoint
│           └── route.ts
├── lib/
│   ├── localImage.ts          # ✅ Image URL resolver
│   └── wp.ts                  # ✅ WordPress API fetching
└── package.json               # ✅ npm scripts configured
```

---

## 🚀 Quick Start

### 1. Manual Sync (Anytime)
```bash
npm run sync-images
```

### 2. Sync + Auto-Deploy
```bash
# Set Vercel deploy hook first (see below)
npm run sync-and-deploy
```

### 3. Auto-Sync at Build Time
Already configured via `prebuild` script - runs automatically on `npm run build`

---

## 🔧 Setup Instructions

### Step 1: Configure WordPress (Already Done!)
Your sync script is already configured for:
- WordPress URL: `https://dev-bluerange.pantheonsite.io`
- Media API: `/wp-json/wp/v2/media`

To customize: Edit `scripts/sync-wp-images.mjs` lines 17-18

### Step 2: Create Vercel Deploy Hook
1. Go to Vercel Dashboard → Your Project → Settings → Git
2. Scroll to **Deploy Hooks**
3. Click **Create Hook**
4. Name it: `WordPress Image Sync`
5. Choose branch: `main` (or your production branch)
6. Click **Create Hook**
7. Copy the generated URL (looks like: `https://api.vercel.com/v1/integrations/deploy/...`)

### Step 3: Set Environment Variable
Add to your environment (`.env.local` or CI/CD):
```env
VERCEL_DEPLOY_HOOK=https://api.vercel.com/v1/integrations/deploy/your-hook-id
```

### Step 4: WordPress Webhook (Optional but Recommended)
Use the existing `/api/wp-image-webhook/route.ts` to trigger sync on image upload:
1. Install WP Webhooks plugin
2. Add webhook pointing to: `https://your-domain.com/api/wp-image-webhook`
3. Set trigger: "Media file uploaded" AND "Media file updated"
4. Add header: `X-WP-Webhook-Secret: your-secret`

---

## 📜 Script Reference

### `npm run sync-images`
- Downloads all new/updated images from WordPress
- Saves to `public/images/`
- Tracks changes in `manifest.json`
- Skips images that haven't changed
- No deploy triggered

### `npm run sync-and-deploy`
- Runs `sync-images` first
- Commits changes to git
- Pushes to remote
- Triggers Vercel deploy via deploy hook
- Only runs if there are actual changes

### `npm run build`
- Auto-runs `sync-images` before build (via `prebuild`)
- Ensures latest images are included in deployment

---

## 🔄 How It Works

### Image Detection & Download
```
WordPress Media Library
    ↓
WP REST API (fetch all media)
    ↓
Check manifest.json (have we downloaded this before?)
    ↓
Compare date_modified (has it changed?)
    ↓
Download (if new/updated) → public/images/
    ↓
Update manifest.json
    ↓
If changes → commit + deploy (optional)
```

### Webhook Flow (For Instant Updates)
```
WordPress Image Uploaded/Updated
    ↓
WP Webhook sends POST to /api/wp-image-webhook
    ↓
Downloads that specific image immediately
    ↓
Updates manifest
    ↓
Revalidates all pages via revalidatePath
    ↓
Changes show up without full deploy!
```

---

## 🎯 Workflows

### Workflow 1: Daily/Weekly Full Sync (Scheduled)
Use GitHub Actions, GitLab CI, or cron job:
```bash
# Run daily at 2 AM
npm run sync-and-deploy
```

### Workflow 2: Instant Updates (Webhook-Based)
1. Upload/update image in WordPress
2. Webhook triggers `/api/wp-image-webhook`
3. Image downloads + pages revalidate instantly
4. No full deploy needed!

### Workflow 3: Manual Sync (As Needed)
```bash
npm run sync-and-deploy
```

---

## ⚙️ Configuration Options

### Add Extra Images (Orphaned Files)
Edit `scripts/sync-wp-images.mjs`, lines 24-28:
```javascript
const EXTRA_IMAGES = [
  'https://your-site.com/wp-content/uploads/2024/01/custom-image.jpg',
];
```

### Change Download Directory
Edit `scripts/sync-wp-images.mjs`, line 19:
```javascript
const OUTPUT_DIR = './public/images';
```

### Change WordPress URL
Edit `scripts/sync-wp-images.mjs`, line 17:
```javascript
const WP_BASE_URL = 'https://your-wordpress-site.com';
```

---

## 🔒 Security Best Practices

1. **Never commit secrets** to git
2. **Use environment variables** for deploy hooks
3. **Secure webhook endpoints** with secret headers
4. **Restrict webhook IPs** if possible (Vercel has known IP ranges)
5. **Rotate secrets** periodically

---

## 🐛 Troubleshooting

### Images not downloading
- Check WordPress API is accessible
- Verify `WP_BASE_URL` is correct
- Look at script output for errors

### Vercel deploy not triggering
- Verify `VERCEL_DEPLOY_HOOK` is set correctly
- Check Vercel deploy hook logs
- Ensure you have permission to push to git

### Webhook not working
- Check webhook secret matches
- Verify endpoint URL is correct
- Check Vercel function logs

---

## ✅ Production Checklist

- [ ] Vercel deploy hook created and configured
- [ ] `VERCEL_DEPLOY_HOOK` env var set in CI/CD
- [ ] WordPress webhook configured (optional but recommended)
- [ ] `public/images/` in gitignore? (NO - commit images!)
- [ ] Tested `npm run sync-and-deploy` locally
- [ ] Verified images show up correctly on site

---

## 📚 Related Files

| File | Purpose |
|------|---------|
| `scripts/sync-wp-images.mjs` | Core image sync logic |
| `scripts/sync-and-deploy.mjs` | Sync + Vercel deploy |
| `app/api/wp-image-webhook/route.ts` | Webhook endpoint for instant updates |
| `lib/localImage.ts` | Image URL resolution |
| `IMAGE_SYNC_GUIDE.md` | This guide! |

---

## 🎉 You're Ready!

Your automated image sync system is now completely set up! When you change an image in WordPress ACF:

1. **Webhook triggers** → image downloads + pages revalidate INSTANTLY
2. **Or run `npm run sync-and-deploy`** → full sync + deploy
3. **Or just build** → auto-syncs at build time

All images are preserved in `public/images/` with their original filenames, and Vercel deployments happen automatically when needed! 🚀
