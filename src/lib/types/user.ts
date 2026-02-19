export type UserRole = 'admin' | 'ngo' | 'user';
export type NGORole = 'owner' | 'staff';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  avatar?: string;
  role: UserRole;
  ngoId?: string; // For NGO users
  ngoRole?: NGORole; // For NGO users: 'owner' or 'staff'
  countryOfOrigin?: string;
  volunteeringExperience?: string;
  jobTitle?: string;
  organization?: string;
  dateOfBirth?: Date;
  phone?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  hasTravelInsurance?: boolean; // Whether user has travel insurance
  profileCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NGOUser extends User {
  role: 'ngo';
  ngoId: string;
}

export interface AdminUser extends User {
  role: 'admin';
}
