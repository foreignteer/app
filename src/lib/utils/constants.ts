export const CAUSE_CATEGORIES = [
  'Education',
  'Environment',
  'Healthcare',
  'Animal Welfare',
  'Community Development',
  'Arts & Culture',
  'Disaster Relief',
  'Human Rights',
  'Youth Empowerment',
  'Elderly Care',
] as const;

export type CauseCategory = typeof CAUSE_CATEGORIES[number];

export const EXPERIENCE_STATUS = {
  DRAFT: 'draft',
  PENDING_APPROVAL: 'pending_approval',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  NGO: 'ngo',
  USER: 'user',
} as const;

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  WAITLIST: 'waitlist',
} as const;

export const COUNTRIES = [
  'Hong Kong',
  'China',
  'Taiwan',
  'Japan',
  'South Korea',
  'Singapore',
  'Thailand',
  'Vietnam',
  'Philippines',
  'Malaysia',
  'Indonesia',
  'India',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Other',
] as const;

export const JURISDICTIONS = [
  'Hong Kong',
  'China',
  'Taiwan',
  'Singapore',
  'United Kingdom',
  'United States',
  'Other',
] as const;
