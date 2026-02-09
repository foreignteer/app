/**
 * Email templates for Foreignteer notifications
 * Uses inline CSS for maximum email client compatibility
 */

const baseStyles = `
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #4A4A4A;
`;

const headerStyles = `
  background-color: #21B3B1;
  color: white;
  padding: 30px 20px;
  text-align: center;
`;

const contentStyles = `
  padding: 30px 20px;
  background-color: #ffffff;
`;

const buttonStyles = `
  display: inline-block;
  padding: 12px 30px;
  background-color: #21B3B1;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 600;
  margin: 20px 0;
`;

const footerStyles = `
  padding: 20px;
  text-align: center;
  font-size: 12px;
  color: #7A7A7A;
  background-color: #FAF5EC;
`;

/**
 * Email sent to volunteer when they submit an application (pending approval)
 */
export function bookingPendingToUser(
  userName: string,
  experienceName: string,
  ngoName: string,
  experienceDate: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="${baseStyles}">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E6EAEA;">
    <!-- Header -->
    <div style="${headerStyles}">
      <h1 style="margin: 0; font-size: 28px;">Application Received!</h1>
    </div>

    <!-- Content -->
    <div style="${contentStyles}">
      <p style="font-size: 16px;">Hi <strong>${userName}</strong>,</p>

      <p>Thank you for applying for <strong>${experienceName}</strong>!</p>

      <p>Your application has been successfully submitted and is now under review by <strong>${ngoName}</strong>.</p>

      <div style="background-color: #FFF9E6; border-left: 4px solid #F2B56B; padding: 15px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Experience Details:</strong></p>
        <p style="margin: 5px 0 0 0;">📅 Date: ${experienceDate}</p>
      </div>

      <p>The NGO will review your application and notify you once it's approved. You can track the status of your application in your dashboard.</p>

      <div style="text-align: center;">
        <a href="https://foreignteer.com/dashboard/user/bookings" style="${buttonStyles}">View My Applications</a>
      </div>

      <p>Thank you for choosing to make a difference with Foreignteer!</p>

      <p style="margin-top: 30px;">Best regards,<br/><strong>The Foreignteer Team</strong></p>
    </div>

    <!-- Footer -->
    <div style="${footerStyles}">
      <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} Foreignteer. All rights reserved.</p>
      <p style="margin: 0;">
        <a href="https://foreignteer.com/privacy" style="color: #21B3B1; text-decoration: none;">Privacy Policy</a> |
        <a href="https://foreignteer.com/terms" style="color: #21B3B1; text-decoration: none;">Terms of Service</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Email sent to volunteer when booking is instantly confirmed
 */
export function bookingConfirmedToUser(
  userName: string,
  experienceName: string,
  experienceDate: string,
  experienceLocation: string,
  ngoName: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="${baseStyles}">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E6EAEA;">
    <!-- Header -->
    <div style="${headerStyles}">
      <h1 style="margin: 0; font-size: 28px;">Booking Confirmed! 🎉</h1>
    </div>

    <!-- Content -->
    <div style="${contentStyles}">
      <p style="font-size: 16px;">Hi <strong>${userName}</strong>,</p>

      <p>Great news! Your booking for <strong>${experienceName}</strong> has been confirmed.</p>

      <div style="background-color: #E8F5F4; border-left: 4px solid #21B3B1; padding: 15px; margin: 20px 0;">
        <p style="margin: 0 0 10px 0;"><strong>Booking Details:</strong></p>
        <p style="margin: 5px 0;">📅 <strong>Date:</strong> ${experienceDate}</p>
        <p style="margin: 5px 0;">📍 <strong>Location:</strong> ${experienceLocation}</p>
        <p style="margin: 5px 0;">🏢 <strong>Organisation:</strong> ${ngoName}</p>
      </div>

      <p>You're all set! Please check your dashboard for complete details and any preparation instructions from the NGO.</p>

      <div style="text-align: center;">
        <a href="https://foreignteer.com/dashboard/user/bookings" style="${buttonStyles}">View My Bookings</a>
      </div>

      <p><strong>What's next?</strong></p>
      <ul style="line-height: 2;">
        <li>Check the experience details in your dashboard</li>
        <li>Note any special instructions from the NGO</li>
        <li>Mark your calendar and prepare for an amazing experience!</li>
      </ul>

      <p>Thank you for choosing to make a difference with Foreignteer!</p>

      <p style="margin-top: 30px;">Best regards,<br/><strong>The Foreignteer Team</strong></p>
    </div>

    <!-- Footer -->
    <div style="${footerStyles}">
      <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} Foreignteer. All rights reserved.</p>
      <p style="margin: 0;">
        <a href="https://foreignteer.com/privacy" style="color: #21B3B1; text-decoration: none;">Privacy Policy</a> |
        <a href="https://foreignteer.com/terms" style="color: #21B3B1; text-decoration: none;">Terms of Service</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Email sent to volunteer when their pending application is approved
 */
export function bookingApprovedToUser(
  userName: string,
  experienceName: string,
  experienceDate: string,
  experienceLocation: string,
  ngoName: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="${baseStyles}">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E6EAEA;">
    <!-- Header -->
    <div style="background-color: #6FB7A4; color: white; padding: 30px 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px;">Application Approved! ✅</h1>
    </div>

    <!-- Content -->
    <div style="${contentStyles}">
      <p style="font-size: 16px;">Hi <strong>${userName}</strong>,</p>

      <p>Congratulations! Your application for <strong>${experienceName}</strong> has been approved by ${ngoName}.</p>

      <div style="background-color: #E8F5F4; border-left: 4px solid #6FB7A4; padding: 15px; margin: 20px 0;">
        <p style="margin: 0 0 10px 0;"><strong>Experience Details:</strong></p>
        <p style="margin: 5px 0;">📅 <strong>Date:</strong> ${experienceDate}</p>
        <p style="margin: 5px 0;">📍 <strong>Location:</strong> ${experienceLocation}</p>
        <p style="margin: 5px 0;">🏢 <strong>Organisation:</strong> ${ngoName}</p>
      </div>

      <p>We're excited for you to join this experience! Please check your dashboard for complete details and any preparation instructions.</p>

      <div style="text-align: center;">
        <a href="https://foreignteer.com/dashboard/user/bookings" style="${buttonStyles}">View Booking Details</a>
      </div>

      <p><strong>Important reminders:</strong></p>
      <ul style="line-height: 2;">
        <li>Mark the date on your calendar</li>
        <li>Review any special requirements or instructions</li>
        <li>Arrive on time and ready to contribute</li>
      </ul>

      <p>Thank you for your commitment to making a positive impact!</p>

      <p style="margin-top: 30px;">Best regards,<br/><strong>The Foreignteer Team</strong></p>
    </div>

    <!-- Footer -->
    <div style="${footerStyles}">
      <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} Foreignteer. All rights reserved.</p>
      <p style="margin: 0;">
        <a href="https://foreignteer.com/privacy" style="color: #21B3B1; text-decoration: none;">Privacy Policy</a> |
        <a href="https://foreignteer.com/terms" style="color: #21B3B1; text-decoration: none;">Terms of Service</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Email sent to volunteer when their application is rejected
 */
export function bookingRejectedToUser(
  userName: string,
  experienceName: string,
  ngoName: string,
  rejectionReason?: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="${baseStyles}">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E6EAEA;">
    <!-- Header -->
    <div style="${headerStyles}">
      <h1 style="margin: 0; font-size: 28px;">Application Update</h1>
    </div>

    <!-- Content -->
    <div style="${contentStyles}">
      <p style="font-size: 16px;">Hi <strong>${userName}</strong>,</p>

      <p>Thank you for your interest in <strong>${experienceName}</strong> with ${ngoName}.</p>

      <p>We regret to inform you that your application was not approved at this time.</p>

      ${rejectionReason ? `
      <div style="background-color: #FFF5F5; border-left: 4px solid #EF4444; padding: 15px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Reason provided:</strong></p>
        <p style="margin: 10px 0 0 0;">${rejectionReason}</p>
      </div>
      ` : ''}

      <p>Please don't let this discourage you! There are many other amazing volunteering opportunities available on Foreignteer.</p>

      <div style="text-align: center;">
        <a href="https://foreignteer.com/experiences" style="${buttonStyles}">Explore More Experiences</a>
      </div>

      <p>Your commitment to making a positive impact is appreciated, and we encourage you to continue your volunteering journey with us.</p>

      <p style="margin-top: 30px;">Best regards,<br/><strong>The Foreignteer Team</strong></p>
    </div>

    <!-- Footer -->
    <div style="${footerStyles}">
      <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} Foreignteer. All rights reserved.</p>
      <p style="margin: 0;">
        <a href="https://foreignteer.com/privacy" style="color: #21B3B1; text-decoration: none;">Privacy Policy</a> |
        <a href="https://foreignteer.com/terms" style="color: #21B3B1; text-decoration: none;">Terms of Service</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Email sent to NGO when they receive a new volunteer application
 */
export function newApplicationToNGO(
  ngoName: string,
  userName: string,
  userEmail: string,
  experienceName: string,
  experienceDate: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="${baseStyles}">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E6EAEA;">
    <!-- Header -->
    <div style="${headerStyles}">
      <h1 style="margin: 0; font-size: 28px;">New Volunteer Application 📋</h1>
    </div>

    <!-- Content -->
    <div style="${contentStyles}">
      <p style="font-size: 16px;">Hi <strong>${ngoName}</strong>,</p>

      <p>You have received a new volunteer application for <strong>${experienceName}</strong>.</p>

      <div style="background-color: #E8F5F4; border-left: 4px solid #21B3B1; padding: 15px; margin: 20px 0;">
        <p style="margin: 0 0 10px 0;"><strong>Applicant Details:</strong></p>
        <p style="margin: 5px 0;">👤 <strong>Name:</strong> ${userName}</p>
        <p style="margin: 5px 0;">✉️ <strong>Email:</strong> ${userEmail}</p>
        <p style="margin: 5px 0;">📅 <strong>Experience Date:</strong> ${experienceDate}</p>
      </div>

      <p>Please review this application in your NGO dashboard and approve or reject it at your earliest convenience.</p>

      <div style="text-align: center;">
        <a href="https://foreignteer.com/dashboard/ngo/applicants" style="${buttonStyles}">Review Application</a>
      </div>

      <p><strong>What you can do:</strong></p>
      <ul style="line-height: 2;">
        <li>View the volunteer's full profile and previous experience</li>
        <li>Review their application responses</li>
        <li>Approve or reject the application</li>
        <li>Communicate directly with the applicant if needed</li>
      </ul>

      <p>Thank you for partnering with Foreignteer to make a difference!</p>

      <p style="margin-top: 30px;">Best regards,<br/><strong>The Foreignteer Team</strong></p>
    </div>

    <!-- Footer -->
    <div style="${footerStyles}">
      <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} Foreignteer. All rights reserved.</p>
      <p style="margin: 0;">
        <a href="https://foreignteer.com/privacy" style="color: #21B3B1; text-decoration: none;">Privacy Policy</a> |
        <a href="https://foreignteer.com/terms" style="color: #21B3B1; text-decoration: none;">Terms of Service</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Email sent to volunteer when application requires admin approval
 */
export function bookingPendingAdminToUser(
  userName: string,
  experienceName: string,
  ngoName: string,
  experienceDate: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="${baseStyles}">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E6EAEA;">
    <!-- Header -->
    <div style="${headerStyles}">
      <h1 style="margin: 0; font-size: 28px;">Application Received!</h1>
    </div>

    <!-- Content -->
    <div style="${contentStyles}">
      <p style="font-size: 16px;">Hi <strong>${userName}</strong>,</p>

      <p>Thank you for applying for <strong>${experienceName}</strong>!</p>

      <p>Your application has been successfully submitted and is now under review by our admin team.</p>

      <div style="background-color: #FFF9E6; border-left: 4px solid #F2B56B; padding: 15px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Experience Details:</strong></p>
        <p style="margin: 5px 0 0 0;">📅 Date: ${experienceDate}</p>
        <p style="margin: 5px 0 0 0;">🏢 Organisation: ${ngoName}</p>
      </div>

      <p><strong>What happens next?</strong></p>
      <ol style="line-height: 2;">
        <li>Our admin team will review your application</li>
        <li>Once approved, it will be forwarded to <strong>${ngoName}</strong> for their review</li>
        <li>You'll be notified at each step of the process</li>
      </ol>

      <p>This experience requires additional vetting to ensure the best match for both volunteers and the organization. Thank you for your patience!</p>

      <div style="text-align: center;">
        <a href="https://foreignteer.com/dashboard/user/bookings" style="${buttonStyles}">View My Applications</a>
      </div>

      <p>Thank you for choosing to make a difference with Foreignteer!</p>

      <p style="margin-top: 30px;">Best regards,<br/><strong>The Foreignteer Team</strong></p>
    </div>

    <!-- Footer -->
    <div style="${footerStyles}">
      <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} Foreignteer. All rights reserved.</p>
      <p style="margin: 0;">
        <a href="https://foreignteer.com/privacy" style="color: #21B3B1; text-decoration: none;">Privacy Policy</a> |
        <a href="https://foreignteer.com/terms" style="color: #21B3B1; text-decoration: none;">Terms of Service</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Email sent to admin when new application requires vetting
 */
export function newApplicationToAdmin(
  userName: string,
  userEmail: string,
  experienceName: string,
  ngoName: string,
  experienceDate: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="${baseStyles}">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E6EAEA;">
    <!-- Header -->
    <div style="${headerStyles}">
      <h1 style="margin: 0; font-size: 28px;">New Application Requires Vetting 🔍</h1>
    </div>

    <!-- Content -->
    <div style="${contentStyles}">
      <p style="font-size: 16px;">Hi <strong>Admin</strong>,</p>

      <p>A new volunteer application requires your approval before being forwarded to the NGO.</p>

      <div style="background-color: #FFF9E6; border-left: 4px solid #F2B56B; padding: 15px; margin: 20px 0;">
        <p style="margin: 0 0 10px 0;"><strong>Application Details:</strong></p>
        <p style="margin: 5px 0;">👤 <strong>Volunteer:</strong> ${userName} (${userEmail})</p>
        <p style="margin: 5px 0;">📋 <strong>Experience:</strong> ${experienceName}</p>
        <p style="margin: 5px 0;">🏢 <strong>Organisation:</strong> ${ngoName}</p>
        <p style="margin: 5px 0;">📅 <strong>Date:</strong> ${experienceDate}</p>
      </div>

      <p>This experience requires admin vetting due to special requirements or high-risk activities.</p>

      <div style="text-align: center;">
        <a href="https://foreignteer.com/dashboard/admin/pending-approvals" style="${buttonStyles}">Review Application</a>
      </div>

      <p><strong>Action required:</strong></p>
      <ul style="line-height: 2;">
        <li>Review the volunteer's profile and application</li>
        <li><strong>Approve</strong> to pass the application to the NGO for their review</li>
        <li><strong>Reject</strong> if the volunteer doesn't meet platform requirements</li>
      </ul>

      <p>Please review this application at your earliest convenience.</p>

      <p style="margin-top: 30px;">Best regards,<br/><strong>Foreignteer Platform</strong></p>
    </div>

    <!-- Footer -->
    <div style="${footerStyles}">
      <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} Foreignteer. All rights reserved.</p>
      <p style="margin: 0;">
        <a href="https://foreignteer.com/privacy" style="color: #21B3B1; text-decoration: none;">Privacy Policy</a> |
        <a href="https://foreignteer.com/terms" style="color: #21B3B1; text-decoration: none;">Terms of Service</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Email sent to volunteer when admin approves their application
 */
export function bookingAdminApprovedToUser(
  userName: string,
  experienceName: string,
  ngoName: string,
  experienceDate: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="${baseStyles}">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E6EAEA;">
    <!-- Header -->
    <div style="background-color: #6FB7A4; color: white; padding: 30px 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px;">Application Moving Forward! ✅</h1>
    </div>

    <!-- Content -->
    <div style="${contentStyles}">
      <p style="font-size: 16px;">Hi <strong>${userName}</strong>,</p>

      <p>Good news! Your application for <strong>${experienceName}</strong> has been approved by our admin team.</p>

      <div style="background-color: #E8F5F4; border-left: 4px solid #6FB7A4; padding: 15px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Experience Details:</strong></p>
        <p style="margin: 5px 0 0 0;">📅 Date: ${experienceDate}</p>
        <p style="margin: 5px 0 0 0;">🏢 Organisation: ${ngoName}</p>
      </div>

      <p><strong>What's next?</strong></p>
      <ol style="line-height: 2;">
        <li>Your application is now being reviewed by <strong>${ngoName}</strong></li>
        <li>The NGO will review your profile and application details</li>
        <li>You'll receive another notification once the NGO makes their decision</li>
      </ol>

      <p>You're one step closer to making a positive impact! We'll keep you updated on your application status.</p>

      <div style="text-align: center;">
        <a href="https://foreignteer.com/dashboard/user/bookings" style="${buttonStyles}">View Application Status</a>
      </div>

      <p>Thank you for your patience and commitment to volunteering!</p>

      <p style="margin-top: 30px;">Best regards,<br/><strong>The Foreignteer Team</strong></p>
    </div>

    <!-- Footer -->
    <div style="${footerStyles}">
      <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} Foreignteer. All rights reserved.</p>
      <p style="margin: 0;">
        <a href="https://foreignteer.com/privacy" style="color: #21B3B1; text-decoration: none;">Privacy Policy</a> |
        <a href="https://foreignteer.com/terms" style="color: #21B3B1; text-decoration: none;">Terms of Service</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
