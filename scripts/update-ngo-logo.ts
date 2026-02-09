/**
 * Update NGO logo URL
 * Run with: npx tsx scripts/update-ngo-logo.ts
 */

import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

async function updateNGOLogo() {
  try {
    console.log('🔄 Updating NGO logo URL...\n');

    // Find the NGO
    const querySnapshot = await db
      .collection('ngos')
      .where('name', '==', 'Global Impact Foundation')
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      console.log('❌ NGO not found');
      return;
    }

    const ngoDoc = querySnapshot.docs[0];
    const ngoId = ngoDoc.id;

    // Update the logo URL
    await db.collection('ngos').doc(ngoId).update({
      logoUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=200',
      updatedAt: new Date(),
    });

    console.log('✅ Successfully updated NGO logo URL');
    console.log(`   NGO ID: ${ngoId}`);
    console.log('   New logo URL: https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=200\n');
  } catch (error) {
    console.error('❌ Error updating NGO:', error);
    process.exit(1);
  }
}

// Run the update
updateNGOLogo()
  .then(() => {
    console.log('✨ Update complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
