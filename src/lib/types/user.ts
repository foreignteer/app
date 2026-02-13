export type UserRole = 'admin' | 'ngo' | 'user';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  avatar?: string;
  role: UserRole;
  ngoId?: string; // For NGO users
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
