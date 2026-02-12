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
    const duration = searchParams.get('duration');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const sortBy = searchParams.get('sortBy') || 'newest';

    // Start with base query for published experiences
    // Note: We fetch all and filter in memory to avoid Firestore composite index requirements
    // For production with large datasets, consider using Algolia or Elasticsearch
    let query = adminDb
      .collection('experiences')
      .where('status', '==', 'published');

    const querySnapshot = await query.get();
    let experiences: Experience[] = [];

    querySnapshot.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
      try {
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
      } catch (docError) {
        console.error(`Error processing experience document ${doc.id}:`, docError);
        console.error('Document data:', JSON.stringify(doc.data(), null, 2));
      }
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

    // Duration filter
    if (duration && duration !== 'any') {
      experiences = experiences.filter((exp) => {
        if (!exp.time?.duration) return false;
        const hours = exp.time.duration;

        switch (duration) {
          case 'short':
            return hours <= 2;
          case 'medium':
            return hours > 2 && hours <= 4;
          case 'long':
            return hours > 4;
          default:
            return true;
        }
      });
    }

    // Expand recurring experiences into individual occurrences
    experiences = expandAllRecurringExperiences(experiences);

    // Sort based on sortBy parameter
    switch (sortBy) {
      case 'newest':
        // Sort by creation date (most recent first)
        experiences.sort((a, b) => {
          const aCreated = new Date(a.createdAt).getTime();
          const bCreated = new Date(b.createdAt).getTime();
          return bCreated - aCreated;
        });
        break;

      case 'price_low':
        // Sort by price (low to high)
        experiences.sort((a, b) => a.totalFee - b.totalFee);
        break;

      case 'price_high':
        // Sort by price (high to low)
        experiences.sort((a, b) => b.totalFee - a.totalFee);
        break;

      case 'date_asc':
        // Sort by event start date (earliest first)
        experiences.sort((a, b) => {
          const aStart = new Date(a.dates.start).getTime();
          const bStart = new Date(b.dates.start).getTime();
          return aStart - bStart;
        });
        break;

      case 'date_desc':
        // Sort by event start date (latest first)
        experiences.sort((a, b) => {
          const aStart = new Date(a.dates.start).getTime();
          const bStart = new Date(b.dates.start).getTime();
          return bStart - aStart;
        });
        break;

      default:
        // Default: Sort by creation date (newest first)
        experiences.sort((a, b) => {
          const aCreated = new Date(a.createdAt).getTime();
          const bCreated = new Date(b.createdAt).getTime();
          return bCreated - aCreated;
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
