// Quick script to delete a user account
// Run: node scripts/deleteUserSimple.mjs

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize with environment variables
const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const auth = getAuth(app);
const db = getFirestore(app);

const EMAIL_TO_DELETE = 'ericdianama@gmail.com';

async function deleteUser() {
  try {
    console.log(`\n🔍 Looking for user: ${EMAIL_TO_DELETE}`);

    // Get user by email
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(EMAIL_TO_DELETE);
      console.log(`✓ Found user: ${userRecord.uid}`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log('❌ User not found in Firebase Auth');
        return;
      }
      throw error;
    }

    // Delete from Firestore
    console.log('\n🗑️  Deleting Firestore data...');

    // 1. User document
    await db.collection('users').doc(userRecord.uid).delete();
    console.log('✓ Deleted user document');

    // 2. Verification tokens
    const tokens = await db
      .collection('verificationTokens')
      .where('userId', '==', userRecord.uid)
      .get();

    for (const doc of tokens.docs) {
      await doc.ref.delete();
    }
    console.log(`✓ Deleted ${tokens.size} verification token(s)`);

    // 3. Newsletter subscription
    const newsletters = await db
      .collection('newsletterSubscribers')
      .where('email', '==', EMAIL_TO_DELETE.toLowerCase())
      .get();

    for (const doc of newsletters.docs) {
      await doc.ref.delete();
    }
    console.log(`✓ Deleted ${newsletters.size} newsletter subscription(s)`);

    // 4. Delete from Firebase Auth
    console.log('\n🗑️  Deleting from Firebase Auth...');
    await auth.deleteUser(userRecord.uid);
    console.log('✓ Deleted from Firebase Auth');

    console.log(`\n✅ Successfully deleted user: ${EMAIL_TO_DELETE}\n`);
  } catch (error) {
    console.error('\n❌ Error deleting user:', error);
    process.exit(1);
  }
}

deleteUser()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
