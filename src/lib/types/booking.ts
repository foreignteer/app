export type BookingStatus = 'pending_admin' | 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'waitlist' | 'rejected';

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
