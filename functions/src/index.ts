/**
 * Firebase Cloud Functions for Foreignteer
 *
 * This file exports all cloud functions for the Foreignteer platform.
 * Functions are automatically deployed when you run: firebase deploy --only functions
 */

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config();

import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
// This uses default credentials when deployed to Firebase
admin.initializeApp();

// Export all trigger functions
export { onBookingCreate } from './triggers/onBookingCreate';
export { onBookingStatusChange } from './triggers/onBookingStatusChange';

// You can add more exports here as you create new functions
// For example:
// export { onUserCreate } from './triggers/onUserCreate';
// export { sendCustomEmail } from './callable/sendEmail';
