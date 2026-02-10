import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: join(__dirname, '../.env.local') });

// Initialize Firebase Admin with environment variables
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

// Helper function to create dates
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const mockExperiences = [
  {
    title: 'Beach Clean-Up & Marine Conservation',
    summary: 'Join us for a morning of coastal conservation, protecting marine wildlife by cleaning beaches and removing harmful debris.',
    description: `Make a real impact on marine conservation! Join our dedicated team for a rewarding beach clean-up session along the beautiful Brighton coastline.

**What You'll Do:**
- Remove plastic waste and debris from the beach
- Learn about marine ecosystems and local wildlife
- Sort and recycle collected materials
- Document findings for environmental research

**What You'll Gain:**
- Hands-on conservation experience
- Knowledge about marine pollution
- Certificate of participation
- Free refreshments and lunch
- Meet like-minded environmental advocates

Perfect for individuals, families, or groups who care about ocean health. No experience necessary - just bring enthusiasm and sun protection!`,
    city: 'Brighton',
    country: 'United Kingdom',
    location: {
      address: 'Brighton Beach, Marine Parade, Brighton BN2 1TB',
      lat: 50.8225,
      lng: -0.1372,
    },
    dates: {
      start: admin.firestore.Timestamp.fromDate(addDays(new Date(), 14)),
      end: admin.firestore.Timestamp.fromDate(addDays(new Date(), 14)),
    },
    time: {
      startTime: '09:00',
      duration: 4,
    },
    causeCategories: ['Environment & Conservation', 'Community Development'],
    capacity: 30,
    currentBookings: 0,
    platformServiceFee: 15,
    totalFee: 15,
    recurring: false,
    instantConfirmation: true,
    status: 'published',
    requirements: ['Comfortable walking shoes', 'Sun protection', 'Reusable water bottle'],
    accessibility: 'Wheelchair accessible beach access available. All fitness levels welcome.',
    images: ['https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800', 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800'],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    title: 'English Tutoring for Refugee Children',
    summary: 'Help refugee children learn English through interactive lessons, games, and creative activities in a supportive environment.',
    description: `Transform lives through education! We're seeking compassionate volunteers to provide English language support to refugee children aged 6-12.

**Your Role:**
- Conduct 1-on-1 or small group English lessons
- Use games, songs, and creative activities to teach
- Help with homework and reading practice
- Provide emotional support and encouragement

**Requirements:**
- Native or fluent English speaker
- Patient and enthusiastic attitude
- Enhanced DBS check (we can arrange)
- Commitment to weekly sessions for at least 3 months

**What We Provide:**
- Full training and teaching resources
- Ongoing support from experienced coordinators
- Weekly lesson plans and materials
- Refreshments during sessions

Make a lasting difference in a child's integration journey. These sessions provide crucial language skills and a safe, welcoming environment.`,
    city: 'London',
    country: 'United Kingdom',
    location: {
      address: 'Community Centre, 142 Stockwell Road, London SW9 9TQ',
      lat: 51.4745,
      lng: -0.1182,
    },
    dates: {
      start: admin.firestore.Timestamp.fromDate(addDays(new Date(), 7)),
      end: admin.firestore.Timestamp.fromDate(addDays(new Date(), 97)),
    },
    time: {
      startTime: '16:00',
      duration: 2,
    },
    causeCategories: ['Education & Literacy', 'Children & Youth'],
    capacity: 12,
    currentBookings: 0,
    platformServiceFee: 15,
    totalFee: 15,
    recurring: true,
    recurrencePattern: 'weekly',
    recurrenceEndDate: admin.firestore.Timestamp.fromDate(addDays(new Date(), 97)),
    recurringGroupId: 'eng-tutoring-' + Date.now(),
    instantConfirmation: false,
    status: 'published',
    requirements: ['DBS check required', 'Minimum 3-month commitment', 'Teaching experience helpful but not required'],
    accessibility: 'Fully accessible venue with lift and accessible toilets.',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    title: 'Urban Community Garden Project',
    summary: 'Transform unused urban spaces into thriving community gardens. Learn sustainable gardening while building community connections.',
    description: `Join our vibrant community gardening initiative! We're converting a neglected urban lot into a flourishing community garden and food growing space.

**Activities Include:**
- Preparing soil beds and planting vegetables
- Building raised beds and composting systems
- Installing rainwater harvesting
- Painting murals and creating seating areas
- Planning workshops for local residents

**Perfect For:**
- Gardening enthusiasts or complete beginners
- Anyone interested in sustainability
- People wanting to meet neighbors
- Those seeking outdoor physical activity

**Benefits:**
- Learn organic gardening techniques
- Physical exercise in fresh air
- Take home fresh produce
- Free tea/coffee and homemade snacks
- Lovely community atmosphere

All tools and materials provided. Dress for getting muddy! This project brings together people of all ages and backgrounds to create a green oasis in the city.`,
    city: 'Manchester',
    country: 'United Kingdom',
    location: {
      address: 'Hulme Community Garden, Royce Road, Manchester M15 5TR',
      lat: 53.4646,
      lng: -2.2522,
    },
    dates: {
      start: admin.firestore.Timestamp.fromDate(addDays(new Date(), 21)),
      end: admin.firestore.Timestamp.fromDate(addDays(new Date(), 21)),
    },
    time: {
      startTime: '10:00',
      duration: 5,
    },
    causeCategories: ['Environment & Conservation', 'Community Development'],
    capacity: 20,
    currentBookings: 0,
    platformServiceFee: 15,
    totalFee: 15,
    recurring: false,
    instantConfirmation: true,
    status: 'published',
    requirements: ['Gardening gloves (or we can provide)', 'Outdoor clothing', 'Enthusiasm!'],
    accessibility: 'Mostly accessible. Some areas may be uneven ground. Wheelchair users please contact us in advance.',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    title: 'Food Bank Warehouse Support',
    summary: 'Help sort, pack, and distribute food parcels to families in need. Essential logistics support for our community food program.',
    description: `Be part of the solution to food insecurity! Our food bank provides emergency food supplies to hundreds of families each week.

**Volunteer Roles:**
- Receiving and sorting donated food items
- Checking expiry dates and food safety
- Packing personalized food parcels
- Organizing warehouse storage
- Loading delivery vans

**What Makes This Rewarding:**
- See direct impact on families struggling with food poverty
- Work alongside a dedicated team
- Learn about food distribution logistics
- Efficient, well-organized operation
- Friendly, inclusive atmosphere

**Practical Details:**
- Shifts available Monday-Saturday
- Morning (9am-1pm) or afternoon (1pm-5pm)
- Light physical activity - lifting boxes up to 10kg
- Full induction and training provided

Your time makes an immediate difference to people in crisis. Join our mission to ensure no one in our community goes hungry.`,
    city: 'Birmingham',
    country: 'United Kingdom',
    location: {
      address: 'Birmingham Food Bank, Unit 7, Saltley Business Park, Birmingham B8 1AA',
      lat: 52.4926,
      lng: -1.8591,
    },
    dates: {
      start: admin.firestore.Timestamp.fromDate(addDays(new Date(), 10)),
      end: admin.firestore.Timestamp.fromDate(addDays(new Date(), 100)),
    },
    time: {
      startTime: '09:00',
      duration: 4,
    },
    causeCategories: ['Poverty & Hunger', 'Community Development'],
    capacity: 15,
    currentBookings: 0,
    platformServiceFee: 15,
    totalFee: 15,
    recurring: true,
    recurrencePattern: 'weekly',
    recurrenceEndDate: admin.firestore.Timestamp.fromDate(addDays(new Date(), 100)),
    recurringGroupId: 'food-bank-' + Date.now(),
    instantConfirmation: true,
    status: 'published',
    requirements: ['Closed-toe shoes', 'Hair tied back (if long)', 'Ability to lift up to 10kg'],
    accessibility: 'Ground floor warehouse. Wide aisles. Accessible toilets. Not suitable for wheelchair users due to warehouse layout.',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    title: 'Elderly Companionship & Tech Support',
    summary: 'Combat loneliness by visiting seniors and helping them stay connected through technology. Share stories, play games, and teach digital skills.',
    description: `Make a profound difference in an older person's life! Social isolation affects many elderly people, and your companionship can brighten their week.

**What You'll Do:**
- Visit assigned elderly residents (30-90 minutes per visit)
- Have meaningful conversations over tea/coffee
- Play board games, cards, or puzzles
- Help with smartphones, tablets, or video calls
- Assist with emails and social media (if desired)
- Accompany on short walks (optional)

**Who We're Looking For:**
- Patient, empathetic individuals
- Good listeners with warm personalities
- Basic tech knowledge (smartphones/tablets)
- Reliable and punctual
- Available for weekly visits

**What You'll Gain:**
- Enriching intergenerational friendships
- Valuable life wisdom and stories
- Enhanced communication skills
- DBS check covered by us
- Regular volunteer support meetings

Build genuine connections that matter. Many volunteers say they gain as much as they give from these wonderful relationships.`,
    city: 'Edinburgh',
    country: 'United Kingdom',
    location: {
      address: 'Age Concern Edinburgh, 3 Causewayside, Edinburgh EH9 1QF',
      lat: 55.9375,
      lng: -3.1814,
    },
    dates: {
      start: admin.firestore.Timestamp.fromDate(addDays(new Date(), 14)),
      end: admin.firestore.Timestamp.fromDate(addDays(new Date(), 104)),
    },
    time: {
      startTime: '14:00',
      duration: 2,
    },
    causeCategories: ['Elderly Care', 'Health & Wellbeing'],
    capacity: 8,
    currentBookings: 0,
    platformServiceFee: 15,
    totalFee: 15,
    recurring: true,
    recurrencePattern: 'weekly',
    recurrenceEndDate: admin.firestore.Timestamp.fromDate(addDays(new Date(), 104)),
    recurringGroupId: 'elderly-companion-' + Date.now(),
    instantConfirmation: false,
    status: 'published',
    requirements: ['Enhanced DBS check required', 'Minimum 6-month commitment', 'Patience and empathy', 'Basic smartphone knowledge'],
    accessibility: 'Various locations. We match volunteers with local residents. Most homes are accessible.',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    title: 'Animal Shelter Dog Walking & Care',
    summary: 'Give rescue dogs exercise, love, and socialization. Help prepare them for their forever homes while enjoying the outdoors.',
    description: `Dog lovers needed! Our rescue shelter cares for 50+ dogs awaiting adoption. Your help ensures they get the exercise, attention, and training they need.

**Volunteer Activities:**
- Walk dogs individually or in small groups
- Basic training and socialization
- Cleaning kennels and feeding
- Playing and providing enrichment
- Helping at adoption events (optional)
- Taking photos for adoption profiles

**Requirements:**
- Confident handling dogs of all sizes
- Comfortable with nervous or energetic dogs
- Physically able to walk for 30-60 minutes
- Age 18+ (16+ with adult)
- Training provided - all levels welcome!

**Why Volunteer Here:**
- Spend time with adorable dogs
- Learn professional dog handling skills
- Help dogs become more adoptable
- Be part of their journey to new homes
- Beautiful countryside location
- Supportive, dog-loving community

Every walk helps a dog feel loved and increases their chances of finding a family. It's therapeutic for you and life-changing for them!`,
    city: 'Bristol',
    country: 'United Kingdom',
    location: {
      address: 'Bristol Animal Rescue Centre, Streamleaze, Shirehampton, Bristol BS11 0RP',
      lat: 51.4976,
      lng: -2.6789,
    },
    dates: {
      start: admin.firestore.Timestamp.fromDate(addDays(new Date(), 5)),
      end: admin.firestore.Timestamp.fromDate(addDays(new Date(), 5)),
    },
    time: {
      startTime: '10:00',
      duration: 3,
    },
    causeCategories: ['Animal Welfare', 'Environment & Conservation'],
    capacity: 25,
    currentBookings: 0,
    platformServiceFee: 15,
    totalFee: 15,
    recurring: false,
    instantConfirmation: true,
    status: 'published',
    requirements: ['Sturdy walking shoes', 'Weather-appropriate clothing', 'Dog handling confidence', 'No open-toed shoes'],
    accessibility: 'Outdoor rural location. Not wheelchair accessible due to muddy paths and fields.',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    title: 'Youth Mentoring & Sports Coaching',
    summary: 'Inspire young people through sports coaching and mentoring. Build confidence, teamwork, and healthy habits in at-risk youth.',
    description: `Be a positive role model! We work with young people (ages 11-16) from challenging backgrounds, using sports to teach life skills and build confidence.

**Your Role:**
- Coach football, basketball, or general fitness
- Mentor small groups or individuals
- Organize team-building activities
- Provide positive encouragement
- Be a consistent, reliable presence
- Help with equipment setup

**Ideal Volunteers:**
- Sports enthusiasts (any level)
- Patient and non-judgmental
- Positive attitude and high energy
- Understanding of youth challenges
- Coaching qualification helpful but not essential

**What We Offer:**
- Full safeguarding training
- Sports coaching workshops
- Regular supervision and support
- Opportunity for coaching qualifications
- DBS check arranged by us
- Incredibly rewarding experience

See young people blossom with the right support. Former participants often return as volunteer coaches themselves - the impact is lasting and profound.`,
    city: 'Leeds',
    country: 'United Kingdom',
    location: {
      address: 'Harehills Youth Centre, Harehills Lane, Leeds LS8 3PP',
      lat: 53.8142,
      lng: -1.5123,
    },
    dates: {
      start: admin.firestore.Timestamp.fromDate(addDays(new Date(), 12)),
      end: admin.firestore.Timestamp.fromDate(addDays(new Date(), 102)),
    },
    time: {
      startTime: '17:00',
      duration: 2,
    },
    causeCategories: ['Children & Youth', 'Sports & Recreation'],
    capacity: 10,
    currentBookings: 0,
    platformServiceFee: 15,
    totalFee: 15,
    recurring: true,
    recurrencePattern: 'weekly',
    recurrenceEndDate: admin.firestore.Timestamp.fromDate(addDays(new Date(), 102)),
    recurringGroupId: 'youth-mentoring-' + Date.now(),
    instantConfirmation: false,
    status: 'published',
    requirements: ['Enhanced DBS check', 'Sports clothing', 'Minimum 6-month commitment', 'Safeguarding training (provided)'],
    accessibility: 'Indoor sports hall and outdoor courts. Wheelchair accessible. Accessible changing rooms and toilets.',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    title: 'Homeless Outreach & Support',
    summary: 'Join our street outreach team providing essential supplies, conversation, and connection to services for rough sleepers.',
    description: `Be a lifeline for rough sleepers. Our outreach team walks the streets providing supplies, conversation, and pathways to support services.

**What You'll Do:**
- Walk designated routes with experienced staff
- Distribute hot drinks, food, and essential items
- Engage in respectful conversation
- Provide information about available services
- Record interactions for follow-up support
- Build trust and rapport over time

**Important Information:**
- Evening shifts (7pm-10pm)
- Always in pairs with a trained leader
- Full training in trauma-informed approach
- Comprehensive safety protocols
- Emotional support available

**Who Should Join:**
- Compassionate, non-judgmental people
- Good listeners and communicators
- Resilient and emotionally mature
- Interested in social justice
- Able to maintain boundaries

**Impact:**
Working directly with people in crisis is challenging but incredibly meaningful. Your presence says "you matter" to people often ignored by society. Many participants reconnect with services through these interactions.`,
    city: 'Liverpool',
    country: 'United Kingdom',
    location: {
      address: 'Whitechapel Centre, Langsdale Street, Liverpool L1 6BD',
      lat: 53.4084,
      lng: -2.9916,
    },
    dates: {
      start: admin.firestore.Timestamp.fromDate(addDays(new Date(), 20)),
      end: admin.firestore.Timestamp.fromDate(addDays(new Date(), 20)),
    },
    time: {
      startTime: '19:00',
      duration: 3,
    },
    causeCategories: ['Poverty & Hunger', 'Health & Wellbeing'],
    capacity: 12,
    currentBookings: 0,
    platformServiceFee: 15,
    totalFee: 15,
    recurring: false,
    instantConfirmation: false,
    status: 'published',
    requirements: ['Age 18+', 'Warm clothing', 'Walking shoes', 'Emotional resilience', 'Mandatory training session'],
    accessibility: 'Walking required. Not suitable for those with limited mobility. Routes cover several miles.',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    title: 'Festival Event Support & Sustainability',
    summary: 'Help run our annual community cultural festival. Roles in stewarding, information, recycling, and making the event magical!',
    description: `Be part of something special! Our annual multicultural festival celebrates diversity, arts, and community spirit. We need 200+ volunteers to make it happen!

**Available Roles:**
- **Stewards**: Welcome visitors, provide directions, manage crowds
- **Green Team**: Run recycling stations, promote sustainability
- **Info Point**: Answer questions, hand out programs
- **Kids Zone**: Support craft activities and face painting
- **Stage Crew**: Help with sound checks and artist liaison
- **Food Court**: Assist food vendors and manage queuing

**Festival Details:**
- Two-day event (Saturday & Sunday)
- 10,000+ expected attendees
- Live music, food, crafts, performances
- Family-friendly atmosphere
- Shifts: 4 hours (morning or afternoon)

**Volunteer Perks:**
- Free festival t-shirt
- Meal vouchers
- Access to volunteer rest area
- Free entry to festival when not volunteering
- Volunteer party after the event
- Certificate of participation

Join our festival family! It's hard work but incredibly fun, and you'll meet amazing people while supporting local arts and culture.`,
    city: 'Newcastle',
    country: 'United Kingdom',
    location: {
      address: 'Exhibition Park, Newcastle upon Tyne NE2 4PZ',
      lat: 54.9871,
      lng: -1.6073,
    },
    dates: {
      start: admin.firestore.Timestamp.fromDate(addDays(new Date(), 45)),
      end: admin.firestore.Timestamp.fromDate(addDays(new Date(), 46)),
    },
    time: {
      startTime: '09:00',
      duration: 4,
    },
    causeCategories: ['Arts & Culture', 'Community Development'],
    capacity: 50,
    currentBookings: 0,
    platformServiceFee: 15,
    totalFee: 15,
    recurring: false,
    instantConfirmation: true,
    status: 'published',
    requirements: ['Friendly and outgoing', 'Comfortable standing for 4 hours', 'Available for pre-event briefing (online)'],
    accessibility: 'Park has accessible paths. Various roles available for different abilities. Wheelchair users welcome.',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    title: 'Conservation Workday: Woodland Restoration',
    summary: 'Help restore native woodland by planting trees, clearing invasive species, and creating wildlife habitats in a beautiful nature reserve.',
    description: `Get your hands dirty for nature! Join our conservation team for a day of woodland restoration in a stunning ancient forest.

**Conservation Activities:**
- Planting native tree saplings (oak, ash, birch)
- Removing invasive species (rhododendron, laurel)
- Building wildlife habitats (log piles, bug hotels)
- Repairing footpaths and fencing
- Monitoring wildlife with camera traps

**Perfect For:**
- Nature lovers and outdoor enthusiasts
- Anyone wanting to learn conservation skills
- People seeking physical outdoor work
- Those interested in ecology and wildlife
- Beginners very welcome!

**What's Provided:**
- All tools and equipment
- Expert guidance from ecologist
- Tea/coffee and biscuits
- Vegetarian lunch included
- Gloves and safety equipment
- Species identification guides

**Physical Requirements:**
Moderate fitness needed. Activities involve bending, digging, and carrying. Work outdoors in all weather conditions.

Leave a lasting legacy for wildlife! The trees you plant today will stand for centuries, supporting countless species.`,
    city: 'Bath',
    country: 'United Kingdom',
    location: {
      address: 'Prior Park Woodland, Ralph Allen Drive, Bath BA2 5AH',
      lat: 51.3656,
      lng: -2.3463,
    },
    dates: {
      start: admin.firestore.Timestamp.fromDate(addDays(new Date(), 28)),
      end: admin.firestore.Timestamp.fromDate(addDays(new Date(), 28)),
    },
    time: {
      startTime: '09:30',
      duration: 6,
    },
    causeCategories: ['Environment & Conservation', 'Animal Welfare'],
    capacity: 18,
    currentBookings: 0,
    platformServiceFee: 15,
    totalFee: 15,
    recurring: false,
    instantConfirmation: true,
    status: 'published',
    requirements: ['Sturdy boots', 'Weather-proof clothing', 'Packed lunch (or order from us)', 'Work gloves if you have them', 'Moderate fitness'],
    accessibility: 'Rural woodland location. Uneven terrain. Not wheelchair accessible. Requires ability to walk, bend, and carry equipment.',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
];

async function clearAndSeedExperiences() {
  try {
    console.log('🗑️  Clearing existing experiences...\n');

    // Get all experiences
    const experiencesSnapshot = await db.collection('experiences').get();
    console.log(`Found ${experiencesSnapshot.size} existing experiences to delete`);

    // Delete in batches of 500 (Firestore limit)
    let batch = db.batch();
    let count = 0;

    for (const doc of experiencesSnapshot.docs) {
      batch.delete(doc.ref);
      count++;

      if (count % 500 === 0) {
        await batch.commit();
        batch = db.batch();
        console.log(`Deleted ${count} experiences...`);
      }
    }

    // Commit remaining deletes
    if (count % 500 !== 0) {
      await batch.commit();
    }

    console.log(`✅ Deleted ${count} existing experiences\n`);

    // Get or create a sample NGO
    console.log('🏢 Checking for NGO...\n');
    const ngosSnapshot = await db.collection('ngos').limit(1).get();
    
    let ngoId;
    if (ngosSnapshot.empty) {
      console.log('No NGO found. Creating sample NGO...');
      const newNgoRef = db.collection('ngos').doc();
      ngoId = newNgoRef.id;

      await newNgoRef.set({
        name: 'Community Volunteering Network UK',
        logoUrl: 'https://via.placeholder.com/200x200/21B3B1/FFFFFF?text=CVN',
        jurisdiction: 'United Kingdom',
        serviceLocations: ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Bristol', 'Leeds', 'Liverpool', 'Newcastle', 'Brighton', 'Bath'],
        description: 'We connect volunteers with meaningful opportunities across the UK, supporting communities through various social and environmental programs.',
        causes: ['Environment & Conservation', 'Education & Literacy', 'Children & Youth', 'Elderly Care', 'Animal Welfare', 'Poverty & Hunger', 'Community Development'],
        website: 'https://example.org',
        contactEmail: 'contact@cvn-uk.org',
        publicSlug: 'community-volunteering-network-uk',
        approved: true,
        createdBy: 'seed-script',
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      });

      console.log(`✅ Created sample NGO: ${ngoId}\n`);
    } else {
      ngoId = ngosSnapshot.docs[0].id;
      console.log(`✅ Using existing NGO: ${ngoId}\n`);
    }

    // Create mock experiences
    console.log('🌟 Creating mock experiences...\n');

    // Default images by category
    const defaultImages = {
      beach: ['https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800', 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800'],
      education: ['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800'],
      garden: ['https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'],
      food: ['https://images.unsplash.com/photo-1593113616828-48f90bb446b9?w=800', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800'],
      elderly: ['https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800'],
      dogs: ['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800'],
      youth: ['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800', 'https://images.unsplash.com/photo-1517164850305-99a3e65bb47e?w=800'],
      homeless: ['https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800', 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800'],
      festival: ['https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800', 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800'],
      woodland: ['https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800', 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800'],
    };

    const imageMapping = {
      'Beach Clean-Up & Marine Conservation': defaultImages.beach,
      'English Tutoring for Refugee Children': defaultImages.education,
      'Urban Community Garden Project': defaultImages.garden,
      'Food Bank Warehouse Support': defaultImages.food,
      'Elderly Companionship & Tech Support': defaultImages.elderly,
      'Animal Shelter Dog Walking & Care': defaultImages.dogs,
      'Youth Mentoring & Sports Coaching': defaultImages.youth,
      'Homeless Outreach & Support': defaultImages.homeless,
      'Festival Event Support & Sustainability': defaultImages.festival,
      'Conservation Workday: Woodland Restoration': defaultImages.woodland,
    };

    for (const experience of mockExperiences) {
      const expRef = db.collection('experiences').doc();
      await expRef.set({
        ...experience,
        images: imageMapping[experience.title] || [],
        ngoId,
      });
      console.log(`✅ Created: ${experience.title}`);
    }

    console.log(`\n🎉 Successfully created ${mockExperiences.length} mock experiences!\n`);
    console.log('Summary:');
    console.log(`- ${mockExperiences.filter(e => e.instantConfirmation).length} with instant confirmation`);
    console.log(`- ${mockExperiences.filter(e => e.recurring).length} recurring experiences`);
    console.log(`- ${mockExperiences.filter(e => !e.recurring).length} one-time experiences`);
    console.log(`- ${new Set(mockExperiences.flatMap(e => e.causeCategories)).size} different cause categories`);
    console.log(`- ${new Set(mockExperiences.map(e => e.city)).size} different cities\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

clearAndSeedExperiences();
