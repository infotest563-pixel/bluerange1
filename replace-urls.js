const fs = require('fs');
const path = require('path');

const dir = 'd:\\ProjectData after 16-2-26\\Wordpress\\Bluerange\\bluerange1';
const envVar = 'process.env.NEXT_PUBLIC_WORDPRESS_URL';
const oldUrl = 'https://dev-bluerange.pantheonsite.io';

const replaceMap = {
    'lib/wp.ts': [
        { search: `'${oldUrl}'`, replace: `process.env.NEXT_PUBLIC_WORDPRESS_URL` }
    ],
    'lib/localImage.ts': [
        { search: `|| '${oldUrl}'`, replace: `` }
    ],
    'lib/resolveUrl.ts': [
        { search: `'${oldUrl}'`, replace: `process.env.NEXT_PUBLIC_WORDPRESS_URL` }
    ],
    'app/en/[slug]/page.tsx': [
        { search: `'${oldUrl}/wp-json/wp/v2/pages?per_page=100&lang=en'`, replace: `\`\${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/pages?per_page=100&lang=en\`` }
    ],
    'app/sv/[slug]/page.tsx': [
        { search: `'${oldUrl}/wp-json/wp/v2/pages?per_page=100&lang=sv'`, replace: `\`\${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/pages?per_page=100&lang=sv\`` }
    ],
    'app/[slug]/page.tsx': [
        { search: `'${oldUrl}/wp-json/wp/v2/pages?per_page=100&lang=sv'`, replace: `\`\${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/pages?per_page=100&lang=sv\`` }
    ],
    'app/api/contact/route.ts': [
        { search: `\`${oldUrl}`, replace: `\`\${process.env.NEXT_PUBLIC_WORDPRESS_URL}` }
    ],
    'components/CareerContactForm.tsx': [
        { search: `'${oldUrl}'`, replace: `process.env.NEXT_PUBLIC_WORDPRESS_URL` }
    ],
    'components/CoLocationContactForm.tsx': [
        { search: `'${oldUrl}'`, replace: `process.env.NEXT_PUBLIC_WORDPRESS_URL` }
    ],
    'components/ContactForm.tsx': [
        { search: `'${oldUrl}/wp-json/contact-form-7/v1/contact-forms/70/feedback'`, replace: `\`\${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/contact-form-7/v1/contact-forms/70/feedback\`` }
    ],
    'components/DomainsContactForm.tsx': [
        { search: `'${oldUrl}'`, replace: `process.env.NEXT_PUBLIC_WORDPRESS_URL` }
    ],
    'components/S3ContactForm.tsx': [
        { search: `'${oldUrl}'`, replace: `process.env.NEXT_PUBLIC_WORDPRESS_URL` }
    ],
    'components/Header.tsx': [
        { search: `'${oldUrl}'`, replace: `process.env.NEXT_PUBLIC_WORDPRESS_URL` }
    ],
    'components/Footer.tsx': [
        { search: `'${oldUrl}'`, replace: `process.env.NEXT_PUBLIC_WORDPRESS_URL` }
    ],
    'components/LanguageSwitcher.tsx': [
        { search: `\`${oldUrl}`, replace: `\`\${process.env.NEXT_PUBLIC_WORDPRESS_URL}` },
        { search: `\`${oldUrl}`, replace: `\`\${process.env.NEXT_PUBLIC_WORDPRESS_URL}` }
    ],
    'components/DomainSearch.tsx': [
        { search: `'${oldUrl}/wp-admin/admin-ajax.php'`, replace: `\`\${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-admin/admin-ajax.php\`` }
    ],
    'components/templates/CoLocation.tsx': [
        { search: `'${oldUrl}'`, replace: `process.env.NEXT_PUBLIC_WORDPRESS_URL` }
    ],
    'components/DesignedHomepage.tsx': [
        { search: `src="${oldUrl}/wp-content/uploads/2023/11/headquarter.png"`, replace: `src={\`\${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-content/uploads/2023/11/headquarter.png\`}` }
    ],
    'scripts/sync-wp-images.mjs': [
        { search: `|| '${oldUrl}'`, replace: `` }
    ]
};

for (const [file, replacements] of Object.entries(replaceMap)) {
    const fullPath = path.join(dir, file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let modified = false;
        for (const {search, replace} of replacements) {
            if (content.includes(search)) {
                content = content.replace(new RegExp(search.replace(/[.*+?^$\\{}()|[\\]\\\\]/g, '\\\\$&'), 'g'), replace);
                modified = true;
            }
        }
        if (modified) {
            fs.writeFileSync(fullPath, content);
            console.log('Updated', file);
        }
    }
}
