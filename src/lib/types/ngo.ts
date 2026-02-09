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
