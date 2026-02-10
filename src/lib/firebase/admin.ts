import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App;
let adminAuth: Auth;
let adminDb: Firestore;

// Initialize Firebase Admin (server-side only)
if (getApps().length === 0) {
  // Handle private key - remove quotes and fix newlines
  let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';

  // Remove surrounding quotes if present (common mistake when pasting)
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }

  // Replace literal \n with actual newlines
  // Also handle double-escaped \\n (in case Vercel escapes it)
  privateKey = privateKey.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n');

  adminApp = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
} else {
  adminApp = getApps()[0];
}

adminAuth = getAuth(adminApp);
adminDb = getFirestore(adminApp);

export { adminApp, adminAuth, adminDb };
export default adminApp;
