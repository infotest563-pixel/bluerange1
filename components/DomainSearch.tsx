'use client';

import { useState } from 'react';

export default function DomainSearch({ buttonText = 'Search Domain' }: { buttonText?: string }) {
    const [domain, setDomain] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<null | { available: boolean; domain: string }>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        const raw = domain.trim();
        if (!raw) return;

        setLoading(true);
        setResult(null);

        try {
            const body = new URLSearchParams({
                action: 'wdc_check_domain',
                domain: raw,
                item_id: '741',
            });
            const res = await fetch('https://dev-bluerange.pantheonsite.io/wp-admin/admin-ajax.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body.toString(),
            });
            const json = await res.json();
            setResult({ available: !!json?.success, domain: raw });
        } catch {
            setResult({ available: false, domain: raw });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 704, margin: '0 auto', paddingBottom: 20 }}>
            <form
                onSubmit={handleSearch}
                className="take-form"
                style={{ display: 'flex', borderRadius: 50, overflow: 'hidden', background: '#fff' }}
            >
                <input
                    type="text"
                    className="form-control"
                    // placeholder="yourdomain.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    disabled={loading}
                    style={{
                        flex: 1,
                        border: 'none',
                        padding: '14px 22px',
                        fontSize: '16px',
                        outline: 'none',
                        background: 'transparent',
                        borderRadius: '10px 0 0 10px',
                        color: '#3a3a3a',
                    }}
                />
                <button
                    type="submit"
                    className="btn"
                    disabled={loading}
                    style={{
                        borderRadius: '0 50px 50px 0',
                        backgroundColor: '#50c1ed',
                        color: '#fff',
                        padding: '14px 28px',
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        whiteSpace: 'nowrap',
                        minWidth: 150,
                        fontSize: '16px',
                        opacity: loading ? 0.75 : 1,
                        transition: '0.3s all',
                    }}
                >
                    {loading ? 'Searching...' : buttonText}
                </button>
            </form>

            {/* Loading dots */}
            {loading && (
                <div style={{
                    marginTop: 18,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 10,
                }}>
                    <span className="wdc-dot-1" style={{
                        display: 'inline-block',
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: '#50c1ed',
                    }} />
                    <span className="wdc-dot-2" style={{
                        display: 'inline-block',
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: '#50c1ed',
                    }} />
                    <span className="wdc-dot-3" style={{
                        display: 'inline-block',
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: '#50c1ed',
                    }} />
                </div>
            )}

            {/* Result message */}
            {result && (
                <div style={{
                    marginTop: 18,
                    padding: '12px 20px',
                    borderRadius: 8,
                    background: result.available ? 'rgba(80,193,237,0.15)' : 'rgba(255,80,80,0.1)',
                    border: `1px solid ${result.available ? '#50c1ed' : '#ff5050'}`,
                    color: result.available ? '#0a7a9e' : '#cc2222',
                    fontSize: 16,
                    fontWeight: 500,
                    textAlign: 'center',
                }}>
                    {result.available
                        ? `✓ "${result.domain}" is available!`
                        : `✗ "${result.domain}" is not available.`}
                </div>
            )}
        </div>
    );
}
