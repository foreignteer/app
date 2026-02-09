import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { Testimonial, TestimonialFormData } from '@/lib/types/testimonial';

/**
 * GET /api/testimonials/[id]
 * Fetch a single testimonial by ID
 * Public endpoint for published testimonials
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const testimonialDoc = await adminDb.collection('testimonials').doc(id).get();

    if (!testimonialDoc.exists) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    const data = testimonialDoc.data();
    const testimonial: Testimonial = {
      id: testimonialDoc.id,
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    } as Testimonial;

    return NextResponse.json({ testimonial });
  } catch (error: any) {
    console.error('Error fetching testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonial', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/testimonials/[id]
 * Update a testimonial (admin only)
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

    // Check if testimonial exists
    const testimonialDoc = await adminDb.collection('testimonials').doc(id).get();
    if (!testimonialDoc.exists) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    // Parse request body
    const body: Partial<TestimonialFormData> = await request.json();

    const now = new Date();
    const updates: any = {
      ...body,
      updatedAt: now,
    };

    // Update the testimonial
    await adminDb.collection('testimonials').doc(id).update(updates);

    // Fetch updated testimonial
    const updatedDoc = await adminDb.collection('testimonials').doc(id).get();
    const updatedData = updatedDoc.data();

    const testimonial: Testimonial = {
      id: updatedDoc.id,
      ...updatedData,
      createdAt: updatedData?.createdAt?.toDate(),
      updatedAt: updatedData?.updatedAt?.toDate(),
    } as Testimonial;

    return NextResponse.json({ success: true, testimonial });
  } catch (error: any) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to update testimonial', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/testimonials/[id]
 * Delete a testimonial (admin only)
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

    // Check if testimonial exists
    const testimonialDoc = await adminDb.collection('testimonials').doc(id).get();
    if (!testimonialDoc.exists) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    // Delete the testimonial
    await adminDb.collection('testimonials').doc(id).delete();

    return NextResponse.json({ success: true, message: 'Testimonial deleted' });
  } catch (error: any) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to delete testimonial', details: error.message },
      { status: 500 }
    );
  }
}
