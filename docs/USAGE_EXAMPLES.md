# WordPress Image Handling - Usage Examples

Real-world examples showing how to use the image handling system in your Next.js components.

---

## 📚 Table of Contents

1. [Basic Usage](#basic-usage)
2. [ACF Image Fields](#acf-image-fields)
3. [HTML Content](#html-content)
4. [Next.js Image Component](#nextjs-image-component)
5. [Background Images](#background-images)
6. [Conditional Rendering](#conditional-rendering)
7. [Gallery/Multiple Images](#gallerymultiple-images)
8. [Template Components](#template-components)

---

## Basic Usage

### Simple Image URL

```tsx
import { wpImgUrl } from '@/lib/imageUtils';

export default function Banner({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="banner">
      <img src={wpImgUrl(imageUrl)} alt="Banner" />
    </div>
  );
}
```

### With Fallback

```tsx
import { wpImgUrl } from '@/lib/imageUtils';

export default function Logo({ logoUrl }: { logoUrl?: string }) {
  const src = logoUrl ? wpImgUrl(logoUrl) : '/images/default-logo.png';
  
  return <img src={src} alt="Logo" />;
}
```

---

## ACF Image Fields

### String URL

```tsx
import { wpAcfImg } from '@/lib/imageUtils';

export default function Hero({ page }: { page: any }) {
  // ACF field returns string URL
  const heroImage = wpAcfImg(page.acf.hero_image);
  
  return (
    <section className="hero">
      <img src={heroImage} alt="Hero" />
    </section>
  );
}
```

### Image Object

```tsx
import { wpAcfImg } from '@/lib/imageUtils';

export default function Feature({ page }: { page: any }) {
  // ACF field returns object: { url, width, height, alt }
  const featureImage = page.acf.feature_image;
  const imageUrl = wpAcfImg(featureImage);
  
  return (
    <div className="feature">
      <img 
        src={imageUrl} 
        alt={featureImage?.alt || 'Feature'} 
        width={featureImage?.width}
        height={featureImage?.height}
      />
    </div>
  );
}
```

### Multiple ACF Fields

```tsx
import { wpAcfImg } from '@/lib/imageUtils';

export default function About({ page }: { page: any }) {
  const { acf } = page;
  
  return (
    <div>
      {/* Banner */}
      <img src={wpAcfImg(acf.banner_image)} alt="Banner" />
      
      {/* Logo */}
      <img src={wpAcfImg(acf.company_logo)} alt="Logo" />
      
      {/* Team Photo */}
      <img src={wpAcfImg(acf.team_photo)} alt="Team" />
    </div>
  );
}
```

---

## HTML Content

### Basic HTML Content

```tsx
import { replaceWpImagesInHtml } from '@/lib/imageUtils';

export default function Content({ page }: { page: any }) {
  const content = replaceWpImagesInHtml(page.content.rendered);
  
  return (
    <div 
      className="content"
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
}
```

### With Excerpt

```tsx
import { replaceWpImagesInHtml } from '@/lib/imageUtils';

export default function Post({ post }: { post: any }) {
  const excerpt = replaceWpImagesInHtml(post.excerpt.rendered);
  const content = replaceWpImagesInHtml(post.content.rendered);
  
  return (
    <article>
      <div dangerouslySetInnerHTML={{ __html: excerpt }} />
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}
```

---

## Next.js Image Component

### Basic Usage

```tsx
import Image from 'next/image';
import { wpImgUrl } from '@/lib/imageUtils';

export default function OptimizedImage({ page }: { page: any }) {
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

### With ACF Dimensions

```tsx
import Image from 'next/image';
import { wpAcfImg } from '@/lib/imageUtils';

export default function ResponsiveImage({ page }: { page: any }) {
  const image = page.acf.featured_image;
  const imageUrl = wpAcfImg(image);
  
  return (
    <Image
      src={imageUrl}
      alt={image?.alt || 'Featured'}
      width={image?.width || 1200}
      height={image?.height || 800}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
```

### Fill Container

```tsx
import Image from 'next/image';
import { wpImgUrl } from '@/lib/imageUtils';

export default function HeroSection({ page }: { page: any }) {
  return (
    <div className="relative w-full h-[500px]">
      <Image
        src={wpImgUrl(page.acf.hero_background)}
        alt="Hero Background"
        fill
        style={{ objectFit: 'cover' }}
        priority
      />
    </div>
  );
}
```

---

## Background Images

### Inline Style

```tsx
import { wpImgUrl } from '@/lib/imageUtils';

export default function Section({ page }: { page: any }) {
  const bgImage = wpImgUrl(page.acf.background_image);
  
  return (
    <section 
      style={{ 
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h2>Content here</h2>
    </section>
  );
}
```

### With Tailwind CSS

```tsx
import { wpImgUrl } from '@/lib/imageUtils';

export default function Hero({ page }: { page: any }) {
  const bgImage = wpImgUrl(page.acf.hero_background);
  
  return (
    <div 
      className="bg-cover bg-center h-screen"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <h1>Hero Title</h1>
    </div>
  );
}
```

### Multiple Backgrounds

```tsx
import { wpImgUrl } from '@/lib/imageUtils';

export default function ComplexSection({ page }: { page: any }) {
  const bg1 = wpImgUrl(page.acf.background_layer_1);
  const bg2 = wpImgUrl(page.acf.background_layer_2);
  
  return (
    <section 
      style={{ 
        backgroundImage: `url(${bg1}), url(${bg2})`,
        backgroundSize: 'cover, contain',
        backgroundPosition: 'center, top right',
      }}
    >
      Content
    </section>
  );
}
```

---

## Conditional Rendering

### With Fallback Image

```tsx
import { wpAcfImg } from '@/lib/imageUtils';

export default function Card({ page }: { page: any }) {
  const cardImage = wpAcfImg(page.acf.card_image);
  const fallbackImage = '/images/placeholder.png';
  
  return (
    <div className="card">
      <img 
        src={cardImage || fallbackImage} 
        alt="Card" 
        onError={(e) => {
          e.currentTarget.src = fallbackImage;
        }}
      />
    </div>
  );
}
```

### Only Render if Image Exists

```tsx
import { wpAcfImg } from '@/lib/imageUtils';

export default function OptionalImage({ page }: { page: any }) {
  const image = wpAcfImg(page.acf.optional_image);
  
  return (
    <div>
      {image && (
        <img src={image} alt="Optional" />
      )}
      <p>Content always shows</p>
    </div>
  );
}
```

### Different Images for Different Modes

```tsx
import { wpAcfImg } from '@/lib/imageUtils';

export default function ResponsiveImages({ page }: { page: any }) {
  const desktopImage = wpAcfImg(page.acf.desktop_image);
  const mobileImage = wpAcfImg(page.acf.mobile_image);
  
  return (
    <>
      <img 
        src={desktopImage} 
        alt="Desktop" 
        className="hidden md:block" 
      />
      <img 
        src={mobileImage} 
        alt="Mobile" 
        className="block md:hidden" 
      />
    </>
  );
}
```

---

## Gallery/Multiple Images

### Simple Gallery

```tsx
import { wpAcfImg } from '@/lib/imageUtils';

export default function Gallery({ page }: { page: any }) {
  const gallery = page.acf.gallery || [];
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {gallery.map((image: any, index: number) => (
        <img 
          key={index}
          src={wpAcfImg(image)} 
          alt={image?.alt || `Gallery ${index + 1}`} 
        />
      ))}
    </div>
  );
}
```

### Gallery with Next.js Image

```tsx
import Image from 'next/image';
import { wpAcfImg } from '@/lib/imageUtils';

export default function OptimizedGallery({ page }: { page: any }) {
  const gallery = page.acf.gallery || [];
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {gallery.map((image: any, index: number) => (
        <div key={index} className="relative aspect-square">
          <Image
            src={wpAcfImg(image)}
            alt={image?.alt || `Gallery ${index + 1}`}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      ))}
    </div>
  );
}
```

### Repeater Field with Images

```tsx
import { wpAcfImg } from '@/lib/imageUtils';

export default function Features({ page }: { page: any }) {
  const features = page.acf.features || [];
  
  return (
    <div className="features">
      {features.map((feature: any, index: number) => (
        <div key={index} className="feature">
          <img src={wpAcfImg(feature.icon)} alt={feature.title} />
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Template Components

### Complete Template Example

```tsx
import { wpAcfImg, replaceWpImagesInHtml } from '@/lib/imageUtils';

export default function AboutTemplate({ page }: { page: any }) {
  const { acf } = page;
  
  return (
    <div className="about-page">
      {/* Hero Section with Background */}
      <section 
        className="hero"
        style={{ 
          backgroundImage: `url(${wpAcfImg(acf.banner_background_image)})` 
        }}
      >
        <h1>{page.title.rendered}</h1>
      </section>
      
      {/* Content with inline images */}
      <div 
        className="content"
        dangerouslySetInnerHTML={{ 
          __html: replaceWpImagesInHtml(page.content.rendered) 
        }} 
      />
      
      {/* Featured Image */}
      {acf.featured_image && (
        <img 
          src={wpAcfImg(acf.featured_image)} 
          alt="Featured" 
          className="featured-image"
        />
      )}
      
      {/* Team Section */}
      {acf.team_members && (
        <div className="team">
          {acf.team_members.map((member: any, index: number) => (
            <div key={index} className="team-member">
              <img src={wpAcfImg(member.photo)} alt={member.name} />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Product Template

```tsx
import Image from 'next/image';
import { wpAcfImg, replaceWpImagesInHtml } from '@/lib/imageUtils';

export default function ProductTemplate({ page }: { page: any }) {
  const { acf } = page;
  
  return (
    <div className="product-page">
      {/* Product Gallery */}
      <div className="product-gallery">
        <div className="main-image">
          <Image
            src={wpAcfImg(acf.main_product_image)}
            alt={page.title.rendered}
            width={800}
            height={800}
            priority
          />
        </div>
        
        <div className="thumbnails">
          {acf.product_gallery?.map((image: any, index: number) => (
            <Image
              key={index}
              src={wpAcfImg(image)}
              alt={`Product ${index + 1}`}
              width={100}
              height={100}
            />
          ))}
        </div>
      </div>
      
      {/* Product Info */}
      <div className="product-info">
        <h1>{page.title.rendered}</h1>
        <div 
          dangerouslySetInnerHTML={{ 
            __html: replaceWpImagesInHtml(page.content.rendered) 
          }} 
        />
      </div>
      
      {/* Features with Icons */}
      <div className="features">
        {acf.features?.map((feature: any, index: number) => (
          <div key={index} className="feature">
            <img 
              src={wpAcfImg(feature.icon)} 
              alt={feature.title}
              width={64}
              height={64}
            />
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Service Template with Background Sections

```tsx
import { wpAcfImg, replaceWpImagesInHtml } from '@/lib/imageUtils';

export default function ServiceTemplate({ page }: { page: any }) {
  const { acf } = page;
  
  return (
    <div className="service-page">
      {/* Hero */}
      <section 
        className="hero h-[500px] bg-cover bg-center"
        style={{ backgroundImage: `url(${wpAcfImg(acf.hero_background)})` }}
      >
        <div className="container">
          <h1>{page.title.rendered}</h1>
          <p>{acf.hero_subtitle}</p>
        </div>
      </section>
      
      {/* Service Sections (Repeater) */}
      {acf.service_sections?.map((section: any, index: number) => (
        <section 
          key={index}
          className={`service-section ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
        >
          <div className="container grid md:grid-cols-2 gap-8">
            <div>
              <h2>{section.title}</h2>
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: replaceWpImagesInHtml(section.content) 
                }} 
              />
            </div>
            <div>
              <img 
                src={wpAcfImg(section.image)} 
                alt={section.title}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>
      ))}
      
      {/* CTA Section */}
      <section 
        className="cta bg-cover bg-center"
        style={{ backgroundImage: `url(${wpAcfImg(acf.cta_background)})` }}
      >
        <div className="container text-center">
          <h2>{acf.cta_title}</h2>
          <button className="btn">{acf.cta_button_text}</button>
        </div>
      </section>
    </div>
  );
}
```

---

## Best Practices

### ✅ Do This

```tsx
// Always use helper functions
import { wpImgUrl, wpAcfImg } from '@/lib/imageUtils';

const url = wpImgUrl(imageUrl);
const acfUrl = wpAcfImg(acfField);
```

### ❌ Don't Do This

```tsx
// Don't use raw URLs
const url = page.acf.banner_image; // Won't work in local mode
```

### ✅ Do This

```tsx
// Transform HTML content
import { replaceWpImagesInHtml } from '@/lib/imageUtils';

const html = replaceWpImagesInHtml(page.content.rendered);
```

### ❌ Don't Do This

```tsx
// Don't use raw HTML
const html = page.content.rendered; // Images will be broken
```

### ✅ Do This

```tsx
// Handle null/undefined
const image = wpAcfImg(page.acf.optional_image);
if (image) {
  return <img src={image} alt="Optional" />;
}
```

### ❌ Don't Do This

```tsx
// Don't assume image exists
return <img src={page.acf.optional_image} alt="Optional" />; // May be null
```

---

## Summary

**Key Functions:**
- `wpImgUrl(url)` - Convert any WordPress URL to local/proxy path
- `wpAcfImg(field)` - Handle ACF image fields (any format)
- `replaceWpImagesInHtml(html)` - Transform images in HTML content

**Common Patterns:**
- Simple images: `<img src={wpImgUrl(...)} />`
- ACF fields: `<img src={wpAcfImg(...)} />`
- HTML content: `dangerouslySetInnerHTML={{ __html: replaceWpImagesInHtml(...) }}`
- Background: `style={{ backgroundImage: \`url(\${wpImgUrl(...)})\` }}`
- Next.js Image: `<Image src={wpImgUrl(...)} ... />`

For more information, see [IMAGE_SYNC_GUIDE.md](../IMAGE_SYNC_GUIDE.md).
