import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { NGO } from '@/lib/types/ngo';

export async function GET() {
  try {
    // Fetch all approved NGOs that are featured on partner list
    const ngosSnapshot = await adminDb
      .collection('ngos')
      .where('approved', '==', true)
      .where('featuredOnPartnerList', '==', true)
      .get();

    const ngos: NGO[] = [];

    ngosSnapshot.forEach((doc) => {
      const data = doc.data();
      ngos.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as NGO);
    });

    // Sort by name
    ngos.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ ngos }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching public NGOs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch partners' },
      { status: 500 }
    );
  }
}
