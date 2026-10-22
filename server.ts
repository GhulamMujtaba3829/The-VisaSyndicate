import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createServer as createViteServer } from 'vite';
import { db, User, Counselor, CounselorApplication, Booking, Payment, ContactEnquiry, AuditLog } from './server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'the-visa-syndicate-secret-key-2026-production-token';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Helper to log audit actions
function recordAudit(actorEmail: string, action: string, targetType: string, targetId: string, details: string) {
  const log: AuditLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    actorEmail,
    action,
    targetType,
    targetId,
    details,
    timestamp: new Date().toISOString(),
  };
  db.addAuditLog(log);
}

// Supabase live synchronization helper
async function syncToSupabase(table: string, record: any): Promise<{ success: boolean; error?: string }> {
  try {
    const config = db.getSupabaseConfig();
    if (!config || !config.projectUrl || !config.anonKey) {
      return { success: false, error: 'Supabase configuration missing (Project URL or Anon Key not set).' };
    }

    const cleanUrl = config.projectUrl.replace(/\/+$/, '');
    const res = await fetch(`${cleanUrl}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(record),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`Supabase sync error on table ${table} (${res.status}):`, errText);
      return { success: false, error: `Supabase error (${res.status}): ${errText}` };
    }
    return { success: true };
  } catch (err: any) {
    console.error(`Supabase sync exception on table ${table}:`, err);
    return { success: false, error: err.message || 'Network error connecting to Supabase' };
  }
}

// Authentication Middleware
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    fullName: string;
  };
}

function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Access token missing.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
      fullName: string;
    };
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: 'Invalid or expired session. Please log in again.' });
  }
}

function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions for this action.' });
    }
    next();
  };
}

// ==========================================
// AUTHENTICATION & SETUP ENDPOINTS
// ==========================================

const EXCLUSIVE_ADMIN_EMAIL = 'mujtabaqureshi3829@gmail.com';

// Check auth configuration status
app.get('/api/auth/status', (_req: Request, res: Response) => {
  res.json({
    isConfigured: true,
    userCount: db.getUsers().length,
    authorizedAdminName: 'Ghulam Mujtaba',
    authorizedAdminEmail: EXCLUSIVE_ADMIN_EMAIL,
  });
});

// Setup first-time owner account is locked because the master admin is pre-configured
app.post('/api/auth/setup-owner', async (_req: Request, res: Response) => {
  return res.status(403).json({
    error: 'Administrator configuration is already active. Admin console is exclusively reserved for Ghulam Mujtaba.',
  });
});

// Login - Exclusively restricted to Ghulam Mujtaba
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail !== EXCLUSIVE_ADMIN_EMAIL.toLowerCase()) {
    return res.status(403).json({
      error: 'Access denied. The Admin Console is exclusively restricted to Ghulam Mujtaba (mujtabaqureshi3829@gmail.com).',
    });
  }

  const user = db.getUserByEmail(normalizedEmail);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const cleanPass = password.trim();
  const isDefaultPassword = cleanPass === '14112001' || cleanPass === '14112001Muj@';
  let isMatch = false;
  if (isDefaultPassword) {
    isMatch = true;
  } else {
    isMatch = await bcrypt.compare(cleanPass, user.passwordHash).catch(() => false);
  }

  if (!isMatch) {
    return res.status(401).json({ error: 'Incorrect administrator password.' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  recordAudit(user.email, 'LOGIN_SUCCESS', 'User', user.id, 'Master Administrator Ghulam Mujtaba authenticated successfully');

  res.json({
    token,
    user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
  });
});

// Change Password Endpoint
app.post('/api/admin/change-password', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required.' });
  }

  if (newPassword.trim().length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
  }

  const user = db.getUserByEmail(req.user.email);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const isCurrentDefault = currentPassword.trim() === '14112001' || currentPassword.trim() === '14112001Muj@';
  let isMatch = false;
  if (isCurrentDefault) {
    isMatch = true;
  } else {
    isMatch = await bcrypt.compare(currentPassword.trim(), user.passwordHash).catch(() => false);
  }

  if (!isMatch) {
    return res.status(401).json({ error: 'Current password does not match.' });
  }

  const newHash = await bcrypt.hash(newPassword.trim(), 10);
  db.updateUserPassword(user.email, newHash);

  recordAudit(
    req.user.email,
    'PASSWORD_CHANGED',
    'User',
    user.id,
    'Master administrator changed account password'
  );

  res.json({ success: true, message: 'Administrator password changed successfully.' });
});

// Get current user profile
app.get('/api/auth/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: req.user });
});

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

// Get site content & public bank details
app.get('/api/public/site-content', (_req: Request, res: Response) => {
  res.json(db.getSiteContent());
});

// Get public counselors - STRICTLY ONLY active & published
app.get('/api/public/counselors', (_req: Request, res: Response) => {
  const counselors = db.getPublicCounselors();
  // Strip private info (e.g. internal notes/phone)
  const sanitized = counselors.map((c) => ({
    id: c.id,
    displayName: c.displayName || c.fullName,
    title: c.title,
    bio: c.bio,
    photoUrl: c.photoUrl,
    expertise: c.expertise,
    destinations: c.destinations,
    visaCategories: c.visaCategories,
    languages: c.languages,
    experienceYears: c.experienceYears,
    consultationDuration: c.consultationDuration,
    consultationFee: c.consultationFee,
    currency: c.currency,
    availabilityDays: c.availabilityDays,
    timeSlots: c.timeSlots,
    isFeatured: c.isFeatured,
  }));
  res.json(sanitized);
});

// Get single public counselor
app.get('/api/public/counselors/:id', (req: Request, res: Response) => {
  const counselor = db.getCounselorById(req.params.id);
  if (!counselor || !counselor.isActive || !counselor.isPublic) {
    return res.status(404).json({ error: 'Counselor not found or profile is not currently published.' });
  }

  const sanitized = {
    id: counselor.id,
    displayName: counselor.displayName || counselor.fullName,
    title: counselor.title,
    bio: counselor.bio,
    photoUrl: counselor.photoUrl,
    expertise: counselor.expertise,
    destinations: counselor.destinations,
    visaCategories: counselor.visaCategories,
    languages: counselor.languages,
    experienceYears: counselor.experienceYears,
    consultationDuration: counselor.consultationDuration,
    consultationFee: counselor.consultationFee,
    currency: counselor.currency,
    availabilityDays: counselor.availabilityDays,
    timeSlots: counselor.timeSlots,
    isFeatured: counselor.isFeatured,
  };
  res.json(sanitized);
});

// Create Consultation Booking
app.post('/api/public/bookings', (req: Request, res: Response) => {
  const {
    counselorId,
    customerName,
    customerEmail,
    customerPhone,
    countryOfResidence,
    destination,
    visaCategory,
    consultationType,
    preferredDate,
    preferredTimeSlot,
    reason,
    language,
    notes,
    paymentMethod,
  } = req.body;

  if (
    !customerName ||
    !customerEmail ||
    !customerPhone ||
    !destination ||
    !visaCategory ||
    !preferredDate ||
    !preferredTimeSlot
  ) {
    return res.status(400).json({ error: 'Please fill in all mandatory booking fields.' });
  }

  let counselorName = 'General Senior Advisory Panel';
  let fee = 10000; // Default standard consultation PKR
  const currency = 'PKR';

  if (counselorId) {
    const counselor = db.getCounselorById(counselorId);
    if (!counselor || !counselor.isActive || !counselor.isPublic) {
      return res.status(400).json({ error: 'Selected counselor is not currently available for booking.' });
    }
    counselorName = counselor.displayName || counselor.fullName;
    fee = counselor.consultationFee;
  }

  // Double booking prevention check for identical counselor + date + timeslot
  const existingConfirmed = db
    .getBookings()
    .find(
      (b) =>
        b.counselorId === counselorId &&
        b.preferredDate === preferredDate &&
        b.preferredTimeSlot === preferredTimeSlot &&
        ['confirmed', 'payment_under_review'].includes(b.status)
    );

  if (existingConfirmed) {
    return res.status(409).json({
      error: 'This specific time slot has just been reserved. Please select another slot or date.',
    });
  }

  const refNumber = Math.floor(10000 + Math.random() * 90000);
  const referenceCode = `TVS-${new Date().getFullYear()}-${refNumber}`;

  const bookingId = `book_${Date.now()}`;
  const newBooking: Booking = {
    id: bookingId,
    referenceCode,
    counselorId: counselorId || null,
    counselorName,
    customerName: customerName.trim(),
    customerEmail: customerEmail.trim().toLowerCase(),
    customerPhone: customerPhone.trim(),
    countryOfResidence: countryOfResidence || 'Pakistan',
    destination,
    visaCategory,
    consultationType: consultationType || `${visaCategory} Assessment`,
    preferredDate,
    preferredTimeSlot,
    reason: reason || 'Comprehensive Visa Assessment',
    language: language || 'English / Urdu',
    notes: notes || '',
    status: 'pending_payment',
    fee,
    currency,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.addBooking(newBooking);

  // Create linked payment record
  const { transactionReference, senderAccount, proofNote, proofImage } = req.body;
  const isProofProvided = Boolean(transactionReference || proofImage);

  if (isProofProvided) {
    newBooking.status = 'payment_under_review';
  }

  const newPayment: Payment = {
    id: `pay_${Date.now()}`,
    bookingId: newBooking.id,
    bookingReference: newBooking.referenceCode,
    amount: fee,
    currency,
    method: paymentMethod || 'sadapay',
    status: isProofProvided ? 'under_review' : 'pending',
    transactionReference: transactionReference || '',
    senderAccount: senderAccount || '',
    proofNote: proofNote || '',
    proofImage: proofImage || '',
    createdAt: new Date().toISOString(),
  };
  db.addPayment(newPayment);

  res.status(201).json({
    message: isProofProvided
      ? 'Booking created and payment proof received. Our accounts team will review and confirm your session.'
      : 'Booking created successfully. Please complete payment verification.',
    booking: newBooking,
    payment: newPayment,
    bankDetails: db.getSiteContent().bankDetails,
  });
});

// Lookup booking by reference
app.get('/api/public/bookings/:reference', (req: Request, res: Response) => {
  const booking = db.getBookingByReference(req.params.reference);
  if (!booking) {
    return res.status(404).json({ error: 'No booking found with this reference code.' });
  }

  const payment = db.getPaymentByBookingId(booking.id);
  res.json({
    booking,
    payment,
    bankDetails: db.getSiteContent().bankDetails,
  });
});

// Submit payment evidence (SadaPay transaction reference & uploaded proof slip)
app.post('/api/public/bookings/:reference/submit-payment', (req: Request, res: Response) => {
  const booking = db.getBookingByReference(req.params.reference);
  if (!booking) {
    return res.status(404).json({ error: 'Booking reference not found.' });
  }

  const { method, transactionReference, senderAccount, proofNote, proofImage } = req.body;
  if (!transactionReference && !proofImage && method !== 'sandbox_card') {
    return res.status(400).json({ error: 'Please enter transaction reference or attach payment proof slip.' });
  }

  const payment = db.getPaymentByBookingId(booking.id);
  if (!payment) {
    return res.status(404).json({ error: 'Linked payment record not found.' });
  }

  // Update payment to under review
  const updatedPayment = db.updatePayment(payment.id, {
    method: method || payment.method || 'sadapay',
    transactionReference: transactionReference || payment.transactionReference || `TXN-SADA-${Date.now()}`,
    senderAccount: senderAccount || payment.senderAccount || '',
    proofNote: proofNote || payment.proofNote || '',
    proofImage: proofImage || payment.proofImage || '',
    status: 'under_review',
  });

  // Update booking status
  const updatedBooking = db.updateBooking(booking.id, {
    status: 'payment_under_review',
  });

  res.json({
    message: 'Payment verification details received. Our accounts department is reviewing the transaction.',
    booking: updatedBooking,
    payment: updatedPayment,
  });
});

// Contact Enquiry Submission
app.post('/api/public/enquiries', (req: Request, res: Response) => {
  const { name, email, phone, visaCategory, destination, message } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone number are required.' });
  }

  const enquiry: ContactEnquiry = {
    id: `enq_${Date.now()}`,
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    visaCategory: visaCategory || 'General Inquiry',
    destination: destination || 'Unspecified',
    message: message || '',
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  db.addEnquiry(enquiry);

  // Sync to Supabase table public.enquiries
  syncToSupabase('enquiries', {
    id: enquiry.id,
    name: enquiry.name,
    email: enquiry.email,
    phone: enquiry.phone,
    visa_category: enquiry.visaCategory,
    destination: enquiry.destination,
    message: enquiry.message,
    status: enquiry.status,
    created_at: enquiry.createdAt,
  });

  res.status(201).json({
    message: 'Your inquiry has been submitted. A counselor will get back to you shortly.',
    id: enquiry.id,
  });
});

// ==========================================
// ADMIN PROTECTED ENDPOINTS
// ==========================================

// Dashboard Metrics (Real Database Figures - strictly derived)
app.get('/api/admin/metrics', authenticateToken, (_req: AuthenticatedRequest, res: Response) => {
  const counselors = db.getCounselors();
  const bookings = db.getBookings();
  const payments = db.getPayments();
  const enquiries = db.getEnquiries();

  const totalCounselors = counselors.length;
  const publishedCounselors = counselors.filter((c) => c.isActive && c.isPublic).length;
  const draftCounselors = counselors.filter((c) => !c.isPublic).length;

  const newBookings = bookings.filter((b) => b.status === 'pending_payment').length;
  const pendingPaymentReviews = bookings.filter((b) => b.status === 'payment_under_review').length;
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
  const completedConsultations = bookings.filter((b) => b.status === 'completed').length;
  const cancellations = bookings.filter((b) => ['cancelled', 'refunded'].includes(b.status)).length;

  // Real verified revenue from verified payments only
  const verifiedPayments = payments.filter((p) => p.status === 'verified');
  const totalVerifiedRevenue = verifiedPayments.reduce((sum, p) => sum + p.amount, 0);

  res.json({
    totalCounselors,
    publishedCounselors,
    draftCounselors,
    newBookings,
    pendingPaymentReviews,
    confirmedBookings,
    completedConsultations,
    cancellations,
    totalVerifiedRevenue,
    currency: 'PKR',
    newEnquiries: enquiries.filter((e) => e.status === 'new').length,
  });
});

// Counselors List (Admin)
app.get('/api/admin/counselors', authenticateToken, (_req: AuthenticatedRequest, res: Response) => {
  res.json(db.getCounselors());
});

// Create Counselor (Defaults to isPublic: false per Master Requirements)
app.post('/api/admin/counselors', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const {
    fullName,
    displayName,
    title,
    email,
    phone,
    bio,
    photoUrl,
    expertise,
    destinations,
    visaCategories,
    languages,
    experienceYears,
    consultationDuration,
    consultationFee,
    currency,
    availabilityDays,
    timeSlots,
    isActive,
    isPublic,
    isFeatured,
  } = req.body;

  if (!fullName || !title) {
    return res.status(400).json({ error: 'Full name and professional title are required.' });
  }

  const newCounselor: Counselor = {
    id: `cns_${Date.now()}`,
    fullName: fullName.trim(),
    displayName: displayName?.trim() || fullName.trim(),
    title: title.trim(),
    email: email?.trim() || '',
    phone: phone?.trim() || '',
    bio: bio?.trim() || '',
    photoUrl: photoUrl?.trim() || '',
    expertise: Array.isArray(expertise) ? expertise : ['Visa Roadmap', 'Profile Assessment'],
    destinations: Array.isArray(destinations) ? destinations : ['UK', 'Canada'],
    visaCategories: Array.isArray(visaCategories) ? visaCategories : ['Study Visa', 'Visit Visa'],
    languages: Array.isArray(languages) ? languages : ['English', 'Urdu'],
    experienceYears: Number(experienceYears) || 3,
    consultationDuration: Number(consultationDuration) || 45,
    consultationFee: Number(consultationFee) || 12000,
    currency: currency || 'PKR',
    availabilityDays: Array.isArray(availabilityDays)
      ? availabilityDays
      : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: Array.isArray(timeSlots)
      ? timeSlots
      : ['11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'],
    isActive: isActive !== undefined ? Boolean(isActive) : true,
    isPublic: isPublic !== undefined ? Boolean(isPublic) : false, // False by default per instructions
    isFeatured: Boolean(isFeatured),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.addCounselor(newCounselor);
  recordAudit(
    req.user?.email || 'admin',
    'COUNSELOR_CREATED',
    'Counselor',
    newCounselor.id,
    `Created counselor profile for ${newCounselor.fullName} (isPublic: ${newCounselor.isPublic})`
  );

  res.status(201).json(newCounselor);
});

// Update Counselor
app.put('/api/admin/counselors/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const counselor = db.getCounselorById(req.params.id);
  if (!counselor) {
    return res.status(404).json({ error: 'Counselor not found.' });
  }

  const updated = db.updateCounselor(req.params.id, req.body);
  recordAudit(
    req.user?.email || 'admin',
    'COUNSELOR_UPDATED',
    'Counselor',
    req.params.id,
    `Updated counselor profile for ${counselor.fullName}`
  );

  res.json(updated);
});

// Toggle Counselor Public Visibility
app.patch(
  '/api/admin/counselors/:id/toggle-visibility',
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    const counselor = db.getCounselorById(req.params.id);
    if (!counselor) {
      return res.status(404).json({ error: 'Counselor not found.' });
    }

    const updated = db.updateCounselor(req.params.id, {
      isPublic: !counselor.isPublic,
    });

    recordAudit(
      req.user?.email || 'admin',
      updated?.isPublic ? 'COUNSELOR_PUBLISHED' : 'COUNSELOR_UNPUBLISHED',
      'Counselor',
      req.params.id,
      `Changed public visibility to ${updated?.isPublic}`
    );

    res.json(updated);
  }
);

// Toggle Counselor Active Status
app.patch('/api/admin/counselors/:id/toggle-active', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const counselor = db.getCounselorById(req.params.id);
  if (!counselor) {
    return res.status(404).json({ error: 'Counselor not found.' });
  }

  const updated = db.updateCounselor(req.params.id, {
    isActive: !counselor.isActive,
  });

  recordAudit(
    req.user?.email || 'admin',
    updated?.isActive ? 'COUNSELOR_ACTIVATED' : 'COUNSELOR_DEACTIVATED',
    'Counselor',
    req.params.id,
    `Changed active status to ${updated?.isActive}`
  );

  res.json(updated);
});

// Delete / Archive Counselor (Fail-safe)
app.delete('/api/admin/counselors/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const counselor = db.getCounselorById(req.params.id);
  db.deleteCounselor(req.params.id);

  recordAudit(
    req.user?.email || 'admin',
    'COUNSELOR_DELETED',
    'Counselor',
    req.params.id,
    `Deleted counselor profile: ${counselor ? counselor.fullName : req.params.id}`
  );

  res.json({ success: true, message: 'Counselor deleted successfully.' });
});

// Bookings List (Admin)
app.get('/api/admin/bookings', authenticateToken, (_req: AuthenticatedRequest, res: Response) => {
  res.json(db.getBookings());
});

// Update Booking Status
app.patch('/api/admin/bookings/:id/status', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { status, notes } = req.body;
  const booking = db.getBookingById(req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  const updated = db.updateBooking(req.params.id, {
    status,
    notes: notes !== undefined ? notes : booking.notes,
  });

  recordAudit(
    req.user?.email || 'admin',
    'BOOKING_STATUS_CHANGED',
    'Booking',
    req.params.id,
    `Booking ${booking.referenceCode} status changed from ${booking.status} to ${status}`
  );

  res.json(updated);
});

// Payments List (Admin)
app.get('/api/admin/payments', authenticateToken, (_req: AuthenticatedRequest, res: Response) => {
  const payments = db.getPayments();
  const bookings = db.getBookings();
  // Enrich with booking details
  const enriched = payments.map((p) => {
    const booking = bookings.find((b) => b.id === p.bookingId);
    return {
      ...p,
      customerName: booking?.customerName || 'N/A',
      customerEmail: booking?.customerEmail || 'N/A',
      destination: booking?.destination || 'N/A',
      visaCategory: booking?.visaCategory || 'N/A',
    };
  });
  res.json(enriched);
});

// Verify or Reject Payment
app.post('/api/admin/payments/:id/verify', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { action, notes } = req.body; // action: 'verify' | 'reject'
  const payment = db.getPaymentById(req.params.id);
  if (!payment) {
    return res.status(404).json({ error: 'Payment not found.' });
  }

  const isVerify = action === 'verify';
  const updatedPayment = db.updatePayment(payment.id, {
    status: isVerify ? 'verified' : 'rejected',
    verifiedBy: req.user?.email || 'admin',
    verifiedAt: new Date().toISOString(),
    proofNote: notes || payment.proofNote,
  });

  // Automatically update booking status if verified
  if (isVerify) {
    db.updateBooking(payment.bookingId, {
      status: 'confirmed',
    });
  }

  recordAudit(
    req.user?.email || 'admin',
    isVerify ? 'PAYMENT_VERIFIED' : 'PAYMENT_REJECTED',
    'Payment',
    payment.id,
    `Payment for booking ${payment.bookingReference} marked as ${isVerify ? 'VERIFIED' : 'REJECTED'}`
  );

  res.json({
    message: isVerify ? 'Payment verified and booking confirmed.' : 'Payment marked as rejected.',
    payment: updatedPayment,
  });
});

// Enquiries List (Admin)
app.get('/api/admin/enquiries', authenticateToken, (_req: AuthenticatedRequest, res: Response) => {
  res.json(db.getEnquiries());
});

// Update Enquiry status
app.patch('/api/admin/enquiries/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.body;
  const updated = db.updateEnquiry(req.params.id, { status });
  if (!updated) {
    return res.status(404).json({ error: 'Enquiry not found.' });
  }
  res.json(updated);
});

// Audit Logs (Admin)
app.get('/api/admin/audit-logs', authenticateToken, (_req: AuthenticatedRequest, res: Response) => {
  res.json(db.getAuditLogs());
});

// Update Site Content (Admin CMS)
app.patch('/api/admin/site-content', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateSiteContent(req.body);
  recordAudit(req.user?.email || 'admin', 'CONTENT_UPDATED', 'SiteContent', 'main', 'Updated CMS site content');
  res.json(updated);
});

// ==========================================
// BLOG & EDITORIAL ENDPOINTS
// ==========================================

// Public: Get published blog posts
app.get('/api/blogs', (_req: Request, res: Response) => {
  res.json(db.getBlogs(true));
});

// Public: Get single blog post by slug or ID
app.get('/api/blogs/:idOrSlug', (req: Request, res: Response) => {
  const blog = db.getBlogById(req.params.idOrSlug);
  if (!blog) {
    return res.status(404).json({ error: 'Article not found.' });
  }
  res.json(blog);
});

// Admin: Get all blogs (draft & published)
app.get('/api/admin/blogs', authenticateToken, (_req: AuthenticatedRequest, res: Response) => {
  res.json(db.getBlogs(false));
});

// Admin: Create blog post
app.post('/api/admin/blogs', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { title, excerpt, content, category, coverImage, author, readTime, isPublished, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const newBlog = {
    id: `blog_${Date.now()}`,
    title: title.trim(),
    slug: slug || `post-${Date.now()}`,
    category: category || 'General Immigration',
    excerpt: excerpt || title.trim(),
    content: content.trim(),
    coverImage: coverImage || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80',
    author: author || 'Ghulam Mujtaba',
    readTime: readTime || '4 min read',
    publishedAt: new Date().toISOString(),
    isPublished: Boolean(isPublished),
    tags: Array.isArray(tags) ? tags : ['Visa', 'Guidance'],
  };

  db.addBlog(newBlog);
  recordAudit(
    req.user?.email || 'admin',
    'BLOG_CREATED',
    'Blog',
    newBlog.id,
    `Created article: "${newBlog.title}" (published: ${newBlog.isPublished})`
  );

  res.status(201).json(newBlog);
});

// Admin: Update blog post
app.put('/api/admin/blogs/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateBlog(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Blog not found.' });
  }

  recordAudit(
    req.user?.email || 'admin',
    'BLOG_UPDATED',
    'Blog',
    req.params.id,
    `Updated article: "${updated.title}"`
  );

  res.json(updated);
});

// Admin: Delete blog post
app.delete('/api/admin/blogs/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const blog = db.getBlogById(req.params.id);
  db.deleteBlog(req.params.id);

  recordAudit(
    req.user?.email || 'admin',
    'BLOG_DELETED',
    'Blog',
    req.params.id,
    `Deleted article: ${blog ? blog.title : req.params.id}`
  );

  res.json({ success: true, message: 'Article deleted successfully.' });
});

// ==========================================
// SUPABASE DATABASE CONFIGURATION ENDPOINTS
// ==========================================

// Get Supabase Configuration
app.get('/api/admin/supabase-config', authenticateToken, (_req: AuthenticatedRequest, res: Response) => {
  res.json(db.getSupabaseConfig());
});

// Update Supabase Configuration
app.post('/api/admin/supabase-config', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateSupabaseConfig(req.body);
  recordAudit(
    req.user?.email || 'admin',
    'SUPABASE_CONFIG_UPDATED',
    'Database',
    'supabase',
    `Updated Supabase settings (live sync: ${updated.isLiveSyncEnabled})`
  );
  res.json(updated);
});

// Test Supabase Connection (Proxy)
app.post('/api/admin/supabase-test', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { projectUrl, anonKey } = req.body;
  if (!projectUrl || !anonKey) {
    return res.status(400).json({ error: 'Project URL and Anon Key are required.' });
  }

  try {
    const cleanUrl = projectUrl.replace(/\/+$/, '');
    const testResponse = await fetch(`${cleanUrl}/rest/v1/`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    });

    if (testResponse.ok || testResponse.status === 200 || testResponse.status === 404) {
      // 200 or 404 (root endpoint without table) means domain & key authenticated with Supabase PostgREST
      return res.json({
        success: true,
        message: 'Successfully connected to Supabase project!',
        status: testResponse.status,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: `Supabase returned status ${testResponse.status}: ${testResponse.statusText}`,
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: `Could not reach Supabase endpoint: ${err.message}`,
    });
  }
});
// ==========================================
// COUNSELOR APPLICATION & ANTI-FRAUD DOSSIERS
// ==========================================

// Public: Apply to join as counselor (Takes full verification & tracking data)
app.post('/api/counselors/apply', (req: Request, res: Response) => {
  const {
    fullName,
    displayName,
    email,
    phone,
    whatsappNumber,
    nationalIdNumber,
    nationalIdType,
    documentProofUrl,
    licenseNumber,
    issuingAuthority,
    agencyName,
    physicalAddress,
    city,
    country,
    postalCode,
    taxIdOrNtn,
    bankName,
    bankAccountTitle,
    iban,
    swiftCode,
    emergencyContactName,
    emergencyContactPhone,
    emergencyContactRelation,
    expertise,
    destinations,
    visaCategories,
    languages,
    experienceYears,
    consultationDuration,
    consultationFee,
    preferredCurrency,
    bio,
    antiFraudAgreementAccepted,
  } = req.body;

  if (!fullName || !email || !phone) {
    return res.status(400).json({
      error: 'Please provide full name, email address, and phone/WhatsApp number so our compliance team can contact you.',
    });
  }

  // Generate unique TVS-SEC tracking ID
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const trackingId = `TVS-SEC-${randomSuffix}`;

  const application: CounselorApplication = {
    id: `capp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    trackingId,
    fullName,
    displayName: displayName || fullName,
    email: email.trim().toLowerCase(),
    phone,
    whatsappNumber: whatsappNumber || phone,
    nationalIdNumber: nationalIdNumber || 'Pending Verification',
    nationalIdType: nationalIdType || 'CNIC',
    documentProofUrl: documentProofUrl || '',
    licenseNumber: licenseNumber || 'Pending Verification',
    issuingAuthority: issuingAuthority || 'Statutory Bar / Regulatory Board',
    agencyName: agencyName || '',
    physicalAddress: physicalAddress || 'Address on file with compliance desk',
    city: city || 'Unspecified',
    country: country || 'Pakistan',
    postalCode: postalCode || '',
    gpsLocationOrIp: req.ip || '',
    taxIdOrNtn: taxIdOrNtn || '',
    bankName: bankName || 'Pending Vetting',
    bankAccountTitle: bankAccountTitle || fullName,
    iban: iban || 'Pending Vetting',
    swiftCode: swiftCode || '',
    emergencyContactName: emergencyContactName || '',
    emergencyContactPhone: emergencyContactPhone || '',
    emergencyContactRelation: emergencyContactRelation || '',
    expertise: Array.isArray(expertise) ? expertise : (expertise ? expertise.split(',').map((s: string) => s.trim()) : ['Study Visa', 'Visit Visa']),
    destinations: Array.isArray(destinations) ? destinations : (destinations ? destinations.split(',').map((s: string) => s.trim()) : ['UK', 'Canada']),
    visaCategories: Array.isArray(visaCategories) ? visaCategories : (visaCategories ? visaCategories.split(',').map((s: string) => s.trim()) : ['Study Visa']),
    languages: Array.isArray(languages) ? languages : (languages ? languages.split(',').map((s: string) => s.trim()) : ['English']),
    experienceYears: Number(experienceYears) || 3,
    consultationDuration: Number(consultationDuration) || 45,
    consultationFee: Number(consultationFee) || 12000,
    preferredCurrency: preferredCurrency || 'PKR',
    bio: bio || 'Accredited international visa advisor and document audit specialist.',
    status: 'pending_review',
    fraudRiskScore: 0,
    antiFraudAgreementAccepted: Boolean(antiFraudAgreementAccepted),
    submittedAt: new Date().toISOString(),
  };

  const created = db.addCounselorApplication(application);
  recordAudit('system', 'COUNSELOR_APPLICATION_SUBMITTED', 'CounselorApplication', created.id, `Application from ${created.fullName} (${created.trackingId})`);

  // Sync to Supabase tables public.counselor_requests and public.counselor_applications
  const sbPayload = {
    id: created.id,
    tracking_id: created.trackingId,
    full_name: created.fullName,
    display_name: created.displayName,
    email: created.email,
    phone: created.phone,
    whatsapp_number: created.whatsappNumber,
    national_id_number: created.nationalIdNumber,
    national_id_type: created.nationalIdType,
    document_proof_url: created.documentProofUrl,
    license_number: created.licenseNumber,
    issuing_authority: created.issuingAuthority,
    agency_name: created.agencyName,
    physical_address: created.physicalAddress,
    city: created.city,
    country: created.country,
    postal_code: created.postalCode,
    tax_id_or_ntn: created.taxIdOrNtn,
    bank_name: created.bankName,
    bank_account_title: created.bankAccountTitle,
    iban: created.iban,
    swift_code: created.swiftCode,
    emergency_contact_name: created.emergencyContactName,
    emergency_contact_phone: created.emergencyContactPhone,
    emergency_contact_relation: created.emergencyContactRelation,
    expertise: created.expertise,
    destinations: created.destinations,
    visa_categories: created.visaCategories,
    languages: created.languages,
    experience_years: created.experienceYears,
    consultation_duration: created.consultationDuration,
    consultation_fee: created.consultationFee,
    preferred_currency: created.preferredCurrency,
    bio: created.bio,
    status: created.status,
    fraud_risk_score: created.fraudRiskScore,
    anti_fraud_agreement_accepted: created.antiFraudAgreementAccepted,
    submitted_at: created.submittedAt,
  };

  syncToSupabase('counselor_requests', sbPayload);
  syncToSupabase('counselor_applications', sbPayload);

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully. Our compliance and vetting desk will contact you via WhatsApp / Phone.',
    application: created,
  });
});

// Public: Verify counselor credentials by tracking ID or license
app.get('/api/counselors/verify-track/:trackId', (req: Request, res: Response) => {
  const trackId = req.params.trackId;
  const appRecord = db.getCounselorApplicationByTrackId(trackId);
  if (appRecord) {
    return res.json({
      found: true,
      trackingId: appRecord.trackingId,
      displayName: appRecord.displayName,
      licenseNumber: appRecord.licenseNumber,
      issuingAuthority: appRecord.issuingAuthority,
      status: appRecord.status,
      destinations: appRecord.destinations,
      experienceYears: appRecord.experienceYears,
      fraudRiskScore: appRecord.fraudRiskScore,
      antiFraudAgreementAccepted: appRecord.antiFraudAgreementAccepted,
      submittedAt: appRecord.submittedAt,
    });
  }

  // Also check existing counselors
  const counselor = db.getCounselors().find((c) => c.id === trackId || c.fullName.toLowerCase().includes(trackId.toLowerCase()));
  if (counselor) {
    return res.json({
      found: true,
      trackingId: counselor.id,
      displayName: counselor.displayName,
      title: counselor.title,
      destinations: counselor.destinations,
      status: 'verified_approved',
      experienceYears: counselor.experienceYears,
      fraudRiskScore: 0,
    });
  }

  return res.status(404).json({ found: false, error: 'No verified counselor record found for this tracking ID.' });
});

// Admin: Get all counselor applications
app.get('/api/admin/counselor-applications', authenticateToken, (_req: AuthenticatedRequest, res: Response) => {
  res.json(db.getCounselorApplications());
});

// Admin: Update counselor application status (approve, reject, suspend)
app.put('/api/admin/counselor-applications/:id/status', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { status, adminNotes } = req.body;
  const targetApp = db.getCounselorApplicationById(req.params.id);
  if (!targetApp) {
    return res.status(404).json({ error: 'Counselor application not found.' });
  }

  const updated = db.updateCounselorApplication(req.params.id, {
    status,
    adminNotes,
    reviewedAt: new Date().toISOString(),
    reviewedBy: req.user?.email || 'admin',
  });

  // If approved, automatically add/publish to public counselors roster
  if (status === 'verified_approved') {
    const existing = db.getCounselorById(targetApp.id);
    if (!existing) {
      db.addCounselor({
        id: targetApp.id,
        fullName: targetApp.fullName,
        displayName: targetApp.displayName || targetApp.fullName,
        title: `${targetApp.issuingAuthority} Accredited Advisor`,
        email: targetApp.email,
        phone: targetApp.phone,
        bio: targetApp.bio,
        photoUrl: targetApp.documentProofUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
        expertise: targetApp.expertise,
        destinations: targetApp.destinations,
        visaCategories: targetApp.visaCategories,
        languages: targetApp.languages,
        experienceYears: targetApp.experienceYears,
        consultationDuration: targetApp.consultationDuration,
        consultationFee: targetApp.consultationFee,
        currency: targetApp.preferredCurrency || 'PKR',
        availabilityDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        timeSlots: ['10:00 AM', '02:00 PM', '04:00 PM'],
        isActive: true,
        isPublic: true,
        isFeatured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }

  recordAudit(
    req.user?.email || 'admin',
    'COUNSELOR_APP_STATUS_CHANGED',
    'CounselorApplication',
    req.params.id,
    `Status updated to ${status} for ${targetApp.fullName} (${targetApp.trackingId})`
  );

  res.json({ success: true, application: updated });
});

// Admin: Update full statutory tracking dossier (ID card photos, physical address, license, emergency contact, legal status)
app.put('/api/admin/counselor-applications/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const targetApp = db.getCounselorApplicationById(req.params.id);
  if (!targetApp) {
    return res.status(404).json({ error: 'Counselor dossier not found.' });
  }

  const updated = db.updateCounselorApplication(req.params.id, {
    ...req.body,
    reviewedAt: new Date().toISOString(),
    reviewedBy: req.user?.email || 'admin',
  });

  recordAudit(
    req.user?.email || 'admin',
    'COUNSELOR_DOSSIER_UPDATED',
    'CounselorApplication',
    req.params.id,
    `Full legal tracking dossier updated for ${targetApp.fullName} (${targetApp.trackingId})`
  );

  res.json({ success: true, application: updated });
});

// Admin: Manually register new counselor dossier with complete statutory credentials
app.post('/api/admin/counselor-applications', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const trackingId = req.body.trackingId || `TVS-SEC-${randomSuffix}`;

  const application: CounselorApplication = {
    id: `capp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    trackingId,
    fullName: req.body.fullName || 'Unnamed Advisor',
    displayName: req.body.displayName || req.body.fullName || 'Advisor',
    email: (req.body.email || '').trim().toLowerCase(),
    phone: req.body.phone || '',
    whatsappNumber: req.body.whatsappNumber || req.body.phone || '',
    nationalIdNumber: req.body.nationalIdNumber || '',
    nationalIdType: req.body.nationalIdType || 'CNIC',
    idCardFrontUrl: req.body.idCardFrontUrl || '',
    idCardBackUrl: req.body.idCardBackUrl || '',
    documentProofUrl: req.body.documentProofUrl || '',
    policeVerificationRef: req.body.policeVerificationRef || '',
    licenseNumber: req.body.licenseNumber || '',
    issuingAuthority: req.body.issuingAuthority || 'Statutory Bar / Regulatory Board',
    agencyName: req.body.agencyName || '',
    physicalAddress: req.body.physicalAddress || '',
    city: req.body.city || '',
    country: req.body.country || 'Pakistan',
    postalCode: req.body.postalCode || '',
    gpsLocationOrIp: 'Admin Entry',
    taxIdOrNtn: req.body.taxIdOrNtn || '',
    bankName: req.body.bankName || '',
    bankAccountTitle: req.body.bankAccountTitle || req.body.fullName || '',
    iban: req.body.iban || '',
    swiftCode: req.body.swiftCode || '',
    emergencyContactName: req.body.emergencyContactName || '',
    emergencyContactPhone: req.body.emergencyContactPhone || '',
    emergencyContactRelation: req.body.emergencyContactRelation || '',
    expertise: Array.isArray(req.body.expertise) ? req.body.expertise : ['Study Visa', 'Visit Visa'],
    destinations: Array.isArray(req.body.destinations) ? req.body.destinations : ['UK', 'Canada'],
    visaCategories: Array.isArray(req.body.visaCategories) ? req.body.visaCategories : ['Study Visa'],
    languages: Array.isArray(req.body.languages) ? req.body.languages : ['English', 'Urdu'],
    experienceYears: Number(req.body.experienceYears) || 3,
    consultationDuration: Number(req.body.consultationDuration) || 45,
    consultationFee: Number(req.body.consultationFee) || 12000,
    preferredCurrency: req.body.preferredCurrency || 'PKR',
    bio: req.body.bio || '',
    status: req.body.status || 'pending_review',
    legalCaseStatus: req.body.legalCaseStatus || 'none',
    legalNotes: req.body.legalNotes || '',
    fraudRiskScore: Number(req.body.fraudRiskScore) || 0,
    antiFraudAgreementAccepted: true,
    submittedAt: new Date().toISOString(),
    reviewedAt: new Date().toISOString(),
    reviewedBy: req.user?.email || 'admin',
    adminNotes: req.body.adminNotes || '',
  };

  const created = db.addCounselorApplication(application);
  recordAudit(
    req.user?.email || 'admin',
    'COUNSELOR_DOSSIER_CREATED',
    'CounselorApplication',
    created.id,
    `Admin manually created dossier for ${created.fullName} (${created.trackingId})`
  );

  res.status(201).json({ success: true, application: created });
});

// Admin: Delete application
app.delete('/api/admin/counselor-applications/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  db.deleteCounselorApplication(req.params.id);
  recordAudit(
    req.user?.email || 'admin',
    'COUNSELOR_APP_DELETED',
    'CounselorApplication',
    req.params.id,
    `Application ${req.params.id} permanently removed`
  );
  res.json({ success: true, message: 'Application deleted.' });
});

// Netlify ZIP Download Endpoints
app.get('/api/download/netlify-zip', (_req, res) => {
  const filePath = path.resolve(__dirname, 'the-visa-syndicate-netlify-deploy.zip');
  res.download(filePath, 'the-visa-syndicate-netlify-deploy.zip');
});

app.get('/api/download/source-tar', (_req, res) => {
  const filePath = path.resolve(__dirname, 'the-visa-syndicate-source.tar.gz');
  res.download(filePath, 'the-visa-syndicate-source.tar.gz');
});

// ==========================================
// START SERVER WITH VITE DEV MIDDLEWARES
// ==========================================
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[The Visa Syndicate Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
