/**
 * Image Proxy Resolver (NO LOCAL CACHING)
 * =========================================
 * Always uses WordPress URLs directly via the Next.js proxy.
 * NO static manifest, NO build-time caching, NO stale data!
 *
 * All images go through /wp-content/* → proxied to WordPress in next.config.ts
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

const WP_BASE = 'https://dev-bluerange.pantheonsite.io';

/**
 * Rewrites WordPress image URLs to use the Next.js proxy.
 * Always fresh, never cached locally!
 */
export function wpImgUrl(url: string | null | undefined): string {
    if (!url || typeof url !== 'string') return '';

    let normalized = url.trim();
    
    if (normalized.startsWith('http://')) {
        normalized = normalized.replace('http://', 'https://');
    }

    if (normalized.startsWith(WP_BASE + '/wp-content/')) {
        return normalized.replace(WP_BASE, '');
    }

    if (normalized.startsWith('/wp-content/')) {
        return normalized;
    }

    return normalized;
}

/**
 * Resolves an ACF image field to a URL.
 */
export function wpAcfImg(field: unknown): string {
    if (!field) return '';
    if (typeof field === 'string') return wpImgUrl(field);
    if (typeof field === 'object' && field !== null) {
        const obj = field as Record<string, unknown>;
        const url = (obj.url || obj.source_url || obj.guid) as string | undefined;
        if (url) return wpImgUrl(url);
    }
    return '';
}

/**
 * Replaces all WordPress image URLs inside HTML with proxied paths.
 */
export function replaceWpImagesInHtml(html: string | null | undefined): string {
    if (!html) return '';
    
    return html.replace(
        new RegExp(WP_BASE.replace(/\./g, '\\.') + '/wp-content/', 'g'),
        '/wp-content/'
    );
}

/**
 * No-op for backward compatibility - no cache to bust!
 */
export function bustManifestCache(): void {
    // Intentional no-op - no static caching!
}

// Legacy aliases
export const getLocalImagePath = wpImgUrl;
export const resolveAcfImageUrl = wpAcfImg;

/**
 * Always returns false - no local images!
 */
export function isLocalImage(url: string | null | undefined): boolean {
    return false;
}
