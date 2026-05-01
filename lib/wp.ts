import { transformPage, transformWpImages } from './wpImageTransform';

const WP = 'https://dev-bluerange.pantheonsite.io';

/**
 * Rewrites a WordPress media URL to go through the Next.js /wp-content proxy.
 * e.g. https://dev-bluerange.pantheonsite.io/wp-content/uploads/2023/09/image.png
 *   →  /wp-content/uploads/2023/09/image.png
 *
 * This means images are served via your own Vercel domain instead of the WP server.
 * The rewrite rule in next.config.ts proxies /wp-content/* → WP server.
 */
export function proxyImageUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith(WP + '/wp-content/')) {
        return url.replace(WP, '');
    }
    return url;
}

/**
 * Rewrites all WordPress image URLs inside an HTML string.
 * Use this when rendering dangerouslySetInnerHTML content from WordPress.
 */
export function proxyHtmlImages(html: string): string {
    if (!html) return '';
    return html.replace(
        new RegExp(WP.replace(/\./g, '\\.') + '/wp-content/', 'g'),
        '/wp-content/'
    );
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type WpSettings = {
  show_on_front?: string;
  page_on_front?: number;
  page_for_posts?: number;
  options?: any;
  footer_form_html?: string;
  custom_logo_url?: string;
};

export async function getSettings(lang: string = 'sv'): Promise<WpSettings> {
    const url = `${WP}/wp-json/headless/v1/site-settings?lang=${lang}`;
    
    try {
        const res = await fetch(url, {
            next: { revalidate: 60, tags: ['settings', `settings-${lang}`] },
            redirect: 'manual',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        });

        if (!res.ok) {
            console.error(`[getSettings] Failed: ${res.status} ${res.statusText}`);
            return {} as WpSettings;
        }

        const data = await res.json();
        return transformWpImages({
            show_on_front: data.show_on_front,
            page_on_front: Number(data.page_on_front),
            page_for_posts: Number(data.page_for_posts),
            options: data.options,
            footer_form_html: data.footer_form_html,
            custom_logo_url: data.custom_logo_url
        });
    } catch (err) {
        console.error(`[getSettings] Error:`, err);
        return {} as WpSettings;
    }
}

export async function getSite(lang: string = 'sv') {
    const url = `${WP}/wp-json/headless/v1/site/?lang=${lang}`;

    try {
        const res = await fetch(url, {
            next: { revalidate: 3600, tags: ['site', `site-${lang}`] }, // Cache site info longer
            redirect: 'manual',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            return { name: 'Bluerange', description: '' };
        }

        const siteData = await res.json();
        return transformWpImages(siteData);
    } catch (err) {
        console.error(`[getSite] Network Error:`, err);
        return { name: 'Bluerange', description: '' };
    }
}


export async function getPageById(id: number, lang: string = 'sv') {
    try {
        const res = await fetch(`${WP}/wp-json/wp/v2/pages/${id}?_embed&lang=${lang}&acf_format=standard`, { 
            next: { revalidate: 60, tags: ['page', `page-${id}`, `page-${lang}`] },
            redirect: 'manual'
        });
        
        if (!res.ok) {
            console.error(`[getPageById] Failed: ${res.status}`);
            return null;
        }
        
        const page = await res.json();
        return transformPage(page);
    } catch (err) {
        console.error(`[getPageById] Error:`, err);
        return null;
    }
}

export async function getMedia(id: number, lang: string = 'sv') {
    const media = await fetch(`${WP}/wp-json/wp/v2/media/${id}?lang=${lang}`, { 
        next: { revalidate: 60, tags: ['media', `media-${id}`] },  // ✅ reduced from 3600 → 60 seconds
        redirect: 'manual'
    }).then(r => r.json());
    return transformWpImages(media);
}

export async function getPageBySlug(slug: string, lang: string = 'sv') {
    try {
        const res = await fetch(`${WP}/wp-json/wp/v2/pages?slug=${slug}&_embed&lang=${lang}&acf_format=standard`, { 
            next: { revalidate: 60, tags: ['page', `page-slug-${slug}`, `page-${lang}`] },
            redirect: 'manual'
        });
        
        if (!res.ok) {
            console.error(`[getPageBySlug] Failed: ${res.status}`);
            return null;
        }
        
        const data = await res.json();
        return transformPage(data[0] || null);
    } catch (err) {
        console.error(`[getPageBySlug] Error:`, err);
        return null;
    }
}

export async function getPostBySlug(slug: string, lang: string = 'sv') {
    try {
        const res = await fetch(`${WP}/wp-json/wp/v2/posts?slug=${slug}&_embed&lang=${lang}&acf_format=standard`, { 
            next: { revalidate: 60, tags: ['post', `post-slug-${slug}`, `post-${lang}`] },
            redirect: 'manual'
        });
        
        if (!res.ok) {
            console.error(`[getPostBySlug] Failed: ${res.status}`);
            return null;
        }
        
        const data = await res.json();
        return transformPage(data[0] || null);
    } catch (err) {
        console.error(`[getPostBySlug] Error:`, err);
        return null;
    }
}

export async function getMenu(slug: string, lang: string = 'sv') {
    try {
        const res = await fetch(`${WP}/wp-json/headless/v1/menus/${slug}?lang=${lang}`, { 
            next: { revalidate: 300, tags: ['menu', `menu-${slug}`, `menu-${lang}`] },
            redirect: 'manual'
        });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (e) {
        return [];
    }
}

export async function renderShortcode(code: string) {
    if (!code) return '';

    try {
        const res = await fetch(`${WP}/wp-json/headless/v1/shortcode`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
            next: { revalidate: 60, tags: ['shortcode'] },
            redirect: 'manual'
        });

        if (!res.ok) return '';

        const data = await res.json();

        if (typeof data === 'string') return data;
        if (data?.html) return data.html;
        if (data?.data) return data.data;

        return '';
    } catch (e) {
        console.error('[renderShortcode] Error:', e);
        return '';
    }
}