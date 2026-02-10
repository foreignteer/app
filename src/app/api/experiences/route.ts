import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { Experience } from '@/lib/types/experience';
import { expandAllRecurringExperiences } from '@/lib/utils/recurring';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const city = searchParams.get('city');
    const country = searchParams.get('country');
    const causeCategory = searchParams.get('causeCategory');
    const instantConfirmation = searchParams.get('instantConfirmation');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const sort = searchParams.get('sort') || 'soonest';

    // Start with base query for published experiences
    // Note: We fetch all and filter in memory to avoid Firestore composite index requirements
    // For production with large datasets, consider using Algolia or Elasticsearch
    let query = adminDb
      .collection('experiences')
      .where('status', '==', 'published');

    const querySnapshot = await query.get();
    let experiences: Experience[] = [];

    querySnapshot.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
      const data = doc.data();
      experiences.push({
        id: doc.id,
        ...data,
        dates: {
          start: data.dates.start.toDate(),
          end: data.dates.end.toDate(),
        },
        images: data.images || [],
        recurrenceEndDate: data.recurrenceEndDate ? data.recurrenceEndDate.toDate() : undefined,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Experience);
    });

    // Apply filters in memory (to avoid complex Firestore indexes)
    if (causeCategory) {
      experiences = experiences.filter((exp) => exp.causeCategories?.includes(causeCategory));
    }

    if (city) {
      experiences = experiences.filter((exp) => exp.city === city);
    }

    if (country) {
      experiences = experiences.filter((exp) => exp.country === country);
    }

    if (instantConfirmation !== null) {
      const wantInstant = instantConfirmation === 'true';
      experiences = experiences.filter(
        (exp) => exp.instantConfirmation === wantInstant
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      experiences = experiences.filter(
        (exp) =>
          exp.title.toLowerCase().includes(searchLower) ||
          exp.summary.toLowerCase().includes(searchLower) ||
          exp.description.toLowerCase().includes(searchLower)
      );
    }

    if (startDate) {
      const startDateTime = new Date(startDate).getTime();
      experiences = experiences.filter(
        (exp) => new Date(exp.dates.start).getTime() >= startDateTime
      );
    }

    if (endDate) {
      const endDateTime = new Date(endDate).getTime();
      experiences = experiences.filter(
        (exp) => new Date(exp.dates.end).getTime() <= endDateTime
      );
    }

    // Expand recurring experiences into individual occurrences
    experiences = expandAllRecurringExperiences(experiences);

    // Sort based on sort parameter
    if (sort === 'recent') {
      // Sort by creation date (most recent first)
      experiences.sort((a, b) => {
        const aCreated = new Date(a.createdAt).getTime();
        const bCreated = new Date(b.createdAt).getTime();
        return bCreated - aCreated;
      });
    } else {
      // Default: Sort by event start date (soonest first)
      experiences.sort((a, b) => {
        const aStart = new Date(a.dates.start).getTime();
        const bStart = new Date(b.dates.start).getTime();
        return aStart - bStart;
      });
    }

    // Apply limit if provided
    if (limit && limit > 0) {
      experiences = experiences.slice(0, limit);
    }

    return NextResponse.json({ experiences }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}
