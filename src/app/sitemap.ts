import { MetadataRoute } from 'next';
import { adminDb } from '@/lib/firebase/admin';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://foreignteer.com';

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/experiences`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/partner`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // Fetch dynamic blog posts
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogsSnapshot = await adminDb
      .collection('blogs')
      .where('status', '==', 'published')
      .get();

    blogRoutes = blogsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        url: `${baseUrl}/blog/${doc.id}`,
        lastModified: data.updatedAt?.toDate() || data.publishedAt?.toDate() || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      };
    });
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Fetch dynamic NGO profiles
  let ngoRoutes: MetadataRoute.Sitemap = [];
  try {
    const ngosSnapshot = await adminDb
      .collection('ngos')
      .where('status', '==', 'approved')
      .where('publicSlug', '!=', null)
      .get();

    ngoRoutes = ngosSnapshot.docs
      .filter((doc) => doc.data().publicSlug) // Double-check slug exists
      .map((doc) => {
        const data = doc.data();
        return {
          url: `${baseUrl}/ngos/${data.publicSlug}`,
          lastModified: data.updatedAt?.toDate() || new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        };
      });
  } catch (error) {
    console.error('Error fetching NGOs for sitemap:', error);
  }

  return [...staticRoutes, ...blogRoutes, ...ngoRoutes];
}
