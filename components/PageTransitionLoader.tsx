'use client';

import { useState, useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function PageTransitionLoaderInner() {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Hide loader whenever the pathname or search params change (navigation completes)
    useEffect(() => {
        setIsLoading(false);
    }, [pathname, searchParams]);

    // Intercept clicks on links to show the loader immediately
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Find the closest anchor tag
            const anchor = target.closest('a');
            if (!anchor) return;

            const href = anchor.getAttribute('href');
            if (!href) return;

            // Ignore external links, mailto, tel, or anchor links
            if (href.startsWith('http') && !href.includes(window.location.host)) return;
            if (href.startsWith('mailto:') || href.startsWith('tel:')) return;
            if (href.startsWith('#')) return;

            // Strip origin if present for comparison
            const url = new URL(anchor.href);
            const targetPath = url.pathname;

            // Ignore if it's the exact same page
            if (targetPath === pathname && url.search === window.location.search) return;
            
            // Allow Ctrl+Click or Cmd+Click to open in new tab without showing loader
            if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
            
            // Check target blank
            if (anchor.getAttribute('target') === '_blank') return;

            // Start loader
            setIsLoading(true);
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [pathname]);

    if (!isLoading) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            zIndex: 999999, // Ensure it sits above the header and everything else
            transition: 'opacity 0.2s ease-in-out',
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 12,
            }}>
                <span className="wdc-dot-1" style={{
                    display: 'inline-block',
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#50c1ed',
                }} />
                <span className="wdc-dot-2" style={{
                    display: 'inline-block',
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#50c1ed',
                }} />
                <span className="wdc-dot-3" style={{
                    display: 'inline-block',
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#50c1ed',
                }} />
            </div>
            <div style={{
                marginTop: 24,
                color: '#50c1ed',
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 600,
                fontSize: '15px',
                letterSpacing: '2px',
                textTransform: 'uppercase'
            }}>
                Loading
            </div>
        </div>
    );
}

export default function PageTransitionLoader() {
    return (
        <Suspense fallback={null}>
            <PageTransitionLoaderInner />
        </Suspense>
    );
}
