import React, { useState, useEffect } from 'react';
import { api, PublicCounselor } from '../lib/api';
import { SUPPORTED_CURRENCIES, convertPkrFee } from '../lib/currencies';
import {
  UserCheck,
  Calendar,
  Clock,
  Globe2,
  Languages,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  Lock,
  UserPlus,
} from 'lucide-react';

interface CounselorsSectionProps {
  onBookWithCounselor: (counselor?: PublicCounselor) => void;
  onOpenEligibility: () => void;
  onOpenJoinUs?: () => void;
  onOpenTrustModal?: () => void;
}

export const CounselorsSection: React.FC<CounselorsSectionProps> = ({
  onBookWithCounselor,
  onOpenEligibility,
  onOpenJoinUs,
  onOpenTrustModal,
}) => {
  const [counselors, setCounselors] = useState<PublicCounselor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('PKR');

  const fetchCounselors = async () => {
    setLoading(true);
    try {
      const data = await api.getPublicCounselors();
      setCounselors(data);
    } catch (err) {
      console.error('Failed to load public counselors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounselors();
  }, []);

  const filteredCounselors = counselors.filter((c) => {
    if (selectedFilter === 'All') return true;
    return (
      c.destinations.includes(selectedFilter) ||
      c.visaCategories.some((v) => v.toLowerCase().includes(selectedFilter.toLowerCase()))
    );
  });

  return (
    <section id="counselors" className="py-16 sm:py-24 bg-[#FAF8F6] border-t border-[#E9DAD9]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Worldwide Sovereign Advisory Top Strip */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-950/90 via-[#3B070D] to-black text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600/30 border border-red-500/40 flex items-center justify-center text-red-300 shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="font-bold text-xs text-white block">
                Worldwide Sovereign Advisory · Zero-Fraud Escrow Guarantee
              </span>
              <span className="text-[11px] text-white/70">
                All counselor fees are protected in segregated escrow until your consultation is completed.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onOpenTrustModal && (
              <button
                onClick={onOpenTrustModal}
                className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Verify Counselor License
              </button>
            )}
            {onOpenJoinUs && (
              <button
                onClick={onOpenJoinUs}
                className="px-4 py-1.5 rounded-full bg-[#C8101E] hover:bg-[#E31B2F] text-xs font-bold text-white shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Join As Counselor</span>
              </button>
            )}
          </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C8101E]"></span>
              <span className="text-xs font-bold tracking-widest text-[#760B16] uppercase">
                ACCREDITED WORLDWIDE ADVISORY PANEL
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif-brand font-bold text-[#202124]">
              Meet Our Verified Visa Counselors
            </h2>
            <p className="text-[#6B7078] text-sm sm:text-base leading-relaxed">
              Book confidential consultation sessions with vetted statutory specialists across 120+ countries. Every profile is independently audited and backed by government-verified identity and escrow security.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchCounselors}
              className="p-2.5 bg-white border border-[#E9DAD9] hover:bg-[#F1EEEC] text-[#6B7078] rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Refresh roster"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#C8101E]' : ''}`} />
              <span className="hidden sm:inline">Sync Roster</span>
            </button>
            <button
              onClick={() => onBookWithCounselor(undefined)}
              className="px-5 py-2.5 bg-[#C8101E] hover:bg-[#760B16] text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm hover:shadow transition-colors cursor-pointer"
            >
              General Consultation
            </button>
          </div>
        </div>

        {/* Filters & Multi-Currency Switcher Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {/* Destination / Service Filters */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-[#E9DAD9] shadow-2xs">
            {['All', 'UK', 'Canada', 'USA', 'Australia', 'Europe', 'Study', 'Visit'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  selectedFilter === filter
                    ? 'bg-[#C8101E] text-white shadow-xs'
                    : 'text-[#6B7078] hover:text-[#202124] hover:bg-[#FAF8F6]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* MULTI-CURRENCY SELECTOR */}
          <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-[#E9DAD9] shadow-2xs">
            <span className="text-[10px] font-bold text-[#760B16] uppercase tracking-wider pl-2 hidden sm:inline">
              Fee Currency:
            </span>
            <div className="flex flex-wrap items-center gap-1">
              {SUPPORTED_CURRENCIES.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => setSelectedCurrency(curr.code)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    selectedCurrency === curr.code
                      ? 'bg-[#C8101E] text-white shadow-xs'
                      : 'text-[#6B7078] hover:text-[#202124] hover:bg-[#FAF8F6]'
                  }`}
                  title={curr.name}
                >
                  <span>{curr.flag}</span>
                  <span>{curr.code}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-[#E9DAD9] shadow-2xs animate-pulse space-y-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-200"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-12 bg-slate-200 rounded"></div>
                <div className="h-8 bg-slate-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* STRICT EMPTY STATE: Displayed when DB contains 0 published counselors */}
        {!loading && counselors.length === 0 && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E9DAD9] shadow-sm text-center max-w-3xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#C8101E]/10 text-[#C8101E] flex items-center justify-center mx-auto">
              <UserCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="text-xl sm:text-2xl font-serif-brand font-bold text-[#202124]">
                Advisory Roster Currently Updating
              </h3>
              <p className="text-sm text-[#6B7078] leading-relaxed">
                In strict accordance with our verified credentials policy, public counselor profiles are
                published only following direct administrative credential vetting and roster publication.
              </p>
            </div>

            {/* Explanatory Banner */}
            <div className="bg-[#FAF8F6] rounded-2xl p-4 sm:p-5 border border-[#E9DAD9] text-left text-xs text-[#202124] space-y-2 max-w-xl mx-auto">
              <div className="flex items-center gap-2 font-bold text-[#760B16]">
                <ShieldAlert className="w-4 h-4 text-[#C8101E]" />
                <span>Zero Fictional Profile Guarantee</span>
              </div>
              <p className="text-[#6B7078] text-xs">
                The Visa Syndicate does not display placeholder or fictional counselors. You can proceed with a
                centralized case evaluation through our Senior Advisory Panel, or log into the administrator console
                to publish certified counselors.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => onBookWithCounselor(undefined)}
                className="px-6 py-3 bg-[#C8101E] hover:bg-[#760B16] text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm hover:shadow transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Book General Advisory Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {onOpenJoinUs && (
                <button
                  onClick={onOpenJoinUs}
                  className="px-6 py-3 bg-[#760B16] hover:bg-[#C8101E] text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm hover:shadow transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Join As Counselor</span>
                </button>
              )}
              <button
                onClick={onOpenEligibility}
                className="px-6 py-3 bg-white hover:bg-[#FAF8F6] text-[#202124] border border-[#E9DAD9] text-xs sm:text-sm font-semibold rounded-full transition-colors cursor-pointer"
              >
                Free Eligibility Assessment
              </button>
            </div>
          </div>
        )}

        {/* Counselors Grid (when published by admin) */}
        {!loading && filteredCounselors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCounselors.map((counselor) => (
              <div
                key={counselor.id}
                className="bg-white rounded-2xl p-6 border border-[#E9DAD9] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Counselor Top Header */}
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[#FAF8F6] border-2 border-[#E9DAD9] shrink-0">
                      {counselor.photoUrl ? (
                        <img
                          src={counselor.photoUrl}
                          alt={counselor.displayName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-bold text-[#C8101E] bg-[#C8101E]/10">
                          {counselor.displayName.charAt(0)}
                        </div>
                      )}
                      {counselor.isFeatured && (
                        <div
                          className="absolute -bottom-1 -right-1 bg-[#C8101E] text-white p-1 rounded-full shadow-xs"
                          title="Featured Counselor"
                        >
                          <Sparkles className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-[#202124] group-hover:text-[#C8101E] transition-colors truncate">
                        {counselor.displayName}
                      </h3>
                      <p className="text-xs font-medium text-[#760B16] mt-0.5 truncate">
                        {counselor.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#6B7078]">
                        <span>{counselor.experienceYears}+ Years Exp.</span>
                        <span>·</span>
                        <span>{counselor.consultationDuration} min session</span>
                      </div>
                    </div>
                  </div>

                  {/* Biography */}
                  <p className="text-xs text-[#6B7078] line-clamp-3 leading-relaxed">
                    {counselor.bio || 'Specialist in student visa applications, financial documentation audits, and embassy interview coaching.'}
                  </p>

                  {/* Destinations & Visa Types */}
                  <div className="space-y-2 pt-2 border-t border-[#F1EEEC]">
                    <div className="flex items-center gap-1.5 text-xs text-[#202124]">
                      <Globe2 className="w-3.5 h-3.5 text-[#C8101E] shrink-0" />
                      <span className="font-semibold text-[11px]">Destinations:</span>
                      <span className="text-[11px] text-[#6B7078] truncate">
                        {counselor.destinations.join(', ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#202124]">
                      <Languages className="w-3.5 h-3.5 text-[#C8101E] shrink-0" />
                      <span className="font-semibold text-[11px]">Languages:</span>
                      <span className="text-[11px] text-[#6B7078] truncate">
                        {counselor.languages.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Footer with Fee and Booking CTA */}
                <div className="pt-4 mt-4 border-t border-[#E9DAD9] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#6B7078] uppercase font-semibold block leading-none">
                      Consultation Fee ({selectedCurrency})
                    </span>
                    <span className="text-base font-bold text-[#202124] font-mono block mt-0.5">
                      {convertPkrFee(counselor.consultationFee, selectedCurrency).formatted}
                    </span>
                    {selectedCurrency !== 'PKR' && (
                      <span className="text-[9.5px] text-[#6B7078] font-mono block mt-0.5">
                        Base: PKR {counselor.consultationFee.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onBookWithCounselor(counselor)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C8101E] hover:bg-[#760B16] text-white text-xs font-semibold rounded-full shadow-2xs hover:shadow transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Session</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
