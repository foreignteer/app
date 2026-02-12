import { Metadata } from 'next';
import { adminDb } from '@/lib/firebase/admin';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    // Fetch blog post from Firebase
    const blogsSnapshot = await adminDb
      .collection('blogs')
      .where('slug', '==', params.slug)
      .where('status', '==', 'published')
      .limit(1)
      .get();

    if (blogsSnapshot.empty) {
      return {
        title: 'Post Not Found - Foreignteer Blog',
        description: 'The blog post you are looking for could not be found.',
      };
    }

    const postData = blogsSnapshot.docs[0].data();
    const title = `${postData.title} | Foreignteer Blog`;
    const description = postData.excerpt?.substring(0, 160) || postData.summary || 'Read this inspiring story on the Foreignteer blog.';
    const publishedTime = postData.publishedAt?.toDate?.()?.toISOString();

    return {
      title,
      description,
      keywords: postData.tags?.join(', ') || 'volunteering, travel, impact',
      authors: postData.author?.name ? [{ name: postData.author.name }] : undefined,
      openGraph: {
        type: 'article',
        title: postData.title,
        description,
        url: `https://www.foreignteer.com/blog/${params.slug}`,
        images: postData.featuredImage
          ? [
              {
                url: postData.featuredImage,
                width: 1200,
                height: 630,
                alt: postData.title,
              },
            ]
          : [],
        publishedTime,
        authors: postData.author?.name ? [postData.author.name] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: postData.title,
        description,
        images: postData.featuredImage ? [postData.featuredImage] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata for blog post:', error);
    return {
      title: 'Foreignteer Blog',
      description: 'Read inspiring volunteering stories and travel tips.',
    };
  }
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
