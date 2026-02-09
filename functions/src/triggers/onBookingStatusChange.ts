import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { sendEmail } from '../email/emailService';
import * as templates from '../email/templates';

/**
 * Triggered when a booking document is updated
 * Sends appropriate emails when booking status changes (approval/rejection)
 */
export const onBookingStatusChange = functions
  .runWith({
    serviceAccount: 'firebase-adminsdk-xnbbt@foreignteer-ea9b6.iam.gserviceaccount.com',
  })
  .firestore
  .document('bookings/{bookingId}')
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();

    // Only trigger if status actually changed
    if (beforeData.status === afterData.status) {
      console.log('Booking updated but status unchanged, skipping email');
      return;
    }

    const db = admin.firestore();

    try {
      // Fetch related data in parallel
      const [userDoc, experienceDoc, ngoDoc] = await Promise.all([
        db.collection('users').doc(afterData.userId).get(),
        db.collection('experiences').doc(afterData.experienceId).get(),
        db.collection('ngos').doc(afterData.ngoId).get(),
      ]);

      // Check if all documents exist
      if (!userDoc.exists || !experienceDoc.exists || !ngoDoc.exists) {
        console.error('Missing related data for status change notification:', {
          bookingId: change.after.id,
          hasUser: userDoc.exists,
          hasExperience: experienceDoc.exists,
          hasNGO: ngoDoc.exists,
        });
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

      // Handle status change notifications
      if (afterData.status === 'pending' && beforeData.status === 'pending_admin') {
        // Admin approved - passing to NGO
        console.log('Sending admin approval emails to volunteer and NGO');

        await Promise.all([
          // Email to volunteer: admin approved, now awaiting NGO review
          sendEmail({
            to: user.email,
            subject: `Application Approved by Admin - ${experience.title}`,
            html: templates.bookingAdminApprovedToUser(
              user.displayName,
              experience.title,
              ngo.name,
              experienceDate
            ),
          }),

          // Email to NGO: new application to review (passed admin vetting)
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

        console.log('✅ Admin approval emails sent successfully');
      } else if (afterData.status === 'rejected' && beforeData.status === 'pending_admin') {
        // Admin rejected the application
        console.log('Sending admin rejection email to:', user.email);

        await sendEmail({
          to: user.email,
          subject: `Application Update - ${experience.title}`,
          html: templates.bookingRejectedToUser(
            user.displayName,
            experience.title,
            'Foreignteer Admin Team',
            afterData.adminRejectionReason || afterData.rejectionReason
          ),
        });

        console.log('✅ Admin rejection email sent successfully');
      } else if (afterData.status === 'confirmed' && beforeData.status === 'pending') {
        // Booking was approved by NGO
        console.log('Sending approval email to:', user.email);

        await sendEmail({
          to: user.email,
          subject: `Application Approved - ${experience.title}`,
          html: templates.bookingApprovedToUser(
            user.displayName,
            experience.title,
            experienceDate,
            experienceLocation,
            ngo.name
          ),
        });

        console.log('✅ Approval email sent successfully');
      } else if (afterData.status === 'rejected') {
        // Booking was rejected by NGO
        console.log('Sending rejection email to:', user.email);

        await sendEmail({
          to: user.email,
          subject: `Application Update - ${experience.title}`,
          html: templates.bookingRejectedToUser(
            user.displayName,
            experience.title,
            ngo.name,
            afterData.rejectionReason
          ),
        });

        console.log('✅ Rejection email sent successfully');
      } else if (afterData.status === 'cancelled') {
        // Booking was cancelled (could be by user or NGO)
        // For now, just log it - you can add cancellation emails later if needed
        console.log('Booking cancelled:', {
          bookingId: change.after.id,
          userId: afterData.userId,
          experienceId: afterData.experienceId,
        });
      }
    } catch (error: any) {
      console.error('❌ Error in onBookingStatusChange trigger:', error);

      if (error.code === 7 || error.details?.includes('permissions')) {
        console.error('🔒 PERMISSION ERROR: Cloud Functions service account needs Firestore access.');
        console.error('📋 Fix: Go to Cloud Console IAM and grant "Cloud Datastore User" role to:');
        console.error(`   foreignteer-ea9b6@appspot.gserviceaccount.com`);
      }

      // Don't throw - we don't want to fail the status update
      // Just log the error for monitoring
    }
  });
