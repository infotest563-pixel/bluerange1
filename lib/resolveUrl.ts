const WP_HOST = 'https://dev-bluerange.pantheonsite.io';

/**
 * Converts a WP URL or bare path to a lang-prefixed Next.js path.
 * e.g. "/contact-us" → "/en/contact-us"
 *      "https://dev-bluerange.pantheonsite.io/contact-us" → "/en/contact-us"
 */
export function resolveUrl(url: string, lang: string = 'en'): string {
    if (!url) return '#';

    // Full WP URL — strip host and prefix with lang
    if (url.startsWith(WP_HOST)) {
        let path = url.replace(WP_HOST, '') || '/';
        if (path.includes('?page_id=')) return `/${lang}`;
        if (path.startsWith('/en/') || path.startsWith('/sv/')) return path;
        return `/${lang}${path}`;
    }

    // Bare path without lang prefix
    if (url.startsWith('/') && !url.startsWith('/en/') && !url.startsWith('/sv/')) {
        if (url.includes('?page_id=')) return `/${lang}`;
        return `/${lang}${url}`;
    }

    // Already correct (external URL, mailto:, tel:, or already prefixed)
    return url;
}

/**
 * Detect language from a WP page object.
 */
export function getLang(page: any): string {
    return page.lang
        || (typeof page.link === 'string' && page.link.includes('/sv/') ? 'sv' : 'en');
}
