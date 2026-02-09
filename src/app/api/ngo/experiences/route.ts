import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { v4 as uuidv4 } from 'uuid';

// Helper function to generate recurring dates
function generateRecurringDates(
  startDate: Date,
  endDate: Date,
  pattern: 'weekly' | 'biweekly' | 'monthly',
  recurrenceEndDate: Date
): Date[] {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);
  const duration = endDate.getTime() - startDate.getTime();

  // Normalize recurrenceEndDate to end of day to ensure inclusive comparison
  const endDateNormalized = new Date(recurrenceEndDate);
  endDateNormalized.setHours(23, 59, 59, 999);

  // Compare using date-only (ignore time) by comparing date strings
  while (currentDate <= endDateNormalized) {
    dates.push(new Date(currentDate));

    // Calculate next occurrence based on pattern
    if (pattern === 'weekly') {
      currentDate.setDate(currentDate.getDate() + 7);
    } else if (pattern === 'biweekly') {
      currentDate.setDate(currentDate.getDate() + 14);
    } else if (pattern === 'monthly') {
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  }

  return dates;
}

export async function POST(request: NextRequest) {
  try {
    // Get the authorization token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];

    // Verify the token
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

    const userId = decodedToken.uid;
    const userRole = decodedToken.role || 'user';

    // Check if user is an NGO
    if (userRole !== 'ngo') {
      return NextResponse.json(
        { error: 'Forbidden - Only NGOs can create experiences' },
        { status: 403 }
      );
    }

    // Get the user's NGO ID
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const ngoId = userDoc.data()?.ngoId;

    if (!ngoId) {
      return NextResponse.json(
        { error: 'NGO ID not found for user' },
        { status: 400 }
      );
    }

    // Parse the request body
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'title',
      'summary',
      'description',
      'city',
      'country',
      'location',
      'dates',
      'capacity',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate categories
    if (!body.causeCategories || !Array.isArray(body.causeCategories) || body.causeCategories.length === 0) {
      return NextResponse.json(
        { error: 'At least one category must be selected' },
        { status: 400 }
      );
    }

    // Validate "Other" category
    if (body.causeCategories.includes('Other') && !body.otherCategory) {
      return NextResponse.json(
        { error: 'Please specify the other category' },
        { status: 400 }
      );
    }

    // Validate recurring fields if recurring is true
    if (body.recurring) {
      if (!body.recurrencePattern || !body.recurrenceEndDate) {
        return NextResponse.json(
          { error: 'Recurrence pattern and end date are required for recurring experiences' },
          { status: 400 }
        );
      }
    }

    const now = new Date();
    const platformServiceFee = 15.0; // Fixed £15 platform fee
    const programmeFee = body.programmeFee ? Number(body.programmeFee) : 0;
    const totalFee = platformServiceFee + programmeFee;

    // Generate recurring group ID if this is a recurring experience
    const recurringGroupId = body.recurring ? uuidv4() : undefined;

    // Calculate dates for recurring experiences
    const startDate = new Date(body.dates.start);
    const endDate = new Date(body.dates.end);

    console.log('Creating experience with dates:', {
      start: body.dates.start,
      end: body.dates.end,
      recurring: body.recurring,
      recurrencePattern: body.recurrencePattern,
      recurrenceEndDate: body.recurrenceEndDate,
    });

    const experienceDates = body.recurring
      ? generateRecurringDates(
          startDate,
          endDate,
          body.recurrencePattern,
          new Date(body.recurrenceEndDate)
        )
      : [startDate];

    console.log(`Generated ${experienceDates.length} experience dates:`, experienceDates.map(d => d.toISOString().split('T')[0]));

    const createdExperiences = [];

    // Create experience instance(s)
    for (const instanceStartDate of experienceDates) {
      // Calculate end date for this instance (maintain same duration)
      const duration = endDate.getTime() - startDate.getTime();
      const instanceEndDate = new Date(instanceStartDate.getTime() + duration);

      const experienceData = {
        title: body.title,
        summary: body.summary,
        description: body.description,
        city: body.city,
        country: body.country,
        location: body.location,
        dates: {
          start: instanceStartDate,
          end: instanceEndDate,
        },
        time: body.time,
        causeCategories: body.causeCategories,
        otherCategory: body.otherCategory || null,
        capacity: Number(body.capacity),
        currentBookings: 0,
        platformServiceFee,
        programmeFee,
        totalFee,
        recurring: body.recurring || false,
        recurrencePattern: body.recurrencePattern || null,
        recurrenceEndDate: body.recurrenceEndDate ? new Date(body.recurrenceEndDate) : null,
        recurringGroupId: recurringGroupId || null,
        instantConfirmation: body.instantConfirmation || false,
        ngoId,
        status: body.status || 'draft',
        requirements: body.requirements || [],
        accessibility: body.accessibility || null,
        images: body.images || [],
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await adminDb.collection('experiences').add(experienceData);
      createdExperiences.push({
        id: docRef.id,
        startDate: instanceStartDate,
        endDate: instanceEndDate,
      });
    }

    return NextResponse.json(
      {
        success: true,
        count: createdExperiences.length,
        experiences: createdExperiences,
        recurringGroupId,
        message: body.recurring
          ? `Created ${createdExperiences.length} recurring experience instances`
          : 'Experience created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    );
  }
}
