import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

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

async function checkRecentNGOs() {
  const ngosSnapshot = await db.collection('ngos')
    .orderBy('createdAt', 'desc')
    .limit(5)
    .get();

  console.log('\nRecent NGO registrations:');
  console.log('=========================\n');

  if (ngosSnapshot.empty) {
    console.log('No NGOs found in database.');
  } else {
    for (const doc of ngosSnapshot.docs) {
      const data = doc.data();
      console.log(`NGO ID: ${doc.id}`);
      console.log(`Name: ${data.name}`);
      console.log(`Created By (UID): ${data.createdBy}`);
      console.log(`Approved: ${data.approved}`);
      console.log(`Created At: ${data.createdAt?.toDate()}`);
      console.log(`Public Slug: ${data.publicSlug}`);
      console.log(`Jurisdiction: ${data.jurisdiction}`);
      console.log(`Causes: ${data.causes?.join(', ')}`);
      console.log('---\n');
    }
  }

  // Check the specific user
  console.log('Checking dianalee852@gmail.com:');
  console.log('================================\n');
  try {
    const userRecord = await admin.auth().getUserByEmail('dianalee852@gmail.com');
    console.log(`UID: ${userRecord.uid}`);
    console.log(`Email: ${userRecord.email}`);
    console.log(`Display Name: ${userRecord.displayName}`);

    const token = await admin.auth().createCustomToken(userRecord.uid);
    const idTokenResult = await userRecord.getIdTokenResult();
    console.log(`Role (custom claim): ${idTokenResult.claims.role || 'not set'}`);

    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      console.log(`Role (Firestore): ${userData?.role}`);
      console.log(`NGO ID: ${userData?.ngoId || 'not set'}`);
    } else {
      console.log('User document does not exist in Firestore');
    }
  } catch (error: any) {
    console.log(`Error: ${error.message}`);
  }
}

checkRecentNGOs()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
