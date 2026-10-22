import React, { useState, useEffect } from 'react';
import { CounselorApplication } from '../lib/api';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  UserCheck,
  Camera,
  FileText,
  Printer,
  Copy,
  Check,
  Lock,
  Building,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  ExternalLink,
} from 'lucide-react';

// ==========================================
// 1. EDIT FULL STATUTORY DOSSIER MODAL
// ==========================================
interface EditDossierModalProps {
  isOpen: boolean;
  dossier: CounselorApplication | null;
  onClose: () => void;
  onSave: (updates: Partial<CounselorApplication>) => void;
  saving: boolean;
}

export const EditDossierModal: React.FC<EditDossierModalProps> = ({
  isOpen,
  dossier,
  onClose,
  onSave,
  saving,
}) => {
  const [formData, setFormData] = useState<Partial<CounselorApplication>>({});

  useEffect(() => {
    if (dossier) {
      setFormData({ ...dossier });
    }
  }, [dossier]);

  if (!isOpen || !dossier) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-[#1A0306] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-red-500/30 overflow-hidden my-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-red-950 via-[#3B070D] to-black border-b border-red-500/20 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-red-600/30 text-[10px] font-mono font-bold text-red-200 uppercase tracking-widest border border-red-500/40">
                {dossier.trackingId}
              </span>
              <span className="text-[10px] text-stone-400">Statutory Legal Dossier</span>
            </div>
            <h3 className="text-xl font-bold font-serif-brand text-white">
              Manage Statutory Tracking & Legal Vetting: {dossier.fullName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {/* Section 1: Government Identity & ID Card Photos */}
          <div className="space-y-3 p-4 bg-white/[0.02] rounded-2xl border border-white/5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2 text-red-300">
              <Camera className="w-4 h-4 text-red-400" />
              <span>1. Government Identity & ID Card Photo Records (CNIC / Passport)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-stone-400 uppercase">
                  National ID / CNIC Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nationalIdNumber || ''}
                  onChange={(e) => setFormData({ ...formData, nationalIdNumber: e.target.value })}
                  placeholder="e.g. 37405-1234567-1"
                  className="w-full px-3 py-2 bg-black/40 border border-red-500/20 rounded-xl text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-stone-400 uppercase">
                  Document ID Type
                </label>
                <select
                  value={formData.nationalIdType || 'CNIC'}
                  onChange={(e) => setFormData({ ...formData, nationalIdType: e.target.value as any })}
                  className="w-full px-3 py-2 bg-black/40 border border-red-500/20 rounded-xl text-white focus:outline-none focus:border-red-500"
                >
                  <option value="CNIC">NADRA CNIC (Pakistan)</option>
                  <option value="Passport">International Passport</option>
                  <option value="National ID">Foreign National ID Card</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-stone-400 uppercase">
                  Police Verification / Character Ref #
                </label>
                <input
                  type="text"
                  value={formData.policeVerificationRef || ''}
                  onChange={(e) => setFormData({ ...formData, policeVerificationRef: e.target.value })}
                  placeholder="e.g. POL-VER-2026-981"
                  className="w-full px-3 py-2 bg-black/40 border border-red-500/20 rounded-xl text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* ID Card Front & Back URLs with Live Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2 p-3 bg-black/30 rounded-xl border border-white/5">
                <label className="text-[10.5px] font-bold text-stone-300 uppercase block">
                  CNIC / ID Card Front Photo URL
                </label>
                <input
                  type="url"
                  value={formData.idCardFrontUrl || ''}
                  onChange={(e) => setFormData({ ...formData, idCardFrontUrl: e.target.value })}
                  placeholder="https://... (Front Image Link)"
                  className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-[11px] text-white focus:outline-none focus:border-red-500 font-mono"
                />
                {formData.idCardFrontUrl ? (
                  <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden border border-white/10 bg-black/60">
                    <img
                      src={formData.idCardFrontUrl}
                      alt="ID Front Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-20 rounded-lg border border-dashed border-white/10 flex items-center justify-center text-stone-500 text-[10px]">
                    No Front ID Image Linked
                  </div>
                )}
              </div>

              <div className="space-y-2 p-3 bg-black/30 rounded-xl border border-white/5">
                <label className="text-[10.5px] font-bold text-stone-300 uppercase block">
                  CNIC / ID Card Back Photo URL
                </label>
                <input
                  type="url"
                  value={formData.idCardBackUrl || ''}
                  onChange={(e) => setFormData({ ...formData, idCardBackUrl: e.target.value })}
                  placeholder="https://... (Back Image Link)"
                  className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-[11px] text-white focus:outline-none focus:border-red-500 font-mono"
                />
                {formData.idCardBackUrl ? (
                  <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden border border-white/10 bg-black/60">
                    <img
                      src={formData.idCardBackUrl}
                      alt="ID Back Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-20 rounded-lg border border-dashed border-white/10 flex items-center justify-center text-stone-500 text-[10px]">
                    No Back ID Image Linked
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <label className="text-[10.5px] font-bold text-stone-400 uppercase">
                Bar / Consultancy License Proof Document URL
              </label>
              <input
                type="url"
                value={formData.documentProofUrl || ''}
                onChange={(e) => setFormData({ ...formData, documentProofUrl: e.target.value })}
                placeholder="https://... (PDF or image scan of bar license / degree)"
                className="w-full px-3 py-2 bg-black/40 border border-red-500/20 rounded-xl text-white font-mono focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Section 2: Physical Traceability & Contact Records */}
          <div className="space-y-3 p-4 bg-white/[0.02] rounded-2xl border border-white/5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2 text-red-300">
              <MapPin className="w-4 h-4 text-red-400" />
              <span>2. Physical Residential / Chamber Address & Emergency Contacts</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10.5px] font-bold text-stone-400 uppercase">
                  Complete Physical Address (For Legal Notice Serving) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.physicalAddress || ''}
                  onChange={(e) => setFormData({ ...formData, physicalAddress: e.target.value })}
                  placeholder="House/Office #, Street, Sector/Chambers"
                  className="w-full px-3 py-2 bg-black/40 border border-red-500/20 rounded-xl text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-stone-400 uppercase">
                  City & Country *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                    className="w-full px-2.5 py-2 bg-black/40 border border-red-500/20 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                  <input
                    type="text"
                    value={formData.country || ''}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Country"
                    className="w-full px-2.5 py-2 bg-black/40 border border-red-500/20 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-stone-400 uppercase">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  value={formData.emergencyContactName || ''}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  placeholder="e.g. Aslam Khan (Brother)"
                  className="w-full px-3 py-2 bg-black/40 border border-red-500/20 rounded-xl text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-stone-400 uppercase">
                  Emergency Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.emergencyContactPhone || ''}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  placeholder="+92 300 0000000"
                  className="w-full px-3 py-2 bg-black/40 border border-red-500/20 rounded-xl text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-stone-400 uppercase">
                  Relationship
                </label>
                <input
                  type="text"
                  value={formData.emergencyContactRelation || ''}
                  onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                  placeholder="e.g. Brother / Spouse / Partner"
                  className="w-full px-3 py-2 bg-black/40 border border-red-500/20 rounded-xl text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Statutory Authority & Bank Coordinates */}
          <div className="space-y-3 p-4 bg-white/[0.02] rounded-2xl border border-white/5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2 text-red-300">
              <CreditCard className="w-4 h-4 text-red-400" />
              <span>3. Statutory Bar Authority & Financial Banking Coordinates</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-stone-400 uppercase">
                  License / Registration Number
                </label>
                <input
                  type="text"
                  value={formData.licenseNumber || ''}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  placeholder="Bar Council or MARA/OISC ID"
                  className="w-full px-3 py-2 bg-black/40 border border-red-500/20 rounded-xl text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-stone-400 uppercase">
                  Issuing Bar / Legal Authority
                </label>
                <input
                  type="text"
                  value={formData.issuingAuthority || ''}
                  onChange={(e) => setFormData({ ...formData, issuingAuthority: e.target.value })}
                  placeholder="e.g. Islamabad High Court Bar / Punjab Bar"
                  className="w-full px-3 py-2 bg-black/40 border border-red-500/20 rounded-xl text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-stone-400 uppercase">
                  Bank Name & Account Title
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.bankName || ''}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    placeholder="Bank (e.g. SadaPay, HBL)"
                    className="w-full px-2.5 py-2 bg-black/40 border border-red-500/20 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                  <input
                    type="text"
                    value={formData.bankAccountTitle || ''}
                    onChange={(e) => setFormData({ ...formData, bankAccountTitle: e.target.value })}
                    placeholder="Title"
                    className="w-full px-2.5 py-2 bg-black/40 border border-red-500/20 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-stone-400 uppercase">
                  Bank IBAN / Account Number
                </label>
                <input
                  type="text"
                  value={formData.iban || ''}
                  onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                  placeholder="PK... or Account Number"
                  className="w-full px-3 py-2 bg-black/40 border border-red-500/20 rounded-xl text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Legal Case & Investigation Tracking */}
          <div className="space-y-3 p-4 bg-red-950/30 rounded-2xl border border-red-500/30">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2 text-red-200">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>4. Legal Case Tracking & Anti-Fraud Action Status</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-stone-300 uppercase">
                  Legal Tracking Status
                </label>
                <select
                  value={formData.legalCaseStatus || 'none'}
                  onChange={(e) => setFormData({ ...formData, legalCaseStatus: e.target.value as any })}
                  className="w-full px-3 py-2 bg-black/60 border border-red-500/30 rounded-xl text-white font-semibold focus:outline-none focus:border-red-500"
                >
                  <option value="none">Clean · In Good Standing</option>
                  <option value="under_review">Under Statutory Audit</option>
                  <option value="notice_dispatched">Legal Notice Dispatched</option>
                  <option value="police_dossier_filed">Police / FIR Dossier Filed</option>
                  <option value="blacklisted">Blacklisted from Practice</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-stone-300 uppercase">
                  Profile Status
                </label>
                <select
                  value={formData.status || 'pending_review'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-black/60 border border-red-500/30 rounded-xl text-white font-semibold focus:outline-none focus:border-red-500"
                >
                  <option value="pending_review">Pending Review</option>
                  <option value="verified_approved">Verified & Approved</option>
                  <option value="suspended">Suspended</option>
                  <option value="legal_investigation">Under Legal Investigation</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-stone-300 uppercase">
                  Fraud Risk Score (0 = Clean, 100 = Danger)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.fraudRiskScore ?? 0}
                  onChange={(e) => setFormData({ ...formData, fraudRiskScore: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-black/60 border border-red-500/30 rounded-xl text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <label className="text-[10.5px] font-bold text-stone-300 uppercase">
                Legal Case Log & Investigation Notes (For Court / Police Action)
              </label>
              <textarea
                rows={3}
                value={formData.legalNotes || ''}
                onChange={(e) => setFormData({ ...formData, legalNotes: e.target.value })}
                placeholder="Log all legal actions, NADRA verification timestamps, client dispute reports, or legal notice dispatch details here..."
                className="w-full px-3 py-2 bg-black/60 border border-red-500/30 rounded-xl text-white focus:outline-none focus:border-red-500 resize-none font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/20 text-stone-300 hover:text-white hover:bg-white/5 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-7 py-2.5 bg-gradient-to-r from-[#C8101E] to-[#8C0C16] hover:from-red-600 hover:to-red-800 text-white font-bold rounded-xl shadow-lg cursor-pointer transition-all disabled:opacity-50"
            >
              {saving ? 'Saving Dossier...' : 'Save Statutory Dossier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 2. PRINT / EXPORT LEGAL DOSSIER MODAL
// ==========================================
interface PrintDossierModalProps {
  isOpen: boolean;
  dossier: CounselorApplication | null;
  onClose: () => void;
}

export const PrintDossierModal: React.FC<PrintDossierModalProps> = ({
  isOpen,
  dossier,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !dossier) return null;

  const handleCopyText = () => {
    const textReport = `========================================================
THE VISA SYNDICATE - STATUTORY COUNSELOR INVESTIGATION DOSSIER
CONFIDENTIAL - FOR LAW ENFORCEMENT & LEGAL AUDIT PURPOSES
========================================================
Dossier Reference ID: ${dossier.trackingId}
Date Generated: ${new Date().toISOString()}

1. PRIMARY IDENTITY & STATUTORY CREDENTIALS:
- Full Legal Name: ${dossier.fullName}
- Display Name: ${dossier.displayName}
- Email: ${dossier.email}
- Phone / WhatsApp: ${dossier.phone}
- National ID (${dossier.nationalIdType}): ${dossier.nationalIdNumber}
- Bar / Agency License No: ${dossier.licenseNumber}
- Issuing Authority: ${dossier.issuingAuthority}
- Police Verification Ref: ${dossier.policeVerificationRef || 'N/A'}
- Practice / Firm: ${dossier.agencyName || 'Independent'}

2. PHYSICAL LOCATION FOR LEGAL SUMMONS:
- Verified Physical Address: ${dossier.physicalAddress}
- City & Country: ${dossier.city}, ${dossier.country} (${dossier.postalCode || 'N/A'})
- Network IP / GPS Stamp: ${dossier.gpsLocationOrIp || 'Domestic'}

3. FINANCIAL & TRANSACTION TRAIL:
- Bank Name: ${dossier.bankName}
- Account Title: ${dossier.bankAccountTitle}
- Account IBAN: ${dossier.iban}
- Swift Code / NTN: ${dossier.swiftCode || 'N/A'} / ${dossier.taxIdOrNtn || 'N/A'}

4. EMERGENCY CONTACTS (IMMEDIATE FAMILY / PARTNER):
- Contact Person: ${dossier.emergencyContactName || 'N/A'}
- Phone: ${dossier.emergencyContactPhone || 'N/A'}
- Relation: ${dossier.emergencyContactRelation || 'N/A'}

5. LEGAL CASE STATUS & FRAUD AUDIT:
- Current Status: ${dossier.status.toUpperCase()}
- Legal Action State: ${(dossier.legalCaseStatus || 'none').toUpperCase()}
- Fraud Risk Score: ${dossier.fraudRiskScore}%
- Investigation Notes:
${dossier.legalNotes || 'No active dispute logged.'}
========================================================`;

    navigator.clipboard.writeText(textReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-300 overflow-hidden my-6 text-[#202124]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-xs font-bold text-amber-300">
              LEGAL DOSSIER · {dossier.trackingId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Report' : 'Copy Text'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1 bg-[#C8101E] hover:bg-[#760B16] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
            <button onClick={onClose} className="text-stone-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Statutory Document Body */}
        <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto text-xs font-sans">
          {/* Document Header */}
          <div className="border-b-2 border-stone-800 pb-4 flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#760B16] block">
                The Visa Syndicate Compliance & Legal Registry
              </span>
              <h2 className="text-2xl font-serif-brand font-bold text-stone-900 mt-0.5">
                Statutory Counselor Tracking Dossier
              </h2>
              <span className="text-stone-500 text-[11px]">
                Maintained for statutory traceability, regulatory compliance, and legal action.
              </span>
            </div>
            <div className="text-right font-mono text-[11px] text-stone-600">
              <div>Ref: <strong className="text-red-700">{dossier.trackingId}</strong></div>
              <div>Date: {new Date().toLocaleDateString()}</div>
              <div>Status: <span className="font-bold text-stone-900">{dossier.status.toUpperCase()}</span></div>
            </div>
          </div>

          {/* Section 1: Counselor Identity */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-1">
              1. Statutory Identification & Credentials
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-stone-500 block text-[10px]">Full Legal Name</span>
                <span className="font-bold text-stone-900 text-sm">{dossier.fullName}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">National ID ({dossier.nationalIdType})</span>
                <span className="font-mono font-bold text-stone-900">{dossier.nationalIdNumber}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">Bar / License Number</span>
                <span className="font-mono font-bold text-stone-900">{dossier.licenseNumber}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">Issuing Authority</span>
                <span className="font-semibold text-stone-800">{dossier.issuingAuthority}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">Phone & WhatsApp</span>
                <span className="font-mono text-stone-900">{dossier.phone}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">Email Address</span>
                <span className="font-mono text-stone-900">{dossier.email}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Physical Address & Location */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-1">
              2. Physical Address for Legal Service
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-stone-500 block text-[10px]">Verified Residential / Chamber Address</span>
                <span className="font-medium text-stone-900">{dossier.physicalAddress}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">Jurisdiction</span>
                <span className="font-medium text-stone-900">{dossier.city}, {dossier.country} {dossier.postalCode}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Financial Banking Coordinates */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-1">
              3. Banking & Transaction Trail
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-stone-500 block text-[10px]">Bank Name</span>
                <span className="font-bold text-stone-900">{dossier.bankName}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">Account Title</span>
                <span className="font-semibold text-stone-900">{dossier.bankAccountTitle}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">IBAN Number</span>
                <span className="font-mono text-red-700 font-bold">{dossier.iban}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Emergency Contact */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-1">
              4. Emergency Contact & Guarantor Record
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-stone-500 block text-[10px]">Name</span>
                <span className="font-semibold text-stone-900">{dossier.emergencyContactName || 'N/A'}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">Phone</span>
                <span className="font-mono text-stone-900">{dossier.emergencyContactPhone || 'N/A'}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">Relationship</span>
                <span className="text-stone-900">{dossier.emergencyContactRelation || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Section 5: ID Photos Preview if Available */}
          {(dossier.idCardFrontUrl || dossier.idCardBackUrl) && (
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-1">
                5. National ID Card Photographic Records
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {dossier.idCardFrontUrl && (
                  <div>
                    <span className="text-[10px] text-stone-500 block mb-1">CNIC Front:</span>
                    <img
                      src={dossier.idCardFrontUrl}
                      alt="Front ID"
                      className="w-full max-h-48 object-contain rounded border border-stone-300 bg-stone-50"
                    />
                  </div>
                )}
                {dossier.idCardBackUrl && (
                  <div>
                    <span className="text-[10px] text-stone-500 block mb-1">CNIC Back:</span>
                    <img
                      src={dossier.idCardBackUrl}
                      alt="Back ID"
                      className="w-full max-h-48 object-contain rounded border border-stone-300 bg-stone-50"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 6: Legal Notes & Case Status */}
          <div className="space-y-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900">
              6. Legal Case Tracking Status: <span className="text-red-700">{(dossier.legalCaseStatus || 'none').toUpperCase()}</span>
            </h4>
            <p className="text-stone-700 font-mono text-[11px] whitespace-pre-wrap">
              {dossier.legalNotes || 'No legal infractions or client dispute notices on record.'}
            </p>
          </div>

          {/* Official Sign-off */}
          <div className="pt-6 border-t-2 border-stone-800 flex justify-between text-[10px] text-stone-500">
            <div>
              The Visa Syndicate Compliance Directorate · Automated Statutory Extract
            </div>
            <div>
              Official Record · Protected by Confidentiality Bylaws
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
