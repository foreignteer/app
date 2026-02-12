// Script to delete a user account completely
// Usage: node scripts/deleteUser.js ericdianama@gmail.com

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const auth = admin.auth();

async function deleteUser(email) {
  try {
    console.log(`Looking for user with email: ${email}`);

    // Get user by email
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
      console.log(`Found user: ${userRecord.uid}`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log('User not found in Firebase Auth');
      } else {
        throw error;
      }
    }

    // Delete from Firestore
    if (userRecord) {
      // Delete user document
      await db.collection('users').doc(userRecord.uid).delete();
      console.log('✓ Deleted user document from Firestore');

      // Delete verification tokens
      const tokens = await db
        .collection('verificationTokens')
        .where('userId', '==', userRecord.uid)
        .get();

      const batch = db.batch();
      tokens.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      console.log(`✓ Deleted ${tokens.size} verification tokens`);

      // Delete newsletter subscription
      const newsletters = await db
        .collection('newsletterSubscribers')
        .where('email', '==', email.toLowerCase())
        .get();

      newsletters.docs.forEach((doc) => {
        db.collection('newsletterSubscribers').doc(doc.id).delete();
      });
      console.log(`✓ Deleted newsletter subscription`);

      // Delete from Firebase Auth
      await auth.deleteUser(userRecord.uid);
      console.log('✓ Deleted user from Firebase Auth');

      console.log(`\n✅ Successfully deleted user: ${email}`);
    } else {
      console.log('No user record found to delete');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.error('Usage: node scripts/deleteUser.js <email>');
  process.exit(1);
}

deleteUser(email)
  .then(() => {
    console.log('\nUser deletion complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
