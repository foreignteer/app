/**
 * Seed Script: Blog Posts and Testimonials
 *
 * Run this script to populate sample blog posts and testimonials in Firestore
 *
 * Usage:
 * npx tsx scripts/seedBlogAndTestimonials.ts
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Initialize Firebase Admin
if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

// Sample Blog Posts
// Empty array - blog posts already exist in database
const sampleBlogPosts: any[] = [
];

// Sample Testimonials
const sampleTestimonials = [
  {
    name: 'Emma Thompson',
    role: 'Volunteer',
    location: 'London, UK',
    content: 'I spent just 3 hours helping with a beach cleanup in Barcelona and it was the highlight of my trip. Meeting locals who care deeply about their environment was inspiring. Foreignteer made it so easy to find and book!',
    experienceTitle: 'Beach Cleanup Barcelona',
    rating: 5,
    isPublished: true,
    displayOrder: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'James Chen',
    role: 'Software Engineer',
    location: 'Singapore',
    content: 'As someone who travels for work, I love that I can give back without committing weeks. I taught coding to kids in Berlin during a business trip - incredibly rewarding and perfectly fit my schedule.',
    experienceTitle: 'Coding Workshop Berlin',
    rating: 5,
    isPublished: true,
    displayOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Maria Garcia',
    role: 'NGO Coordinator',
    organization: 'Green Futures',
    location: 'Madrid, Spain',
    content: 'Foreignteer connects us with motivated volunteers who genuinely want to help. The platform is user-friendly and the support team is fantastic. It\'s been a game-changer for our community garden project.',
    experienceTitle: 'Community Garden Project',
    rating: 5,
    isPublished: true,
    displayOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Alex Kumar',
    role: 'Student',
    location: 'Mumbai, India',
    content: 'I was backpacking through Southeast Asia and volunteered at 5 different locations. Each experience was unique and meaningful. The 2-hour commitment was perfect - I could still explore while making a difference.',
    experienceTitle: 'Multiple Experiences',
    rating: 5,
    isPublished: true,
    displayOrder: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Sophie Laurent',
    role: 'Photographer',
    location: 'Paris, France',
    content: 'The verification process gave me confidence that these were legitimate organizations. I volunteered at an animal shelter in Lisbon and the experience was professional, safe, and deeply fulfilling.',
    experienceTitle: 'Animal Shelter Support',
    rating: 5,
    isPublished: true,
    displayOrder: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'David Miller',
    role: 'Retired Teacher',
    location: 'Toronto, Canada',
    content: 'At 65, I thought my volunteering days were behind me. Foreignteer proved me wrong! The short time commitments are perfect for my energy level, and I\'ve met wonderful people in every city.',
    experienceTitle: 'English Tutoring Session',
    rating: 5,
    isPublished: true,
    displayOrder: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seedBlogPosts() {
  console.log('🌱 Seeding blog posts...');

  for (const post of sampleBlogPosts) {
    try {
      await db.collection('blogPosts').add(post);
      console.log(`✅ Created blog post: "${post.title}"`);
    } catch (error) {
      console.error(`❌ Error creating blog post "${post.title}":`, error);
    }
  }

  console.log('✅ Blog posts seeded successfully!\n');
}

async function seedTestimonials() {
  console.log('🌱 Seeding testimonials...');

  for (const testimonial of sampleTestimonials) {
    try {
      await db.collection('testimonials').add(testimonial);
      console.log(`✅ Created testimonial: "${testimonial.name}"`);
    } catch (error) {
      console.error(`❌ Error creating testimonial "${testimonial.name}":`, error);
    }
  }

  console.log('✅ Testimonials seeded successfully!\n');
}

async function main() {
  console.log('🚀 Starting seed process...\n');

  try {
    await seedBlogPosts();
    await seedTestimonials();

    console.log('🎉 All sample data seeded successfully!');
    console.log('\nYou can now:');
    console.log('  - View blog posts at: /blog');
    console.log('  - Manage blog posts at: /dashboard/admin/blog');
    console.log('  - Manage testimonials at: /dashboard/admin/testimonials');
    console.log('  - See testimonials on homepage: /');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }

  process.exit(0);
}

main();
