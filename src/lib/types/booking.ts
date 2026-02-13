export type BookingStatus = 'pending_admin' | 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'waitlist' | 'rejected';
export type AttendanceStatus = 'pending' | 'volunteer_only' | 'ngo_only' | 'confirmed' | 'disputed';

export interface Booking {
  id: string;
  experienceId: string;
  userId: string;
  ngoId: string;
  status: BookingStatus;
  answers?: {
    travelInsurance?: boolean;
    accessibilityNeeds?: string;
    upcomingTripDates?: string;
    [key: string]: any; // For custom questions
  };
  appliedAt: Date;
  confirmedAt?: Date;
  cancelledAt?: Date;
  completedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  adminApprovedAt?: Date;
  adminRejectedAt?: Date;
  adminRejectionReason?: string;

  // Attendance tracking
  volunteerCheckedIn: boolean;
  volunteerCheckInTime?: Date;
  ngoCheckedIn: boolean;
  ngoCheckInTime?: Date;
  attendanceStatus: AttendanceStatus;
  attendanceNotes?: string; // For disputed cases or additional context

  // Rating & Review (after attendance confirmed)
  rating?: number; // 1-5 stars
  review?: string;
  reviewSubmittedAt?: Date;
  reviewApproved?: boolean; // Admin moderation
  reviewRejectionReason?: string;

  // Testimonial tracking
  testimonialSubmitted?: boolean;
  testimonialId?: string; // Reference to testimonials collection
  reviewInvitationSent?: boolean;
  reviewInvitationSentAt?: Date;
}

export interface BookingFormData {
  travelInsurance: boolean;
  accessibilityNeeds?: string;
  upcomingTripDates?: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  experienceId?: string;
  ngoId?: string;
  createdAt: Date;
  status: 'new' | 'contacted' | 'resolved';
}
