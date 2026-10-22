import React, { useState } from 'react';
import { api, CounselorApplication } from '../lib/api';
import { BrandLogo } from './BrandLogo';
import { SUPPORTED_CURRENCIES } from '../lib/currencies';
import {
  X,
  ShieldCheck,
  Lock,
  UserCheck,
  AlertTriangle,
  Building,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  FileText,
  CheckCircle2,
  Upload,
  Globe2,
  Copy,
  Check,
  ArrowRight,
  MessageSquare,
  Download,
  ExternalLink,
} from 'lucide-react';
import {
  generateCounselorWhatsAppLink,
  openCounselorWhatsApp,
  formatCounselorApplicationForWhatsApp,
  ADMIN_WHATSAPP_NUMBER,
} from '../lib/whatsapp';
import { downloadDossierImage } from '../lib/dossierCanvas';

interface JoinCounselorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplicationSubmitted?: (application: CounselorApplication) => void;
}

export const JoinCounselorModal: React.FC<JoinCounselorModalProps> = ({
  isOpen,
  onClose,
  onApplicationSubmitted,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [completedApp, setCompletedApp] = useState<CounselorApplication | null>(null);
  const [copiedTrackId, setCopiedTrackId] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Identity & Statutory
    fullName: '',
    displayName: '',
    nationalIdType: 'CNIC' as 'CNIC' | 'Passport' | 'National ID',
    nationalIdNumber: '',
    documentProofUrl: '',
    licenseNumber: '',
    issuingAuthority: 'High Court Bar / Regulatory Board',
    agencyName: '',

    // Contact & Physical Location Tracking
    email: '',
    phone: '',
    whatsappNumber: '',
    physicalAddress: '',
    city: '',
    country: 'Pakistan',
    postalCode: '',

    // Emergency Contact
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',

    // Financial & Bank Tracking
    bankName: '',
    bankAccountTitle: '',
    iban: '',
    swiftCode: '',
    taxIdOrNtn: '',

    // Professional & Multi-Currency Fees
    expertise: 'Study Visa, University CAS Audit, 28-Day Holding Verification',
    destinations: 'UK, Canada, USA',
    visaCategories: 'Study Visa, Visit Visa',
    languages: 'English, Urdu',
    experienceYears: 4,
    consultationDuration: 45,
    consultationFee: 12000,
    preferredCurrency: 'PKR',
    bio: '',

    // Anti-Fraud Agreement
    antiFraudAgreementAccepted: false,
  });

  if (!isOpen) return null;

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Document size exceeds 5MB limit.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, documentProofUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.antiFraudAgreementAccepted) {
      setErrorMsg('You must sign and accept the Anti-Fraud Statutory Affidavit before submission.');
      return;
    }

    if (!formData.nationalIdNumber.trim()) {
      setErrorMsg('Government ID / CNIC / Passport number is mandatory for background tracking.');
      return;
    }

    if (!formData.iban.trim()) {
      setErrorMsg('Bank IBAN is mandatory for financial tracking and fraud prevention.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        expertise: formData.expertise.split(',').map((s) => s.trim()).filter(Boolean),
        destinations: formData.destinations.split(',').map((s) => s.trim()).filter(Boolean),
        visaCategories: formData.visaCategories.split(',').map((s) => s.trim()).filter(Boolean),
        languages: formData.languages.split(',').map((s) => s.trim()).filter(Boolean),
      };

      const result = await api.applyCounselor(payload);
      setCompletedApp(result.application);
      if (onApplicationSubmitted) {
        onApplicationSubmitted(result.application);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit application. Please check all fields.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyTrackId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedTrackId(true);
    setTimeout(() => setCopiedTrackId(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#FFFFFF] rounded-3xl shadow-2xl border border-[#E9DAD9] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Strip */}
        <div className="bg-gradient-to-r from-[#1E0306] via-[#3B070D] to-[#140204] text-white p-5 sm:p-6 flex items-start justify-between shrink-0">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/30 text-[10px] font-bold tracking-widest text-red-300 uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
              <span>Sovereign Accreditation & Anti-Fraud Vetting</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif-brand font-bold text-white">
              Join As Verified Global Counselor
            </h2>
            <p className="text-xs text-white/70 leading-relaxed">
              We uphold zero fraud tolerance. Every counselor profile is legally tracked, background-checked, and monitored to guarantee absolute safety and trust for client users worldwide.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-xs text-[#202124]">
          {completedApp ? (
            /* Success Confirmation Dossier */
            <div className="space-y-6 text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase block">
                  Accreditation Dossier Registered & Prepared for WhatsApp
                </span>
                <h3 className="text-2xl font-serif-brand font-bold text-[#202124]">
                  Application Under Security Review
                </h3>
                <p className="text-xs text-[#6B7078] max-w-lg mx-auto">
                  Your identity documents, bar license, and financial tracking data have been recorded. Transmit your dossier directly to Administrator Ghulam Mujtaba (+92 340 0131732) for instant verification.
                </p>
              </div>

              {/* Tracking ID Badge */}
              <div className="p-4 bg-[#FAF8F6] rounded-2xl border border-[#E9DAD9] max-w-md mx-auto space-y-2">
                <span className="text-[11px] text-[#6B7078] block font-medium">Your Official Tracking Dossier ID:</span>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl font-mono font-black text-[#C8101E] tracking-wider">
                    {completedApp.trackingId}
                  </span>
                  <button
                    onClick={() => handleCopyTrackId(completedApp.trackingId)}
                    className="p-1.5 rounded-lg bg-white border border-[#E9DAD9] hover:bg-[#F1EEEC] text-[#202124] transition-colors"
                    title="Copy Tracking ID"
                  >
                    {copiedTrackId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-[#6B7078]">
                  Save this Tracking ID. Clients and compliance officers can verify your standing using this ID.
                </p>
              </div>

              {/* Direct Actions: WhatsApp & Image Download */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
                <a
                  href={generateCounselorWhatsAppLink(completedApp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex-1 py-3 px-5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send on WhatsApp (+92 340 0131732)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    downloadDossierImage({
                      referenceId: completedApp.trackingId,
                      type: 'COUNSELOR_ACCREDITATION',
                      title: 'Official Counselor Accreditation Dossier Pass',
                      fullName: completedApp.fullName,
                      phone: completedApp.phone,
                      email: completedApp.email,
                      category: Array.isArray(completedApp.visaCategories) ? completedApp.visaCategories.join(', ') : 'Immigration Law',
                      destination: Array.isArray(completedApp.destinations) ? completedApp.destinations.join(', ') : 'Global',
                    }, `Counselor_Accreditation_Pass_${completedApp.trackingId}.png`);
                  }}
                  className="w-full sm:w-auto py-3 px-5 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Download Pass (Image PNG)</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-8 py-2.5 bg-stone-100 hover:bg-stone-200 text-[#202124] text-xs font-bold rounded-full transition-colors cursor-pointer"
                >
                  Close & Return
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#C8101E] shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* SECTION 1: STATUTORY IDENTITY & TRACKING */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#F1EEEC]">
                  <Lock className="w-4 h-4 text-[#C8101E]" />
                  <h3 className="font-bold text-sm text-[#202124] uppercase tracking-wider">
                    1. Statutory Identity & Government Registry
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#202124]">Full Legal Name (as on Passport/CNIC) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Barrister Tariq Mahmood"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] bg-white focus:border-[#C8101E] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-[#202124]">Public Profile / Display Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Tariq Mahmood (UK Specialist)"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] bg-white focus:border-[#C8101E] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#202124]">Govt ID Type *</label>
                    <select
                      value={formData.nationalIdType}
                      onChange={(e: any) => setFormData({ ...formData, nationalIdType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] bg-white focus:border-[#C8101E] focus:outline-none"
                    >
                      <option value="CNIC">National CNIC (Pakistan)</option>
                      <option value="Passport">International Passport</option>
                      <option value="National ID">Overseas National ID</option>
                    </select>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-semibold text-[#202124]">Government ID Number (Strictly Verified) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 35202-XXXXXXXX-X or Passport Number"
                      value={formData.nationalIdNumber}
                      onChange={(e) => setFormData({ ...formData, nationalIdNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] bg-white font-mono focus:border-[#C8101E] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#202124]">Regulatory License / Bar Reg No. *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. OISC / MARA / Bar Council Reg No."
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] bg-white focus:border-[#C8101E] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-[#202124]">Issuing Authority / Law Society *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Punjab Bar Council / High Court Bar"
                      value={formData.issuingAuthority}
                      onChange={(e) => setFormData({ ...formData, issuingAuthority: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] bg-white focus:border-[#C8101E] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#202124]">Upload ID / Passport Document Proof (Optional Scan)</label>
                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2 bg-[#FAF8F6] border border-[#E9DAD9] hover:bg-[#F1EEEC] rounded-xl cursor-pointer flex items-center gap-2 font-medium">
                      <Upload className="w-3.5 h-3.5 text-[#C8101E]" />
                      <span>{formData.documentProofUrl ? 'Change Document File' : 'Attach ID Scan (Max 5MB)'}</span>
                      <input type="file" accept="image/*,.pdf" onChange={handleDocumentUpload} className="hidden" />
                    </label>
                    {formData.documentProofUrl && (
                      <span className="text-emerald-700 flex items-center gap-1 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Document Attached</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 2: PHYSICAL ADDRESS & EMERGENCY TRACEABILITY */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#F1EEEC]">
                  <MapPin className="w-4 h-4 text-[#C8101E]" />
                  <h3 className="font-bold text-sm text-[#202124] uppercase tracking-wider">
                    2. Physical Location & Traceability Desk
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#202124]">Official Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="counselor@firm.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] bg-white focus:border-[#C8101E] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-[#202124]">Direct Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+92 300 1234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] bg-white focus:border-[#C8101E] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-[#202124]">Direct WhatsApp Number</label>
                    <input
                      type="tel"
                      placeholder="+92 300 1234567"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] bg-white focus:border-[#C8101E] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#202124]">Physical Office / Residential Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="Suite #, Building, Street, Area"
                    value={formData.physicalAddress}
                    onChange={(e) => setFormData({ ...formData, physicalAddress: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] bg-white focus:border-[#C8101E] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#202124]">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lahore / Islamabad / London"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] bg-white focus:border-[#C8101E] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-[#202124]">Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] bg-white focus:border-[#C8101E] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-[#202124]">Postal Code</label>
                    <input
                      type="text"
                      placeholder="e.g. 54000"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] bg-white focus:border-[#C8101E] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Emergency Traceability Contact */}
                <div className="p-3.5 bg-[#FAF8F6] rounded-2xl border border-[#E9DAD9] space-y-3">
                  <span className="font-bold text-[#202124] block">Secondary Emergency Verification Contact</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Contact Full Name"
                      value={formData.emergencyContactName}
                      onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                      className="px-3 py-2 rounded-xl border border-[#E9DAD9] bg-white"
                    />
                    <input
                      type="tel"
                      placeholder="Contact Phone Number"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                      className="px-3 py-2 rounded-xl border border-[#E9DAD9] bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Relationship (e.g. Partner / Co-Counsel)"
                      value={formData.emergencyContactRelation}
                      onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                      className="px-3 py-2 rounded-xl border border-[#E9DAD9] bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: BANKING DETAILS & FINANCIAL ACCOUNTABILITY */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#F1EEEC]">
                  <CreditCard className="w-4 h-4 text-[#C8101E]" />
                  <h3 className="font-bold text-sm text-[#202124] uppercase tracking-wider">
                    3. Banking Details & Payout IBAN
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#202124]">Bank Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Standard Chartered / HBL / SadaPay"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] bg-white focus:border-[#C8101E] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-[#202124]">Account Title (Must Match CNIC) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Exact title as on bank statement"
                      value={formData.bankAccountTitle}
                      onChange={(e) => setFormData({ ...formData, bankAccountTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] bg-white focus:border-[#C8101E] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-semibold text-[#202124]">Official IBAN (24 Characters) *</label>
                    <input
                      type="text"
                      required
                      placeholder="PKXX ABCD XXXXXXXXXXXXXXXX"
                      value={formData.iban}
                      onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] bg-white font-mono focus:border-[#C8101E] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-[#202124]">National Tax Number (NTN)</label>
                    <input
                      type="text"
                      placeholder="e.g. 1234567-8"
                      value={formData.taxIdOrNtn}
                      onChange={(e) => setFormData({ ...formData, taxIdOrNtn: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] bg-white font-mono focus:border-[#C8101E] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: PRACTICE & MULTI-CURRENCY CONSULTATION FEE */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#F1EEEC]">
                  <Globe2 className="w-4 h-4 text-[#C8101E]" />
                  <h3 className="font-bold text-sm text-[#202124] uppercase tracking-wider">
                    4. Professional Practice & Multi-Currency Fee
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#202124]">Destinations Covered (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.destinations}
                      onChange={(e) => setFormData({ ...formData, destinations: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] bg-white focus:border-[#C8101E] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-[#202124]">Visa Categories</label>
                    <input
                      type="text"
                      value={formData.visaCategories}
                      onChange={(e) => setFormData({ ...formData, visaCategories: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] bg-white focus:border-[#C8101E] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Multi-Currency Fee Settings */}
                <div className="p-4 bg-[#FAF8F6] rounded-2xl border border-[#E9DAD9] grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="space-y-1">
                    <label className="font-bold text-[#202124]">Preferred Currency *</label>
                    <select
                      value={formData.preferredCurrency}
                      onChange={(e) => setFormData({ ...formData, preferredCurrency: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E9DAD9] bg-white font-bold"
                    >
                      {SUPPORTED_CURRENCIES.map((curr) => (
                        <option key={curr.code} value={curr.code}>
                          {curr.flag} {curr.code} ({curr.name})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#202124]">Consultation Fee Amount *</label>
                    <input
                      type="number"
                      required
                      min={1000}
                      step={500}
                      value={formData.consultationFee}
                      onChange={(e) => setFormData({ ...formData, consultationFee: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E9DAD9] bg-white font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#202124]">Session Duration</label>
                    <select
                      value={formData.consultationDuration}
                      onChange={(e) => setFormData({ ...formData, consultationDuration: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E9DAD9] bg-white"
                    >
                      <option value={30}>30 Minutes</option>
                      <option value={45}>45 Minutes (Standard)</option>
                      <option value={60}>60 Minutes (Comprehensive)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#202124]">Professional Biography & High Commission Specialization *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Briefly describe your statutory immigration expertise, bar admissions, and track record..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] bg-white focus:border-[#C8101E] focus:outline-none"
                  />
                </div>
              </div>

              {/* SECTION 5: ANTI-FRAUD AFFIDAVIT & STATUTORY UNDERTAKING */}
              <div className="p-4 bg-red-50 rounded-2xl border border-red-200/80 space-y-3">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#C8101E] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-red-950 text-xs block">
                      Anti-Fraud Statutory Affidavit & Zero-Tolerance Guarantee
                    </span>
                    <p className="text-[11px] text-red-900 leading-relaxed">
                      I solemnly swear and legally undertake that all information provided is accurate and authentic. I understand that The Visa Syndicate operates under strict escrow protections: client fees are held in escrow until consultation completion. Any misrepresentation, fraudulent document filing, or unethical practice will trigger immediate forfeiture, disciplinary reporting to statutory law bodies, and civil/criminal prosecution.
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-2.5 pt-2 border-t border-red-200 cursor-pointer font-bold text-red-950 text-xs">
                  <input
                    type="checkbox"
                    required
                    checked={formData.antiFraudAgreementAccepted}
                    onChange={(e) => setFormData({ ...formData, antiFraudAgreementAccepted: e.target.checked })}
                    className="w-4 h-4 rounded accent-[#C8101E]"
                  />
                  <span>I agree to statutory verification, anti-fraud tracking, and escrow terms.</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full border border-[#E9DAD9] hover:bg-[#FAF8F6] text-[#202124] font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-[#C8101E] hover:bg-[#760B16] text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Registering Dossier...</span>
                  ) : (
                    <>
                      <span>Submit Accreditation Dossier</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
