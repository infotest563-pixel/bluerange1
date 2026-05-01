
# WordPress ↔ Next.js Sync Setup Guide

Your project already has **90% of the infrastructure in place**! Follow these steps to complete the setup.

---

## 📋 What's Already Implemented

✅ `/app/api/revalidate/route.ts` - On-demand revalidation API endpoint
✅ `/app/api/wp-image-webhook/route.ts` - Image sync webhook
✅ `/lib/wp.ts` - WordPress data fetching with proper caching
✅ `next.config.ts` - Image configuration and proxy
✅ ISR configured on all pages
✅ WordPress plugins ready for installation

---

## 🚀 Step 1: Environment Variables

### Next.js (Local & Vercel)

1. Copy `.env.local.example` to `.env.local`
2. Generate strong secrets:
   ```bash
   # Generate a strong secret (Mac/Linux)
   openssl rand -base64 32
   
   # Or use this online generator: https://www.random.org/strings/
   ```
3. Update `.env.local`:
   ```env
   REVALIDATE_SECRET=your-strong-random-secret
   WP_WEBHOOK_SECRET=your-strong-random-secret
   ```
4. Add the same secrets to Vercel Environment Variables (Project Settings → Environment Variables)

---

## 🚀 Step 2: WordPress Setup

### Option A: Use the Custom Plugin (Recommended)

1. Upload `wordpress-webhook.php` to your WordPress `wp-content/plugins/` directory
2. Activate the plugin in WordPress Admin → Plugins
3. Add these constants to your `wp-config.php`:
   ```php
   define('BR_NEXTJS_WEBHOOK_URL', 'https://your-vercel-domain.com/api/revalidate');
   define('BR_NEXTJS_IMAGE_WEBHOOK_URL', 'https://your-vercel-domain.com/api/wp-image-webhook');
   define('BR_REVALIDATE_SECRET', 'your-same-secret-as-in-nextjs');
   ```

### Option B: Use WP Webhooks Plugin

1. Install and activate **WP Webhooks** plugin from WordPress.org
2. Go to Settings → WP Webhooks → Webhooks
3. Add 2 webhooks:

   **Webhook 1: Post/Page Updates**
   - Trigger: Post saved / Page saved / Post updated
   - Webhook URL: `https://your-domain.com/api/revalidate`
   - Headers: Add `X-Revalidate-Secret` with your secret

   **Webhook 2: Media Updates**
   - Trigger: Media file uploaded / Media file updated
   - Webhook URL: `https://your-domain.com/api/wp-image-webhook`
   - Headers: Add `X-WP-Webhook-Secret` with your secret

---

## 🚀 Step 3: Verify Data Fetching

Your `lib/wp.ts` already has proper caching! Here's what's configured:

```typescript
// Example from lib/wp.ts
const res = await fetch(url, {
  next: { revalidate: 60 }, // Cache for 60 seconds
  redirect: 'manual',
  // ...
});
```

This means:
- Pages are statically generated
- Cache is revalidated every 60 seconds
- Webhook triggers immediate revalidation

---

## 🚀 Step 4: Image Configuration

Your `next.config.ts` already has the correct configuration:
- `remotePatterns` allows images from your WordPress site
- Rewrite rule proxies `/wp-content/*` → WordPress server

No changes needed here!

---

## 🔍 Testing the Setup

### Test 1: Revalidation Endpoint

```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "X-Revalidate-Secret: your-secret" \
  -d '{"slug": "about-bluerange", "lang": "en"}'
```

### Test 2: Image Webhook

```bash
curl -X POST https://your-domain.com/api/wp-image-webhook \
  -H "Content-Type: application/json" \
  -H "X-WP-Webhook-Secret: your-secret" \
  -d '{"source_url": "https://dev-bluerange.pantheonsite.io/wp-content/uploads/2023/01/test.jpg", "ID": 123}'
```

### Test 3: WordPress → Next.js

1. Go to WordPress Admin
2. Edit a page/post
3. Click "Update"
4. Check your Next.js site - changes should appear within seconds!

---

## 🛠️ Common Mistakes & Debugging

### 1. Changes not showing up

- Check if the secret matches between WordPress and Next.js
- Verify Vercel logs (Deployments → Functions → Logs)
- Try manual revalidation with curl
- Clear browser cache

### 2. Images not updating

- Check the image webhook is configured
- Verify the image rewrite rule in `next.config.ts`
- Check Vercel Edge Function logs

### 3. 401 Unauthorized errors

- Double-check that the secret header is correctly set
- Ensure no trailing spaces in the secret
- Verify the header name (case-sensitive on some servers)

### 4. Webhook not triggering

- Check WordPress plugin is activated
- Look at WordPress debug log (`wp-content/debug.log`)
- Test webhook with a service like webhook.site

---

## 💡 Best Practices

### revalidatePath vs revalidateTag

Your current implementation uses `revalidatePath`, which is great for:
- Small to medium sites
- Clear path-based cache invalidation
- Simpler implementation

For larger sites, consider migrating to `revalidateTag`:
1. Add tags to your fetch calls:
   ```typescript
   fetch(url, { next: { tags: ['page', `page-${slug}`] } })
   ```
2. Revalidate by tag instead of path
3. More flexible and scalable

### Security

- Use HTTPS always
- Never commit secrets to git
- Rotate secrets periodically
- Consider adding rate limiting

### Performance

- Keep ISR times reasonable (60-300 seconds)
- Use `revalidateTag` for larger sites
- Monitor Vercel function usage

---

## 🎯 Expected Outcome

When you're done:
1. ✅ Update a post in WordPress → Frontend updates automatically within seconds
2. ✅ No manual redeploys needed
3. ✅ Images refresh when updated
4. ✅ Site remains fast with ISR
5. ✅ Secure with secret-based authentication

---

## 🆘 Need Help?

Check these logs:
1. **Vercel Functions Logs**: Deployments → Functions → Select your API route
2. **WordPress Debug Log**: Enable `WP_DEBUG` in wp-config.php
3. **Browser DevTools**: Network tab to see cache headers

Good luck! 🎉
