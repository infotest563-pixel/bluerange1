/**
 * Local Image Resolver
 * ====================
 * Converts WordPress image URLs → local /images/ paths.
 *
 * Works in BOTH server and client components — no 'fs' used.
 * Manifest is imported as a static JSON file (webpack handles it safely).
 *
 * IMAGE_MODE=local  → returns /images/filename  (requires npm run sync-images)
 * IMAGE_MODE=wp     → returns original WP URL   (default, always fresh)
 */

// ─── Static JSON import — safe in client AND server ──────────────────────────
// webpack/Next.js bundles this at build time — no 'fs' needed
let _manifest: Record<string, { filename: string; source_url: string; local_path: string }> = {};

try {
    // This works in both server and client — Next.js handles JSON imports natively
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    _manifest = require('../public/images/manifest.json');
} catch {
    _manifest = {};
}

// ─── Build lookup map once ────────────────────────────────────────────────────
const _map: Record<string, string> = {};

for (const entry of Object.values(_manifest)) {
    if (entry?.filename && entry?.local_path) {
        _map[entry.filename.toLowerCase()] = entry.local_path;
        if (entry.source_url) {
            _map[entry.source_url] = entry.local_path;
        }
    }
}

// ─── Mode detection ───────────────────────────────────────────────────────────
function getImageMode(): string {
    if (typeof process !== 'undefined') {
        const mode = process.env?.IMAGE_MODE || process.env?.NEXT_PUBLIC_IMAGE_MODE;
        if (mode === 'local') return 'local';
    }
    return 'wp';
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sanitizeFilename(name: string): string {
    return name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
}

function extractFilename(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1].split('?')[0];
}

// ─── Main function ────────────────────────────────────────────────────────────

/**
 * Converts a WordPress image URL to a local /images/ path.
 * Falls back to the original WP URL if not found locally.
 */
export function wpImgUrl(url: string | null | undefined): string {
    if (!url || typeof url !== 'string') return '';

    // Normalize
    let normalized = url.trim();
    if (normalized.startsWith('http://')) {
        normalized = normalized.replace('http://', 'https://');
    }

    // Expand relative /wp-content/ paths
    if (normalized.startsWith('/wp-content/') || normalized.startsWith('wp-content/')) {
        normalized = `https://dev-bluerange.pantheonsite.io/${normalized.replace(/^\//, '')}`;
    }

    // Already a local path
    if (normalized.startsWith('/images/') || normalized.startsWith('/public/')) {
        return normalized;
    }

    // Non-WP external URL
    if (
        normalized.startsWith('http') &&
        !normalized.includes('pantheonsite.io') &&
        !normalized.includes('wp-content')
    ) {
        return normalized;
    }

    // IMAGE_MODE=wp → return WP URL directly (always fresh)
    if (getImageMode() !== 'local') {
        return normalized;
    }

    // IMAGE_MODE=local → look up in manifest
    // 1. Direct source_url match
    if (_map[normalized]) return _map[normalized];

    // 2. Sanitized filename
    const rawFilename = extractFilename(normalized);
    const safeFilename = sanitizeFilename(rawFilename);
    if (_map[safeFilename]) return _map[safeFilename];

    // 3. Lowercase filename
    if (_map[rawFilename.toLowerCase()]) return _map[rawFilename.toLowerCase()];

    // 4. Fallback — return original WP URL
    return normalized;
}

/**
 * Resolves an ACF image field to a URL.
 * Handles: string URL | { url } | { source_url } | number (ID — returns empty, needs server fetch)
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
 * Replaces all WordPress image URLs inside an HTML string with local paths.
 */
export function replaceWpImagesInHtml(html: string | null | undefined): string {
    if (!html) return '';
    if (getImageMode() !== 'local') return html;
    if (Object.keys(_map).length === 0) return html;

    return html.replace(
        /https?:\/\/[^"'\s)]+\/wp-content\/uploads\/[^"'\s)]+/g,
        (match) => wpImgUrl(match) || match
    );
}

/**
 * Clears the manifest cache (no-op now since we use static import).
 * Kept for backward compatibility.
 */
export function bustManifestCache(): void {
    // No-op — manifest is loaded at build time
}

// Legacy aliases
export const getLocalImagePath = wpImgUrl;
export const resolveAcfImageUrl = wpAcfImg;
