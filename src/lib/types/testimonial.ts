/**
 * Testimonial Types
 */

export interface Testimonial {
  id: string;
  name: string;
  role?: string; // e.g., 'Volunteer', 'NGO Partner'
  organization?: string; // e.g., NGO name or company
  content: string; // The testimonial text
  image?: string; // URL to person's photo
  location?: string; // e.g., 'London, UK'
  experienceTitle?: string; // Which experience they participated in
  rating?: number; // 1-5 stars (optional)
  isPublished: boolean; // Whether to show on website
  displayOrder: number; // Order on the page (lower number = earlier)
  createdAt: Date;
  updatedAt: Date;
}

export interface TestimonialFormData {
  name: string;
  role?: string;
  organization?: string;
  content: string;
  image?: string;
  location?: string;
  experienceTitle?: string;
  rating?: number;
  isPublished: boolean;
}

export interface TestimonialFilters {
  isPublished?: boolean;
  search?: string;
}
