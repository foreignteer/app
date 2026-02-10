import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function GET() {
  try {
    // Try a simple count query
    const snapshot = await adminDb.collection('experiences').limit(1).get();
    
    return NextResponse.json({ 
      success: true,
      count: snapshot.size,
      hasData: !snapshot.empty,
      message: 'Firebase Admin SDK working correctly'
    });
  } catch (error: any) {
    console.error('Firebase test error:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message,
      code: error.code,
      stack: error.stack
    }, { status: 500 });
  }
}
