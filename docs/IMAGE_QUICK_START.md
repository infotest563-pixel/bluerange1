# Image Handling - Quick Start

## 🚀 5-Minute Setup

### 1. Choose Your Mode

```env
# .env.local

# Option A: Proxy Mode (Development - Always Fresh)
IMAGE_MODE=proxy

# Option B: Local Mode (Production - Fast & CDN-Friendly)
IMAGE_MODE=local
```

### 2. Sync Images (Local Mode Only)

```bash
npm run sync-images
```

### 3. Use in Components

```tsx
import { wpImgUrl, wpAcfImg } from '@/lib/imageUtils';

// Simple URL
const url = wpImgUrl(page.acf.banner_image);

// ACF field (any format)
const url = wpAcfImg(page.acf.some_image);

// HTML content
import { replaceWpImagesInHtml } from '@/lib/imageUtils';
const html = replaceWpImagesInHtml(page.content.rendered);
```

---

## 📚 Common Patterns

### Pattern 1: Simple Image

```tsx
import { wpImgUrl } from '@/lib/imageUtils';

export default function Banner({ imageUrl }) {
  return <img src={wpImgUrl(imageUrl)} alt="Banner" />;
}
```

### Pattern 2: ACF Image Object

```tsx
import { wpAcfImg } from '@/lib/imageUtils';

export default function Hero({ page }) {
  // Handles string, object, or null
  const heroImage = wpAcfImg(page.acf.hero_image);
  
  return heroImage ? <img src={heroImage} alt="Hero" /> : null;
}
```

### Pattern 3: HTML Content

```tsx
import { replaceWpImagesInHtml } from '@/lib/imageUtils';

export default function Content({ page }) {
  return (
    <div 
      dangerouslySetInnerHTML={{ 
        __html: replaceWpImagesInHtml(page.content.rendered) 
      }} 
    />
  );
}
```

### Pattern 4: Next.js Image Component

```tsx
import Image from 'next/image';
import { wpImgUrl } from '@/lib/imageUtils';

export default function OptimizedImage({ page }) {
  return (
    <Image
      src={wpImgUrl(page.acf.banner_image)}
      alt="Banner"
      width={1200}
      height={800}
      priority
    />
  );
}
```

### Pattern 5: Background Image

```tsx
import { wpImgUrl } from '@/lib/imageUtils';

export default function Section({ page }) {
  const bgImage = wpImgUrl(page.acf.background_image);
  
  return (
    <section 
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      Content here
    </section>
  );
}
```

---

## 🔧 Commands

```bash
# Sync images manually
npm run sync-images

# Build (auto-syncs images first)
npm run build

# Development (no sync needed in proxy mode)
npm run dev
```

---

## 🎯 When to Use Each Mode

| Scenario | Mode | Why |
|----------|------|-----|
| Local development | `proxy` | Always fresh, no sync needed |
| Production build | `local` | Fast, CDN-friendly |
| Vercel/Netlify deploy | `local` | Automatic CDN caching |
| Frequent image updates | `proxy` | No rebuild needed |
| Large image library | `proxy` | Smaller deployment size |

---

## ⚠️ Common Issues

### Images not loading?
1. Check `IMAGE_MODE` in `.env.local`
2. Run `npm run sync-images` (local mode)
3. Check browser console for errors

### Stale images?
- **Proxy mode:** Automatic updates
- **Local mode:** Run `npm run sync-images` again

### Slow build?
- Use `proxy` mode for development
- Use `local` mode only for production builds

---

## 📖 Full Documentation

See [IMAGE_SYNC_GUIDE.md](../IMAGE_SYNC_GUIDE.md) for complete documentation.

---

## 🎓 Examples

### Real-World Example: Template Component

```tsx
// components/templates/About.tsx
import { wpAcfImg, replaceWpImagesInHtml } from '@/lib/imageUtils';

export default function About({ page }) {
  const { acf } = page;
  
  return (
    <div>
      {/* Hero Section */}
      <section 
        style={{ 
          backgroundImage: `url(${wpAcfImg(acf.banner_background_image)})` 
        }}
      >
        <h1>{page.title.rendered}</h1>
      </section>
      
      {/* Content with inline images */}
      <div 
        dangerouslySetInnerHTML={{ 
          __html: replaceWpImagesInHtml(page.content.rendered) 
        }} 
      />
      
      {/* ACF Image Field */}
      {acf.featured_image && (
        <img 
          src={wpAcfImg(acf.featured_image)} 
          alt="Featured" 
        />
      )}
    </div>
  );
}
```

---

That's it! You're ready to handle WordPress images in Next.js. 🎉
