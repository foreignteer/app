import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function GET() {
  try {
    // Debug: Check what we're receiving from environment
    const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY || '';
    const debugInfo = {
      hasKey: !!privateKeyRaw,
      keyLength: privateKeyRaw.length,
      startsWithBegin: privateKeyRaw.startsWith('-----BEGIN'),
      endsWithEnd: privateKeyRaw.includes('-----END'),
      hasLiteralBackslashN: privateKeyRaw.includes('\\n'),
      hasActualNewlines: privateKeyRaw.includes('\n'),
      firstChars: privateKeyRaw.substring(0, 50),
      lastChars: privateKeyRaw.substring(privateKeyRaw.length - 50),
    };

    // Try a simple count query
    const snapshot = await adminDb.collection('experiences').limit(1).get();

    return NextResponse.json({
      success: true,
      count: snapshot.size,
      hasData: !snapshot.empty,
      message: 'Firebase Admin SDK working correctly',
      debug: debugInfo,
    });
  } catch (error: any) {
    // Return debug info even on error
    const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY || '';
    const debugInfo = {
      hasKey: !!privateKeyRaw,
      keyLength: privateKeyRaw.length,
      startsWithBegin: privateKeyRaw.startsWith('-----BEGIN'),
      endsWithEnd: privateKeyRaw.includes('-----END'),
      hasLiteralBackslashN: privateKeyRaw.includes('\\n'),
      hasActualNewlines: privateKeyRaw.includes('\n'),
      firstChars: privateKeyRaw.substring(0, 50),
      lastChars: privateKeyRaw.substring(privateKeyRaw.length - 50),
    };

    console.error('Firebase test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      debug: debugInfo,
    }, { status: 500 });
  }
}
