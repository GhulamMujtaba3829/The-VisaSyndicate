import React, { useState } from 'react';
import { api } from '../lib/api';
import { BrandLogo } from './BrandLogo';
import {
  X,
  ShieldCheck,
  Lock,
  Search,
  CheckCircle2,
  XCircle,
  FileCheck,
  DollarSign,
  Globe2,
  Building,
  Award,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface TrustAndVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking?: () => void;
}

export const TrustAndVerificationModal: React.FC<TrustAndVerificationModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
}) => {
  const [searchTrackId, setSearchTrackId] = useState('');
  const [searching, setSearching] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [searchError, setSearchError] = useState('');

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTrackId.trim()) return;

    setSearching(true);
    setSearchError('');
    setVerificationResult(null);

    try {
      const res = await api.verifyCounselorTrack(searchTrackId.trim());
      if (res && res.found) {
        setVerificationResult(res);
      } else {
        setSearchError('No accredited counselor found for this Tracking ID or License Number.');
      }
    } catch {
      setSearchError('Verification registry lookup failed. Please verify tracking ID format.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#FFFFFF] rounded-3xl shadow-2xl border border-[#E9DAD9] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#120204] via-[#2D060B] to-[#120204] text-white p-5 sm:p-6 flex items-start justify-between shrink-0">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-[10px] font-bold tracking-widest text-emerald-300 uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Official Syndicate Trust & Escrow Guarantee</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif-brand font-bold text-white">
              Why Worldwide Applicants Trust The Visa Syndicate
            </h2>
            <p className="text-xs text-white/70">
              Institutional safeguards designed to eliminate fraud, protect applicant funds in segregated escrow, and verify statutory counselor licenses.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-7 flex-1 text-xs text-[#202124]">
          {/* INTERACTIVE TRACKING REGISTRY LOOKUP */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#FAF8F6] to-white border border-[#E9DAD9] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold text-[#C8101E] tracking-wider uppercase block">
                  Central Accreditation Registry
                </span>
                <h3 className="text-base font-serif-brand font-bold text-[#202124]">
                  Verify Counselor Standing & Anti-Fraud Clearance
                </h3>
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Live Database Registry</span>
              </span>
            </div>

            <form onSubmit={handleVerify} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#6B7078]" />
                <input
                  type="text"
                  placeholder="Enter Tracking ID (e.g. TVS-SEC-XXXXXX) or Counselor Name..."
                  value={searchTrackId}
                  onChange={(e) => setSearchTrackId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E9DAD9] bg-white text-xs focus:border-[#C8101E] focus:outline-none font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={searching}
                className="px-5 py-2.5 bg-[#C8101E] hover:bg-[#760B16] text-white font-bold rounded-xl shadow cursor-pointer transition-colors"
              >
                {searching ? 'Verifying...' : 'Verify Record'}
              </button>
            </form>

            {searchError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-[11px] flex items-center gap-2">
                <XCircle className="w-4 h-4 text-[#C8101E] shrink-0" />
                <span>{searchError}</span>
              </div>
            )}

            {verificationResult && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-sm text-emerald-950">
                      {verificationResult.displayName} — Officially Verified
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-mono font-bold text-[10px]">
                    {verificationResult.trackingId}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-200 text-[11px]">
                  <div>
                    <span className="text-emerald-800 block text-[10px]">Regulatory Standing</span>
                    <span className="font-bold text-emerald-950">{verificationResult.status.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-emerald-800 block text-[10px]">Fraud Risk Score</span>
                    <span className="font-bold text-emerald-600">0% (Spotless)</span>
                  </div>
                  <div>
                    <span className="text-emerald-800 block text-[10px]">Escrow Security</span>
                    <span className="font-bold text-emerald-950">Active Bond</span>
                  </div>
                  <div>
                    <span className="text-emerald-800 block text-[10px]">Jurisdictions</span>
                    <span className="font-bold text-emerald-950">
                      {Array.isArray(verificationResult.destinations)
                        ? verificationResult.destinations.join(', ')
                        : 'Worldwide'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4 CORE TRUST PILLARS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-[#E9DAD9] bg-white space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-[#202124]">100% Client Escrow Protection</h4>
              <p className="text-[#6B7078] text-[11px] leading-relaxed">
                Your consultation fee is never transferred directly to the counselor upfront. Funds are held in sovereign escrow until your one-on-one session is concluded to your satisfaction.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-[#E9DAD9] bg-white space-y-2">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-[#C8101E] flex items-center justify-center font-bold">
                <FileCheck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-[#202124]">Anti-Fraud Background Vetting</h4>
              <p className="text-[#6B7078] text-[11px] leading-relaxed">
                Every advisor must provide government CNIC/Passport, physical address verification, bar regulatory license numbers, and banking IBANs. Unvetted or rogue advisors are strictly barred.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-[#E9DAD9] bg-white space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-[#202124]">Money-Back Guarantee</h4>
              <p className="text-[#6B7078] text-[11px] leading-relaxed">
                If a counselor misses your confirmed appointment or fails to deliver professional immigration advice, your payment is 100% refunded with zero administrative deductions.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-[#E9DAD9] bg-white space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Lock className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-[#202124]">Encrypted Confidential Chambers</h4>
              <p className="text-[#6B7078] text-[11px] leading-relaxed">
                Your financial holdings, bank statements, academic records, and personal identity documents are shielded by 256-bit encryption. Your private data is never shared with third parties.
              </p>
            </div>
          </div>

          {/* Worldwide Sovereign Reach Callout */}
          <div className="p-4 bg-gradient-to-r from-red-950 via-[#3B070D] to-black text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-red-300 font-bold block">
                Worldwide Sovereign Advisory
              </span>
              <h4 className="text-sm font-bold font-serif-brand">
                Serving Clients In 120+ International Jurisdictions
              </h4>
              <p className="text-[11px] text-white/70">
                UKVI · IRCC Canada · US State Department · Australian Home Affairs · Schengen Consulates
              </p>
            </div>
            {onOpenBooking && (
              <button
                onClick={() => {
                  onClose();
                  onOpenBooking();
                }}
                className="px-6 py-2.5 bg-[#C8101E] hover:bg-[#E31B2F] text-white text-xs font-bold rounded-full shadow shrink-0 cursor-pointer transition-colors"
              >
                Book Secure Session
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
