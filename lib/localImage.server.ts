/**
 * Server-only image manifest loader.
 * This file uses Node.js 'fs' — never import in client components.
 * Only import in Server Components or lib files used by Server Components.
 */

import fs from 'fs';
import path from 'path';

type ManifestEntry = {
    id: string | number;
    filename: string;
    source_url: string;
    local_path: string;
    synced_at: string;
};

let _map: Record<string, string> | null = null;

export function getServerImageMap(): Record<string, string> {
    if (_map) return _map;

    try {
        const manifestPath = path.join(process.cwd(), 'public', 'images', 'manifest.json');
        if (!fs.existsSync(manifestPath)) {
            _map = {};
            return _map;
        }

        const manifest: Record<string, ManifestEntry> = JSON.parse(
            fs.readFileSync(manifestPath, 'utf-8')
        );

        _map = {};
        for (const entry of Object.values(manifest)) {
            if (entry.filename && entry.local_path) {
                _map[entry.filename.toLowerCase()] = entry.local_path;
                _map[entry.source_url] = entry.local_path;
            }
        }
    } catch {
        _map = {};
    }

    return _map;
}
