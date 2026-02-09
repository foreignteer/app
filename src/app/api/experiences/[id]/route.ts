import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { Experience } from '@/lib/types/experience';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    const docRef = adminDb.collection('experiences').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }

    const data = doc.data()!;
    let experience: Experience = {
      id: doc.id,
      ...data,
      dates: {
        start: data.dates.start.toDate(),
        end: data.dates.end.toDate(),
      },
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Experience;

    // If this is a recurring instance with a specific date, adjust the dates
    if (dateParam && experience.recurring) {
      const requestedDate = new Date(dateParam);
      const originalStart = new Date(experience.dates.start);
      const originalEnd = new Date(experience.dates.end);
      const duration = originalEnd.getTime() - originalStart.getTime();

      // Set the start to the requested date (keeping the time)
      requestedDate.setHours(originalStart.getHours(), originalStart.getMinutes(), 0, 0);
      const adjustedEnd = new Date(requestedDate.getTime() + duration);

      experience.dates = {
        start: requestedDate,
        end: adjustedEnd,
      };
    }

    return NextResponse.json({ experience }, { status: 200 });
  } catch (error) {
    console.error('Error fetching experience:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experience' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // TODO: Add authentication check for admin/NGO

    const docRef = adminDb.collection('experiences').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }

    await docRef.update({
      ...body,
      updatedAt: new Date(),
    });

    const updatedDoc = await docRef.get();
    const data = updatedDoc.data()!;

    const experience: Experience = {
      id: updatedDoc.id,
      ...data,
      dates: {
        start: data.dates.start.toDate(),
        end: data.dates.end.toDate(),
      },
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Experience;

    return NextResponse.json({ experience }, { status: 200 });
  } catch (error) {
    console.error('Error updating experience:', error);
    return NextResponse.json(
      { error: 'Failed to update experience' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // TODO: Add authentication check for admin/NGO

    const docRef = adminDb.collection('experiences').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }

    await docRef.delete();

    return NextResponse.json(
      { success: true, message: 'Experience deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting experience:', error);
    return NextResponse.json(
      { error: 'Failed to delete experience' },
      { status: 500 }
    );
  }
}
