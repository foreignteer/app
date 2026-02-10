import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { BlogPost, BlogPostFormData } from '@/lib/types/blog';

/**
 * GET /api/blog
 * Fetch all blog posts with optional filtering
 * Public endpoint - no auth required for published posts
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const publishedOnly = searchParams.get('publishedOnly') !== 'false'; // Default to true
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build query - avoid compound index requirement by fetching all then filtering
    let query: any = adminDb.collection('blogPosts');

    // Fetch all posts
    const snapshot = await query.get();
    let posts: BlogPost[] = snapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        publishedAt: data.publishedAt?.toDate(),
      } as BlogPost;
    });

    // Filter by published status
    if (publishedOnly) {
      posts = posts.filter((post) => post.published === true);
    }

    // Apply client-side filters
    if (category) {
      posts = posts.filter((post) => post.category === category);
    }

    if (tag) {
      posts = posts.filter((post) => post.tags?.includes(tag));
    }

    if (search) {
      const searchLower = search.toLowerCase();
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower)
      );
    }

    // Sort by publishedAt (most recent first)
    posts.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });

    // Apply limit
    posts = posts.slice(0, limit);

    return NextResponse.json({ posts });
  } catch (error: any) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/blog
 * Create a new blog post (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Get and verify authorization token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();

    if (userData?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Parse request body
    const body: BlogPostFormData = await request.json();
    const { title, slug, content, excerpt, featuredImage, category, tags, published } = body;

    // Validate required fields
    if (!title || !slug || !content || !excerpt) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, content, excerpt' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingSlug = await adminDb
      .collection('blogPosts')
      .where('slug', '==', slug)
      .get();

    if (!existingSlug.empty) {
      return NextResponse.json(
        { error: 'A blog post with this slug already exists' },
        { status: 400 }
      );
    }

    const now = new Date();

    // Calculate estimated read time (roughly 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    const blogPost: Omit<BlogPost, 'id'> = {
      title,
      slug,
      content,
      excerpt,
      featuredImage: featuredImage || undefined,
      category: category || undefined,
      tags: tags || [],
      author: {
        id: decodedToken.uid,
        name: userData?.displayName || 'Admin',
        role: 'Admin',
      },
      published,
      publishedAt: published ? now : undefined,
      createdAt: now,
      updatedAt: now,
      views: 0,
      readTime,
    };

    // Create the blog post
    const docRef = await adminDb.collection('blogPosts').add(blogPost);

    return NextResponse.json({
      success: true,
      blogPost: { id: docRef.id, ...blogPost },
    });
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post', details: error.message },
      { status: 500 }
    );
  }
}
