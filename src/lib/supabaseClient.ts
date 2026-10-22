import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://iigkhztddzlufeojhjie.supabase.co';

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
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
    .order('submitted_at', { ascending: false });

  if (error || !data || data.length === 0) {
    const fallback = await supabase
      .from('counselor_applications')
      .select('*')
      .order('submitted_at', { ascending: false });
    if (!fallback.error && fallback.data) {
      data = fallback.data;
    }
  }

  return (data || []).map((row: any) => ({
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
