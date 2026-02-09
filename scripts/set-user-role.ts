/**
 * Set user role for existing users
 * Run with: npx tsx scripts/set-user-role.ts <email> <role>
 * Example: npx tsx scripts/set-user-role.ts user@example.com user
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

async function setUserRole(email: string, role: 'user' | 'ngo' | 'admin') {
  try {
    console.log(`\n🔧 Setting role for ${email} to "${role}"...\n`);

    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    const uid = userRecord.uid;

    console.log(`✓ Found user: ${userRecord.email}`);
    console.log(`  UID: ${uid}\n`);

    // Set custom claims
    await admin.auth().setCustomUserClaims(uid, { role });
    console.log(`✓ Set custom claims: role = ${role}`);

    // Update Firestore document
    await db.collection('users').doc(uid).set(
      {
        uid,
        email: userRecord.email,
        displayName: userRecord.displayName || '',
        role,
        updatedAt: new Date(),
        createdAt: new Date(userRecord.metadata.creationTime),
      },
      { merge: true }
    );
    console.log(`✓ Updated Firestore document\n`);

    console.log('✨ Success! Role has been updated.\n');
    console.log('⚠️  IMPORTANT: The user MUST do the following for changes to take effect:');
    console.log('   1. Click "Sign Out" in the application');
    console.log('   2. Log back in with their credentials');
    console.log('   3. Then they can access their dashboard\n');
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

if (args.length < 2) {
  console.error('\n❌ Usage: npx tsx scripts/set-user-role.ts <email> <role>');
  console.error('   Roles: user, ngo, admin\n');
  console.error('Example:');
  console.error('   npx tsx scripts/set-user-role.ts user@example.com user\n');
  process.exit(1);
}

const [email, role] = args;

if (!['user', 'ngo', 'admin'].includes(role)) {
  console.error('\n❌ Invalid role. Must be one of: user, ngo, admin\n');
  process.exit(1);
}

// Run the script
setUserRole(email, role as 'user' | 'ngo' | 'admin')
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
