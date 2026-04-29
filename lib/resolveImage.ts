/**
 * resolveImage.ts
 * ===============
 * Shared image resolver for all templates.
 *
 * Replaces the repeated inline resolveImage() function in every template.
 * Always runs the URL through wpImgUrl() so IMAGE_MODE is respected.
 *
 * Usage in templates:
 *   import { makeResolver } from '../../lib/resolveImage';
 *   const resolveImage = makeResolver(getMedia);
 *   const url = await resolveImage(acf.some_image_field);
 */

import { wpImgUrl } from './localImage';
import { getMedia } from './wp';

/**
 * Resolves any ACF image field to a final URL.
 * - string  → wpImgUrl(string)
 * - object  → wpImgUrl(object.url || object.source_url)
 * - number  → fetch media by ID → wpImgUrl(source_url)
 * - null    → ''
 */
export async function resolveImage(field: any): Promise<string> {
    if (!field) return '';

    // Already a string URL
    if (typeof field === 'string') return wpImgUrl(field);

    // ACF image object { url, ... } or { source_url, ... }
    if (typeof field === 'object' && !Array.isArray(field)) {
        const url = field.url || field.source_url || field.guid || '';
        if (url) return wpImgUrl(url);
    }

    // Numeric media ID — fetch from WP API
    if (typeof field === 'number') {
        const media = await getMedia(field).catch(() => null);
        return wpImgUrl(media?.source_url || '');
    }

    return '';
}
