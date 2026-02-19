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
  {
    title: 'Teaching English Abroad: A 2-Hour Journey That Lasted Forever',
    slug: 'teaching-english-abroad-micro-volunteering',
    excerpt: 'How a single afternoon teaching English to refugee children in Athens became one of the most meaningful experiences of my life.',
    content: `
      <h2>The Classroom That Changed Everything</h2>
      <p>I walked into a small community center in Athens expecting to spend two hours practicing English with kids. I left with a perspective shift that continues to shape how I see the world.</p>

      <h3>Just Two Hours</h3>
      <p>That's all I had. Between museum visits and a sunset at the Acropolis, I squeezed in this micro-volunteering opportunity. The kids - ranging from 6 to 14, from Syria, Afghanistan, and beyond - were more excited to learn than any students I'd ever met.</p>

      <h3>Language is More Than Words</h3>
      <p>We played games, sang songs, and practiced conversations. But what struck me was how language represented hope to these children. English wasn't just vocabulary - it was a bridge to their futures.</p>

      <h3>The Thank You Note</h3>
      <p>Three months later, I received an email. One of the kids, Amira (10), had written me a short message in English: "Thank you teacher. I study every day. I will be doctor." That's when I understood - two hours can create ripples that last years.</p>

      <h3>Why Micro-Volunteering Works</h3>
      <p>You don't need weeks or months to make an impact. Sometimes, showing up for a few hours and giving your full attention is exactly what's needed. For me, for those kids, for that moment - it was enough.</p>

      <p><em>Looking for teaching opportunities? Browse our English tutoring and education experiences worldwide.</em></p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=600&fit=crop&q=80',
    category: 'Impact Stories',
    tags: ['teaching', 'education', 'refugees', 'personal-story'],
    published: true,
    publishedAt: new Date('2024-02-10'),
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    author: {
      id: 'admin',
      name: 'Michael Rodriguez',
      role: 'Volunteer & Language Teacher',
    },
    views: 312,
    readTime: 5,
  },
  {
    title: 'Zero Waste Travel: Combining Eco-Volunteering with Your Adventures',
    slug: 'zero-waste-travel-eco-volunteering',
    excerpt: 'Practical tips for sustainable travel through environmental micro-volunteering experiences.',
    content: `
      <h2>Travel Light, Impact Heavy</h2>
      <p>Can you travel sustainably while making a positive impact? Absolutely. Here's how environmental micro-volunteering can transform your trips into eco-friendly adventures.</p>

      <h3>Start with Beach Cleanups</h3>
      <p>Coastal destinations worldwide need help combating plastic pollution. A morning beach cleanup removes hundreds of pounds of waste while giving you a unique perspective on marine conservation.</p>

      <h3>Urban Gardening Projects</h3>
      <p>Cities from Berlin to Bangkok have community gardens that welcome volunteers. Spend an afternoon planting, weeding, or harvesting. You'll learn about urban agriculture and take home fresh, local produce.</p>

      <h3>Wildlife Conservation</h3>
      <p>Short conservation projects - monitoring sea turtles, bird counting, or invasive species removal - let you contribute to vital research without long-term commitments.</p>

      <h3>Reforestation Initiatives</h3>
      <p>Plant trees during your travels. Many organizations coordinate one-day planting events where you can help restore ecosystems and offset your travel carbon footprint.</p>

      <h3>Making It Work</h3>
      <ul>
        <li>Pack reusable items (water bottle, bags, utensils)</li>
        <li>Choose experiences near public transport</li>
        <li>Combine volunteering with exploring the area</li>
        <li>Share your journey to inspire others</li>
      </ul>

      <p><strong>Remember:</strong> Every small action counts. Your few hours of environmental work can inspire others and create lasting change.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&h=600&fit=crop&q=80',
    category: 'Sustainability',
    tags: ['environment', 'sustainability', 'eco-friendly', 'conservation'],
    published: true,
    publishedAt: new Date('2024-02-15'),
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
    author: {
      id: 'admin',
      name: 'Luna Green',
      role: 'Environmental Activist',
    },
    views: 267,
    readTime: 6,
  },
  {
    title: 'Skills-Based Volunteering: Your Professional Talents Meet Social Impact',
    slug: 'skills-based-volunteering-guide',
    excerpt: 'Discover how to leverage your professional skills for meaningful micro-volunteering experiences.',
    content: `
      <h2>Your Career Skills Can Change Lives</h2>
      <p>You've spent years developing professional expertise. What if you could use those skills to create social impact during your travels? Welcome to skills-based volunteering.</p>

      <h3>For Tech Professionals</h3>
      <p>Teach coding workshops, help NGOs set up websites, or provide digital literacy training. Your afternoon can empower communities with essential digital skills.</p>

      <h3>For Creative Professionals</h3>
      <p>Designers, photographers, and writers - your talents are needed. Help NGOs create marketing materials, document their work, or teach creative workshops to youth.</p>

      <h3>For Business Professionals</h3>
      <p>Offer business coaching to social enterprises, run financial literacy workshops, or help community organizations with strategic planning.</p>

      <h3>For Healthcare Professionals</h3>
      <p>While medical volunteering requires careful consideration, health education, first aid training, and wellness workshops are valuable short-term contributions.</p>

      <h3>For Language Experts</h3>
      <p>Translation services, language exchange sessions, or curriculum development for ESL programs - your linguistic skills open doors.</p>

      <h3>Finding the Right Match</h3>
      <p>Browse experiences by skill type, reach out to NGOs directly, or propose your own project. Organizations are often thrilled to receive specialized help.</p>

      <p><em>Your professional skills + travel curiosity + a few hours = transformative impact.</em></p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop&q=80',
    category: 'Volunteering Tips',
    tags: ['skills-based', 'professional', 'expertise', 'career'],
    published: true,
    publishedAt: new Date('2024-02-20'),
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
    author: {
      id: 'admin',
      name: 'Foreignteer Team',
      role: 'Admin',
    },
    views: 198,
    readTime: 5,
  },
  {
    title: 'Volunteering with Kids: Family-Friendly Micro-Experiences',
    slug: 'family-volunteering-with-kids',
    excerpt: 'How to introduce children to volunteering through age-appropriate, short-term experiences during family travel.',
    content: `
      <h2>Teaching Empathy Through Action</h2>
      <p>Want to raise globally-minded children? Family volunteering experiences create powerful teaching moments while traveling together.</p>

      <h3>Age-Appropriate Activities</h3>
      <p><strong>Ages 5-8:</strong> Animal shelter visits, park cleanups, food bank sorting. Simple tasks with visible impact.</p>
      <p><strong>Ages 9-12:</strong> Community gardens, art projects with local kids, sports coaching. Activities that involve teamwork and creativity.</p>
      <p><strong>Teens:</strong> Teaching workshops, construction projects, environmental surveys. Experiences that challenge and engage.</p>

      <h3>Benefits for Children</h3>
      <ul>
        <li>Develop empathy and global awareness</li>
        <li>Learn about different cultures firsthand</li>
        <li>Build confidence through helping others</li>
        <li>Create meaningful family memories</li>
        <li>Practice problem-solving in real situations</li>
      </ul>

      <h3>Tips for Success</h3>
      <p><strong>Start small:</strong> Choose 1-2 hour experiences for younger children.</p>
      <p><strong>Prepare together:</strong> Research the cause and discuss why you're helping.</p>
      <p><strong>Reflect afterwards:</strong> Talk about what they learned and felt.</p>
      <p><strong>Follow their interests:</strong> Love animals? Choose wildlife projects. Artistic? Pick creative workshops.</p>

      <h3>Safety First</h3>
      <p>Always verify experiences are family-friendly, check age requirements, and ensure adult supervision is provided.</p>

      <p><strong>Start your family volunteering journey today - these experiences become the stories they'll tell for decades.</strong></p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=600&fit=crop&q=80',
    category: 'Family Travel',
    tags: ['family', 'kids', 'children', 'parenting', 'education'],
    published: true,
    publishedAt: new Date('2024-02-25'),
    createdAt: new Date('2024-02-25'),
    updatedAt: new Date('2024-02-25'),
    author: {
      id: 'admin',
      name: 'Rachel Park',
      role: 'Family Travel Blogger',
    },
    views: 221,
    readTime: 6,
  },
  {
    title: 'From Volunteer to Friend: The Human Connections That Surprise You',
    slug: 'volunteer-friendships-human-connections',
    excerpt: 'The unexpected friendships that bloom when strangers come together for a common cause.',
    content: `
      <h2>The Gift of Connection</h2>
      <p>I signed up to help paint a community center in Porto. I left with three new friends and an invitation to a Portuguese wedding.</p>

      <h3>The Power of Shared Purpose</h3>
      <p>Something magical happens when people work together for a cause larger than themselves. Conversations flow naturally. Walls come down. Strangers become collaborators, then friends.</p>

      <h3>Cross-Cultural Bonds</h3>
      <p>During a tree-planting project in Kenya, I worked alongside locals, other travelers, and expats. We spoke different languages but shared the same mission. By lunch, we were teaching each other phrases and sharing life stories.</p>

      <h3>The Volunteer Network</h3>
      <p>Meet someone at a beach cleanup in Bali, reconnect in a hostel in Vietnam, coordinate future volunteering together in Thailand. The micro-volunteering community is surprisingly interconnected.</p>

      <h3>Staying Connected</h3>
      <p>I now have friends in 12 countries, all from volunteering experiences. We share updates, visit each other, and sometimes volunteer together again in new places.</p>

      <h3>More Than Networking</h3>
      <p>These aren't LinkedIn connections - they're genuine friendships forged through shared values and meaningful work. The best kind of travel souvenir.</p>

      <p><em>Come for the cause, stay for the connections. Micro-volunteering opens doors to authentic relationships that travel alone rarely provides.</em></p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200&h=600&fit=crop&q=80',
    category: 'Impact Stories',
    tags: ['community', 'friendship', 'connection', 'culture'],
    published: true,
    publishedAt: new Date('2024-03-01'),
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
    author: {
      id: 'admin',
      name: 'Tom Harrison',
      role: 'Digital Nomad',
    },
    views: 276,
    readTime: 4,
  },
  {
    title: 'The NGO Perspective: Why Micro-Volunteers Matter',
    slug: 'ngo-perspective-why-micro-volunteers-matter',
    excerpt: 'NGO leaders share how short-term volunteers create lasting impact for their organizations.',
    content: `
      <h2>Inside the Impact: What NGOs Really Think</h2>
      <p>We interviewed 15 NGO coordinators worldwide to understand how micro-volunteers contribute to their missions. The answers might surprise you.</p>

      <h3>Beyond the Hours</h3>
      <p>"It's not about getting 100 hours from one person," explains Maria from Green Earth Barcelona. "It's about 100 people giving one hour each. The diversity of perspectives, skills, and energy is invaluable."</p>

      <h3>Fresh Eyes, New Ideas</h3>
      <p>Volunteers bring outside perspectives that lead to innovation. A designer who helped for an afternoon redesigned our entire outreach strategy," shares Kofi from Youth Empowerment Kenya.</p>

      <h3>Spreading Awareness</h3>
      <p>Every volunteer becomes an ambassador. "When people go home and share their experience, our message reaches communities we could never access," notes Priya from Mumbai Education Initiative.</p>

      <h3>Manageable Commitment</h3>
      <p>"Short-term volunteering is easier to coordinate than long-term placements. We can plan specific projects, match skills to needs, and integrate help seamlessly," explains Carlos from Lima Community Kitchen.</p>

      <h3>The Multiplier Effect</h3>
      <p>Data shows volunteers often:</p>
      <ul>
        <li>Donate after their experience (43%)</li>
        <li>Return for another session (38%)</li>
        <li>Recommend the organization to others (89%)</li>
        <li>Share about it on social media (76%)</li>
      </ul>

      <h3>What NGOs Need</h3>
      <p>Reliability, enthusiasm, and respect for local communities. "We don't need heroes," says Sarah from Berlin Refugee Support. "We need people who show up, listen, and genuinely care."</p>

      <p><strong>Your few hours create ripples far beyond what you see. Trust the process.</strong></p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=600&fit=crop&q=80',
    category: 'For NGOs',
    tags: ['ngo', 'impact', 'organization', 'perspective'],
    published: true,
    publishedAt: new Date('2024-03-05'),
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05'),
    author: {
      id: 'admin',
      name: 'Foreignteer Team',
      role: 'Admin',
    },
    views: 145,
    readTime: 5,
  },
  {
    title: 'Solo Female Travel + Volunteering: Safety Tips & Empowering Experiences',
    slug: 'solo-female-travel-volunteering-safety',
    excerpt: 'A comprehensive guide to safe and empowering micro-volunteering experiences for solo female travelers.',
    content: `
      <h2>Traveling Solo, Volunteering Smart</h2>
      <p>As a solo female traveler who's volunteered in 20+ countries, I've learned that micro-volunteering can actually enhance your safety while creating incredible experiences.</p>

      <h3>Why Volunteering Makes Solo Travel Safer</h3>
      <p><strong>Instant community:</strong> You're immediately connected with vetted organizations and fellow volunteers.</p>
      <p><strong>Local knowledge:</strong> NGO staff can advise on safe areas and cultural norms.</p>
      <p><strong>Structured activities:</strong> Your time is organized, reducing solo wandering in unfamiliar areas.</p>

      <h3>Choosing Safe Experiences</h3>
      <ul>
        <li>Read reviews from other female volunteers</li>
        <li>Choose experiences in public, well-trafficked areas</li>
        <li>Look for organizations with female coordinators</li>
        <li>Start with daytime activities in your first country</li>
        <li>Join group experiences versus one-on-one placements</li>
      </ul>

      <h3>Essential Safety Practices</h3>
      <p>✓ Share your schedule with someone back home<br>
      ✓ Meet at the organization's official location<br>
      ✓ Trust your instincts - if something feels off, leave<br>
      ✓ Have offline maps and emergency contacts saved<br>
      ✓ Keep your accommodation and valuables separate from volunteer work</p>

      <h3>Empowering Experiences</h3>
      <p>Some of my most empowering moments came from volunteering:</p>
      <p>Teaching self-defense to girls in India. Supporting women's cooperatives in Morocco. Joining all-female beach cleanup crews in Indonesia. These experiences connected me with strong, inspiring women worldwide.</p>

      <h3>Building Confidence</h3>
      <p>Volunteering pushes you out of your comfort zone in controlled, supported ways. You'll return home braver, more confident, and deeply connected to global communities.</p>

      <p><em>Your gender doesn't limit your impact - embrace it. The world needs more women showing up, speaking up, and stepping up.</em></p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=600&fit=crop&q=80',
    category: 'Safety & Tips',
    tags: ['solo-travel', 'female', 'women', 'safety', 'empowerment'],
    published: true,
    publishedAt: new Date('2024-03-10'),
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
    author: {
      id: 'admin',
      name: 'Aisha Patel',
      role: 'Solo Travel Advocate',
    },
    views: 334,
    readTime: 7,
  },
  {
    title: 'Debunking Volunteering Myths: What Micro-Volunteering Really Is',
    slug: 'debunking-volunteering-myths',
    excerpt: 'Separating fact from fiction about short-term volunteering experiences.',
    content: `
      <h2>Let's Clear This Up</h2>
      <p>Micro-volunteering faces plenty of skepticism. Let's address the most common myths with honest facts.</p>

      <h3>Myth 1: "You Can't Make Real Impact in Just a Few Hours"</h3>
      <p><strong>Reality:</strong> Impact isn't measured only in time. A skilled graphic designer can create months of marketing materials in an afternoon. An English teacher can spark a child's lifelong love of learning in two hours. Focus on quality, not just quantity.</p>

      <h3>Myth 2: "Volunteers Take Jobs from Locals"</h3>
      <p><strong>Reality:</strong> Legitimate micro-volunteering fills gaps that wouldn't otherwise be filled - one-time events, overflow help, specialized skills. NGOs verify this. If an opportunity would replace paid work, it shouldn't be offered.</p>

      <h3>Myth 3: "It's Just Voluntourism in Disguise"</h3>
      <p><strong>Reality:</strong> Voluntourism often involves unskilled work in sensitive areas (orphanages, construction) for high fees. Micro-volunteering through Foreignteer:</p>
      <ul>
        <li>Matches skills to actual needs</li>
        <li>Involves vetted, established NGOs</li>
        <li>Focuses on appropriate, short-term tasks</li>
        <li>Keeps fees minimal (covering platform costs only)</li>
      </ul>

      <h3>Myth 4: "You Need Special Skills or Training"</h3>
      <p><strong>Reality:</strong> Many experiences welcome enthusiasm over expertise. Beach cleanups, community gardening, and event support need willing hands, not credentials.</p>

      <h3>Myth 5: "It's More About the Volunteer Than the Community"</h3>
      <p><strong>Reality:</strong> When done right, it's mutual benefit. Communities get needed help, volunteers gain perspective. Both sides learn. That's not selfish - that's human exchange.</p>

      <h3>Myth 6: "Just Donate Money Instead"</h3>
      <p><strong>Reality:</strong> Money is crucial, AND hands-on help matters. Some needs require physical presence. Plus, volunteers often donate after experiencing the work firsthand.</p>

      <h3>The Truth?</h3>
      <p>Micro-volunteering isn't perfect, but when matched appropriately to community needs, it creates genuine value for everyone involved.</p>

      <p><strong>Do your research, choose responsibly, volunteer humbly. That's all anyone asks.</strong></p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop&q=80',
    category: 'Volunteering Tips',
    tags: ['myths', 'facts', 'ethics', 'responsible-travel'],
    published: true,
    publishedAt: new Date('2024-03-15'),
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
    author: {
      id: 'admin',
      name: 'Dr. James Wilson',
      role: 'International Development Consultant',
    },
    views: 289,
    readTime: 6,
  },
  {
    title: 'Digital Nomads Give Back: Balancing Remote Work with Local Impact',
    slug: 'digital-nomads-volunteering-guide',
    excerpt: 'How remote workers can integrate meaningful volunteering into their location-independent lifestyle.',
    content: `
      <h2>Work From Anywhere, Help Everywhere</h2>
      <p>Being a digital nomad means freedom and flexibility. It can also mean purpose and community through micro-volunteering.</p>

      <h3>The Digital Nomad Advantage</h3>
      <p>Unlike traditional travelers, you're staying put for weeks or months. This lets you:</p>
      <ul>
        <li>Build ongoing relationships with local NGOs</li>
        <li>Volunteer regularly without long commitments</li>
        <li>Use your professional skills for maximum impact</li>
        <li>Integrate into local communities authentically</li>
      </ul>

      <h3>Finding Your Rhythm</h3>
      <p><strong>Weekly commitment:</strong> Choose a recurring Thursday afternoon slot helping the same organization.</p>
      <p><strong>Project-based:</strong> Dedicate weekend days to specific projects (website builds, workshop facilitation).</p>
      <p><strong>Flexible:</strong> Book experiences around your work schedule, canceling only when absolutely necessary.</p>

      <h3>Top Opportunities for Digital Nomads</h3>
      <p><strong>Tech skills:</strong> Code education, digital literacy, website development for NGOs.</p>
      <p><strong>Business skills:</strong> Marketing strategy, social media management, business planning workshops.</p>
      <p><strong>Teaching:</strong> English conversation practice, professional skill workshops, mentoring programs.</p>

      <h3>The Social Benefit</h3>
      <p>Working remotely can be isolating. Volunteering provides:</p>
      <ul>
        <li>Face-to-face human interaction</li>
        <li>Purpose beyond your paycheck</li>
        <li>Local friends and community connections</li>
        <li>Break from screen time</li>
        <li>Mental health boost through helping others</li>
      </ul>

      <h3>Making It Work</h3>
      <p>Block volunteer time in your calendar like a meeting. Treat it with the same commitment. Your work can happen anywhere, but local impact only happens when you show up.</p>

      <h3>Tax Considerations</h3>
      <p>Some countries offer tax deductions for volunteer work. Consult your accountant about tracking your contributions.</p>

      <p><em>Location independence + local impact = the digital nomad lifestyle at its best.</em></p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop&q=80',
    category: 'Digital Nomad',
    tags: ['digital-nomad', 'remote-work', 'coworking', 'location-independent'],
    published: true,
    publishedAt: new Date('2024-03-20'),
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-20'),
    author: {
      id: 'admin',
      name: 'Nina Schmidt',
      role: 'Digital Nomad & Developer',
    },
    views: 192,
    readTime: 5,
  },
  {
    title: 'After the Experience: How to Stay Involved from Afar',
    slug: 'staying-involved-after-volunteering',
    excerpt: 'Practical ways to continue supporting the causes and communities you discovered through micro-volunteering.',
    content: `
      <h2>The Journey Doesn't End When You Leave</h2>
      <p>You've had an amazing micro-volunteering experience. Now you're back home, thousands of miles away. How do you stay connected?</p>

      <h3>1. Monthly Micro-Donations</h3>
      <p>Even £5-10 monthly makes a difference. Set up recurring donations to the NGO you volunteered with. It's the price of two coffees and funds ongoing work.</p>

      <h3>2. Remote Volunteering</h3>
      <p>Offer your skills from home:</p>
      <ul>
        <li>Social media management</li>
        <li>Grant writing and research</li>
        <li>Graphic design and branding</li>
        <li>Virtual tutoring or mentoring</li>
        <li>Translation services</li>
        <li>Website maintenance</li>
      </ul>

      <h3>3. Become an Ambassador</h3>
      <p>Share your experience! Write blog posts, post on social media, speak at local events. Every person you inspire might become the next volunteer.</p>

      <h3>4. Fundraise Creatively</h3>
      <p>Birthday fundraisers on Facebook, charity runs, bake sales - channel your passion into raising awareness and funds.</p>

      <h3>5. Skill-Building for Future Impact</h3>
      <p>Learn skills that could help on future trips: Basic first aid, teaching certification, language learning, photography for documentation.</p>

      <h3>6. Connect Others</h3>
      <p>Friends traveling to that city? Connect them with the NGO. You become a bridge between your community and theirs.</p>

      <h3>7. Return Visits</h3>
      <p>Plan your next trip around volunteering again. Many organizations love seeing familiar faces return.</p>

      <h3>8. Join Alumni Networks</h3>
      <p>Some organizations have volunteer alumni groups. Stay connected, share updates, collaborate on initiatives.</p>

      <h3>The Ripple Effect</h3>
      <p>Your continued engagement, even small actions, shows the NGO that their work matters. It motivates them, funds their projects, and creates lasting global connections.</p>

      <p><strong>You volunteered for a day. Your impact can last a lifetime.</strong></p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200&h=600&fit=crop&q=80',
    category: 'Impact & Giving',
    tags: ['long-term-impact', 'remote-volunteering', 'fundraising', 'connection'],
    published: true,
    publishedAt: new Date('2024-03-25'),
    createdAt: new Date('2024-03-25'),
    updatedAt: new Date('2024-03-25'),
    author: {
      id: 'admin',
      name: 'Foreignteer Team',
      role: 'Admin',
    },
    views: 167,
    readTime: 5,
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
