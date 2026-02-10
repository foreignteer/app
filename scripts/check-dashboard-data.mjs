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
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

async function checkDashboardData() {
  try {
    console.log('📊 Checking Dashboard Data...\n');

    // Get all NGOs
    const ngosSnapshot = await db.collection('ngos').get();
    console.log(`Found ${ngosSnapshot.size} NGO(s)\n`);

    for (const ngoDoc of ngosSnapshot.docs) {
      const ngoId = ngoDoc.id;
      const ngoData = ngoDoc.data();
      console.log(`NGO: ${ngoData.name} (${ngoId})`);
      console.log('─'.repeat(50));

      // Get experiences for this NGO
      const experiencesSnapshot = await db
        .collection('experiences')
        .where('ngoId', '==', ngoId)
        .get();

      let publishedCount = 0;
      let draftCount = 0;
      let pendingCount = 0;
      const experienceIds = [];

      experiencesSnapshot.forEach((doc) => {
        const data = doc.data();
        experienceIds.push(doc.id);
        if (data.status === 'published') publishedCount++;
        else if (data.status === 'draft') draftCount++;
        else if (data.status === 'pending_approval') pendingCount++;
      });

      console.log(`  Experiences:`);
      console.log(`    Total: ${experiencesSnapshot.size}`);
      console.log(`    Published: ${publishedCount}`);
      console.log(`    Draft: ${draftCount}`);
      console.log(`    Pending Approval: ${pendingCount}`);

      // Get bookings for these experiences
      let totalBookings = 0;
      let pendingBookings = 0;
      let confirmedBookings = 0;
      let cancelledBookings = 0;

      if (experienceIds.length > 0) {
        const batchSize = 10;
        for (let i = 0; i < experienceIds.length; i += batchSize) {
          const batch = experienceIds.slice(i, i + batchSize);
          const bookingsSnapshot = await db
            .collection('bookings')
            .where('experienceId', 'in', batch)
            .get();

          bookingsSnapshot.forEach((doc) => {
            const data = doc.data();
            totalBookings++;
            if (data.status === 'pending') pendingBookings++;
            else if (data.status === 'confirmed') confirmedBookings++;
            else if (data.status === 'cancelled') cancelledBookings++;
          });
        }
      }

      console.log(`  Bookings:`);
      console.log(`    Total: ${totalBookings}`);
      console.log(`    Pending: ${pendingBookings}`);
      console.log(`    Confirmed: ${confirmedBookings}`);
      console.log(`    Cancelled: ${cancelledBookings}`);

      // Check for currentBookings mismatch
      console.log(`\n  Checking currentBookings accuracy...`);
      for (const expDoc of experiencesSnapshot.docs) {
        const expData = expDoc.data();
        const expId = expDoc.id;

        // Count actual active bookings
        const bookingsSnapshot = await db
          .collection('bookings')
          .where('experienceId', '==', expId)
          .where('status', 'in', ['pending', 'confirmed'])
          .get();

        const actualBookings = bookingsSnapshot.size;
        const storedBookings = expData.currentBookings || 0;

        if (actualBookings !== storedBookings) {
          console.log(`    ⚠️  Mismatch in "${expData.title}":`);
          console.log(`       Stored: ${storedBookings}, Actual: ${actualBookings}`);
        }
      }

      console.log('\n');
    }

    console.log('✅ Dashboard data check complete!\n');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

checkDashboardData();
