import {
  insertEnquiryDirect,
  insertCounselorRequestDirect,
  fetchEnquiriesDirect,
  fetchCounselorRequestsDirect,
} from './supabaseClient';

export interface PublicCounselor {
  id: string;
  displayName: string;
  title: string;
  bio: string;
  photoUrl: string;
  expertise: string[];
  destinations: string[];
  visaCategories: string[];
  languages: string[];
  experienceYears: number;
  consultationDuration: number;
  consultationFee: number;
  currency: string;
  availabilityDays: string[];
  timeSlots: string[];
  isFeatured: boolean;
}

export interface AdminCounselor extends PublicCounselor {
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
  isPublic: boolean;
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
  proofImage?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  customerName?: string;
  customerEmail?: string;
  destination?: string;
  visaCategory?: string;
}

export interface SiteContent {
  heroEyebrow: string;
  heroHeadline1: string;
  heroHeadline2: string;
  heroSubtitle: string;
  heroImageUrl?: string;
  heroImageCrop?: string;
  heroShowWatermark?: boolean;
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
    sadapayNumber?: string;
    jazzcashNumber: string;
    easypaisaNumber: string;
  };
}

export interface CounselorApplication {
  id: string;
  trackingId: string;
  fullName: string;
  displayName: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  nationalIdNumber: string;
  nationalIdType: 'CNIC' | 'Passport' | 'National ID';
  documentProofUrl?: string;
  idCardFrontUrl?: string; // CNIC / ID Card front photo
  idCardBackUrl?: string; // CNIC / ID Card back photo
  policeVerificationRef?: string; // Police character certificate or report number
  licenseNumber: string;
  issuingAuthority: string;
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
  fraudRiskScore: number;
  antiFraudAgreementAccepted: boolean;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
}

export interface AdminMetrics {
  totalCounselors: number;
  publishedCounselors: number;
  draftCounselors: number;
  newBookings: number;
  pendingPaymentReviews: number;
  confirmedBookings: number;
  completedConsultations: number;
  cancellations: number;
  totalVerifiedRevenue: number;
  currency: string;
  newEnquiries: number;
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

// Token helper
export const getToken = (): string | null => localStorage.getItem('tvs_admin_token');
export const setToken = (token: string) => localStorage.setItem('tvs_admin_token', token);
export const removeToken = () => localStorage.removeItem('tvs_admin_token');

const authHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ============================================================================
// CLIENT-SIDE STORAGE & OFFLINE / NETLIFY FALLBACK SUPPORT
// When deployed on Netlify without a Node backend, this ensures all booking,
// payment proof, inquiry, and admin management functionality works seamlessly.
// ============================================================================

const DEFAULT_SITE_CONTENT: SiteContent = {
  heroEyebrow: 'STUDY / VISIT / BUSINESS',
  heroHeadline1: 'Your Next Chapter',
  heroHeadline2: 'Starts With Clarity.',
  heroSubtitle:
    'Explore global opportunities with expert guidance, personalized visa assessments and trusted consultation services — accessible worldwide.',
  contactEmail: 'admissions@thevisasyndicate.com',
  contactPhone: '+92 340 0131732',
  officeAddress: 'Remote-First Online Consultation Desk (Serving Nationwide & Worldwide)',
  bankDetails: {
    bankName: 'SadaPay',
    accountTitle: 'The Visa Syndicate / Ghulam Mujtaba',
    accountNumber: '03400131732',
    iban: '03400131732',
    branch: 'SadaPay Digital',
    sadapayNumber: '03400131732',
    jazzcashNumber: '',
    easypaisaNumber: '',
  },
};

const DEFAULT_COUNSELORS: AdminCounselor[] = [
  {
    id: 'csl_ghulam_mujtaba',
    fullName: 'Ghulam Mujtaba Qureshi',
    displayName: 'Ghulam Mujtaba Qureshi',
    email: 'mujtabaqureshi3829@gmail.com',
    phone: '+92 340 0131732',
    title: 'Lead Strategic Visa & Immigration Consultant',
    bio: 'Senior counselor specializing in UK, USA, Australia, and Canadian student & visit visa casework, statutory fund vetting, and interview preparation.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    expertise: [
      'Study Visa Advisory',
      'Financial Audit (28-day rule)',
      'Visit & Tourism Filings',
      'Visa Refusal Remediation',
      'Interview Coaching',
    ],
    destinations: ['UK', 'USA', 'Australia', 'Canada', 'Europe'],
    visaCategories: ['Study Visa', 'Visit Visa', 'Business Visa'],
    languages: ['English', 'Urdu', 'Punjabi'],
    experienceYears: 6,
    consultationDuration: 45,
    consultationFee: 12000,
    currency: 'PKR',
    availabilityDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timeSlots: ['11:00 AM - 11:45 AM', '02:00 PM - 02:45 PM', '04:00 PM - 04:45 PM', '07:00 PM - 07:45 PM'],
    isActive: true,
    isPublic: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEFAULT_BLOGS: BlogPost[] = [
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
Caseworkers frequently assess student genuine intent through credibility interviews. Be prepared to articulate your university selection, degree structure, and long-term career rationale.`,
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
    excerpt: 'Received a standard Box 10 or Box 13 Schengen refusal notice? Learn how forensic itinerary design and ties to Pakistan turn refusals into approvals.',
    content: `A Schengen visa refusal under standard check-boxes is not a permanent barrier. It is a sign that your dossier left critical ambiguities.

### The Most Common Refusal Triggers
1. **Unsubstantiated Ties to Home Country:** Consulates need irrefutable evidence of family, economic, or occupational obligations that ensure return.
2. **Generic Dummy Bookings:** Non-ticketed flight reservations that fail PNR validation during embassy processing.
3. **Incoherent Day-by-Day Itineraries:** Travel plans that do not logically match hotel reservations and train/flight hops across member states.`,
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
    content: `Immigration, Refugees and Citizenship Canada (IRCC) introduced fundamental reforms to international student intake quotas.

### The Provincial Attestation Letter (PAL)
Except for Master's and Doctoral degree students, every college or undergraduate applicant must possess an official PAL issued by the province before lodging their study permit application.

### Guaranteed Investment Certificate (GIC)
To demonstrate financial capability under SDS, applicants must maintain the updated GIC benchmark in an eligible Canadian bank.`,
    coverImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=80',
    author: 'Ghulam Mujtaba',
    readTime: '5 min read',
    publishedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    isPublished: true,
    tags: ['Canada', 'IRCC', 'PAL', 'Study Permit', 'GIC'],
  },
];

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const val = localStorage.getItem(`tvs_net_${key}`);
    if (val) return JSON.parse(val);
  } catch (e) {
    // ignore
  }
  return defaultValue;
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`tvs_net_${key}`, JSON.stringify(value));
  } catch (e) {
    // ignore
  }
}

// Seed local storage with default counselor and blogs if empty
if (!localStorage.getItem('tvs_net_counselors')) {
  setStored('counselors', DEFAULT_COUNSELORS);
}
if (!localStorage.getItem('tvs_net_site_content')) {
  setStored('site_content', DEFAULT_SITE_CONTENT);
}
if (!localStorage.getItem('tvs_net_blogs')) {
  setStored('blogs', DEFAULT_BLOGS);
}

export const api = {
  // Public
  async getSiteContent(): Promise<SiteContent> {
    try {
      const res = await fetch('/api/public/site-content');
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await res.json();
        }
      }
    } catch {
      // Fallback
    }
    return getStored<SiteContent>('site_content', DEFAULT_SITE_CONTENT);
  },

  async getPublicCounselors(): Promise<PublicCounselor[]> {
    let serverCounselors: PublicCounselor[] = [];
    try {
      const res = await fetch('/api/public/counselors');
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          serverCounselors = await res.json();
        }
      }
    } catch {
      // Fallback
    }

    const localCounselors = getStored<AdminCounselor[]>('counselors', DEFAULT_COUNSELORS);
    const map = new Map<string, PublicCounselor>();

    for (const c of serverCounselors) {
      if ((c as any).isActive !== false && (c as any).isPublic !== false) {
        map.set(c.id, c);
      }
    }
    for (const c of localCounselors) {
      if (c.isActive !== false && c.isPublic !== false) {
        if (!map.has(c.id)) {
          map.set(c.id, c);
        }
      }
    }

    return Array.from(map.values());
  },

  async getPublicCounselor(id: string): Promise<PublicCounselor> {
    try {
      const res = await fetch(`/api/public/counselors/${id}`);
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await res.json();
        }
      }
    } catch {
      // Fallback
    }
    const all = getStored<AdminCounselor[]>('counselors', DEFAULT_COUNSELORS);
    const found = all.find((c) => c.id === id);
    if (!found) throw new Error('Counselor not found');
    return found;
  },

  async createBooking(bookingData: any): Promise<{ booking: Booking; payment: Payment; bankDetails: any }> {
    try {
      const res = await fetch('/api/public/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await res.json();
        }
      } else {
        const err = await res.json().catch(() => ({}));
        if (err.error) throw new Error(err.error);
      }
    } catch (e: any) {
      if (e.message && !e.message.includes('fetch') && !e.message.includes('Failed to fetch')) {
        throw e;
      }
    }

    // LocalStorage fallback for static hosting
    const siteContent = getStored<SiteContent>('site_content', DEFAULT_SITE_CONTENT);
    const refCode = `TVS-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking: Booking = {
      id: `book_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      referenceCode: refCode,
      counselorId: bookingData.counselorId || null,
      counselorName: bookingData.counselorName || 'Ghulam Mujtaba Qureshi',
      customerName: bookingData.customerName,
      customerEmail: bookingData.customerEmail,
      customerPhone: bookingData.customerPhone,
      countryOfResidence: bookingData.countryOfResidence || 'Home Country',
      destination: bookingData.destination || 'UK',
      visaCategory: bookingData.visaCategory || 'Study Visa',
      consultationType: bookingData.consultationType || 'Virtual 1-on-1',
      preferredDate: bookingData.preferredDate || new Date().toISOString().split('T')[0],
      preferredTimeSlot: bookingData.preferredTimeSlot || '02:00 PM - 02:45 PM',
      reason: bookingData.reason || '',
      language: bookingData.language || 'English',
      notes: bookingData.notes || '',
      status: 'pending_payment',
      fee: 12000,
      currency: 'PKR',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newPayment: Payment = {
      id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      bookingId: newBooking.id,
      bookingReference: refCode,
      amount: newBooking.fee,
      currency: newBooking.currency,
      method: 'sadapay',
      status: 'pending',
      transactionReference: '',
      createdAt: new Date().toISOString(),
      customerName: newBooking.customerName,
      customerEmail: newBooking.customerEmail,
      destination: newBooking.destination,
      visaCategory: newBooking.visaCategory,
    };

    const bookings = getStored<Booking[]>('bookings', []);
    bookings.unshift(newBooking);
    setStored('bookings', bookings);

    const payments = getStored<Payment[]>('payments', []);
    payments.unshift(newPayment);
    setStored('payments', payments);

    return { booking: newBooking, payment: newPayment, bankDetails: siteContent.bankDetails };
  },

  async lookupBooking(ref: string): Promise<{ booking: Booking; payment: Payment; bankDetails: any }> {
    try {
      const res = await fetch(`/api/public/bookings/${encodeURIComponent(ref)}`);
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await res.json();
        }
      }
    } catch {
      // Fallback
    }

    const bookings = getStored<Booking[]>('bookings', []);
    const booking = bookings.find((b) => b.referenceCode.toUpperCase() === ref.trim().toUpperCase());
    if (!booking) throw new Error('Booking reference not found');

    const payments = getStored<Payment[]>('payments', []);
    const payment = payments.find((p) => p.bookingReference === booking.referenceCode) || {
      id: `pay_fallback`,
      bookingId: booking.id,
      bookingReference: booking.referenceCode,
      amount: booking.fee,
      currency: booking.currency,
      method: 'sadapay',
      status: 'pending',
      transactionReference: '',
      createdAt: booking.createdAt,
    };

    const siteContent = getStored<SiteContent>('site_content', DEFAULT_SITE_CONTENT);
    return { booking, payment, bankDetails: siteContent.bankDetails };
  },

  async submitPayment(
    ref: string,
    payload: {
      method: string;
      transactionReference: string;
      senderAccount?: string;
      proofNote?: string;
      proofImage?: string;
    }
  ): Promise<{ booking: Booking; payment: Payment }> {
    try {
      const res = await fetch(`/api/public/bookings/${encodeURIComponent(ref)}/submit-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await res.json();
        }
      }
    } catch {
      // Fallback
    }

    const bookings = getStored<Booking[]>('bookings', []);
    const booking = bookings.find((b) => b.referenceCode.toUpperCase() === ref.trim().toUpperCase());
    if (!booking) throw new Error('Booking not found');

    booking.status = 'payment_under_review';
    booking.updatedAt = new Date().toISOString();
    setStored('bookings', bookings);

    const payments = getStored<Payment[]>('payments', []);
    let payment = payments.find((p) => p.bookingReference === booking.referenceCode);
    if (!payment) {
      payment = {
        id: `pay_${Date.now()}`,
        bookingId: booking.id,
        bookingReference: booking.referenceCode,
        amount: booking.fee,
        currency: booking.currency,
        method: payload.method,
        status: 'under_review',
        transactionReference: payload.transactionReference,
        senderAccount: payload.senderAccount,
        proofNote: payload.proofNote,
        proofImage: payload.proofImage,
        createdAt: new Date().toISOString(),
      };
      payments.unshift(payment);
    } else {
      payment.status = 'under_review';
      payment.transactionReference = payload.transactionReference;
      payment.senderAccount = payload.senderAccount;
      payment.proofNote = payload.proofNote;
      payment.proofImage = payload.proofImage;
    }
    setStored('payments', payments);

    return { booking, payment };
  },

  async submitEnquiry(data: any): Promise<{ message: string; id: string }> {
    let supabaseRecord: any = null;
    let supabaseError: any = null;

    // 1. Direct Supabase insert (for Vercel, Netlify, and live cloud database)
    try {
      supabaseRecord = await insertEnquiryDirect({
        name: data.name,
        email: data.email,
        phone: data.phone,
        visa_category: data.visaCategory,
        destination: data.destination,
        message: data.message,
      });
    } catch (err: any) {
      console.warn('Direct Supabase insert error:', err);
      supabaseError = err;
    }

    // 2. Also try backend API if server is running
    try {
      const res = await fetch('/api/public/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json().catch(() => ({}));
        return {
          message: 'Your inquiry has been submitted successfully to the Sovereign Syndicate.',
          id: json.id || supabaseRecord?.id || `enq_${Date.now()}`,
        };
      }
    } catch (serverErr) {
      // Backend not running (expected in Vercel static deployments)
    }

    if (supabaseRecord) {
      return {
        message: 'Your inquiry has been submitted successfully to the Sovereign Syndicate.',
        id: supabaseRecord.id,
      };
    }

    // If both failed, surface the real Supabase error message
    throw new Error(
      supabaseError?.message ||
        'Failed to connect to Supabase database. Please check connection and permissions.'
    );
  },

  // Auth
  async checkAuthStatus(): Promise<{ isConfigured: boolean; userCount: number }> {
    try {
      const res = await fetch('/api/auth/status');
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await res.json();
        }
      }
    } catch {
      // Fallback
    }
    return { isConfigured: true, userCount: 1 };
  },

  async setupOwner(data: { email: string; password: string; fullName: string }): Promise<any> {
    try {
      const res = await fetch('/api/auth/setup-owner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return { message: 'Owner account set up successfully' };
  },

  async login(credentials: { email: string; password: string }): Promise<any> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await res.json();
        }
      } else {
        const err = await res.json().catch(() => ({}));
        if (err.error) throw new Error(err.error);
      }
    } catch (e: any) {
      if (e.message && !e.message.includes('fetch') && !e.message.includes('Failed to fetch')) {
        throw e;
      }
    }

    // Static / Netlify fallback: Validate master admin credentials
    const cleanEmail = credentials.email.trim().toLowerCase();
    const cleanPass = credentials.password.trim();
    const savedPassword = localStorage.getItem('master_admin_password') || '14112001';

    const isValidAdminEmail =
      !cleanEmail ||
      cleanEmail === 'mujtabaqureshi3829@gmail.com' ||
      cleanEmail === 'admin' ||
      cleanEmail === 'master' ||
      cleanEmail.includes('mujtaba');

    const isValidAdminPass =
      cleanPass === '14112001' ||
      cleanPass === savedPassword ||
      cleanPass === '14112001Muj@';

    if (isValidAdminEmail && isValidAdminPass) {
      const token = `token_master_${Date.now()}`;
      setToken(token);
      return {
        token,
        user: {
          id: 'usr_master_mujtaba',
          email: 'mujtabaqureshi3829@gmail.com',
          fullName: 'Ghulam Mujtaba',
          role: 'super_admin',
        },
      };
    }

    throw new Error('Invalid master passcode. Access is strictly restricted.');
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        localStorage.setItem('master_admin_password', newPassword.trim());
        return await res.json();
      } else {
        const err = await res.json().catch(() => ({}));
        if (err.error) throw new Error(err.error);
      }
    } catch (e: any) {
      if (e.message && !e.message.includes('fetch') && !e.message.includes('Failed to fetch')) {
        throw e;
      }
    }

    // Static / Netlify fallback: Validate current password against stored or default
    const savedPassword = localStorage.getItem('master_admin_password') || '14112001';
    const isCurrentValid =
      currentPassword.trim() === '14112001' ||
      currentPassword.trim() === savedPassword ||
      currentPassword.trim() === '14112001Muj@';

    if (!isCurrentValid) {
      throw new Error('Current password does not match.');
    }

    if (newPassword.trim().length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }

    localStorage.setItem('master_admin_password', newPassword.trim());
    return { success: true, message: 'Password updated successfully!' };
  },

  async getMe(): Promise<any> {
    try {
      const res = await fetch('/api/auth/me', {
        headers: authHeaders(),
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await res.json();
        }
      }
    } catch {
      // Fallback
    }
    const token = getToken();
    if (!token) throw new Error('Not authenticated');
    return {
      id: 'usr_master_mujtaba',
      email: 'mujtabaqureshi3829@gmail.com',
      fullName: 'Ghulam Mujtaba',
      role: 'owner',
    };
  },

  // Admin
  async getAdminMetrics(): Promise<AdminMetrics> {
    try {
      const res = await fetch('/api/admin/metrics', {
        headers: authHeaders(),
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await res.json();
        }
      }
    } catch {
      // Fallback
    }

    const counselors = getStored<AdminCounselor[]>('counselors', DEFAULT_COUNSELORS);
    const bookings = getStored<Booking[]>('bookings', []);
    const payments = getStored<Payment[]>('payments', []);
    const enquiries = getStored<ContactEnquiry[]>('enquiries', []);

    return {
      totalCounselors: counselors.length,
      publishedCounselors: counselors.filter((c) => c.isPublic).length,
      draftCounselors: counselors.filter((c) => !c.isPublic).length,
      newBookings: bookings.filter((b) => b.status === 'pending_payment').length,
      pendingPaymentReviews: payments.filter((p) => p.status === 'under_review').length,
      confirmedBookings: bookings.filter((b) => b.status === 'confirmed').length,
      completedConsultations: bookings.filter((b) => b.status === 'completed').length,
      cancellations: bookings.filter((b) => b.status === 'cancelled').length,
      totalVerifiedRevenue: payments
        .filter((p) => p.status === 'verified')
        .reduce((sum, p) => sum + (p.amount || 0), 0),
      currency: 'PKR',
      newEnquiries: enquiries.filter((e) => e.status === 'new').length,
    };
  },

  async getAdminCounselors(): Promise<AdminCounselor[]> {
    try {
      const res = await fetch('/api/admin/counselors', {
        headers: authHeaders(),
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await res.json();
        }
      }
    } catch {
      // Fallback
    }
    return getStored<AdminCounselor[]>('counselors', DEFAULT_COUNSELORS);
  },

  async createCounselor(data: Partial<AdminCounselor>): Promise<AdminCounselor> {
    let created: AdminCounselor | null = null;
    try {
      const res = await fetch('/api/admin/counselors', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          ...data,
          isActive: data.isActive ?? true,
          isPublic: data.isPublic ?? true,
        }),
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          created = await res.json();
        }
      }
    } catch {
      // Fallback
    }

    const counselors = getStored<AdminCounselor[]>('counselors', DEFAULT_COUNSELORS);
    const newCounselor: AdminCounselor = created || {
      id: `csl_${Date.now()}`,
      fullName: data.fullName || 'Counselor',
      displayName: data.displayName || data.fullName || 'Counselor',
      email: data.email || 'counselor@thevisasyndicate.com',
      phone: data.phone || '+92 340 0131732',
      title: data.title || 'Immigration Consultant',
      bio: data.bio || '',
      photoUrl: data.photoUrl || '',
      expertise: data.expertise || ['Study Visa', 'Visit Visa'],
      destinations: data.destinations || ['UK', 'USA', 'Canada'],
      visaCategories: data.visaCategories || ['Study Visa', 'Visit Visa'],
      languages: data.languages || ['English', 'Urdu'],
      experienceYears: data.experienceYears || 4,
      consultationDuration: data.consultationDuration || 45,
      consultationFee: data.consultationFee || 12000,
      currency: 'PKR',
      availabilityDays: data.availabilityDays || ['Monday', 'Wednesday', 'Friday'],
      timeSlots: data.timeSlots || ['02:00 PM - 02:45 PM'],
      isActive: data.isActive ?? true,
      isPublic: data.isPublic ?? true, // Always default to true so it is published immediately!
      isFeatured: data.isFeatured ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Ensure it exists in local storage
    const existingIndex = counselors.findIndex((c) => c.id === newCounselor.id);
    if (existingIndex >= 0) {
      counselors[existingIndex] = newCounselor;
    } else {
      counselors.unshift(newCounselor);
    }
    setStored('counselors', counselors);

    return newCounselor;
  },

  async updateCounselor(id: string, data: Partial<AdminCounselor>): Promise<AdminCounselor> {
    try {
      const res = await fetch(`/api/admin/counselors/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await res.json();
        }
      }
    } catch {
      // Fallback
    }

    const counselors = getStored<AdminCounselor[]>('counselors', DEFAULT_COUNSELORS);
    const idx = counselors.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Counselor not found');
    counselors[idx] = { ...counselors[idx], ...data, updatedAt: new Date().toISOString() };
    setStored('counselors', counselors);
    return counselors[idx];
  },

  async toggleCounselorVisibility(id: string): Promise<AdminCounselor> {
    try {
      const res = await fetch(`/api/admin/counselors/${id}/toggle-visibility`, {
        method: 'PATCH',
        headers: authHeaders(),
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await res.json();
        }
      }
    } catch {
      // Fallback
    }

    const counselors = getStored<AdminCounselor[]>('counselors', DEFAULT_COUNSELORS);
    const idx = counselors.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Counselor not found');
    counselors[idx].isPublic = !counselors[idx].isPublic;
    counselors[idx].updatedAt = new Date().toISOString();
    setStored('counselors', counselors);
    return counselors[idx];
  },

  async toggleCounselorActive(id: string): Promise<AdminCounselor> {
    try {
      const res = await fetch(`/api/admin/counselors/${id}/toggle-active`, {
        method: 'PATCH',
        headers: authHeaders(),
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await res.json();
        }
      }
    } catch {
      // Fallback
    }

    const counselors = getStored<AdminCounselor[]>('counselors', DEFAULT_COUNSELORS);
    const idx = counselors.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Counselor not found');
    counselors[idx].isActive = !counselors[idx].isActive;
    counselors[idx].updatedAt = new Date().toISOString();
    setStored('counselors', counselors);
    return counselors[idx];
  },

  async deleteCounselor(id: string): Promise<void> {
    // 1. Immediately update localStorage so state reflects immediately everywhere
    let counselors = getStored<AdminCounselor[]>('counselors', DEFAULT_COUNSELORS);
    counselors = counselors.filter((c) => c.id !== id);
    setStored('counselors', counselors);

    // 2. Safely synchronize with backend
    try {
      await fetch(`/api/admin/counselors/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
    } catch {
      // Offline fallback
    }
  },

  async getAdminBookings(): Promise<Booking[]> {
    try {
      const res = await fetch('/api/admin/bookings', {
        headers: authHeaders(),
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await res.json();
        }
      }
    } catch {
      // Fallback
    }
    return getStored<Booking[]>('bookings', []);
  },

  async updateBookingStatus(id: string, status: string, notes?: string): Promise<Booking> {
    try {
      const res = await fetch(`/api/admin/bookings/${id}/status`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status, notes }),
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await res.json();
        }
      }
    } catch {
      // Fallback
    }

    const bookings = getStored<Booking[]>('bookings', []);
    const idx = bookings.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error('Booking not found');
    bookings[idx].status = status as any;
    if (notes) bookings[idx].notes = notes;
    bookings[idx].updatedAt = new Date().toISOString();
    setStored('bookings', bookings);
    return bookings[idx];
  },

  async getAdminPayments(): Promise<Payment[]> {
    try {
      const res = await fetch('/api/admin/payments', {
        headers: authHeaders(),
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await res.json();
        }
      }
    } catch {
      // Fallback
    }
    return getStored<Payment[]>('payments', []);
  },

  async verifyPayment(id: string, action: 'verify' | 'reject', notes?: string): Promise<any> {
    try {
      const res = await fetch(`/api/admin/payments/${id}/verify`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ action, notes }),
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await res.json();
        }
      }
    } catch {
      // Fallback
    }

    const payments = getStored<Payment[]>('payments', []);
    const payment = payments.find((p) => p.id === id);
    if (!payment) throw new Error('Payment not found');

    payment.status = action === 'verify' ? 'verified' : 'rejected';
    payment.verifiedBy = 'Ghulam Mujtaba';
    payment.verifiedAt = new Date().toISOString();
    if (notes) payment.proofNote = notes;
    setStored('payments', payments);

    // Also update booking status
    const bookings = getStored<Booking[]>('bookings', []);
    const booking = bookings.find((b) => b.referenceCode === payment.bookingReference);
    if (booking) {
      booking.status = action === 'verify' ? 'confirmed' : 'pending_payment';
      booking.updatedAt = new Date().toISOString();
      setStored('bookings', bookings);
    }

    return { payment, booking };
  },

  async getAdminEnquiries(): Promise<ContactEnquiry[]> {
    let supabaseEnquiries: ContactEnquiry[] = [];
    try {
      supabaseEnquiries = await fetchEnquiriesDirect();
    } catch (sbErr) {
      console.warn('Direct Supabase fetch enquiries failed:', sbErr);
    }

    let serverEnquiries: ContactEnquiry[] = [];
    try {
      const res = await fetch('/api/admin/enquiries', {
        headers: authHeaders(),
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          serverEnquiries = await res.json();
        }
      }
    } catch (err) {
      console.warn('Failed to fetch server enquiries:', err);
    }

    const localEnquiries = getStored<ContactEnquiry[]>('enquiries', []);

    // Merge Supabase, server, and local enquiries, avoiding duplicates by id
    const map = new Map<string, ContactEnquiry>();
    for (const e of supabaseEnquiries) {
      map.set(e.id, e);
    }
    for (const e of serverEnquiries) {
      map.set(e.id, e);
    }
    for (const e of localEnquiries) {
      if (!map.has(e.id)) {
        map.set(e.id, e);
      }
    }

    const combined = Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return combined;
  },

  async updateEnquiryStatus(id: string, status: string): Promise<ContactEnquiry> {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await res.json();
        }
      }
    } catch {
      // Fallback
    }

    const enquiries = getStored<ContactEnquiry[]>('enquiries', []);
    const idx = enquiries.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('Enquiry not found');
    enquiries[idx].status = status as any;
    setStored('enquiries', enquiries);
    return enquiries[idx];
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const res = await fetch('/api/admin/audit-logs', {
        headers: authHeaders(),
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await res.json();
        }
      }
    } catch {
      // Fallback
    }
    return getStored<AuditLog[]>('audit_logs', [
      {
        id: 'log_seed',
        actorEmail: 'mujtabaqureshi3829@gmail.com',
        action: 'SYSTEM_INITIALIZED',
        targetType: 'SYSTEM',
        targetId: 'INIT',
        details: 'The Visa Syndicate portal initialized with master security protocols.',
        timestamp: new Date().toISOString(),
      },
    ]);
  },

  async updateSiteContent(data: Partial<SiteContent>): Promise<SiteContent> {
    try {
      const res = await fetch('/api/admin/site-content', {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await res.json();
        }
      }
    } catch {
      // Fallback
    }

    const current = getStored<SiteContent>('site_content', DEFAULT_SITE_CONTENT);
    const updated = { ...current, ...data };
    setStored('site_content', updated);
    return updated;
  },

  // ==========================================
  // BLOG & EDITORIAL API
  // ==========================================
  async getPublicBlogs(): Promise<BlogPost[]> {
    try {
      const res = await fetch('/api/blogs');
      if (res.ok) {
        const ct = res.headers.get('content-type');
        if (ct && ct.includes('application/json')) {
          return await res.json();
        }
      }
    } catch {
      // fallback
    }
    const all = getStored<BlogPost[]>('blogs', DEFAULT_BLOGS);
    return all.filter((b) => b.isPublished);
  },

  async getAdminBlogs(): Promise<BlogPost[]> {
    try {
      const res = await fetch('/api/admin/blogs', {
        headers: authHeaders(),
      });
      if (res.ok) {
        const ct = res.headers.get('content-type');
        if (ct && ct.includes('application/json')) {
          return await res.json();
        }
      }
    } catch {
      // fallback
    }
    return getStored<BlogPost[]>('blogs', DEFAULT_BLOGS);
  },

  async createBlog(data: Partial<BlogPost>): Promise<BlogPost> {
    const slug = (data.title || 'untitled')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newBlog: BlogPost = {
      id: `blog_${Date.now()}`,
      title: data.title || 'Untitled Article',
      slug: slug || `article-${Date.now()}`,
      category: data.category || 'Study Visa',
      excerpt: data.excerpt || '',
      content: data.content || '',
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
      author: data.author || 'Ghulam Mujtaba',
      readTime: data.readTime || '5 min read',
      publishedAt: new Date().toISOString(),
      isPublished: data.isPublished ?? true,
      tags: data.tags || ['Visa', 'Guidance'],
    };

    try {
      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(newBlog),
      });
      if (res.ok) {
        const json = await res.json();
        Object.assign(newBlog, json);
      }
    } catch {
      // fallback
    }

    const blogs = getStored<BlogPost[]>('blogs', DEFAULT_BLOGS);
    blogs.unshift(newBlog);
    setStored('blogs', blogs);

    // If published, trigger user notification!
    if (newBlog.isPublished) {
      localStorage.setItem('visa_syndicate_latest_blog_notification', JSON.stringify({
        id: newBlog.id,
        title: newBlog.title,
        category: newBlog.category,
        timestamp: Date.now(),
        read: false,
      }));
      window.dispatchEvent(new CustomEvent('visa_syndicate_new_blog_published', { detail: newBlog }));
    }

    return newBlog;
  },

  async updateBlog(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) {
        // sync
      }
    } catch {
      // fallback
    }

    const blogs = getStored<BlogPost[]>('blogs', DEFAULT_BLOGS);
    const idx = blogs.findIndex((b) => b.id === id);
    if (idx !== -1) {
      const wasPublished = blogs[idx].isPublished;
      blogs[idx] = { ...blogs[idx], ...data };
      setStored('blogs', blogs);

      // If newly published, notify
      if (!wasPublished && blogs[idx].isPublished) {
        localStorage.setItem('visa_syndicate_latest_blog_notification', JSON.stringify({
          id: blogs[idx].id,
          title: blogs[idx].title,
          category: blogs[idx].category,
          timestamp: Date.now(),
          read: false,
        }));
        window.dispatchEvent(new CustomEvent('visa_syndicate_new_blog_published', { detail: blogs[idx] }));
      }
      return blogs[idx];
    }
    throw new Error('Blog not found');
  },

  async deleteBlog(id: string): Promise<void> {
    let blogs = getStored<BlogPost[]>('blogs', DEFAULT_BLOGS);
    blogs = blogs.filter((b) => b.id !== id);
    setStored('blogs', blogs);

    try {
      await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
    } catch {
      // fallback
    }
  },

  // ==========================================
  // SUPABASE CONFIGURATION
  // ==========================================
  async getSupabaseConfig(): Promise<SupabaseConfig> {
    try {
      const res = await fetch('/api/admin/supabase-config', {
        headers: authHeaders(),
      });
      if (res.ok) return await res.json();
    } catch {}
    return getStored<SupabaseConfig>('supabase_config', {
      projectUrl: '',
      anonKey: '',
      serviceRoleKey: '',
      isLiveSyncEnabled: false,
    });
  },

  async saveSupabaseConfig(config: Partial<SupabaseConfig>): Promise<SupabaseConfig> {
    try {
      const res = await fetch('/api/admin/supabase-config', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(config),
      });
      if (res.ok) {
        const json = await res.json();
        setStored('supabase_config', json);
        return json;
      }
    } catch {}

    const cur = getStored<SupabaseConfig>('supabase_config', {
      projectUrl: '',
      anonKey: '',
      serviceRoleKey: '',
      isLiveSyncEnabled: false,
    });
    const updated = { ...cur, ...config };
    setStored('supabase_config', updated);
    return updated;
  },

  async testSupabaseConnection(projectUrl: string, anonKey: string): Promise<{ success: boolean; message: string }> {
    try {
      const cleanUrl = projectUrl.replace(/\/+$/, '');
      const res = await fetch(`${cleanUrl}/rest/v1/`, {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
        },
      });
      if (res.ok || res.status === 200 || res.status === 404) {
        return { success: true, message: 'Connected to Supabase project successfully!' };
      }
      return { success: false, message: `Supabase returned HTTP ${res.status}: ${res.statusText}` };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to reach Supabase project' };
    }
  },

  // ==========================================
  // COUNSELOR APPLICATIONS & ANTI-FRAUD
  // ==========================================

  async applyCounselor(formData: any): Promise<{ success: boolean; message: string; application: CounselorApplication }> {
    let supabaseRecord: any = null;
    let supabaseError: any = null;

    // 1. Direct Supabase insert (for Vercel, Netlify, and live cloud database)
    try {
      supabaseRecord = await insertCounselorRequestDirect(formData);
    } catch (err: any) {
      console.warn('Direct Supabase insert counselor error:', err);
      supabaseError = err;
    }

    // 2. Also try backend API if server is running
    try {
      const res = await fetch('/api/counselors/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const json = await res.json().catch(() => ({}));
        return {
          success: true,
          message: 'Application registered successfully. TVS-SEC tracking ID generated.',
          application: json.application || supabaseRecord,
        };
      }
    } catch (serverErr) {
      // Backend not running (expected in Vercel static deployments)
    }

    if (supabaseRecord) {
      return {
        success: true,
        message: 'Application registered successfully. TVS-SEC tracking ID generated.',
        application: supabaseRecord,
      };
    }

    // If both failed, surface the real Supabase error message
    throw new Error(
      supabaseError?.message ||
        'Failed to connect to Supabase database. Please check connection and permissions.'
    );
  },

  async verifyCounselorTrack(trackingId: string): Promise<any> {
    try {
      const res = await fetch(`/api/counselors/verify-track/${encodeURIComponent(trackingId)}`);
      if (res.ok) return await res.json();
    } catch {}

    const apps = getStored<CounselorApplication[]>('counselor_applications', []);
    const match = apps.find((a) => a.trackingId.toUpperCase() === trackingId.trim().toUpperCase());
    if (match) {
      return {
        found: true,
        trackingId: match.trackingId,
        displayName: match.displayName,
        licenseNumber: match.licenseNumber,
        issuingAuthority: match.issuingAuthority,
        status: match.status,
        destinations: match.destinations,
        experienceYears: match.experienceYears,
        fraudRiskScore: match.fraudRiskScore,
        antiFraudAgreementAccepted: match.antiFraudAgreementAccepted,
        submittedAt: match.submittedAt,
      };
    }
    return { found: false, error: 'Tracking record not found' };
  },

  async getAdminCounselorApplications(): Promise<CounselorApplication[]> {
    let supabaseApps: CounselorApplication[] = [];
    try {
      supabaseApps = await fetchCounselorRequestsDirect();
    } catch (sbErr) {
      console.warn('Direct Supabase fetch counselor requests failed:', sbErr);
    }

    let serverApps: CounselorApplication[] = [];
    try {
      const res = await fetch('/api/admin/counselor-applications', {
        headers: authHeaders(),
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          serverApps = await res.json();
        }
      }
    } catch (err) {
      console.warn('Failed to fetch server counselor applications:', err);
    }

    const localApps = getStored<CounselorApplication[]>('counselor_applications', []);

    // Merge Supabase, server, and local apps, avoiding duplicates by id
    const map = new Map<string, CounselorApplication>();
    for (const a of supabaseApps) {
      map.set(a.id, a);
    }
    for (const a of serverApps) {
      map.set(a.id, a);
    }
    for (const a of localApps) {
      if (!map.has(a.id)) {
        map.set(a.id, a);
      }
    }

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  },

  async updateCounselorApplicationStatus(
    id: string,
    status: 'pending_review' | 'verified_approved' | 'rejected' | 'suspended',
    adminNotes?: string
  ): Promise<CounselorApplication> {
    try {
      const res = await fetch(`/api/admin/counselor-applications/${id}/status`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ status, adminNotes }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.application;
      }
    } catch {}

    const apps = getStored<CounselorApplication[]>('counselor_applications', []);
    const idx = apps.findIndex((a) => a.id === id);
    if (idx !== -1) {
      apps[idx] = { ...apps[idx], status, adminNotes, reviewedAt: new Date().toISOString() };
      setStored('counselor_applications', apps);
      return apps[idx];
    }
    throw new Error('Application not found');
  },

  async updateCounselorApplicationDossier(
    id: string,
    updates: Partial<CounselorApplication>
  ): Promise<CounselorApplication> {
    try {
      const res = await fetch(`/api/admin/counselor-applications/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        return data.application;
      }
    } catch {}

    const apps = getStored<CounselorApplication[]>('counselor_applications', []);
    const idx = apps.findIndex((a) => a.id === id);
    if (idx !== -1) {
      apps[idx] = { ...apps[idx], ...updates, reviewedAt: new Date().toISOString() };
      setStored('counselor_applications', apps);
      return apps[idx];
    }
    throw new Error('Application not found');
  },

  async deleteCounselorApplication(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/counselor-applications/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (res.ok) return true;
    } catch {}

    const apps = getStored<CounselorApplication[]>('counselor_applications', []);
    setStored('counselor_applications', apps.filter((a) => a.id !== id));
    return true;
  },
};
