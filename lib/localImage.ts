/**
 * Image Resolver with Local/Proxy Mode Support
 * =============================================
 * Supports two modes:
 * - LOCAL: Serves images from /public/images/ (synced via sync-wp-images.mjs)
 * - PROXY: Proxies images through /wp-content/* → WordPress server
 *
 * Set IMAGE_MODE=local in .env.local to use local images.
 * Default is proxy mode (always fresh, no build-time sync needed).
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */

// Type declarations for Node.js globals (used server-side only)
declare const process: any;
declare const require: any;

const WP_BASE = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://dev-bluerange.pantheonsite.io';
const IMAGE_MODE = process.env.IMAGE_MODE || 'proxy'; // 'local' or 'proxy'

// Manifest cache (only used in local mode, server-side only)
let manifestCache: Record<string, any> | null = null;

/**
 * Load the manifest.json file (only in local mode, server-side only)
 */
function loadManifest(): Record<string, any> {
    if (manifestCache) return manifestCache;
    
    // Only load manifest server-side
    if (typeof window !== 'undefined') return {};
    
    try {
        // Dynamic require to avoid bundling fs/path in client code
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const fs = require('fs');
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const path = require('path');
        
        const manifestPath = path.join(process.cwd(), 'public', 'images', 'manifest.json');
        if (fs.existsSync(manifestPath)) {
            const content = fs.readFileSync(manifestPath, 'utf-8');
            manifestCache = JSON.parse(content);
            return manifestCache || {};
        }
    } catch (err) {
        console.warn('[localImage] Failed to load manifest:', err);
    }
    
    return {};
}

/**
 * Extract filename from WordPress URL
 */
function getFilenameFromUrl(url: string): string {
    const parts = url.split('/');
    const filename = parts[parts.length - 1].split('?')[0];
    return filename.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
}

/**
 * Find local image path from manifest by matching source URL
 */
function findLocalImage(wpUrl: string): string | null {
    if (IMAGE_MODE !== 'local') return null;
    
    const manifest = loadManifest();
    
    // Search manifest for matching source_url
    for (const entry of Object.values(manifest)) {
        if (entry.source_url === wpUrl) {
            return entry.local_path;
        }
    }
    
    // Fallback: try to construct path from filename
    const filename = getFilenameFromUrl(wpUrl);
    const localPath = `/images/${filename}`;
    
    // Check if file exists (server-side only)
    if (typeof window === 'undefined') {
        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const fs = require('fs');
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const path = require('path');
            const filePath = path.join(process.cwd(), 'public', localPath);
            if (fs.existsSync(filePath)) {
                return localPath;
            }
        } catch {
            // Ignore errors
        }
    }
    
    return null;
}

/**
 * Rewrites WordPress image URLs based on IMAGE_MODE.
 * - local mode: /images/filename.png
 * - proxy mode: /wp-content/uploads/.../filename.png
 */
export function wpImgUrl(url: string | null | undefined): string {
    if (!url || typeof url !== 'string') return '';

    let normalized = url.trim();
    
    // Normalize http → https
    if (normalized.startsWith('http://')) {
        normalized = normalized.replace('http://', 'https://');
    }

    // Already a local path
    if (normalized.startsWith('/images/')) {
        return normalized;
    }

    // LOCAL MODE: Try to find local image
    if (IMAGE_MODE === 'local') {
        const localPath = findLocalImage(normalized);
        if (localPath) return localPath;
        
        // Fallback to proxy if not found locally
        console.warn(`[localImage] Image not found locally, falling back to proxy: ${normalized}`);
    }

    // PROXY MODE: Rewrite to use Next.js proxy
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
 * Replaces all WordPress image URLs inside HTML.
 * - local mode: tries to replace with /images/ paths
 * - proxy mode: replaces with /wp-content/ proxy paths
 */
export function replaceWpImagesInHtml(html: string | null | undefined): string {
    if (!html) return '';
    
    if (IMAGE_MODE === 'local') {
        // Replace WordPress URLs with local paths
        const manifest = loadManifest();
        let result = html;
        
        for (const entry of Object.values(manifest)) {
            if (entry.source_url && entry.local_path) {
                result = result.replace(
                    new RegExp(entry.source_url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                    entry.local_path
                );
            }
        }
        
        // Also replace any remaining WP URLs with proxy paths as fallback
        result = result.replace(
            new RegExp(WP_BASE.replace(/\./g, '\\.') + '/wp-content/', 'g'),
            '/wp-content/'
        );
        
        return result;
    }
    
    // PROXY MODE: Simple replacement
    return html.replace(
        new RegExp(WP_BASE.replace(/\./g, '\\.') + '/wp-content/', 'g'),
        '/wp-content/'
    );
}

/**
 * Bust the manifest cache (useful after syncing new images)
 */
export function bustManifestCache(): void {
    manifestCache = null;
}

// Legacy aliases
export const getLocalImagePath = wpImgUrl;
export const resolveAcfImageUrl = wpAcfImg;

/**
 * Check if an image is available locally
 */
export function isLocalImage(url: string | null | undefined): boolean {
    if (!url || IMAGE_MODE !== 'local') return false;
    
    const localPath = findLocalImage(url);
    return localPath !== null;
}
