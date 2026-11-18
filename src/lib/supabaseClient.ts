import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) ||
  'https://iigkhztddzlufeojhjie.supabase.co';

export const SUPABASE_ANON_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpZ2toenRkZHpsdWZlb2poamllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3MDE3NDksImV4cCI6MjEwNzI3Nzc0OX0.cb1NvJAxRvO6YLJ4r9g5aPXvoJhV8zN_UNfmNAShHEk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Direct Supabase Insertion for Visitor Enquiries.
 * Works on Vercel, Netlify, and all static deployments without requiring a Node backend.
 */
export async function insertEnquiryDirect(payload: {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  visa_category?: string;
  destination?: string;
  message?: string;
  status?: string;
  created_at?: string;
}) {
  const record = {
    id: payload.id || `enq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: payload.name.trim(),
    email: payload.email.trim(),
    phone: payload.phone?.trim() || '',
    visa_category: payload.visa_category || 'General Inquiry',
    destination: payload.destination || 'Unspecified',
    message: payload.message || '',
    status: payload.status || 'new',
    created_at: payload.created_at || new Date().toISOString(),
  };

  const { data, error } = await supabase.from('enquiries').insert([record]).select();
  if (error) {
    console.error('Supabase enquiries insert error:', error);
    throw new Error(error.message || 'Failed to insert enquiry into Supabase');
  }
  return data?.[0] || record;
}

/**
 * Direct Supabase Insertion for Counselor Applications / Requests.
 * Works on Vercel, Netlify, and all static deployments.
 */
export async function insertCounselorRequestDirect(payload: Record<string, any>) {
  const trackingId = payload.trackingId || payload.tracking_id || `TVS-SEC-${Math.floor(100000 + Math.random() * 900000)}`;
  const record = {
    id: payload.id || `capp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    tracking_id: trackingId,
    full_name: payload.fullName || payload.full_name || '',
    display_name: payload.displayName || payload.display_name || payload.fullName || '',
    email: (payload.email || '').trim().toLowerCase(),
    phone: payload.phone || '',
    whatsapp_number: payload.whatsappNumber || payload.whatsapp_number || payload.phone || '',
    national_id_number: payload.nationalIdNumber || payload.national_id_number || 'Pending',
    national_id_type: payload.nationalIdType || payload.national_id_type || 'CNIC',
    document_proof_url: payload.documentProofUrl || payload.document_proof_url || '',
    license_number: payload.licenseNumber || payload.license_number || 'Pending',
    issuing_authority: payload.issuingAuthority || payload.issuing_authority || 'Regulatory Board',
    agency_name: payload.agencyName || payload.agency_name || '',
    physical_address: payload.physicalAddress || payload.physical_address || '',
    city: payload.city || 'Islamabad',
    country: payload.country || 'Pakistan',
    postal_code: payload.postalCode || payload.postal_code || '',
    tax_id_or_ntn: payload.taxIdOrNtn || payload.tax_id_or_ntn || '',
    bank_name: payload.bankName || payload.bank_name || '',
    bank_account_title: payload.bankAccountTitle || payload.bank_account_title || '',
    iban: payload.iban || '',
    swift_code: payload.swiftCode || payload.swift_code || '',
    emergency_contact_name: payload.emergencyContactName || payload.emergency_contact_name || '',
    emergency_contact_phone: payload.emergencyContactPhone || payload.emergency_contact_phone || '',
    emergency_contact_relation: payload.emergencyContactRelation || payload.emergency_contact_relation || '',
    expertise: payload.expertise || ['Study Visa'],
    destinations: payload.destinations || ['UK'],
    visa_categories: payload.visaCategories || payload.visa_categories || ['Study Visa'],
    languages: payload.languages || ['English'],
    experience_years: Number(payload.experienceYears || payload.experience_years) || 3,
    consultation_duration: Number(payload.consultationDuration || payload.consultation_duration) || 45,
    consultation_fee: Number(payload.consultationFee || payload.consultation_fee) || 12000,
    preferred_currency: payload.preferredCurrency || payload.preferred_currency || 'PKR',
    bio: payload.bio || 'Accredited specialist.',
    status: payload.status || 'pending_review',
    fraud_risk_score: Number(payload.fraudRiskScore || payload.fraud_risk_score) || 0,
    anti_fraud_agreement_accepted: Boolean(payload.antiFraudAgreementAccepted || payload.anti_fraud_agreement_accepted),
    submitted_at: payload.submittedAt || payload.submitted_at || new Date().toISOString(),
  };

  // Try inserting into counselor_requests first
  let insertResult = await supabase.from('counselor_requests').insert([record]).select();
  if (insertResult.error) {
    console.warn('counselor_requests insert failed, trying counselor_applications:', insertResult.error);
    // Fallback to counselor_applications table
    const fallback = await supabase.from('counselor_applications').insert([record]).select();
    if (fallback.error) {
      console.error('Both counselor tables failed:', fallback.error);
      throw new Error(insertResult.error.message || fallback.error.message);
    }
    return fallback.data?.[0] || record;
  }

  return insertResult.data?.[0] || record;
}

/**
 * Fetch enquiries directly from Supabase.
 */
export async function fetchEnquiriesDirect() {
  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase fetch enquiries error:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || '',
    visaCategory: row.visa_category || row.visaCategory || 'General Inquiry',
    destination: row.destination || 'Unspecified',
    message: row.message || '',
    status: row.status || 'new',
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  }));
}

/**
 * Fetch counselor requests directly from Supabase.
 */
export async function fetchCounselorRequestsDirect() {
  let { data, error } = await supabase
    .from('counselor_requests')
    .select('*')
    .neq('status', 'deleted')
    .order('submitted_at', { ascending: false });

  if (error || !data || data.length === 0) {
    const fallback = await supabase
      .from('counselor_applications')
      .select('*')
      .neq('status', 'deleted')
      .order('submitted_at', { ascending: false });
    if (!fallback.error && fallback.data) {
      data = fallback.data;
    }
  }

  const cleanList = (data || []).filter((row: any) => row.status !== 'deleted');

  return cleanList.map((row: any) => ({
    id: row.id,
    trackingId: row.tracking_id || row.trackingId || '',
    fullName: row.full_name || row.fullName || '',
    displayName: row.display_name || row.displayName || row.full_name || '',
    email: row.email || '',
    phone: row.phone || '',
    whatsappNumber: row.whatsapp_number || row.whatsappNumber || '',
    nationalIdNumber: row.national_id_number || row.nationalIdNumber || '',
    nationalIdType: row.national_id_type || row.nationalIdType || 'CNIC',
    documentProofUrl: row.document_proof_url || row.documentProofUrl || '',
    licenseNumber: row.license_number || row.licenseNumber || '',
    issuingAuthority: row.issuing_authority || row.issuingAuthority || '',
    agencyName: row.agency_name || row.agencyName || '',
    physicalAddress: row.physical_address || row.physicalAddress || '',
    city: row.city || '',
    country: row.country || '',
    postalCode: row.postal_code || row.postalCode || '',
    gpsLocationOrIp: row.gps_location_or_ip || '127.0.0.1',
    taxIdOrNtn: row.tax_id_or_ntn || '',
    bankName: row.bank_name || '',
    bankAccountTitle: row.bank_account_title || '',
    iban: row.iban || '',
    swiftCode: row.swift_code || '',
    emergencyContactName: row.emergency_contact_name || '',
    emergencyContactPhone: row.emergency_contact_phone || '',
    emergencyContactRelation: row.emergency_contact_relation || '',
    expertise: row.expertise || ['Study Visa'],
    destinations: row.destinations || ['UK'],
    visaCategories: row.visa_categories || ['Study Visa'],
    languages: row.languages || ['English'],
    experienceYears: row.experience_years || 3,
    consultationDuration: row.consultation_duration || 45,
    consultationFee: row.consultation_fee || 12000,
    preferredCurrency: row.preferred_currency || 'PKR',
    bio: row.bio || '',
    status: row.status || 'pending_review',
    fraudRiskScore: row.fraud_risk_score || 0,
    antiFraudAgreementAccepted: Boolean(row.anti_fraud_agreement_accepted),
    submittedAt: row.submitted_at || new Date().toISOString(),
  }));
}

/**
 * Permanently delete or mark deleted a counselor application from Supabase.
 */
export async function deleteCounselorRequestDirect(id: string) {
  try {
    await supabase.from('counselor_requests').delete().eq('id', id);
  } catch (err) {
    console.warn('Supabase delete from counselor_requests:', err);
  }

  try {
    await supabase.from('counselor_applications').delete().eq('id', id);
  } catch (err) {
    console.warn('Supabase delete from counselor_applications:', err);
  }

  // Fallback: Also soft-delete by setting status = 'deleted'
  try {
    await supabase.from('counselor_requests').update({ status: 'deleted' }).eq('id', id);
    await supabase.from('counselor_applications').update({ status: 'deleted' }).eq('id', id);
  } catch {}
}

/**
 * ============================================================================
 * COUNSELORS PUBLIC & ADMIN SYNC VIA SUPABASE
 * Ensures counselor photo updates and new profiles publish across all browsers!
 * ============================================================================
 */

export async function fetchCounselorsDirect(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('counselors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map((c: any) => ({
      id: c.id,
      fullName: c.full_name || c.fullName || 'Counselor',
      displayName: c.display_name || c.displayName || c.full_name || 'Counselor',
      title: c.title || 'Immigration Consultant',
      email: c.email || '',
      phone: c.phone || '',
      bio: c.bio || '',
      photoUrl: c.photo_url || c.photoUrl || '',
      expertise: c.expertise || ['Study Visa', 'Visit Visa'],
      destinations: c.destinations || ['UK', 'Canada'],
      visaCategories: c.visa_categories || c.visaCategories || ['Study Visa'],
      languages: c.languages || ['English', 'Urdu'],
      experienceYears: Number(c.experience_years || c.experienceYears) || 3,
      consultationDuration: Number(c.consultation_duration || c.consultationDuration) || 45,
      consultationFee: Number(c.consultation_fee || c.consultationFee) || 12000,
      currency: c.currency || 'PKR',
      availabilityDays: c.availability_days || c.availabilityDays || ['Monday', 'Wednesday', 'Friday'],
      timeSlots: c.time_slots || c.timeSlots || ['02:00 PM - 02:45 PM'],
      isActive: c.is_active !== undefined ? c.is_active : (c.isActive ?? true),
      isPublic: c.is_public !== undefined ? c.is_public : (c.isPublic ?? true),
      isFeatured: Boolean(c.is_featured ?? c.isFeatured),
      createdAt: c.created_at || c.createdAt || new Date().toISOString(),
      updatedAt: c.updated_at || c.updatedAt || new Date().toISOString(),
    }));
  } catch (err) {
    console.warn('fetchCounselorsDirect exception:', err);
    return [];
  }
}

export async function upsertCounselorDirect(c: any): Promise<boolean> {
  try {
    const record = {
      id: c.id,
      full_name: c.fullName || c.displayName || 'Counselor',
      display_name: c.displayName || c.fullName || 'Counselor',
      title: c.title || 'Immigration Consultant',
      email: c.email || '',
      phone: c.phone || '',
      bio: c.bio || '',
      photo_url: c.photoUrl || c.photo_url || '',
      expertise: c.expertise || ['Study Visa'],
      destinations: c.destinations || ['UK'],
      visa_categories: c.visaCategories || c.visa_categories || ['Study Visa'],
      languages: c.languages || ['English'],
      experience_years: Number(c.experienceYears || c.experience_years) || 3,
      consultation_duration: Number(c.consultationDuration || c.consultation_duration) || 45,
      consultation_fee: Number(c.consultationFee || c.consultation_fee) || 12000,
      currency: c.currency || 'PKR',
      availability_days: c.availabilityDays || ['Monday', 'Wednesday', 'Friday'],
      time_slots: c.timeSlots || ['02:00 PM - 02:45 PM'],
      is_active: c.isActive ?? true,
      is_public: c.isPublic ?? true,
      is_featured: Boolean(c.isFeatured),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('counselors').upsert([record]);
    if (error) {
      console.warn('upsertCounselorDirect error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('upsertCounselorDirect exception:', err);
    return false;
  }
}

export async function deleteCounselorDirect(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('counselors').delete().eq('id', id);
    if (error) {
      console.warn('deleteCounselorDirect error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('deleteCounselorDirect exception:', err);
    return false;
  }
}

/**
 * ============================================================================
 * PAYMENTS & BOOKINGS SYNC VIA SUPABASE
 * Ensures client payment proof and booking records are stored in Supabase.
 * ============================================================================
 */

export async function fetchPaymentsDirect(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((p: any) => ({
      id: p.id,
      bookingId: p.booking_id || p.bookingId || '',
      bookingReference: p.booking_reference || p.bookingReference || '',
      amount: Number(p.amount) || 10000,
      currency: p.currency || 'PKR',
      method: p.method || 'sadapay',
      status: p.status || 'pending',
      transactionReference: p.transaction_reference || p.transactionReference || '',
      senderAccount: p.sender_account || p.senderAccount || '',
      proofNote: p.proof_note || p.proofNote || '',
      proofImage: p.proof_image || p.proofImage || '',
      verifiedBy: p.verified_by || p.verifiedBy || '',
      verifiedAt: p.verified_at || p.verifiedAt || '',
      createdAt: p.created_at || p.createdAt || new Date().toISOString(),
      customerName: p.customer_name || p.customerName || 'Client',
      customerEmail: p.customer_email || p.customerEmail || '',
      destination: p.destination || 'Global',
      visaCategory: p.visa_category || p.visaCategory || 'Consultation',
    }));
  } catch (err) {
    console.warn('fetchPaymentsDirect exception:', err);
    return [];
  }
}

export async function upsertPaymentDirect(p: any): Promise<boolean> {
  try {
    const record = {
      id: p.id,
      booking_id: p.bookingId,
      booking_reference: p.bookingReference,
      amount: Number(p.amount) || 10000,
      currency: p.currency || 'PKR',
      method: p.method || 'sadapay',
      status: p.status || 'pending',
      transaction_reference: p.transactionReference || '',
      sender_account: p.senderAccount || '',
      proof_note: p.proofNote || '',
      proof_image: p.proofImage || '',
      verified_by: p.verifiedBy || null,
      verified_at: p.verifiedAt || null,
      created_at: p.createdAt || new Date().toISOString(),
    };

    const { error } = await supabase.from('payments').upsert([record]);
    if (error) {
      console.warn('upsertPaymentDirect error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('upsertPaymentDirect exception:', err);
    return false;
  }
}

export async function fetchBookingsDirect(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((b: any) => ({
      id: b.id,
      referenceCode: b.reference_code || b.referenceCode || '',
      counselorId: b.counselor_id || b.counselorId || null,
      counselorName: b.counselor_name || b.counselorName || '',
      customerName: b.customer_name || b.customerName || '',
      customerEmail: b.customer_email || b.customerEmail || '',
      customerPhone: b.customer_phone || b.customerPhone || '',
      countryOfResidence: b.country_of_residence || b.countryOfResidence || '',
      destination: b.destination || '',
      visaCategory: b.visa_category || b.visaCategory || '',
      consultationType: b.consultation_type || b.consultationType || '',
      preferredDate: b.preferred_date || b.preferredDate || '',
      preferredTimeSlot: b.preferred_time_slot || b.preferredTimeSlot || '',
      reason: b.reason || '',
      language: b.language || 'English',
      notes: b.notes || '',
      status: b.status || 'pending_payment',
      fee: Number(b.fee) || 10000,
      currency: b.currency || 'PKR',
      createdAt: b.created_at || b.createdAt || new Date().toISOString(),
      updatedAt: b.updated_at || b.updatedAt || new Date().toISOString(),
    }));
  } catch (err) {
    console.warn('fetchBookingsDirect exception:', err);
    return [];
  }
}

export async function upsertBookingDirect(b: any): Promise<boolean> {
  try {
    const record = {
      id: b.id,
      reference_code: b.referenceCode,
      counselor_id: b.counselorId || null,
      counselor_name: b.counselorName || null,
      customer_name: b.customerName,
      customer_email: b.customerEmail,
      customer_phone: b.customerPhone,
      country_of_residence: b.countryOfResidence || '',
      destination: b.destination,
      visa_category: b.visaCategory,
      consultation_type: b.consultationType || '',
      preferred_date: b.preferredDate,
      preferred_time_slot: b.preferredTimeSlot,
      reason: b.reason || '',
      language: b.language || '',
      status: b.status || 'pending_payment',
      fee: Number(b.fee) || 10000,
      currency: b.currency || 'PKR',
      created_at: b.createdAt || new Date().toISOString(),
      updated_at: b.updatedAt || new Date().toISOString(),
    };

    const { error } = await supabase.from('bookings').upsert([record]);
    if (error) {
      console.warn('upsertBookingDirect error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('upsertBookingDirect exception:', err);
    return false;
  }
}
