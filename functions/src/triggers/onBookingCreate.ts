import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { sendEmail } from '../email/emailService';
import * as templates from '../email/templates';

/**
 * Triggered when a new booking is created
 * Sends appropriate emails based on booking status (instant vs pending)
 */
export const onBookingCreate = functions
  .runWith({
    serviceAccount: 'firebase-adminsdk-xnbbt@foreignteer-ea9b6.iam.gserviceaccount.com',
  })
  .firestore
  .document('bookings/{bookingId}')
  .onCreate(async (snap, context) => {
    const booking = snap.data();
    const db = admin.firestore();

    try {
      // Fetch related data in parallel
      const [userDoc, experienceDoc, ngoDoc] = await Promise.all([
        db.collection('users').doc(booking.userId).get(),
        db.collection('experiences').doc(booking.experienceId).get(),
        db.collection('ngos').doc(booking.ngoId).get(),
      ]);

      // Check if all documents exist
      if (!userDoc.exists || !experienceDoc.exists || !ngoDoc.exists) {
        console.error('❌ Missing related data for booking notification:', {
          bookingId: snap.id,
          hasUser: userDoc.exists,
          hasExperience: experienceDoc.exists,
          hasNGO: ngoDoc.exists,
        });
        console.log('ℹ️  This may be due to Firestore permissions. Grant Cloud Datastore User role to the service account.');
        return;
      }

      const user = userDoc.data();
      const experience = experienceDoc.data();
      const ngo = ngoDoc.data();

      // Validate required fields
      if (!user || !experience || !ngo) {
        console.error('Invalid data in related documents');
        return;
      }

      if (!user.email || !user.displayName) {
        console.error('User missing required email or displayName');
        return;
      }

      // Format experience date
      const experienceDate = experience.dates?.start
        ? new Date(experience.dates.start.toDate()).toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'Date TBD';

      const experienceLocation = experience.city && experience.country
        ? `${experience.city}, ${experience.country}`
        : 'Location TBD';

      // Send emails based on booking status
      if (booking.status === 'confirmed') {
        // Instant confirmation - send confirmation email to volunteer
        console.log('Sending instant confirmation email to:', user.email);

        await sendEmail({
          to: user.email,
          subject: `Booking Confirmed - ${experience.title}`,
          html: templates.bookingConfirmedToUser(
            user.displayName,
            experience.title,
            experienceDate,
            experienceLocation,
            ngo.name
          ),
        });

        console.log('✅ Instant confirmation email sent successfully');
      } else if (booking.status === 'pending_admin') {
        // Requires admin approval first - notify volunteer and admin
        console.log('Sending pending admin approval emails to volunteer and admin');

        await Promise.all([
          // Email to volunteer: application received, under admin review
          sendEmail({
            to: user.email,
            subject: `Application Received - ${experience.title}`,
            html: templates.bookingPendingAdminToUser(
              user.displayName,
              experience.title,
              ngo.name,
              experienceDate
            ),
          }),

          // Email to admin: new application requires vetting
          // TODO: Replace with actual admin email from config
          sendEmail({
            to: process.env.ADMIN_EMAIL || 'admin@foreignteer.com',
            subject: `New Application Requires Vetting - ${experience.title}`,
            html: templates.newApplicationToAdmin(
              user.displayName,
              user.email,
              experience.title,
              ngo.name,
              experienceDate
            ),
          }),
        ]);

        console.log('✅ Pending admin approval emails sent successfully');
      } else if (booking.status === 'pending') {
        // Requires NGO approval - notify both volunteer and NGO
        console.log('Sending pending application emails to volunteer and NGO');

        await Promise.all([
          // Email to volunteer: application received
          sendEmail({
            to: user.email,
            subject: `Application Received - ${experience.title}`,
            html: templates.bookingPendingToUser(
              user.displayName,
              experience.title,
              ngo.name,
              experienceDate
            ),
          }),

          // Email to NGO: new application to review
          sendEmail({
            to: ngo.contactEmail,
            subject: `New Volunteer Application - ${experience.title}`,
            html: templates.newApplicationToNGO(
              ngo.name,
              user.displayName,
              user.email,
              experience.title,
              experienceDate
            ),
          }),
        ]);

        console.log('✅ Pending application emails sent successfully');
      }
    } catch (error: any) {
      console.error('❌ Error in onBookingCreate trigger:', error);

      if (error.code === 7 || error.details?.includes('permissions')) {
        console.error('🔒 PERMISSION ERROR: Cloud Functions service account needs Firestore access.');
        console.error('📋 Fix: Go to Cloud Console IAM and grant "Cloud Datastore User" role to:');
        console.error(`   foreignteer-ea9b6@appspot.gserviceaccount.com`);
      }

      // Don't throw - we don't want to fail the booking creation
      // Just log the error for monitoring
    }
  });
