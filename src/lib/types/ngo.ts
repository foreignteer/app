export interface NGO {
  id: string;
  name: string;
  logoUrl?: string;
  jurisdiction: string;
  serviceLocations: string[];
  description: string;
  causes: string[];
  website?: string;
  contactEmail: string;
  publicSlug: string;
  approved: boolean;
  createdBy: string; // userId
  createdAt: Date;
  updatedAt: Date;
}

export interface NGOFormData {
  name: string;
  jurisdiction: string;
  serviceLocations: string[];
  description: string;
  causes: string[];
  website?: string;
  contactEmail: string;
}

export interface NGOTeamMember {
  id: string;
  ngoId: string;
  userId: string;
  ngoRole: 'owner' | 'staff';
  email: string;
  displayName: string;
  invitedBy: string;
  invitedAt: Date;
  joinedAt?: Date;
  status: 'active' | 'removed';
}

export interface NGOInvitation {
  id: string;
  ngoId: string;
  ngoName: string;
  invitedEmail: string;
  ngoRole: 'staff';
  invitedBy: string;
  createdAt: Date;
  expiresAt: Date;
  used: boolean;
  usedAt?: Date;
  usedBy?: string;
}
