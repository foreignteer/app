/**
 * Seed Script: Sample Experiences
 * Run with: npx tsx scripts/seed-experiences.ts
 */

import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

// Sample NGO data
const sampleNGO = {
  name: 'Global Impact Foundation',
  logoUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=200',
  jurisdiction: 'United Kingdom',
  serviceLocations: ['London', 'Manchester', 'Edinburgh'],
  description:
    'Global Impact Foundation is dedicated to creating sustainable change through community engagement and volunteer initiatives. We focus on education, environmental conservation, and social welfare programs.',
  causes: ['Education', 'Environment', 'Community Development'],
  website: 'https://globalimpact.org',
  contactEmail: 'contact@globalimpact.org',
  publicSlug: 'global-impact-foundation',
  approved: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Sample experiences
const sampleExperiences = [
  {
    title: 'Beach Cleanup & Marine Conservation',
    summary:
      'Join us for a rewarding day cleaning Brighton Beach and learning about marine conservation',
    description: `<p>Help protect our coastline and marine life by participating in our monthly beach cleanup event. This hands-on experience combines environmental action with education about ocean conservation.</p>

    <p><strong>What you'll do:</strong></p>
    <ul>
      <li>Collect and sort beach litter and debris</li>
      <li>Learn about microplastics and their impact on marine ecosystems</li>
      <li>Participate in a guided marine life observation session</li>
      <li>Document findings for environmental research</li>
    </ul>

    <p><strong>What's included:</strong></p>
    <ul>
      <li>All equipment (gloves, bags, collection tools)</li>
      <li>Expert-led workshop on marine conservation</li>
      <li>Refreshments and lunch</li>
      <li>Certificate of participation</li>
    </ul>

    <p>No prior experience needed - just bring your enthusiasm and a willingness to make a difference!</p>`,
    images: [
      'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800',
      'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800',
    ],
    city: 'Brighton',
    country: 'United Kingdom',
    location: {
      address: 'Brighton Beach, Brighton BN2 1TW, UK',
      lat: 50.8225,
      lng: -0.1372,
    },
    dates: {
      start: new Date('2026-03-15T09:00:00'),
      end: new Date('2026-03-15T16:00:00'),
    },
    time: {
      startTime: '09:00',
      duration: 7,
    },
    causeCategory: 'Environment',
    capacity: 25,
    currentBookings: 12,
    serviceFee: 5.0,
    recurring: true,
    recurrenceRule: 'Monthly on the 3rd Saturday',
    status: 'published' as const,
    requirements: [
      'Must be 16 years or older',
      'Wear comfortable clothes and closed-toe shoes',
      'Bring sunscreen and water bottle',
      'Moderate fitness level required',
    ],
    accessibility: 'Wheelchair accessible paths available. Please contact us in advance for specific needs.',
  },
  {
    title: 'Community Garden Project',
    summary:
      'Help create a sustainable community garden in East London',
    description: `<p>Be part of transforming an unused urban space into a thriving community garden. This ongoing project brings neighbors together while promoting sustainable living and local food production.</p>

    <p><strong>Activities include:</strong></p>
    <ul>
      <li>Building raised garden beds and installing irrigation systems</li>
      <li>Planting vegetables, herbs, and pollinator-friendly flowers</li>
      <li>Learning organic gardening techniques</li>
      <li>Creating composting stations</li>
      <li>Designing community gathering spaces</li>
    </ul>

    <p><strong>Skills you'll gain:</strong></p>
    <ul>
      <li>Organic gardening and permaculture basics</li>
      <li>Composting and soil health management</li>
      <li>Community organizing and project management</li>
      <li>Carpentry and construction basics</li>
    </ul>

    <p>All skill levels welcome. Tools and training provided!</p>`,
    images: [
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
    ],
    city: 'London',
    country: 'United Kingdom',
    location: {
      address: 'Hackney Downs, London E5 8BP, UK',
      lat: 51.5462,
      lng: -0.0557,
    },
    dates: {
      start: new Date('2026-03-20T10:00:00'),
      end: new Date('2026-03-22T15:00:00'),
    },
    time: {
      startTime: '10:00',
      duration: 5,
    },
    causeCategory: 'Community Development',
    capacity: 15,
    currentBookings: 8,
    serviceFee: 7.5,
    recurring: false,
    status: 'published' as const,
    requirements: [
      'Must be 18 years or older',
      'Comfortable with outdoor physical work',
      'No gardening experience necessary',
    ],
    accessibility: 'Accessible facilities on-site. Some activities may require standing or kneeling.',
  },
  {
    title: 'Youth Mentoring & Literacy Support',
    summary:
      'Support young learners with reading and homework assistance in Manchester',
    description: `<p>Make a lasting impact in a child's life by volunteering as a reading buddy and homework helper. Our literacy program serves underprivileged youth aged 7-14 in Manchester.</p>

    <p><strong>Your role:</strong></p>
    <ul>
      <li>One-on-one reading sessions with assigned students</li>
      <li>Homework support across various subjects</li>
      <li>Engaging educational games and activities</li>
      <li>Building confidence and fostering a love of learning</li>
    </ul>

    <p><strong>Program details:</strong></p>
    <ul>
      <li>2-3 hour sessions twice per week</li>
      <li>Comprehensive volunteer training provided</li>
      <li>Ongoing support from program coordinators</li>
      <li>Monthly volunteer meetups and socials</li>
    </ul>

    <p><strong>What we're looking for:</strong></p>
    <ul>
      <li>Patient, encouraging personality</li>
      <li>Good communication skills</li>
      <li>Ability to commit to regular sessions</li>
      <li>Background check required (we'll assist)</li>
    </ul>`,
    images: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
    ],
    city: 'Manchester',
    country: 'United Kingdom',
    location: {
      address: 'Manchester Community Centre, M4 4BF, UK',
      lat: 53.4839,
      lng: -2.2446,
    },
    dates: {
      start: new Date('2026-04-01T15:00:00'),
      end: new Date('2026-06-30T18:00:00'),
    },
    time: {
      startTime: '15:00',
      duration: 3,
    },
    causeCategory: 'Education',
    capacity: 20,
    currentBookings: 15,
    serviceFee: 10.0,
    recurring: true,
    recurrenceRule: 'Twice weekly (Tuesdays and Thursdays)',
    status: 'published' as const,
    requirements: [
      'Must be 21 years or older',
      'DBS check required (Enhanced)',
      'Minimum 3-month commitment',
      'Attend mandatory orientation session',
      'Strong English language skills',
    ],
    accessibility: 'Fully accessible building with elevator and accessible restrooms.',
  },
  {
    title: 'Wildlife Habitat Restoration',
    summary:
      'Restore natural habitats for native wildlife in the Lake District',
    description: `<p>Join our conservation team for a weekend of hands-on habitat restoration in the stunning Lake District National Park. Help protect endangered species by restoring their natural environments.</p>

    <p><strong>Conservation activities:</strong></p>
    <ul>
      <li>Removing invasive plant species</li>
      <li>Planting native trees and wildflowers</li>
      <li>Building wildlife shelters and bird boxes</li>
      <li>Stream and pond restoration work</li>
      <li>Wildlife monitoring and data collection</li>
    </ul>

    <p><strong>What's included:</strong></p>
    <ul>
      <li>Accommodation in a rustic eco-lodge</li>
      <li>All meals (vegetarian/vegan options available)</li>
      <li>Expert-led workshops on conservation</li>
      <li>All tools and equipment</li>
      <li>Transportation from Windermere station</li>
    </ul>

    <p>This is an immersive outdoor experience perfect for nature lovers who want to make a real difference!</p>`,
    images: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
    ],
    city: 'Windermere',
    country: 'United Kingdom',
    location: {
      address: 'Lake District National Park, Windermere LA23 1LJ, UK',
      lat: 54.3800,
      lng: -2.9089,
    },
    dates: {
      start: new Date('2026-04-10T09:00:00'),
      end: new Date('2026-04-12T16:00:00'),
    },
    time: {
      startTime: '09:00',
      duration: 7,
    },
    causeCategory: 'Environment',
    capacity: 12,
    currentBookings: 5,
    serviceFee: 15.0,
    recurring: false,
    status: 'published' as const,
    requirements: [
      'Must be 18 years or older',
      'Good physical fitness required',
      'Outdoor clothing and hiking boots essential',
      'Comfortable with camping-style accommodation',
    ],
    accessibility: 'Limited accessibility due to remote location and terrain. Please contact us to discuss specific needs.',
  },
  {
    title: 'Food Bank Distribution Volunteer',
    summary:
      'Help combat food poverty by supporting Edinburgh Food Bank operations',
    description: `<p>Play a vital role in fighting food insecurity in Edinburgh. Our food bank serves hundreds of families each week, and volunteers are essential to our operations.</p>

    <p><strong>Volunteer tasks:</strong></p>
    <ul>
      <li>Sorting and organizing food donations</li>
      <li>Packing food parcels for families</li>
      <li>Welcoming and registering clients</li>
      <li>Stock management and inventory</li>
      <li>Loading/unloading delivery vehicles</li>
    </ul>

    <p><strong>Shift options:</strong></p>
    <ul>
      <li>Morning shift: 9:00 AM - 1:00 PM</li>
      <li>Afternoon shift: 1:00 PM - 5:00 PM</li>
      <li>Full day: 9:00 AM - 5:00 PM</li>
    </ul>

    <p><strong>What you'll gain:</strong></p>
    <ul>
      <li>Understanding of food poverty issues</li>
      <li>Logistics and warehouse skills</li>
      <li>Team working experience</li>
      <li>Warm, welcoming community</li>
    </ul>`,
    images: [
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
    ],
    city: 'Edinburgh',
    country: 'United Kingdom',
    location: {
      address: 'Edinburgh Food Bank, EH7 5QG, UK',
      lat: 55.9533,
      lng: -3.1883,
    },
    dates: {
      start: new Date('2026-03-25T09:00:00'),
      end: new Date('2026-03-25T17:00:00'),
    },
    time: {
      startTime: '09:00',
      duration: 8,
    },
    causeCategory: 'Community Development',
    capacity: 30,
    currentBookings: 22,
    serviceFee: 3.0,
    recurring: true,
    recurrenceRule: 'Daily (flexible scheduling)',
    status: 'published' as const,
    requirements: [
      'Must be 16 years or older',
      'Ability to lift boxes up to 10kg',
      'Friendly and non-judgmental attitude',
      'Punctuality important',
    ],
    accessibility: 'Wheelchair accessible with lift access. Modified tasks available for those unable to lift.',
  },
];

async function seedExperiences() {
  try {
    console.log('🌱 Starting to seed experiences...\n');

    // Create sample NGO
    console.log('Creating sample NGO...');
    const ngoRef = await db.collection('ngos').add(sampleNGO);
    console.log(`✅ Created NGO: ${sampleNGO.name} (ID: ${ngoRef.id})\n`);

    // Create experiences
    console.log('Creating sample experiences...\n');
    let count = 0;

    for (const experience of sampleExperiences) {
      const experienceData = {
        ...experience,
        ngoId: ngoRef.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await db.collection('experiences').add(experienceData);
      count++;

      console.log(`✅ ${count}. Created: ${experience.title}`);
      console.log(`   - Location: ${experience.city}, ${experience.country}`);
      console.log(`   - Fee: £${experience.serviceFee.toFixed(2)}`);
      console.log(`   - Capacity: ${experience.currentBookings}/${experience.capacity}`);
      console.log(`   - ID: ${docRef.id}\n`);
    }

    console.log(`\n🎉 Successfully created ${count} sample experiences!`);
    console.log(`\nNGO ID: ${ngoRef.id}`);
    console.log('\nYou can now browse these experiences at: http://localhost:3000/experiences\n');
  } catch (error) {
    console.error('❌ Error seeding experiences:', error);
    process.exit(1);
  }
}

// Run the seed function
seedExperiences()
  .then(() => {
    console.log('✨ Seeding complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
