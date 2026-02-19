import Link from 'next/link';
import Image from 'next/image';
import {
  Building2,
  Calendar,
  Users,
  CheckCircle,
  Users2,
  LayoutDashboard,
  Mail,
  Crown,
  User,
  Plus,
  Eye,
  Trash2,
  ArrowRight,
  Info,
  AlertTriangle,
  Lightbulb,
  Clock,
  FileText,
  Star,
  MapPin,
  ChevronRight,
  Lock,
  Upload,
  Send,
  UserPlus,
  ClipboardCheck,
} from 'lucide-react';

// ─── Reusable layout components ───────────────────────────────────────────────

function SectionHeader({
  number,
  icon: Icon,
  title,
  subtitle,
}: {
  number: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-5 mb-8">
      <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-[#21B3B1] flex items-center justify-center shadow-md">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <div>
        <p className="text-xs font-bold tracking-widest text-[#21B3B1] uppercase mb-0.5">
          Section {number}
        </p>
        <h2 className="text-2xl font-bold text-[#4A4A4A]">{title}</h2>
        <p className="text-[#7A7A7A] mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-[#21B3B1] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
          {number}
        </div>
        <div className="w-0.5 bg-[#E6EAEA] flex-1 mt-2 mb-0" />
      </div>
      <div className="pb-8 flex-1">
        <h4 className="font-semibold text-[#4A4A4A] mb-2">{title}</h4>
        <div className="text-sm text-[#7A7A7A] space-y-2">{children}</div>
      </div>
    </div>
  );
}

function StepLast({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-5">
      <div className="flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-[#21B3B1] text-white flex items-center justify-center font-bold text-sm">
          {number}
        </div>
      </div>
      <div className="pb-4 flex-1">
        <h4 className="font-semibold text-[#4A4A4A] mb-2">{title}</h4>
        <div className="text-sm text-[#7A7A7A] space-y-2">{children}</div>
      </div>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 bg-[#C9F0EF] border border-[#21B3B1]/30 rounded-xl px-4 py-3 my-4 text-sm text-[#4A4A4A]">
      <Info className="w-4 h-4 text-[#21B3B1] flex-shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 bg-[#FFF3CD] border border-[#F2B56B] rounded-xl px-4 py-3 my-4 text-sm text-[#4A4A4A]">
      <AlertTriangle className="w-4 h-4 text-[#F2B56B] flex-shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 bg-[#FAF5EC] border border-[#F6C98D] rounded-xl px-4 py-3 my-4 text-sm text-[#4A4A4A]">
      <Lightbulb className="w-4 h-4 text-[#F6C98D] flex-shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}

// Visual mock of the sidebar navigation
function SidebarMock({ active }: { active: string }) {
  const links = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'My Experiences', icon: Calendar },
    { label: 'Applicants', icon: Users },
    { label: 'Attendance', icon: CheckCircle },
    { label: 'NGO Profile', icon: Building2 },
    { label: 'Team', icon: Users2 },
  ];
  return (
    <div className="bg-white border border-[#E6EAEA] rounded-xl overflow-hidden w-48 flex-shrink-0 shadow-sm">
      <div className="bg-[#21B3B1] px-4 py-3">
        <p className="text-white text-xs font-bold">NGO Portal</p>
      </div>
      {links.map(({ label, icon: Icon }) => (
        <div
          key={label}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs ${
            label === active
              ? 'bg-[#21B3B1] text-white'
              : 'text-[#4A4A4A] border-b border-[#E6EAEA]/60'
          }`}
        >
          <Icon className="w-3.5 h-3.5 flex-shrink-0" />
          {label}
        </div>
      ))}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function NGOUserManual() {
  return (
    <div className="min-h-screen bg-[#FAF5EC]">
      {/* ── Cover ──────────────────────────────────────────────────────────── */}
      <div className="bg-[#21B3B1] text-white">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <Link href="/" className="inline-block mb-8 opacity-80 hover:opacity-100 transition-opacity">
            <Image
              src="/images/foreignteer-logo.png"
              alt="Foreignteer"
              width={160}
              height={46}
              className="brightness-0 invert"
            />
          </Link>
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="text-[#C9F0EF] text-sm font-semibold tracking-wider uppercase mb-2">
                Official Guide
              </p>
              <h1 className="text-4xl font-bold mb-3">NGO User Manual</h1>
              <p className="text-white/80 text-lg max-w-xl">
                Everything you need to manage your organisation, create volunteering experiences,
                and collaborate with your team on Foreignteer.
              </p>
            </div>
          </div>

          {/* Quick-nav badges */}
          <div className="flex flex-wrap gap-2 mt-10">
            {[
              'Getting Started',
              'Dashboard',
              'Experiences',
              'Applicants',
              'Attendance',
              'Team',
              'NGO Profile',
            ].map((label, i) => (
              <a
                key={label}
                href={`#section-${i + 1}`}
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 transition-colors text-white text-sm px-4 py-1.5 rounded-full"
              >
                <span className="text-[#C9F0EF] font-mono text-xs">{i + 1}</span>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Contents ───────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">

        {/* ══ SECTION 1 — Getting Started ════════════════════════════════════ */}
        <section id="section-1">
          <SectionHeader
            number="1"
            icon={Building2}
            title="Getting Started"
            subtitle="How to register your organisation and get your account approved"
          />

          {/* Registration form visual */}
          <div className="bg-white rounded-2xl border border-[#E6EAEA] p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#4A4A4A] text-sm">
                Register Your Organisation
              </h3>
              <span className="text-xs bg-[#C9F0EF] text-[#168E8C] px-2 py-0.5 rounded-full">
                foreignteer.com/register/ngo
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                'Contact Name',
                'Email Address',
                'Organisation Name',
                'Entity Type',
                'Jurisdiction (Country)',
                'Service Locations',
                'Contact Email',
                'Cause Categories',
              ].map((field) => (
                <div key={field} className="h-8 bg-[#FAF5EC] rounded border border-[#E6EAEA] flex items-center px-3">
                  <span className="text-xs text-[#8FA6A1]">{field}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 h-9 bg-[#21B3B1] rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-semibold">Submit Registration</span>
            </div>
          </div>

          <Step number={1} title="Go to the registration page">
            <p>
              Visit{' '}
              <code className="bg-[#E6EAEA] px-1.5 py-0.5 rounded text-xs font-mono">
                foreignteer.com/register/ngo
              </code>{' '}
              or click <strong>Partner With Us</strong> on the homepage.
            </p>
          </Step>

          <Step number={2} title="Fill in your account details">
            <p>Enter your <strong>name</strong>, <strong>email address</strong>, and a <strong>password</strong>. These will be your login credentials.</p>
          </Step>

          <Step number={3} title="Fill in your organisation details">
            <p>Provide your NGO's information:</p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li><strong>Organisation Name</strong> — the official name</li>
              <li><strong>Entity Type</strong> — e.g. Registered Charity, Non-Profit</li>
              <li><strong>Jurisdiction</strong> — the country where you are registered</li>
              <li><strong>Service Locations</strong> — countries/regions where you operate</li>
              <li><strong>Cause Categories</strong> — the causes your NGO supports</li>
              <li><strong>Contact Email</strong> — public-facing email for volunteers</li>
            </ul>
          </Step>

          <Step number={4} title="Verify your email address">
            <p>
              Check your inbox for a <strong>verification email</strong> from Foreignteer and click the link inside.
              The link expires in <strong>24 hours</strong>.
            </p>
          </Step>

          <StepLast number={5} title="Wait for admin approval">
            <p>
              Your registration is sent to the Foreignteer team for review. You will receive an email
              once your organisation is <strong>approved</strong>. This usually takes 1–3 business days.
            </p>
          </StepLast>

          {/* Status flow diagram */}
          <div className="bg-white rounded-2xl border border-[#E6EAEA] p-5 mt-2 shadow-sm">
            <p className="text-xs font-semibold text-[#7A7A7A] mb-4 uppercase tracking-wider">Registration status flow</p>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { label: 'Registered', color: 'bg-[#E6EAEA] text-[#7A7A7A]' },
                { label: 'Email Verified', color: 'bg-[#C9F0EF] text-[#168E8C]' },
                { label: 'Under Review', color: 'bg-[#FFF3CD] text-[#8B6914]' },
                { label: 'Approved ✓', color: 'bg-[#6FB7A4] text-white' },
              ].map((s, i, arr) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${s.color}`}>
                    {s.label}
                  </span>
                  {i < arr.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-[#8FA6A1]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Warning>
            <strong>Not approved yet?</strong> Check your spam folder for the verification email. If
            your application is rejected, you will receive the reason by email and can update your
            profile to resubmit.
          </Warning>
        </section>

        {/* ══ SECTION 2 — Dashboard Overview ═════════════════════════════════ */}
        <section id="section-2">
          <SectionHeader
            number="2"
            icon={LayoutDashboard}
            title="Your Dashboard"
            subtitle="Understanding the NGO Portal and how to navigate it"
          />

          {/* Dashboard layout diagram */}
          <div className="bg-white rounded-2xl border border-[#E6EAEA] overflow-hidden shadow-sm mb-6">
            <div className="bg-[#4A4A4A] px-5 py-2 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-white/60 font-mono">foreignteer.com/dashboard/ngo</span>
            </div>
            <div className="flex">
              <SidebarMock active="Dashboard" />
              <div className="flex-1 p-5 space-y-3 bg-[#FAF5EC]">
                <p className="text-xs font-semibold text-[#4A4A4A]">Welcome back, Green Earth NGO</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Active Experiences', val: '4', color: 'bg-[#C9F0EF]' },
                    { label: 'Total Applicants', val: '27', color: 'bg-[#FAF5EC] border border-[#E6EAEA]' },
                    { label: 'This Month', val: '8', color: 'bg-[#F6C98D]/30 border border-[#F6C98D]/50' },
                  ].map((c) => (
                    <div key={c.label} className={`${c.color} rounded-lg p-2.5`}>
                      <p className="text-lg font-bold text-[#21B3B1]">{c.val}</p>
                      <p className="text-[10px] text-[#7A7A7A]">{c.label}</p>
                    </div>
                  ))}
                </div>
                <div className="h-16 bg-white rounded-lg border border-[#E6EAEA] flex items-center justify-center">
                  <p className="text-[10px] text-[#8FA6A1]">Recent activity feed</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              {
                icon: LayoutDashboard,
                label: 'Dashboard',
                desc: 'Overview of your stats, recent activity, and quick links.',
              },
              {
                icon: Calendar,
                label: 'My Experiences',
                desc: 'Create, edit, and manage your volunteering experiences.',
              },
              {
                icon: Users,
                label: 'Applicants',
                desc: 'Review volunteer applications for all your experiences.',
              },
              {
                icon: CheckCircle,
                label: 'Attendance',
                desc: 'Mark volunteers as attended or absent after an experience.',
              },
              {
                icon: Building2,
                label: 'NGO Profile',
                desc: 'Edit your organisation details, logo, and causes (Owner only).',
              },
              {
                icon: Users2,
                label: 'Team',
                desc: 'Invite staff, manage roles, and remove team members.',
              },
            ].map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="flex gap-3 bg-white border border-[#E6EAEA] rounded-xl p-4 shadow-sm"
              >
                <div className="w-9 h-9 rounded-lg bg-[#C9F0EF] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4.5 h-4.5 text-[#21B3B1]" style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#4A4A4A]">{label}</p>
                  <p className="text-xs text-[#7A7A7A] mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Note>
            <strong>Staff members</strong> can see all sidebar items, but the <strong>NGO Profile</strong> and{' '}
            <strong>Team</strong> management are restricted to <strong>Owners</strong>. See Section 6 for details on roles.
          </Note>
        </section>

        {/* ══ SECTION 3 — Creating Experiences ═══════════════════════════════ */}
        <section id="section-3">
          <SectionHeader
            number="3"
            icon={Calendar}
            title="Creating Experiences"
            subtitle="How to publish a volunteering opportunity on Foreignteer"
          />

          {/* Create experience form mockup */}
          <div className="bg-white rounded-2xl border border-[#E6EAEA] overflow-hidden shadow-sm mb-6">
            <div className="bg-[#4A4A4A] px-5 py-2 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-white/60 font-mono">dashboard/ngo/experiences/create</span>
            </div>
            <div className="flex">
              <SidebarMock active="My Experiences" />
              <div className="flex-1 p-5 bg-[#FAF5EC] space-y-2">
                <p className="text-xs font-bold text-[#4A4A4A]">Create New Experience</p>
                {[
                  'Experience Title',
                  'Description',
                  'Location (Country / City)',
                  'Start Date — End Date',
                  'Duration (hours)',
                  'Maximum Volunteers',
                  'Cause Categories',
                  'Skills Required',
                  'Fee (£)',
                ].map((f) => (
                  <div key={f} className="h-6 bg-white rounded border border-[#E6EAEA] flex items-center px-2">
                    <span className="text-[10px] text-[#8FA6A1]">{f}</span>
                  </div>
                ))}
                <div className="flex gap-2 pt-1">
                  <div className="flex-1 h-7 bg-[#E6EAEA] rounded-lg flex items-center justify-center">
                    <span className="text-[10px] text-[#7A7A7A] font-medium">Save Draft</span>
                  </div>
                  <div className="flex-1 h-7 bg-[#21B3B1] rounded-lg flex items-center justify-center">
                    <span className="text-[10px] text-white font-medium">Submit for Review</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Step number={1} title='Go to "My Experiences" in the sidebar'>
            <p>Click <strong>My Experiences</strong> from the left-hand navigation.</p>
          </Step>

          <Step number={2} title='Click "Create New Experience"'>
            <p>Press the <strong>+ Create New Experience</strong> button at the top right of the page.</p>
          </Step>

          <Step number={3} title="Fill in the experience details">
            <p>Complete all required fields (marked with *):</p>
            <div className="mt-2 space-y-1">
              {[
                ['Title', 'A short, descriptive name for the experience'],
                ['Description', 'What volunteers will do and what they will learn'],
                ['Location', 'Country and city'],
                ['Dates', 'Start and end dates (or "Flexible" if recurring)'],
                ['Duration', 'How many hours is the experience?'],
                ['Max Volunteers', 'How many can participate per session?'],
                ['Cause Categories', 'Which causes does this experience serve?'],
                ['Fee', 'Leave at £0 if free for volunteers'],
              ].map(([field, hint]) => (
                <div key={field} className="flex gap-2 items-start">
                  <ArrowRight className="w-3.5 h-3.5 text-[#21B3B1] flex-shrink-0 mt-0.5" />
                  <p>
                    <strong>{field}:</strong> {hint}
                  </p>
                </div>
              ))}
            </div>
          </Step>

          <Step number={4} title="Save as draft or submit for review">
            <p>
              <strong>Save Draft</strong> — saves your work without publishing. Only visible to your NGO team.
            </p>
            <p>
              <strong>Submit for Review</strong> — sends the experience to the Foreignteer admin team.
              Once approved, it becomes visible to volunteers.
            </p>
          </Step>

          <StepLast number={5} title="Experience is approved and goes live">
            <p>
              You will receive an email when your experience is approved or if changes are requested.
              Approved experiences appear on the <strong>Experiences</strong> browse page immediately.
            </p>
          </StepLast>

          {/* Status flow */}
          <div className="bg-white rounded-2xl border border-[#E6EAEA] p-5 mt-2 shadow-sm">
            <p className="text-xs font-semibold text-[#7A7A7A] mb-4 uppercase tracking-wider">Experience status flow</p>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { label: 'Draft', color: 'bg-[#E6EAEA] text-[#7A7A7A]' },
                { label: 'Pending Review', color: 'bg-[#FFF3CD] text-[#8B6914]' },
                { label: 'Published ✓', color: 'bg-[#6FB7A4] text-white' },
              ].map((s, i, arr) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${s.color}`}>
                    {s.label}
                  </span>
                  {i < arr.length - 1 && <ChevronRight className="w-4 h-4 text-[#8FA6A1]" />}
                </div>
              ))}
            </div>
          </div>

          <Tip>
            You can edit a <strong>Published</strong> experience at any time from the experience detail page.
            Minor edits (typos, date updates) don't require re-approval.
          </Tip>
        </section>

        {/* ══ SECTION 4 — Managing Applicants ════════════════════════════════ */}
        <section id="section-4">
          <SectionHeader
            number="4"
            icon={Users}
            title="Managing Applicants"
            subtitle="Reviewing and accepting volunteer applications"
          />

          {/* Applicants table mockup */}
          <div className="bg-white rounded-2xl border border-[#E6EAEA] overflow-hidden shadow-sm mb-6">
            <div className="bg-[#4A4A4A] px-5 py-2 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-white/60 font-mono">dashboard/ngo/applicants</span>
            </div>
            <div className="flex">
              <SidebarMock active="Applicants" />
              <div className="flex-1 p-4 bg-[#FAF5EC]">
                <p className="text-xs font-bold text-[#4A4A4A] mb-3">Volunteer Applications</p>
                <div className="bg-white rounded-lg border border-[#E6EAEA] overflow-hidden">
                  <div className="grid grid-cols-4 gap-2 px-3 py-1.5 bg-[#FAF5EC] border-b border-[#E6EAEA]">
                    {['Volunteer', 'Experience', 'Applied', 'Status'].map((h) => (
                      <span key={h} className="text-[9px] font-bold text-[#7A7A7A] uppercase">{h}</span>
                    ))}
                  </div>
                  {[
                    ['Jane D.', 'Beach Cleanup', 'Jan 12', 'pending'],
                    ['Mark T.', 'Tree Planting', 'Jan 14', 'confirmed'],
                    ['Sara L.', 'Beach Cleanup', 'Jan 15', 'pending'],
                  ].map(([name, exp, date, status]) => (
                    <div key={name} className="grid grid-cols-4 gap-2 px-3 py-2 border-b border-[#E6EAEA]/60 items-center">
                      <span className="text-[10px] text-[#4A4A4A] font-medium">{name}</span>
                      <span className="text-[9px] text-[#7A7A7A]">{exp}</span>
                      <span className="text-[9px] text-[#7A7A7A]">{date}</span>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full w-fit ${
                        status === 'confirmed'
                          ? 'bg-[#6FB7A4]/20 text-[#6FB7A4]'
                          : 'bg-[#FFF3CD] text-[#8B6914]'
                      }`}>
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Step number={1} title='Open "Applicants" in the sidebar'>
            <p>Click <strong>Applicants</strong> to see all pending and confirmed bookings.</p>
          </Step>

          <Step number={2} title="Filter by experience (optional)">
            <p>Use the experience filter dropdown to show applicants for a specific experience only.</p>
          </Step>

          <Step number={3} title="Review each applicant">
            <p>Click on a volunteer's name to view their full profile including:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>Skills and languages</li>
              <li>Volunteering experience level</li>
              <li>Country of origin</li>
              <li>Any special requirements</li>
            </ul>
          </Step>

          <StepLast number={4} title="Confirm or decline">
            <p>
              Click <strong>Confirm</strong> to accept the volunteer. They will be notified by email.
              Click <strong>Decline</strong> to reject — the volunteer will also be notified.
            </p>
          </StepLast>

          <Note>
            Applicants with a <strong>Pending</strong> status have paid (if applicable) but haven't been
            confirmed yet. Try to respond within <strong>48 hours</strong> to give a good volunteer experience.
          </Note>
        </section>

        {/* ══ SECTION 5 — Attendance ══════════════════════════════════════════ */}
        <section id="section-5">
          <SectionHeader
            number="5"
            icon={ClipboardCheck}
            title="Tracking Attendance"
            subtitle="Marking volunteers as attended after the experience takes place"
          />

          <div className="bg-white rounded-2xl border border-[#E6EAEA] overflow-hidden shadow-sm mb-6">
            <div className="bg-[#4A4A4A] px-5 py-2 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-white/60 font-mono">dashboard/ngo/attendance</span>
            </div>
            <div className="flex">
              <SidebarMock active="Attendance" />
              <div className="flex-1 p-4 bg-[#FAF5EC]">
                <p className="text-xs font-bold text-[#4A4A4A] mb-3">Attendance — Beach Cleanup, 20 Jan</p>
                <div className="space-y-2">
                  {[
                    ['Jane D.', true],
                    ['Mark T.', false],
                    ['Sara L.', true],
                  ].map(([name, attended]) => (
                    <div key={String(name)} className="flex items-center justify-between bg-white border border-[#E6EAEA] rounded-lg px-3 py-2">
                      <span className="text-[10px] font-medium text-[#4A4A4A]">{String(name)}</span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${attended ? 'bg-[#6FB7A4]' : 'bg-[#E6EAEA]'}`}>
                        {attended && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Step number={1} title='Go to "Attendance" in the sidebar'>
            <p>Click <strong>Attendance</strong> to see experiences that have passed and need attendance logged.</p>
          </Step>

          <Step number={2} title="Select the experience">
            <p>Choose the specific experience from the list of completed sessions.</p>
          </Step>

          <Step number={3} title="Mark each volunteer">
            <p>
              Tick the checkbox next to each volunteer who attended. Leave unchecked for no-shows.
            </p>
          </Step>

          <StepLast number={4} title="Save attendance">
            <p>
              Click <strong>Save</strong>. Attendance is recorded and contributes to volunteers'
              impact statistics on their profile.
            </p>
          </StepLast>

          <Tip>
            Attendance records help volunteers track their volunteering hours and countries visited.
            Please fill these in promptly after each experience.
          </Tip>
        </section>

        {/* ══ SECTION 6 — Team Management ════════════════════════════════════ */}
        <section id="section-6">
          <SectionHeader
            number="6"
            icon={Users2}
            title="Team Management"
            subtitle="Invite staff, manage roles, and collaborate on your NGO"
          />

          {/* Role comparison */}
          <div className="bg-white rounded-2xl border border-[#E6EAEA] p-6 mb-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#4A4A4A] mb-4">Team Roles at a Glance</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Owner */}
              <div className="bg-[#F6C98D]/15 border border-[#F6C98D]/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#F6C98D]/40 flex items-center justify-center">
                    <Crown className="w-4 h-4 text-[#8B6914]" />
                  </div>
                  <span className="text-sm font-bold text-[#8B6914]">Owner</span>
                </div>
                <ul className="space-y-1.5">
                  {[
                    'Edit NGO Profile',
                    'Manage team members',
                    'Invite / remove staff',
                    'Create experiences',
                    'View & confirm applicants',
                    'Track attendance',
                    'View dashboard stats',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-[#4A4A4A]">
                      <CheckCircle className="w-3.5 h-3.5 text-[#6FB7A4] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Staff */}
              <div className="bg-[#C9F0EF]/40 border border-[#21B3B1]/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#C9F0EF] flex items-center justify-center">
                    <User className="w-4 h-4 text-[#168E8C]" />
                  </div>
                  <span className="text-sm font-bold text-[#168E8C]">Staff</span>
                </div>
                <ul className="space-y-1.5">
                  {[
                    ['Edit NGO Profile', false],
                    ['Manage team members', false],
                    ['Invite / remove staff', false],
                    ['Create experiences', true],
                    ['View & confirm applicants', true],
                    ['Track attendance', true],
                    ['View dashboard stats', true],
                  ].map(([item, allowed]) => (
                    <li key={String(item)} className="flex items-center gap-2 text-xs text-[#4A4A4A]">
                      {allowed ? (
                        <CheckCircle className="w-3.5 h-3.5 text-[#6FB7A4] flex-shrink-0" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-[#E6EAEA] flex-shrink-0" />
                      )}
                      <span className={!allowed ? 'text-[#8FA6A1]' : ''}>{String(item)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── Inviting a team member ── */}
          <h3 className="text-base font-bold text-[#4A4A4A] mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-[#21B3B1]" />
            How to Invite a Team Member
          </h3>

          {/* Invite flow visual */}
          <div className="bg-white rounded-2xl border border-[#E6EAEA] p-5 mb-5 shadow-sm">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {[
                { icon: Users2, label: 'Go to Team page', step: '1' },
                { icon: Mail, label: 'Enter email & click Send Invite', step: '2' },
                { icon: Send, label: 'Invitation email sent', step: '3' },
                { icon: UserPlus, label: 'Staff clicks link & registers', step: '4' },
                { icon: CheckCircle, label: 'Staff joins your team', step: '5' },
              ].map(({ icon: Icon, label, step }, i, arr) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 rounded-xl bg-[#C9F0EF] flex items-center justify-center relative">
                      <Icon className="w-5 h-5 text-[#21B3B1]" />
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#21B3B1] rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                        {step}
                      </span>
                    </div>
                    <p className="text-[9px] text-[#7A7A7A] text-center max-w-[70px] leading-tight">
                      {label}
                    </p>
                  </div>
                  {i < arr.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-[#E6EAEA] flex-shrink-0 -mt-4" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Step number={1} title='Navigate to "Team" in the sidebar'>
            <p>Click <strong>Team</strong> in the NGO Portal sidebar.</p>
          </Step>

          <Step number={2} title="Enter the staff member's email">
            <p>
              In the <strong>Invite a Team Member</strong> section, type the email address of the
              person you want to add.
            </p>
          </Step>

          <Step number={3} title='Click "Send Invite"'>
            <p>
              An invitation email is sent automatically. The link is valid for <strong>72 hours</strong>.
            </p>
            <p>
              The email contains a unique link:{' '}
              <code className="bg-[#E6EAEA] px-1.5 py-0.5 rounded text-xs font-mono">
                foreignteer.com/join-ngo?token=…
              </code>
            </p>
          </Step>

          <StepLast number={4} title="Staff member clicks the link and registers">
            <p>
              They will see your NGO name, be shown their role (Staff), and create an account with
              their name and a password. Their email is pre-filled and cannot be changed.
            </p>
            <p>
              Once registered, they appear on the Team page and can log in immediately.
            </p>
          </StepLast>

          <Note>
            <strong>Invitation expired?</strong> Simply send a new invite to the same email — the old
            link will automatically be invalidated.
          </Note>

          {/* ── Removing a member ── */}
          <h3 className="text-base font-bold text-[#4A4A4A] mt-8 mb-4 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-red-400" />
            How to Remove a Team Member
          </h3>

          <Step number={1} title='Go to "Team" in the sidebar'>
            <p>Click <strong>Team</strong> from the NGO Portal sidebar.</p>
          </Step>

          <Step number={2} title="Find the staff member in the list">
            <p>Each active team member is listed with their name, email, role, and join date.</p>
          </Step>

          <StepLast number={3} title='Click the trash icon and confirm'>
            <p>
              Click the <Trash2 className="inline w-3.5 h-3.5 text-red-400 mx-0.5" /> icon next to
              their name. A confirmation prompt will appear. Confirm to remove them.
            </p>
            <p>
              The staff member will lose access to your NGO dashboard immediately on their next login.
            </p>
          </StepLast>

          <Warning>
            <strong>You cannot remove yourself</strong> from the team, and you cannot remove another
            Owner. Only <strong>Staff members</strong> can be removed via this page. To transfer
            ownership, contact Foreignteer support.
          </Warning>
        </section>

        {/* ══ SECTION 7 — NGO Profile ═════════════════════════════════════════ */}
        <section id="section-7">
          <SectionHeader
            number="7"
            icon={Building2}
            title="NGO Profile"
            subtitle="Edit your organisation details and logo (Owner only)"
          />

          {/* Owner-only badge */}
          <div className="flex items-center gap-3 bg-[#F6C98D]/20 border border-[#F6C98D]/60 rounded-xl px-4 py-3 mb-5">
            <Crown className="w-5 h-5 text-[#8B6914] flex-shrink-0" />
            <p className="text-sm text-[#4A4A4A]">
              <strong>Owner only.</strong> Staff members can view basic profile info but cannot make
              changes.
            </p>
          </div>

          <Step number={1} title='Open "NGO Profile" in the sidebar'>
            <p>Click <strong>NGO Profile</strong> from the left-hand navigation.</p>
          </Step>

          <Step number={2} title="Upload a logo (optional)">
            <p>
              Click the upload area to choose an image file (PNG, JPG, max <strong>5 MB</strong>).
              Your logo will appear on the public <strong>Verified Partners</strong> page once approved.
            </p>
            <div className="border-2 border-dashed border-[#E6EAEA] rounded-xl p-4 mt-2 flex flex-col items-center gap-1.5 bg-white">
              <div className="w-10 h-10 bg-[#C9F0EF] rounded-full flex items-center justify-center">
                <Upload className="w-5 h-5 text-[#21B3B1]" />
              </div>
              <p className="text-xs font-medium text-[#4A4A4A]">Click to upload logo</p>
              <p className="text-[10px] text-[#8FA6A1]">PNG, JPG, GIF up to 5MB</p>
            </div>
          </Step>

          <Step number={3} title="Edit your details">
            <p>You can update:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>Organisation name and description</li>
              <li>Entity type and jurisdiction</li>
              <li>Service locations</li>
              <li>Contact email and website</li>
              <li>Cause categories</li>
              <li>Insurance information</li>
              <li>Featured on Verified Partners page toggle</li>
            </ul>
          </Step>

          <Step number={4} title='Click "Save Changes"'>
            <p>Your changes are saved immediately. Profile information is visible to volunteers.</p>
          </Step>

          <StepLast number={5} title="Re-submit for review if rejected">
            <p>
              If your initial application was rejected, update your details and click{' '}
              <strong>Submit for Review</strong>. The Foreignteer admin team will be notified.
            </p>
          </StepLast>

          <Tip>
            Enabling <strong>Feature on Verified Partners Page</strong> increases your visibility.
            Make sure to upload a clear logo first — it will appear alongside your NGO name and causes
            on the public Partners directory.
          </Tip>
        </section>

        {/* ── Footer / Help ─────────────────────────────────────────────────── */}
        <div className="border-t border-[#E6EAEA] pt-10">
          <div className="bg-[#21B3B1] rounded-2xl p-8 text-center text-white">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Need more help?</h3>
            <p className="text-white/80 text-sm mb-5 max-w-sm mx-auto">
              Our support team is happy to assist with any questions about your NGO account or the
              Foreignteer platform.
            </p>
            <a
              href="mailto:info@foreignteer.com"
              className="inline-block bg-white text-[#21B3B1] font-semibold px-6 py-2.5 rounded-lg hover:bg-[#C9F0EF] transition-colors text-sm"
            >
              Contact Support — info@foreignteer.com
            </a>
          </div>

          <p className="text-center text-xs text-[#8FA6A1] mt-8">
            &copy; 2026 Foreignteer · NGO User Manual · Version 1.0
          </p>
        </div>
      </div>
    </div>
  );
}
