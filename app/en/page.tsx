import { getSettings, getPageById } from '../../lib/wp';
import DesignedHomepage from '../../components/DesignedHomepage';

// Force dynamic rendering - no static caching
export const dynamic = 'force-dynamic';

export default async function EnglishHome() {
  const settings = await getSettings('en');

  if (!settings?.page_on_front) {
    return <h1>WordPress Front Page not configured</h1>;
  }

  const page = await getPageById(settings.page_on_front, 'en');

  if (!page || !page.acf) {
    return <h1>ACF data missing on homepage</h1>;
  }

  return <DesignedHomepage page={page} lang="en" />;
}
