'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const languages = [
  { 
    code: 'sv', 
    label: 'Svenska', 
    flag: '/flags/se.png',
    path: '/sv' 
  },
  { 
    code: 'en', 
    label: 'English', 
    flag: '/flags/gb.png',
    path: '/en' 
  },
];

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [translatedUrls, setTranslatedUrls] = useState<{[key: string]: string}>({});
  const router = useRouter();
  const pathname = usePathname();
  const current = pathname?.startsWith('/en') ? languages[1] : languages[0];

  // Fetch translated URLs when pathname changes
  useEffect(() => {
    async function fetchTranslations() {
      if (!pathname) return;
      
      // Extract current language and slug
      let currentLang = 'sv';
      let slug = '';
      
      if (pathname.startsWith('/sv/')) {
        currentLang = 'sv';
        slug = pathname.replace('/sv/', '').split('/')[0];
      } else if (pathname.startsWith('/en/')) {
        currentLang = 'en';
        slug = pathname.replace('/en/', '').split('/')[0];
      } else if (pathname === '/sv' || pathname === '/en' || pathname === '/') {
        // Homepage - just use language paths
        setTranslatedUrls({ sv: '/sv', en: '/en' });
        return;
      }

      if (!slug) return;

      try {
        // Fetch current page to get translation IDs
        const res = await fetch(`https://dev-bluerange.pantheonsite.io/wp-json/wp/v2/pages?slug=${slug}&lang=${currentLang}`);
        const data = await res.json();
        
        if (data && data[0] && data[0].translations) {
          const page = data[0];
          const translations: {[key: string]: string} = {};
          
          // Polylang returns translations as { "en": 347, "sv": 1863 } (post IDs)
          // We need to fetch the slug for each translation
          const translationPromises = Object.keys(page.translations).map(async (lang) => {
            const postId = page.translations[lang];
            
            try {
              // Fetch the translated page by ID to get its slug
              const translatedRes = await fetch(`https://dev-bluerange.pantheonsite.io/wp-json/wp/v2/pages/${postId}?lang=${lang}`);
              const translatedPage = await translatedRes.json();
              
              if (translatedPage && translatedPage.slug) {
                translations[lang] = `/${lang}/${translatedPage.slug}`;
              }
            } catch (err) {
              console.error(`Error fetching translation for ${lang}:`, err);
            }
          });
          
          await Promise.all(translationPromises);
          
          // Add current page
          translations[currentLang] = pathname;
          
          setTranslatedUrls(translations);
        } else {
          // No translations found, fallback to homepage
          setTranslatedUrls({ sv: '/sv', en: '/en' });
        }
      } catch (error) {
        console.error('Error fetching translations:', error);
        // Fallback: just use homepage
        setTranslatedUrls({ sv: '/sv', en: '/en' });
      }
    }

    fetchTranslations();
  }, [pathname]);

  const handleLanguageChange = (targetLang: string) => {
    setOpen(false);
    
    // Use translated URL if available
    if (translatedUrls[targetLang]) {
      router.push(translatedUrls[targetLang]);
    } else {
      // Fallback to homepage of target language
      router.push(targetLang === 'sv' ? '/sv' : '/en');
    }
  };

  return (
    <div className="lang-switcher" style={{ position: 'relative', marginLeft: '12px' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px',
        }}
        aria-label="Switch language"
      >
        <img 
          src={current.flag} 
          alt={current.label} 
          width={16} 
          height={11} 
          style={{ width: '16px', height: '11px', display: 'block' }} 
        />
        <span style={{ fontSize: '12px', color: '#fff' }}>▼</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '100%',
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 9999,
            minWidth: '140px',
            marginTop: '4px',
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                textDecoration: 'none',
                color: '#333',
                fontSize: '14px',
                borderBottom: lang.code === 'sv' ? '1px solid #f0f0f0' : 'none',
                width: '100%',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <img 
                src={lang.flag} 
                alt={lang.label} 
                width={16} 
                height={11} 
                style={{ width: '16px', height: '11px', display: 'block' }} 
              />
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
