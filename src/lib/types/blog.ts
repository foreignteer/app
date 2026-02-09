/**
 * Blog Post Types
 */

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string; // Rich text HTML content
  excerpt: string; // Short summary for listing pages
  featuredImage?: string; // URL to main image
  author: {
    id: string;
    name: string;
    role?: string;
  };
  category?: string; // e.g., 'Volunteering Tips', 'Impact Stories', 'Travel Guides'
  tags?: string[]; // e.g., ['volunteering', 'sustainability', 'travel']
  published: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  views?: number; // Optional view counter
  readTime?: number; // Estimated read time in minutes
}

export interface BlogPostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  category?: string;
  tags?: string[];
  published: boolean;
}

export interface BlogFilters {
  category?: string;
  tag?: string;
  search?: string;
  published?: boolean;
}
