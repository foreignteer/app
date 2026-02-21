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
        '/register/ngo',
        '/reset-password',
        '/forgot-password',
        '/verify-email',
      ],
    },
    sitemap: 'https://foreignteer.com/sitemap.xml',
  };
}
