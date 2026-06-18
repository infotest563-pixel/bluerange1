'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ClientScripts() {
    const pathname = usePathname();

    useEffect(() => {
        // Run on initial hydration AND on Next.js route changes
        // Using setTimeout ensures DOM is fully painted and ready for Swiper/Maps
        const timer1 = setTimeout(() => {
            if (typeof window !== 'undefined' && typeof (window as any).initSwipers === 'function') {
                (window as any).initSwipers();
            }
        }, 300);

        const timer2 = setTimeout(() => {
            if (typeof window !== 'undefined' && typeof (window as any).initMap === 'function') {
                (window as any).initMap();
            }
        }, 500);

        // Re-trigger scroll animations for new page content
        const timer3 = setTimeout(() => {
            if (typeof window !== 'undefined' && typeof (window as any).jQuery !== 'undefined') {
                const $ = (window as any).jQuery;
                $(".row , .bl-inners").each(function (this: any) {
                    var $el = $(this);
                    var bot_obj = $el.offset().top + $el.outerHeight() * 0.6;
                    var bot_win = $(window).scrollTop() + $(window).height();
                    if (bot_win > bot_obj) {
                        setTimeout(() => { $el.addClass("animated"); }, 400);
                    }
                });
            }
        }, 600);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [pathname]); // Depend on pathname so it runs every time the route changes

    return null;
}
