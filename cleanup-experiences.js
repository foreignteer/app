// Run this with: node cleanup-experiences.js
require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function deleteAllExperiences() {
  console.log('Fetching all experiences...');
  const snapshot = await db.collection('experiences').get();
  
  console.log(`Found ${snapshot.size} experiences. Deleting...`);
  
  if (snapshot.size === 0) {
    console.log('No experiences to delete.');
    process.exit(0);
  }
  
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
  console.log('✅ All experiences deleted successfully!');
  process.exit(0);
}

deleteAllExperiences().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
