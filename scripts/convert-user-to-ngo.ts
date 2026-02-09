/**
 * Convert an existing user account to an NGO account
 * Run with: npx tsx scripts/convert-user-to-ngo.ts <email> "<NGO Name>" "<Description>" "<Jurisdiction>" "<Service Locations (comma-separated)>" "<Causes (comma-separated)>"
 * Example: npx tsx scripts/convert-user-to-ngo.ts user@example.com "Global Impact Foundation" "We help communities worldwide" "United Kingdom" "London,Manchester" "Education,Environment"
 */

import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
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

// Helper function to generate URL-friendly slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function convertUserToNGO(
  email: string,
  ngoName: string,
  description: string,
  jurisdiction: string,
  serviceLocations: string,
  causes: string,
  website?: string,
  contactEmail?: string
) {
  try {
    console.log(`\n🔧 Converting user ${email} to NGO account...\n`);

    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    const uid = userRecord.uid;

    console.log(`✓ Found user: ${userRecord.email}`);
    console.log(`  UID: ${uid}\n`);

    // Parse service locations and causes
    const serviceLocationsList = serviceLocations.split(',').map((loc) => loc.trim());
    const causesList = causes.split(',').map((cause) => cause.trim());

    // Generate unique slug
    const baseSlug = generateSlug(ngoName);
    let publicSlug = baseSlug;
    let slugExists = true;
    let counter = 1;

    while (slugExists) {
      const slugQuery = await db.collection('ngos').where('publicSlug', '==', publicSlug).get();
      if (slugQuery.empty) {
        slugExists = false;
      } else {
        publicSlug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    console.log(`✓ Generated public slug: ${publicSlug}\n`);

    // Create NGO document
    const now = new Date();
    const ngoData = {
      name: ngoName,
      description,
      jurisdiction,
      serviceLocations: serviceLocationsList,
      causes: causesList,
      website: website || null,
      contactEmail: contactEmail || email,
      publicSlug,
      approved: true, // Auto-approve for manual conversion
      createdBy: uid,
      createdAt: now,
      updatedAt: now,
    };

    const ngoRef = await db.collection('ngos').add(ngoData);
    const ngoId = ngoRef.id;

    console.log(`✓ Created NGO document: ${ngoId}\n`);

    // Set custom claims for role
    await admin.auth().setCustomUserClaims(uid, { role: 'ngo' });
    console.log(`✓ Set custom claims: role = ngo`);

    // Update user document in Firestore
    await db.collection('users').doc(uid).set(
      {
        role: 'ngo',
        ngoId,
        updatedAt: now,
      },
      { merge: true }
    );
    console.log(`✓ Updated user document with ngoId\n`);

    console.log('✨ Success! User has been converted to NGO account.\n');
    console.log('📋 NGO Details:');
    console.log(`   - Name: ${ngoName}`);
    console.log(`   - Slug: ${publicSlug}`);
    console.log(`   - NGO ID: ${ngoId}`);
    console.log(`   - Service Locations: ${serviceLocationsList.join(', ')}`);
    console.log(`   - Causes: ${causesList.join(', ')}`);
    console.log(`   - Approved: Yes\n`);
    console.log('⚠️  IMPORTANT: The user MUST log out and log back in for changes to take effect.\n');
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      console.error(`\n❌ Error: No user found with email ${email}\n`);
    } else {
      console.error('\n❌ Error:', error.message, '\n');
    }
    process.exit(1);
  }
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 6) {
  console.error('\n❌ Usage: npx tsx scripts/convert-user-to-ngo.ts <email> "<NGO Name>" "<Description>" "<Jurisdiction>" "<Service Locations>" "<Causes>" [website] [contactEmail]\n');
  console.error('Required arguments:');
  console.error('   1. email           - User email address');
  console.error('   2. NGO Name        - Organisation name (in quotes if contains spaces)');
  console.error('   3. Description     - Organisation description (in quotes)');
  console.error('   4. Jurisdiction    - Country of registration (in quotes if contains spaces)');
  console.error('   5. Service Locations - Comma-separated cities (in quotes)');
  console.error('   6. Causes          - Comma-separated cause categories (in quotes)\n');
  console.error('Optional arguments:');
  console.error('   7. website         - Organisation website URL');
  console.error('   8. contactEmail    - Public contact email (defaults to user email)\n');
  console.error('Example:');
  console.error('   npx tsx scripts/convert-user-to-ngo.ts user@example.com "Global Impact Foundation" "We help communities worldwide" "United Kingdom" "London,Manchester" "Education,Environment"\n');
  process.exit(1);
}

const [email, ngoName, description, jurisdiction, serviceLocations, causes, website, contactEmail] = args;

// Run the script
convertUserToNGO(email, ngoName, description, jurisdiction, serviceLocations, causes, website, contactEmail)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
