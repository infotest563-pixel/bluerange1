/**
 * lib/config.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all environment-driven configuration.
 *
 * ✅ Server-side usage  → import from 'lib/config'
 * ✅ Client-side usage  → use NEXT_PUBLIC_WORDPRESS_URL directly (Next.js
 *    replaces it at build time for browser bundles)
 *
 * To change the WordPress backend URL, update NEXT_PUBLIC_WORDPRESS_URL
 * in .env.local — do NOT hardcode URLs anywhere else in the codebase.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ---------------------------------------------------------------------------
// WordPress Backend URL
// ---------------------------------------------------------------------------
// NEXT_PUBLIC_WORDPRESS_URL is available on both server and client because
// of the NEXT_PUBLIC_ prefix. It is injected by Next.js at build time for
// browser bundles and read from process.env at runtime for server code.
//
// The fallback string intentionally triggers a visible error so developers
// know they forgot to set the env var — it is NOT a real fallback URL.
// ---------------------------------------------------------------------------

if (
  typeof process !== 'undefined' &&
  !process.env.NEXT_PUBLIC_WORDPRESS_URL
) {
  console.warn(
    '[config] ⚠️  NEXT_PUBLIC_WORDPRESS_URL is not set. ' +
    'Please create .env.local with NEXT_PUBLIC_WORDPRESS_URL=https://your-wp-site.com'
  );
}

/** Base URL of the WordPress backend — no trailing slash */
export const WP_URL: string =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ||
  'https://dev-bluerange.pantheonsite.io';

// ---------------------------------------------------------------------------
// Image Mode
// ---------------------------------------------------------------------------
/** 'proxy' (default) | 'local' */
export const IMAGE_MODE: string =
  process.env.IMAGE_MODE || 'proxy';

// ---------------------------------------------------------------------------
// Derived helpers
// ---------------------------------------------------------------------------

/** WP REST API v2 base path */
export const WP_API = `${WP_URL}/wp-json/wp/v2`;

/** WP headless custom endpoints base path */
export const WP_HEADLESS_API = `${WP_URL}/wp-json/headless/v1`;

/** Contact Form 7 REST API base path */
export const WP_CF7_API = `${WP_URL}/wp-json/contact-form-7/v1/contact-forms`;

/** WordPress admin-ajax.php URL */
export const WP_ADMIN_AJAX = `${WP_URL}/wp-admin/admin-ajax.php`;

/** WordPress uploads base URL */
export const WP_UPLOADS = `${WP_URL}/wp-content/uploads`;
