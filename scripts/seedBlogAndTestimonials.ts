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
const sampleBlogPosts = [
  {
    title: '5 Tips for First-Time Micro-Volunteers',
    slug: '5-tips-first-time-micro-volunteers',
    excerpt: 'New to micro-volunteering? Here are essential tips to make your first experience amazing and impactful.',
    content: `
      <h2>Welcome to the World of Micro-Volunteering!</h2>
      <p>Embarking on your first micro-volunteering experience is exciting! Here are five essential tips to help you make the most of it.</p>

      <h3>1. Research Your Destination</h3>
      <p>Before booking, learn about the local community and the cause you'll be supporting. Understanding the context makes your contribution more meaningful.</p>

      <h3>2. Come Prepared</h3>
      <p>Check what to bring and wear. Comfortable clothes, water, and a positive attitude are usually all you need. Some experiences may require specific items - always read the description carefully.</p>

      <h3>3. Be Open-Minded</h3>
      <p>Micro-volunteering is about cultural exchange as much as helping. Embrace new perspectives and be ready to learn from the local community.</p>

      <h3>4. Ask Questions</h3>
      <p>Don't hesitate to reach out to the NGO coordinator before your experience. They're there to help and want you to have a great time.</p>

      <h3>5. Share Your Story</h3>
      <p>After your experience, leave a review and share your story. Your feedback helps other volunteers and supports the NGOs doing amazing work.</p>

      <p><strong>Ready to start?</strong> Browse our experiences and find your perfect micro-volunteering opportunity!</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=600&fit=crop&q=80',
    category: 'Volunteering Tips',
    tags: ['getting-started', 'tips', 'first-time'],
    published: true,
    publishedAt: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    author: {
      id: 'admin',
      name: 'Foreignteer Team',
      role: 'Admin',
    },
    views: 127,
    readTime: 4,
  },
  {
    title: 'How Micro-Volunteering Changed My Travel Experience',
    slug: 'how-micro-volunteering-changed-my-travel',
    excerpt: 'A personal story about discovering the deeper side of travel through short but meaningful volunteering experiences.',
    content: `
      <h2>Beyond the Tourist Trail</h2>
      <p>I used to travel like everyone else - museums, restaurants, Instagram-worthy spots. But something was missing. That changed when I discovered micro-volunteering.</p>

      <h3>The First Experience</h3>
      <p>In Barcelona, I spent three hours helping at a local food bank. It wasn't glamorous, but sorting donations alongside locals taught me more about the city than any guidebook could.</p>

      <h3>Real Connections</h3>
      <p>Through Foreignteer, I've cleaned beaches in Thailand, taught English to children in Peru, and helped organize community events in Berlin. Each experience connected me with real people living real lives.</p>

      <h3>The Ripple Effect</h3>
      <p>Micro-volunteering doesn't just help communities - it transforms how you see the world. You start noticing the people behind the places, understanding challenges, celebrating small victories.</p>

      <h3>Why It Works</h3>
      <p>The beauty of micro-volunteering is its accessibility. Two hours is enough to make a difference. No long-term commitment, no expensive program fees, just genuine impact.</p>

      <p><em>Now, I plan my trips around volunteering opportunities. Travel became richer, more meaningful, more human.</em></p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=600&fit=crop&q=80',
    category: 'Impact Stories',
    tags: ['personal-story', 'impact', 'travel'],
    published: true,
    publishedAt: new Date('2024-02-01'),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    author: {
      id: 'admin',
      name: 'Sarah Mitchell',
      role: 'Volunteer & Travel Blogger',
    },
    views: 243,
    readTime: 5,
  },
  {
    title: 'The Best Cities for Micro-Volunteering in 2024',
    slug: 'best-cities-micro-volunteering-2024',
    excerpt: 'Discover the top destinations where you can combine travel with meaningful volunteering opportunities.',
    content: `
      <h2>Where Impact Meets Adventure</h2>
      <p>Looking for your next travel destination? These cities offer incredible micro-volunteering opportunities alongside amazing experiences.</p>

      <h3>1. Barcelona, Spain</h3>
      <p>From beach cleanups to community gardens, Barcelona's vibrant NGO scene offers diverse opportunities. Plus, the food and culture make it unforgettable.</p>

      <h3>2. Chiang Mai, Thailand</h3>
      <p>Known for its temples and mountains, Chiang Mai also has fantastic educational and environmental projects. Perfect for those seeking cultural immersion.</p>

      <h3>3. Cape Town, South Africa</h3>
      <p>Stunning natural beauty meets impactful community work. Wildlife conservation, education, and social programs abound.</p>

      <h3>4. Lisbon, Portugal</h3>
      <p>This charming city is home to innovative social enterprises and community initiatives. Great for creative volunteering projects.</p>

      <h3>5. Bali, Indonesia</h3>
      <p>Beyond yoga retreats, Bali offers marine conservation, teaching opportunities, and cultural preservation projects.</p>

      <h3>Planning Your Trip</h3>
      <p>When choosing a destination, consider:</p>
      <ul>
        <li>Your interests and skills</li>
        <li>The season and weather</li>
        <li>Language barriers (though many experiences welcome all languages)</li>
        <li>Your travel budget and timeline</li>
      </ul>

      <p><strong>Pro tip:</strong> Book your volunteering experiences early, especially during peak travel seasons!</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&h=600&fit=crop&q=80',
    category: 'Travel Guides',
    tags: ['destinations', 'travel', '2024'],
    published: true,
    publishedAt: new Date('2024-01-20'),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    author: {
      id: 'admin',
      name: 'Foreignteer Team',
      role: 'Admin',
    },
    views: 189,
    readTime: 6,
  },
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
