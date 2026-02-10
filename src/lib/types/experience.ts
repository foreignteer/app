export type ExperienceStatus = 'draft' | 'pending_approval' | 'published' | 'cancelled';

export type RecurrencePattern = 'weekly' | 'biweekly' | 'monthly';

export interface Experience {
  id: string;
  title: string;
  summary: string;
  description: string;
  images: string[];
  city: string;
  country: string;
  location: {
    address: string;
    lat?: number;
    lng?: number;
  };
  dates: {
    start: Date;
    end: Date;
  };
  time?: {
    startTime: string; // e.g., "09:00"
    duration: number; // in hours
  };
  causeCategories: string[]; // Multiple categories allowed
  otherCategory?: string; // Custom category if "Other" is selected
  capacity: number;
  currentBookings: number;
  platformServiceFee: number; // Fixed £15 platform fee
  programmeFee?: number; // Optional programme fee set by NGO (requires admin approval)
  totalFee: number; // platformServiceFee + programmeFee (calculated)
  recurring: boolean;
  recurrencePattern?: RecurrencePattern; // 'weekly', 'biweekly', 'monthly'
  recurrenceEndDate?: Date; // When to stop creating recurring instances
  recurringGroupId?: string; // Links all instances of the same recurring event
  instantConfirmation?: boolean; // If true, bookings are auto-confirmed; if false, NGO must approve
  requiresAdminApproval?: boolean; // If true, bookings need admin approval before NGO review (not shown to public)
  ngoId: string;
  status: ExperienceStatus;
  requirements?: string[];
  accessibility?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExperienceFormData {
  title: string;
  summary: string;
  description: string;
  city: string;
  country: string;
  locationAddress: string;
  startDate: Date;
  endDate: Date;
  causeCategory: string;
  capacity: number;
  serviceFee: number;
  recurring: boolean;
  requirements?: string;
  accessibility?: string;
}

export interface ExperienceFilters {
  search?: string;
  city?: string;
  country?: string;
  causeCategory?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  recurring?: boolean;
  instantConfirmation?: boolean;
}
