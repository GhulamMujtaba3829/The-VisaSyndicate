import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'super_admin' | 'admin' | 'counselor';
  fullName: string;
  createdAt: string;
}

export interface Counselor {
  id: string;
  fullName: string;
  displayName: string;
  title: string;
  email: string;
  phone: string;
  bio: string;
  photoUrl: string;
  expertise: string[];
  destinations: string[]; // e.g. 'UK', 'Canada', 'USA', 'Australia', 'Europe'
  visaCategories: string[]; // 'Study Visa', 'Visit Visa', 'Business Visa'
  languages: string[];
  experienceYears: number;
  consultationDuration: number; // in minutes (e.g. 45)
  consultationFee: number; // PKR
  currency: string;
  availabilityDays: string[]; // e.g. ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  timeSlots: string[]; // e.g. ['10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM']
  isActive: boolean;
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  referenceCode: string;
  counselorId?: string | null;
  counselorName?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  countryOfResidence: string;
  destination: string;
  visaCategory: string;
  consultationType: string;
  preferredDate: string;
  preferredTimeSlot: string;
  reason: string;
  language: string;
  notes?: string;
  status:
    | 'pending_payment'
    | 'payment_under_review'
    | 'confirmed'
    | 'reschedule_requested'
    | 'completed'
    | 'cancelled'
    | 'refund_pending'
    | 'refunded';
  fee: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  bookingReference: string;
  amount: number;
  currency: string;
  method: 'sadapay' | 'bank_transfer' | 'easypaisa' | 'jazzcash' | 'sandbox_card' | string;
  status: 'pending' | 'under_review' | 'verified' | 'rejected';
  transactionReference: string;
  senderAccount?: string;
  proofNote?: string;
  proofImage?: string; // Uploaded payment slip / receipt image data URL
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface SiteContent {
  heroEyebrow: string;
  heroHeadline1: string;
  heroHeadline2: string;
  heroSubtitle: string;
  heroImageUrl?: string;
  heroImageCrop?: string; // e.g. 'center 30%', 'center 50%', 'top center'
  heroShowWatermark?: boolean; // false for clean crop without watermark
  heroWatermarkText?: string;
  worldwideTagline?: string;
  contactEmail: string;
  contactPhone: string;
  officeAddress: string;
  bankDetails: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
    branch: string;
    sadapayNumber: string;
    jazzcashNumber: string;
    easypaisaNumber: string;
  };
}

export interface CounselorApplication {
  id: string;
  trackingId: string; // e.g. TVS-SEC-948102
  fullName: string;
  displayName: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  nationalIdNumber: string; // CNIC or Passport
  nationalIdType: 'CNIC' | 'Passport' | 'National ID';
  documentProofUrl?: string; // ID / Passport document upload or photo
  idCardFrontUrl?: string; // CNIC / ID Card front photo
  idCardBackUrl?: string; // CNIC / ID Card back photo
  policeVerificationRef?: string; // Police character certificate or report number
  licenseNumber: string; // Bar Council, MARA, OISC, ICCRC or Agency Registration No
  issuingAuthority: string; // e.g. High Court Bar, MARA, OISC, ICCRC
  agencyName?: string;
  physicalAddress: string;
  city: string;
  country: string;
  postalCode: string;
  gpsLocationOrIp?: string;
  taxIdOrNtn?: string;
  bankName: string;
  bankAccountTitle: string;
  iban: string;
  swiftCode?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  expertise: string[];
  destinations: string[];
  visaCategories: string[];
  languages: string[];
  experienceYears: number;
  consultationDuration: number;
  consultationFee: number;
  preferredCurrency: string;
  bio: string;
  status: 'pending_review' | 'verified_approved' | 'rejected' | 'suspended' | 'legal_investigation';
  legalCaseStatus?: 'none' | 'under_review' | 'notice_dispatched' | 'police_dossier_filed' | 'blacklisted';
  legalNotes?: string;
  fraudRiskScore: number; // 0 = Clean/Safe, 100 = High risk
  antiFraudAgreementAccepted: boolean;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
}

export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  visaCategory: string;
  destination: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  timestamp: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  readTime: string;
  publishedAt: string;
  isPublished: boolean;
  tags: string[];
}

export interface SupabaseConfig {
  projectUrl: string;
  anonKey: string;
  serviceRoleKey?: string;
  isLiveSyncEnabled: boolean;
  lastSyncTimestamp?: string;
}

export interface DatabaseSchema {
  users: User[];
  counselors: Counselor[];
  counselorApplications: CounselorApplication[];
  bookings: Booking[];
  payments: Payment[];
  enquiries: ContactEnquiry[];
  auditLogs: AuditLog[];
  siteContent: SiteContent;
  blogs: BlogPost[];
  supabaseConfig: SupabaseConfig;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const defaultSiteContent: SiteContent = {
  heroEyebrow: 'WORLDWIDE STUDY / VISIT / BUSINESS',
  heroHeadline1: 'Your Next Chapter',
  heroHeadline2: 'Starts With Clarity.',
  heroSubtitle:
    'Explore global opportunities with expert guidance, personalized visa assessments and trusted consultation services — accessible worldwide across 120+ jurisdictions.',
  heroImageUrl: '', // Empty means use default traveler asset or custom
  heroImageCrop: 'center 30%',
  heroShowWatermark: false, // Cropped cleanly without watermark as requested
  heroWatermarkText: 'THE VISA SYNDICATE · WORLDWIDE',
  worldwideTagline: 'Operating Worldwide in 120+ Jurisdictions · Global Sovereign Advisory',
  contactEmail: 'admissions@thevisasyndicate.com',
  contactPhone: '+92 300 0000000',
  officeAddress: 'Worldwide Digital Sovereign Chambers (Serving Clients Across 120+ Countries)',
  bankDetails: {
    bankName: 'SadaPay',
    accountTitle: 'The Visa Syndicate / Ghulam Mujtaba',
    accountNumber: '03400131732',
    iban: '03400131732',
    branch: 'SadaPay Digital Pakistan',
    sadapayNumber: '03400131732',
    jazzcashNumber: '',
    easypaisaNumber: '',
  },
};

// Bcrypt hash for default password '14112001'
const DEFAULT_PASSWORD_HASH_14112001 = '$2b$10$A9o9jgs5kMMfDdOX6f38XeMiObjILk6Pvfu7bY./ENjGGSLhvS7ke';

const MASTER_ADMIN: User = {
  id: 'usr_ghulam_mujtaba',
  email: 'mujtabaqureshi3829@gmail.com',
  fullName: 'Ghulam Mujtaba',
  passwordHash: DEFAULT_PASSWORD_HASH_14112001,
  role: 'super_admin',
  createdAt: '2026-10-11T00:00:00.000Z',
};

const initialBlogs: BlogPost[] = [
  {
    id: 'blog_uk_visas_2025',
    title: 'UK Student & Graduate Route Visa 2024-2025: Key Financial & Maintenance Updates',
    slug: 'uk-student-graduate-visa-2025-updates',
    category: 'Study Visa',
    excerpt: 'An authoritative breakdown of UKVI maintenance threshold changes, CAS issuance deadlines, and how to structure 28-day holding funds for Pakistani applicants.',
    content: `Navigating the United Kingdom student visa process requires meticulous attention to financial provenance and statutory timelines. 

### 1. Mandatory 28-Day Financial Holding Rule
The United Kingdom Visas and Immigration (UKVI) enforces strict compliance regarding proof of funds. Tuition fees for the first academic year plus living costs must be held in an acceptable financial institution for a consecutive 28-day period ending within 31 days of the visa application date.

### 2. Living Costs Benchmark (London vs Outside London)
- **Inside London:** £1,483 per month (up to 9 months, total £13,347)
- **Outside London:** £1,136 per month (up to 9 months, total £10,224)

### 3. Credibility Interview Strategies
Caseworkers frequently assess student genuine intent through credibility interviews. You must be prepared to articulate:
- Why you selected this specific university over alternative international institutions.
- How your degree module architecture connects to your long-term career in Pakistan or internationally.
- Accurate awareness of post-study graduate route permissions.`,
    coverImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    author: 'Ghulam Mujtaba',
    readTime: '4 min read',
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    isPublished: true,
    tags: ['UKVI', 'Study Visa', 'CAS', 'Maintenance Funds'],
  },
  {
    id: 'blog_schengen_rejection_audit',
    title: 'Overcoming Schengen Visa Refusals: Audit Justification & Re-Application Protocol',
    slug: 'overcoming-schengen-visa-refusals-protocol',
    category: 'Visit Visa',
    excerpt: 'Received a standard Box 10 or Box 13 Schengen refusal notice? Learn how forensic itinerary design and ties to Pakistan can turn refusals into approvals.',
    content: `A Schengen visa refusal under standard check-boxes (such as "justification for the purpose and conditions of the intended stay was not reliable") is not a permanent barrier. It is a sign that your dossier left critical ambiguities.

### The Most Common Refusal Triggers
1. **Unsubstantiated Ties to Home Country:** Consulates need irrefutable evidence of family, economic, or occupational obligations that ensure return.
2. **Generic Dummy Bookings:** Non-ticketed or canceled flight reservations that fail PNR validation during embassy processing.
3. **Incoherent Day-by-Day Itineraries:** Travel plans that do not logically match hotel reservations and train/flight hops across member states.

### Strategic Appeal vs Fresh Application
In 85% of cases, submitting a fresh, meticulously restructured application with a comprehensive legal Cover Letter produces a faster resolution than an embassy appeal that could take up to 90 days.`,
    coverImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80',
    author: 'Ghulam Mujtaba',
    readTime: '6 min read',
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    isPublished: true,
    tags: ['Schengen', 'Visit Visa', 'Refusal Audit', 'Europe'],
  },
  {
    id: 'blog_canada_study_permit_pal',
    title: 'Canada Study Permit Roadmap: Provincial Attestation Letters (PAL) & SDS Guidelines',
    slug: 'canada-study-permit-pal-sds-guidelines',
    category: 'Study Visa',
    excerpt: 'Detailed guide on securing your Provincial Attestation Letter, GIC requirements, and navigating the revised Canadian international student quota.',
    content: `Immigration, Refugees and Citizenship Canada (IRCC) introduced fundamental reforms to international student intake quotas. Here is what every applicant must know to ensure visa issuance.

### The Provincial Attestation Letter (PAL)
Except for Master's and Doctoral degree students, every college or undergraduate applicant must possess an official PAL issued by the province before lodging their study permit application.

### Guaranteed Investment Certificate (GIC)
To demonstrate financial capability under the Student Direct Stream (SDS) and general stream, applicants must maintain the updated GIC amount (currently $20,635 CAD) in an eligible Canadian bank.`,
    coverImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=80',
    author: 'Ghulam Mujtaba',
    readTime: '5 min read',
    publishedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    isPublished: true,
    tags: ['Canada', 'IRCC', 'PAL', 'Study Permit', 'GIC'],
  },
];

const defaultSupabaseConfig: SupabaseConfig = {
  projectUrl: 'https://iigkhztddzlufeojhjie.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpZ2toenRkZHpsdWZlb2poamllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3MDE3NDksImV4cCI6MjEwNzI3Nzc0OX0.cb1NvJAxRvO6YLJ4r9g5aPXvoJhV8zN_UNfmNAShHEk',
  serviceRoleKey: '',
  isLiveSyncEnabled: true,
};

const initialData: DatabaseSchema = {
  users: [MASTER_ADMIN],
  counselors: [], // Strictly 0 counselors initially per master requirements
  counselorApplications: [],
  bookings: [],
  payments: [],
  enquiries: [],
  auditLogs: [],
  siteContent: defaultSiteContent,
  blogs: initialBlogs,
  supabaseConfig: defaultSupabaseConfig,
};

export class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        let userList: User[] = parsed.users || [];
        if (!userList.some((u) => u.email.toLowerCase() === MASTER_ADMIN.email.toLowerCase())) {
          userList = [MASTER_ADMIN, ...userList];
        }
        return {
          users: userList,
          counselors: parsed.counselors || [],
          counselorApplications: parsed.counselorApplications || [],
          bookings: parsed.bookings || [],
          payments: parsed.payments || [],
          enquiries: parsed.enquiries || [],
          auditLogs: parsed.auditLogs || [],
          siteContent: { ...defaultSiteContent, ...(parsed.siteContent || {}) },
          blogs: parsed.blogs && parsed.blogs.length > 0 ? parsed.blogs : initialBlogs,
          supabaseConfig: { ...defaultSupabaseConfig, ...(parsed.supabaseConfig || {}) },
        };
      }
    } catch (err) {
      console.error('Error loading db file, initializing default:', err);
    }

    this.saveDataDirect(initialData);
    return initialData;
  }

  private saveDataDirect(data: DatabaseSchema) {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  private persist() {
    this.saveDataDirect(this.data);
  }

  // Users
  getUsers(): User[] {
    return this.data.users;
  }

  getUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  addUser(user: User) {
    this.data.users.push(user);
    this.persist();
  }

  // Counselors
  getCounselors(): Counselor[] {
    return this.data.counselors;
  }

  getPublicCounselors(): Counselor[] {
    // Only active and publicly visible counselors
    return this.data.counselors.filter((c) => c.isActive && c.isPublic);
  }

  getCounselorById(id: string): Counselor | undefined {
    return this.data.counselors.find((c) => c.id === id);
  }

  addCounselor(counselor: Counselor) {
    this.data.counselors.push(counselor);
    this.persist();
  }

  updateCounselor(id: string, updates: Partial<Counselor>): Counselor | undefined {
    const idx = this.data.counselors.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    this.data.counselors[idx] = {
      ...this.data.counselors[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.data.counselors[idx];
  }

  deleteCounselor(id: string): boolean {
    const initialLen = this.data.counselors.length;
    this.data.counselors = this.data.counselors.filter((c) => c.id !== id);
    if (this.data.counselors.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // Bookings
  getBookings(): Booking[] {
    return this.data.bookings;
  }

  getBookingById(id: string): Booking | undefined {
    return this.data.bookings.find((b) => b.id === id);
  }

  getBookingByReference(ref: string): Booking | undefined {
    return this.data.bookings.find(
      (b) => b.referenceCode.trim().toUpperCase() === ref.trim().toUpperCase()
    );
  }

  addBooking(booking: Booking) {
    this.data.bookings.push(booking);
    this.persist();
  }

  updateBooking(id: string, updates: Partial<Booking>): Booking | undefined {
    const idx = this.data.bookings.findIndex((b) => b.id === id);
    if (idx === -1) return undefined;
    this.data.bookings[idx] = {
      ...this.data.bookings[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.data.bookings[idx];
  }

  // Payments
  getPayments(): Payment[] {
    return this.data.payments;
  }

  getPaymentById(id: string): Payment | undefined {
    return this.data.payments.find((p) => p.id === id);
  }

  getPaymentByBookingId(bookingId: string): Payment | undefined {
    return this.data.payments.find((p) => p.bookingId === bookingId);
  }

  addPayment(payment: Payment) {
    this.data.payments.push(payment);
    this.persist();
  }

  updatePayment(id: string, updates: Partial<Payment>): Payment | undefined {
    const idx = this.data.payments.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    this.data.payments[idx] = {
      ...this.data.payments[idx],
      ...updates,
    };
    this.persist();
    return this.data.payments[idx];
  }

  // Enquiries
  getEnquiries(): ContactEnquiry[] {
    return this.data.enquiries;
  }

  addEnquiry(enquiry: ContactEnquiry) {
    this.data.enquiries.unshift(enquiry);
    this.persist();
  }

  updateEnquiry(id: string, updates: Partial<ContactEnquiry>): ContactEnquiry | undefined {
    const idx = this.data.enquiries.findIndex((e) => e.id === id);
    if (idx === -1) return undefined;
    this.data.enquiries[idx] = { ...this.data.enquiries[idx], ...updates };
    this.persist();
    return this.data.enquiries[idx];
  }

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return this.data.auditLogs;
  }

  addAuditLog(log: AuditLog) {
    this.data.auditLogs.unshift(log);
    // Keep last 500 logs
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 500);
    }
    this.persist();
  }

  // Site Content
  getSiteContent(): SiteContent {
    return this.data.siteContent;
  }

  updateSiteContent(updates: Partial<SiteContent>): SiteContent {
    this.data.siteContent = { ...this.data.siteContent, ...updates };
    this.persist();
    return this.data.siteContent;
  }

  // Users Password Update
  updateUserPassword(email: string, passwordHash: string): boolean {
    const user = this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      user.passwordHash = passwordHash;
      this.persist();
      return true;
    }
    return false;
  }

  // Blog Posts
  getBlogs(onlyPublished = false): BlogPost[] {
    if (onlyPublished) {
      return this.data.blogs.filter((b) => b.isPublished);
    }
    return this.data.blogs;
  }

  getBlogById(idOrSlug: string): BlogPost | undefined {
    return this.data.blogs.find((b) => b.id === idOrSlug || b.slug === idOrSlug);
  }

  addBlog(blog: BlogPost): BlogPost {
    this.data.blogs.unshift(blog);
    this.persist();
    return blog;
  }

  updateBlog(id: string, updates: Partial<BlogPost>): BlogPost | undefined {
    const idx = this.data.blogs.findIndex((b) => b.id === id);
    if (idx === -1) return undefined;
    this.data.blogs[idx] = { ...this.data.blogs[idx], ...updates };
    this.persist();
    return this.data.blogs[idx];
  }

  deleteBlog(id: string): boolean {
    const initialLen = this.data.blogs.length;
    this.data.blogs = this.data.blogs.filter((b) => b.id !== id);
    if (this.data.blogs.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // Supabase Configuration
  getSupabaseConfig(): SupabaseConfig {
    return this.data.supabaseConfig;
  }

  updateSupabaseConfig(updates: Partial<SupabaseConfig>): SupabaseConfig {
    this.data.supabaseConfig = { ...this.data.supabaseConfig, ...updates };
    this.persist();
    return this.data.supabaseConfig;
  }

  // Counselor Applications & Anti-Fraud Vetting
  getCounselorApplications(): CounselorApplication[] {
    return this.data.counselorApplications || [];
  }

  getCounselorApplicationById(id: string): CounselorApplication | undefined {
    return (this.data.counselorApplications || []).find((a) => a.id === id);
  }

  getCounselorApplicationByTrackId(trackId: string): CounselorApplication | undefined {
    return (this.data.counselorApplications || []).find(
      (a) => a.trackingId.toUpperCase() === trackId.trim().toUpperCase()
    );
  }

  addCounselorApplication(app: CounselorApplication): CounselorApplication {
    if (!this.data.counselorApplications) {
      this.data.counselorApplications = [];
    }
    this.data.counselorApplications.unshift(app);
    this.persist();
    return app;
  }

  updateCounselorApplication(
    id: string,
    updates: Partial<CounselorApplication>
  ): CounselorApplication | undefined {
    if (!this.data.counselorApplications) return undefined;
    const idx = this.data.counselorApplications.findIndex((a) => a.id === id);
    if (idx === -1) return undefined;
    this.data.counselorApplications[idx] = {
      ...this.data.counselorApplications[idx],
      ...updates,
    };
    this.persist();
    return this.data.counselorApplications[idx];
  }

  deleteCounselorApplication(id: string): boolean {
    if (!this.data.counselorApplications) return false;
    const initialLen = this.data.counselorApplications.length;
    this.data.counselorApplications = this.data.counselorApplications.filter((a) => a.id !== id);
    if (this.data.counselorApplications.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }
}

export const db = new Database();
