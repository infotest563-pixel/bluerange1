import './globals.css';
import type { ReactNode } from 'react';
import Script from 'next/script';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ErrorBoundary from '../components/ErrorBoundary';
import { headers } from 'next/headers';

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Detect language from URL path
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const lang = pathname.startsWith('/en') ? 'en' : 'sv';

  return (
    <html lang={lang}>
      <head>
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
        <Header lang={lang} />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <Footer lang={lang} />

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
      </body>
    </html>
  );
}
