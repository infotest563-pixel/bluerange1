import './globals.css';
import type { ReactNode } from 'react';
import Script from 'next/script';
import ErrorBoundary from '../components/ErrorBoundary';
import PageTransitionLoader from '../components/PageTransitionLoader';
import ClientScripts from '../components/ClientScripts';

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning={true}>
      <head>
      {/* Remove browser-extension injected attributes (e.g. Bitwarden bis_skin_checked)
          BEFORE React hydration runs — prevents hydration mismatch errors */}
      <script dangerouslySetInnerHTML={{ __html: `(function(){try{var o=new MutationObserver(function(ml){ml.forEach(function(m){if(m.type==='attributes'&&m.attributeName==='bis_skin_checked'){m.target.removeAttribute('bis_skin_checked');}});});o.observe(document.documentElement,{attributes:true,subtree:true,attributeFilter:['bis_skin_checked']});}catch(e){}})();` }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/understrap/css/theme.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/8.4.7/swiper-bundle.css" />
        <link rel="stylesheet" href="/understrap-child/css/animation.css" />
        <link rel="stylesheet" href="/understrap-child/css/bl-custom.css" />
        <link rel="stylesheet" href="/understrap-child/css/bl-responsive.css" />
        <link rel="stylesheet" href="/understrap-child/css/bl-menu.css" />
        <link rel="stylesheet" href="/understrap-child/fonts/stylesheet.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
        <link rel="stylesheet" href="/understrap-child/style.css" />
      </head>
      <body suppressHydrationWarning={true}>
        <ClientScripts />
        <PageTransitionLoader />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>

        {/* jQuery — load before Bootstrap */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js"
          strategy="beforeInteractive"
        />

        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/8.4.7/swiper-bundle.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="/understrap-child/js/bl-custom.js"
          strategy="afterInteractive"
        />
        <Script
          src="/understrap-child/js/mapdata.js"
          strategy="afterInteractive"
        />
        <Script
          src="/understrap-child/js/countrymap.js"
          strategy="afterInteractive"
        />
        <Script
          src="/contact-form-handler.js"
          strategy="afterInteractive"
        />

        {/* Re-initialize Swiper on Next.js client-side navigation */}
        <Script
          id="swiper-reinit"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function initSwipers() {
                if (typeof Swiper === 'undefined') return;

                // Fantastic customers / logo sliders — scoped navigation per instance
                document.querySelectorAll('.hm-firstbnr').forEach(function(el) {
                  if (el.swiper) el.swiper.destroy(true, true);
                  var nextBtn = el.querySelector('.swiper-button-next');
                  var prevBtn = el.querySelector('.swiper-button-prev');
                  new Swiper(el, {
                    slidesPerView: 1, spaceBetween: 30, loop: true, speed: 1500,
                    autoplay: { delay: 1500, disableOnInteraction: false },
                    navigation: { nextEl: nextBtn, prevEl: prevBtn },
                    breakpoints: { 0:{slidesPerView:1}, 660:{slidesPerView:2}, 1024:{slidesPerView:5} }
                  });
                });

                // Partners slider
                document.querySelectorAll('.hm-partswiper').forEach(function(el) {
                  if (el.swiper) el.swiper.destroy(true, true);
                  new Swiper(el, {
                    slidesPerView: 6, spaceBetween: 30, loop: true, speed: 2500,
                    autoplay: { delay: 2000, disableOnInteraction: false },
                    breakpoints: { 0:{slidesPerView:1}, 640:{slidesPerView:3}, 1024:{slidesPerView:5}, 1280:{slidesPerView:6} }
                  });
                });

                // Career image slider
                document.querySelectorAll('.cr-imgcrr').forEach(function(el) {
                  if (el.swiper) el.swiper.destroy(true, true);
                  new Swiper(el, {
                    slidesPerView: 2, spaceBetween: 30, loop: true, speed: 1500,
                    autoplay: { delay: 1000, disableOnInteraction: false },
                    pagination: { el: el.querySelector('.swiper-pagination'), clickable: true },
                    breakpoints: { 0:{slidesPerView:1}, 660:{slidesPerView:2} }
                  });
                });

                // Security awareness training logos
                document.querySelectorAll('.sat-securlog').forEach(function(el) {
                  if (el.swiper) el.swiper.destroy(true, true);
                  new Swiper(el, {
                    slidesPerView: 4, spaceBetween: 30, loop: true, speed: 1500,
                    autoplay: { delay: 1000, disableOnInteraction: false },
                    pagination: { el: el.querySelector('.swiper-pagination'), clickable: true },
                    breakpoints: { 0:{slidesPerView:1}, 660:{slidesPerView:2}, 1024:{slidesPerView:4} }
                  });
                });

                // Our partners slider
                document.querySelectorAll('.op-prtnrsldr').forEach(function(el) {
                  if (el.swiper) el.swiper.destroy(true, true);
                  var nextBtn = el.querySelector('.swiper-button-next');
                  var prevBtn = el.querySelector('.swiper-button-prev');
                  new Swiper(el, {
                    slidesPerView: 4, spaceBetween: 30, loop: true,
                    pagination: { el: el.querySelector('.swiper-pagination'), clickable: true },
                    navigation: { nextEl: nextBtn, prevEl: prevBtn },
                    breakpoints: { 0:{slidesPerView:1}, 660:{slidesPerView:3}, 1024:{slidesPerView:4} }
                  });
                });

                // Service testimonial
                document.querySelectorAll('.sr-testimoail').forEach(function(el) {
                  if (el.swiper) el.swiper.destroy(true, true);
                  new Swiper(el, {
                    slidesPerView: 3, spaceBetween: 30, loop: true,
                    pagination: { el: el.querySelector('.swiper-pagination'), clickable: true },
                    breakpoints: { 0:{slidesPerView:1}, 660:{slidesPerView:2}, 1024:{slidesPerView:3} }
                  });
                });

                // Add sw-aropad class to swipers that have prev/next buttons
                document.querySelectorAll('.swiper').forEach(function(el) {
                  if (el.querySelector('.swiper-button-prev')) {
                    el.classList.add('sw-aropad');
                  }
                });
              }

              // Init country map
              function initMap() {
                var mapEl = document.getElementById('map');
                if (!mapEl || mapEl.children.length > 0) return;
                if (typeof simplemaps_countrymap !== 'undefined') {
                  try { simplemaps_countrymap.load(); } catch(e) {}
                }
              }

              // Export functions to window so React Client Component can call them safely AFTER hydration completes
              if (typeof window !== 'undefined') {
                window.initSwipers = initSwipers;
                window.initMap = initMap;
              }
            `
          }}
        />
      </body>
    </html>
  );
}
