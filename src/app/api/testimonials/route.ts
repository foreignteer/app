import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { Testimonial, TestimonialFormData } from '@/lib/types/testimonial';

/**
 * GET /api/testimonials
 * Fetch all testimonials with optional filtering
 * Public endpoint - no auth required for published testimonials
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get('publishedOnly') !== 'false'; // Default to true
    const search = searchParams.get('search');

    let query = adminDb.collection('testimonials').orderBy('displayOrder', 'asc');

    // Fetch all testimonials
    const snapshot = await query.get();
    let testimonials: Testimonial[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Testimonial;
    });

    // Filter by published status
    if (publishedOnly) {
      testimonials = testimonials.filter((t) => t.isPublished);
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      testimonials = testimonials.filter(
        (t) =>
          t.name.toLowerCase().includes(searchLower) ||
          t.content.toLowerCase().includes(searchLower) ||
          t.organization?.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({ testimonials });
  } catch (error: any) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/testimonials
 * Create a new testimonial (admin only)
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
    const body: TestimonialFormData = await request.json();
    const { name, role, organization, content, image, location, experienceTitle, rating, isPublished } = body;

    // Validate required fields
    if (!name || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: name, content' },
        { status: 400 }
      );
    }

    const now = new Date();

    // Get the highest displayOrder and add 1
    const lastTestimonial = await adminDb
      .collection('testimonials')
      .orderBy('displayOrder', 'desc')
      .limit(1)
      .get();

    const nextOrder = lastTestimonial.empty
      ? 0
      : (lastTestimonial.docs[0].data().displayOrder || 0) + 1;

    const testimonial: Omit<Testimonial, 'id'> = {
      name,
      role: role || undefined,
      organization: organization || undefined,
      content,
      image: image || undefined,
      location: location || undefined,
      experienceTitle: experienceTitle || undefined,
      rating: rating || undefined,
      isPublished,
      displayOrder: nextOrder,
      createdAt: now,
      updatedAt: now,
    };

    // Create the testimonial
    const docRef = await adminDb.collection('testimonials').add(testimonial);

    return NextResponse.json({
      success: true,
      testimonial: { id: docRef.id, ...testimonial },
    });
  } catch (error: any) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to create testimonial', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/testimonials/reorder
 * Reorder testimonials (admin only)
 * Body: { testimonialIds: string[] } - array of IDs in new order
 */
export async function PATCH(request: NextRequest) {
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
    const body = await request.json();
    const { testimonialIds } = body;

    if (!Array.isArray(testimonialIds)) {
      return NextResponse.json(
        { error: 'testimonialIds must be an array' },
        { status: 400 }
      );
    }

    // Update displayOrder for each testimonial
    const batch = adminDb.batch();
    testimonialIds.forEach((id: string, index: number) => {
      const ref = adminDb.collection('testimonials').doc(id);
      batch.update(ref, { displayOrder: index, updatedAt: new Date() });
    });

    await batch.commit();

    return NextResponse.json({ success: true, message: 'Testimonials reordered' });
  } catch (error: any) {
    console.error('Error reordering testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to reorder testimonials', details: error.message },
      { status: 500 }
    );
  }
}
