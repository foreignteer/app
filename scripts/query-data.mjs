import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') });

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

async function queryData() {
  try {
    console.log('📊 Querying Foreignteer Data...\n');

    // Example: Get all users
    const usersSnapshot = await db.collection('users').get();
    console.log(`👥 Total Users: ${usersSnapshot.size}`);

    // Example: Get all NGOs
    const ngosSnapshot = await db.collection('ngos').get();
    console.log(`🏢 Total NGOs: ${ngosSnapshot.size}`);

    // Example: Get all experiences
    const experiencesSnapshot = await db.collection('experiences').get();
    console.log(`🎯 Total Experiences: ${experiencesSnapshot.size}`);

    // Example: Get all bookings
    const bookingsSnapshot = await db.collection('bookings').get();
    console.log(`📅 Total Bookings: ${bookingsSnapshot.size}`);

    // Example: Query specific data
    console.log('\n🔍 Admin Users:');
    const adminUsers = await db.collection('users').where('role', '==', 'admin').get();
    adminUsers.forEach((doc) => {
      const data = doc.data();
      console.log(`  - ${data.email} (${data.displayName || 'No name'})`);
    });

    console.log('\n✅ Done!\n');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

queryData();
