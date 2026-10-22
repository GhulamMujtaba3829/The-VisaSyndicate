import React from 'react';
import { BrandLogo } from './BrandLogo';
import { ShieldCheck, Lock, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
  onOpenJoinCounselor?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin, onOpenJoinCounselor }) => {
  return (
    <footer className="bg-white border-t border-[#E9DAD9] pt-14 pb-8 text-[#202124]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="md" />
            <p className="text-xs text-[#6B7078] leading-relaxed max-w-sm pt-2">
              The Visa Syndicate is a premier global immigration advisory offering institutional-grade
              case assessments, document audits, and verified counselor consultations.
            </p>
          </div>

          {/* Pathways */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#202124] uppercase tracking-wider">Visa Pathways</h4>
            <ul className="space-y-2 text-xs text-[#6B7078]">
              <li>
                <button onClick={() => onNavigate('study-visa')} className="hover:text-[#C8101E] transition-colors cursor-pointer">
                  Study Visa Advisory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('visit-visa')} className="hover:text-[#C8101E] transition-colors cursor-pointer">
                  Tourist & Family Visit
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('business-visa')} className="hover:text-[#C8101E] transition-colors cursor-pointer">
                  Corporate & Business
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('counselors')} className="hover:text-[#C8101E] transition-colors cursor-pointer">
                  Verified Counselors
                </button>
              </li>
            </ul>
          </div>

          {/* Destinations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#202124] uppercase tracking-wider">Destinations</h4>
            <ul className="space-y-2 text-xs text-[#6B7078]">
              <li>
                <button onClick={() => onNavigate('dest-uk')} className="hover:text-[#C8101E] transition-colors cursor-pointer">
                  United Kingdom
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dest-canada')} className="hover:text-[#C8101E] transition-colors cursor-pointer">
                  Canada
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dest-usa')} className="hover:text-[#C8101E] transition-colors cursor-pointer">
                  United States
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dest-australia')} className="hover:text-[#C8101E] transition-colors cursor-pointer">
                  Australia
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dest-europe')} className="hover:text-[#C8101E] transition-colors cursor-pointer">
                  Europe / Schengen Area
                </button>
              </li>
            </ul>
          </div>

          {/* Advisory & Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#202124] uppercase tracking-wider">Advisory & Access</h4>
            <div className="space-y-2 text-xs text-[#6B7078]">
              <div>
                <span className="font-semibold text-[#202124] block">Remote-First Consultation</span>
                <span>Virtual one-on-one sessions nationwide</span>
              </div>
              <div className="pt-2 flex flex-wrap items-center gap-2">
                {onOpenJoinCounselor && (
                  <button
                    onClick={onOpenJoinCounselor}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C8101E]/10 hover:bg-[#C8101E] text-[#C8101E] hover:text-white border border-[#C8101E]/20 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>Join Us as Counselor</span>
                  </button>
                )}
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F6] hover:bg-[#F1EEEC] text-[#760B16] border border-[#E9DAD9] rounded-lg font-semibold text-[11px] transition-colors cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-[#C8101E]" />
                  <span>Admin Console</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory Disclaimer */}
        <div className="p-4 bg-[#FAF8F6] rounded-2xl border border-[#E9DAD9] text-[11px] text-[#6B7078] leading-relaxed">
          <span className="font-bold text-[#202124] block mb-0.5">Statutory & Regulatory Notice:</span>
          The Visa Syndicate is an independent professional visa consulting practice. We are not an embassy, consulate, or
          government agency. Visa grants, processing times, and approvals are under the exclusive sovereign authority of the
          respective receiving country's immigration department. We do not guarantee visa issuances or endorse fraudulent claims.
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7078] pt-2 border-t border-[#F1EEEC]">
          <div>
            © {new Date().getFullYear()} The Visa Syndicate. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => onNavigate('learn')} className="hover:underline">Privacy Policy</button>
            <span>·</span>
            <button onClick={() => onNavigate('learn')} className="hover:underline">Terms of Service</button>
            <span>·</span>
            <button onClick={() => onNavigate('learn')} className="hover:underline">Cancellation & Refund Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
