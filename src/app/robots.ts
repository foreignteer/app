import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/*',
        '/api/*',
        '/login',
        '/register',
        '/reset-password',
        '/forgot-password',
      ],
    },
    sitemap: 'https://foreignteer.com/sitemap.xml',
  };
}
