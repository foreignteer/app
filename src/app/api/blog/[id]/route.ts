import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { BlogPost, BlogPostFormData } from '@/lib/types/blog';

/**
 * GET /api/blog/[id]
 * Fetch a single blog post by ID or slug
 * Public endpoint for published posts
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try to fetch by document ID first
    let blogDoc = await adminDb.collection('blogPosts').doc(id).get();

    // If not found, try by slug
    if (!blogDoc.exists) {
      const slugQuery = await adminDb
        .collection('blogPosts')
        .where('slug', '==', id)
        .limit(1)
        .get();

      if (!slugQuery.empty) {
        blogDoc = slugQuery.docs[0];
      }
    }

    if (!blogDoc.exists) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const data = blogDoc.data();
    const blogPost: BlogPost = {
      id: blogDoc.id,
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
      publishedAt: data?.publishedAt?.toDate(),
    } as BlogPost;

    // Increment view counter
    await adminDb
      .collection('blogPosts')
      .doc(blogDoc.id)
      .update({
        views: (data?.views || 0) + 1,
      });

    return NextResponse.json({ blogPost });
  } catch (error: any) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/blog/[id]
 * Update a blog post (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Check if blog post exists
    const blogDoc = await adminDb.collection('blogPosts').doc(id).get();
    if (!blogDoc.exists) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Parse request body
    const body: Partial<BlogPostFormData> = await request.json();
    const existingData = blogDoc.data();

    // If slug is being changed, check it doesn't conflict
    if (body.slug && body.slug !== existingData?.slug) {
      const existingSlug = await adminDb
        .collection('blogPosts')
        .where('slug', '==', body.slug)
        .get();

      if (!existingSlug.empty) {
        return NextResponse.json(
          { error: 'A blog post with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const now = new Date();
    const updates: any = {
      ...body,
      updatedAt: now,
    };

    // If publishing for the first time, set publishedAt
    if (body.published && !existingData?.published) {
      updates.publishedAt = now;
    }

    // If unpublishing, remove publishedAt
    if (body.published === false) {
      updates.publishedAt = null;
    }

    // Recalculate read time if content changed
    if (body.content) {
      const wordCount = body.content.split(/\s+/).length;
      updates.readTime = Math.ceil(wordCount / 200);
    }

    // Update the blog post
    await adminDb.collection('blogPosts').doc(id).update(updates);

    // Fetch updated post
    const updatedDoc = await adminDb.collection('blogPosts').doc(id).get();
    const updatedData = updatedDoc.data();

    const blogPost: BlogPost = {
      id: updatedDoc.id,
      ...updatedData,
      createdAt: updatedData?.createdAt?.toDate(),
      updatedAt: updatedData?.updatedAt?.toDate(),
      publishedAt: updatedData?.publishedAt?.toDate(),
    } as BlogPost;

    return NextResponse.json({ success: true, blogPost });
  } catch (error: any) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/blog/[id]
 * Delete a blog post (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Check if blog post exists
    const blogDoc = await adminDb.collection('blogPosts').doc(id).get();
    if (!blogDoc.exists) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Delete the blog post
    await adminDb.collection('blogPosts').doc(id).delete();

    return NextResponse.json({ success: true, message: 'Blog post deleted' });
  } catch (error: any) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post', details: error.message },
      { status: 500 }
    );
  }
}
