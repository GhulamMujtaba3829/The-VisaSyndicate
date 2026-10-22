import React, { useState, useEffect } from 'react';
import { BrandAssets } from '../assets/images';
import { BrandLogo } from './BrandLogo';
import { api, SiteContent } from '../lib/api';
import {
  ArrowRight,
  Play,
  GraduationCap,
  Plane,
  Briefcase,
  MousePointer,
  Compass,
  Globe2,
  ShieldCheck,
  Lock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface HeroSectionProps {
  onCheckEligibility: () => void;
  onExploreServices: () => void;
  onSelectDestination: (dest: string) => void;
  onSelectServiceType: (service: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onCheckEligibility,
  onExploreServices,
  onSelectDestination,
  onSelectServiceType,
}) => {
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    api.getSiteContent().then((data) => setSiteContent(data)).catch(() => {});
  }, []);

  const heroImage = siteContent?.heroImageUrl || BrandAssets.heroTraveler;
  const imageCrop = siteContent?.heroImageCrop || 'center 28%';
  const showWatermark = siteContent?.heroShowWatermark === true; // Default false: clean cropped image without watermark as requested!
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#FAF8F6] to-[#FAF8F6] pt-4 sm:pt-8 pb-12">
      {/* Background Syndicate Council Picture (Without Face) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={BrandAssets.syndicateTrustCouncil}
          alt="The Visa Syndicate Sovereign Council"
          className="w-full h-full object-cover object-center opacity-25 filter contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFFFFF]/95 via-[#FAF8F6]/85 to-[#FAF8F6]/55"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-[#FAF8F6]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Value Proposition & Typography */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6 lg:pr-4">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-3">
              <span className="text-xs font-bold tracking-[0.22em] text-[#760B16] uppercase flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-[#C8101E]" />
                <span>WORLDWIDE SOVEREIGN PRACTICE · 120+ COUNTRIES</span>
              </span>
              <div className="w-12 h-[2px] bg-gradient-to-r from-[#C8101E] to-transparent"></div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] leading-[1.08] tracking-tight font-normal text-[#202124]">
              <span className="block font-serif-brand font-normal">
                {siteContent?.heroHeadline1 || 'Your Next Chapter'}
              </span>
              <span className="block font-serif-brand italic font-semibold text-[#C8101E] mt-1">
                {siteContent?.heroHeadline2 || 'Starts With Clarity.'}
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-[#6B7078] text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              {siteContent?.heroSubtitle ||
                'Explore global opportunities with expert guidance, personalized visa assessments and trusted consultation services — accessible worldwide across 120+ jurisdictions.'}
            </p>

            {/* High Trust Micro-Credentials */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Escrow Fund Security</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-800 border border-red-200/80 font-medium">
                <Lock className="w-3.5 h-3.5 text-[#C8101E]" />
                <span>Zero-Fraud Vetted Counsel</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onCheckEligibility}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#C8101E] hover:bg-[#760B16] text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Check Your Eligibility</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreServices}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-white hover:bg-[#F1EEEC] text-[#202124] border border-[#E9DAD9] text-sm font-semibold rounded-full shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer"
              >
                <span>Explore Our Services</span>
                <div className="w-6 h-6 rounded-full bg-[#C8101E] text-white flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
              </button>
            </div>

            {/* 3 Service Highlights directly below CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#E9DAD9]/70">
              {/* Study Visa */}
              <button
                onClick={() => onSelectServiceType('Study Visa')}
                className="text-left group p-2.5 rounded-xl hover:bg-white hover:shadow-2xs transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#C8101E]/10 text-[#C8101E] flex items-center justify-center mb-2 group-hover:bg-[#C8101E] group-hover:text-white transition-colors">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-[#202124] group-hover:text-[#C8101E] transition-colors">
                  Study Visa
                </h2>
                <p className="text-xs text-[#6B7078] mt-0.5">Your education. Global opportunities.</p>
                <div className="flex items-center text-[11px] font-semibold text-[#C8101E] mt-1 opacity-80 group-hover:opacity-100">
                  <span>Learn more</span>
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Visit Visa */}
              <button
                onClick={() => onSelectServiceType('Visit Visa')}
                className="text-left group p-2.5 rounded-xl hover:bg-white hover:shadow-2xs transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#C8101E]/10 text-[#C8101E] flex items-center justify-center mb-2 group-hover:bg-[#C8101E] group-hover:text-white transition-colors">
                  <Plane className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-[#202124] group-hover:text-[#C8101E] transition-colors">
                  Visit Visa
                </h2>
                <p className="text-xs text-[#6B7078] mt-0.5">Explore. Experience. Discover.</p>
                <div className="flex items-center text-[11px] font-semibold text-[#C8101E] mt-1 opacity-80 group-hover:opacity-100">
                  <span>Learn more</span>
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Business Visa */}
              <button
                onClick={() => onSelectServiceType('Business Visa')}
                className="text-left group p-2.5 rounded-xl hover:bg-white hover:shadow-2xs transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#C8101E]/10 text-[#C8101E] flex items-center justify-center mb-2 group-hover:bg-[#C8101E] group-hover:text-white transition-colors">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-[#202124] group-hover:text-[#C8101E] transition-colors">
                  Business Visa
                </h2>
                <p className="text-xs text-[#6B7078] mt-0.5">Build connections. Grow globally.</p>
                <div className="flex items-center text-[11px] font-semibold text-[#C8101E] mt-1 opacity-80 group-hover:opacity-100">
                  <span>Learn more</span>
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>

          {/* Right Column: Reference Artwork in Cloud-Shaped Frame with Luxury Watermark */}
          <div className="lg:col-span-6 relative flex justify-center items-center py-4">
            {/* SVG Definition for Smooth, Harmonious Cloud Silhouette */}
            <svg width="0" height="0" className="absolute pointer-events-none">
              <defs>
                <clipPath id="heroCloudShape" clipPathUnits="objectBoundingBox">
                  <path d="M 0.18 0.92 C 0.08 0.92 0.01 0.84 0.01 0.72 C 0.01 0.59 0.09 0.49 0.18 0.46 C 0.16 0.32 0.26 0.17 0.39 0.14 C 0.47 0.12 0.55 0.15 0.60 0.20 C 0.66 0.09 0.78 0.05 0.88 0.10 C 0.97 0.15 1.00 0.26 0.98 0.38 C 1.03 0.44 1.05 0.54 1.03 0.64 C 1.01 0.78 0.92 0.90 0.78 0.92 C 0.72 0.92 0.65 0.92 0.58 0.92 Z" />
                </clipPath>
              </defs>
            </svg>

            {/* Cloud Frame Container with Ambient Cloud Puff Glows */}
            <div className="relative w-full max-w-lg lg:max-w-xl group">
              {/* Cloud Ambient Background Halo / Outer Glow */}
              <div
                className="absolute inset-0 -m-3 bg-gradient-to-r from-[#C8101E]/25 via-amber-200/20 to-[#760B16]/25 blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ clipPath: 'url(#heroCloudShape)' }}
              ></div>

              {/* Cloud Outer Puffy Decorative Ring */}
              <div
                className="relative aspect-[16/11] w-full p-2.5 bg-gradient-to-b from-white via-[#FAF8F6] to-white/95 shadow-2xl filter drop-shadow-[0_20px_35px_rgba(200,16,30,0.15)] transition-transform duration-500 hover:scale-[1.012]"
                style={{ clipPath: 'url(#heroCloudShape)' }}
              >
                {/* Clipped Image Container */}
                <div
                  className="relative w-full h-full overflow-hidden bg-slate-900"
                  style={{ clipPath: 'url(#heroCloudShape)' }}
                >
                  <img
                    src={heroImage}
                    alt="International visa guidance and sovereign pathway consultation"
                    referrerPolicy="no-referrer"
                    style={{ objectPosition: imageCrop }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Subtle scrim overlay to allow badge readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none"></div>

                  {/* OPTIONAL WATERMARK OVERLAY (Only rendered if enabled by admin; by default cleanly cropped without watermark) */}
                  {showWatermark && (
                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-5 select-none animate-in fade-in duration-300">
                      {/* Top Right: Golden Shield Watermark & Official Crest */}
                      <div className="self-end bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-300/30 flex items-center gap-2 shadow-lg">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-200 flex items-center justify-center text-[9px] font-black text-black">
                          ★
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[9px] font-extrabold tracking-widest text-amber-200 uppercase leading-none drop-shadow">
                            {siteContent?.heroWatermarkText || 'THE VISA SYNDICATE'}
                          </span>
                          <span className="text-[7px] text-amber-100/75 tracking-wider uppercase mt-0.5 leading-none font-mono">
                            CERTIFIED ADVISORY · #TVS-2024
                          </span>
                        </div>
                      </div>

                      {/* Center Watermark Stamp */}
                      <div className="self-center my-auto flex flex-col items-center justify-center opacity-30 group-hover:opacity-45 transition-opacity duration-500 rotate-[-12deg]">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-dashed border-amber-300/80 flex items-center justify-center p-2 relative shadow-inner">
                          <div className="w-full h-full rounded-full border border-amber-200/60 flex flex-col items-center justify-center text-center p-1">
                            <span className="text-[8px] font-black text-amber-200 tracking-wider uppercase leading-tight">
                              VERIFIED
                            </span>
                            <span className="text-[14px] font-serif-brand font-black text-amber-100 tracking-tight leading-none my-0.5">
                              TVS
                            </span>
                            <span className="text-[6.5px] font-mono text-amber-200/90 tracking-widest uppercase">
                              OFFICIAL SEAL
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bottom Floating Info Strip */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white/90 flex items-center justify-between text-xs font-medium text-[#202124] pointer-events-auto">
                    <div className="flex items-center gap-2">
                      <Globe2 className="w-4 h-4 text-[#C8101E]" />
                      <span className="font-semibold text-xs text-[#202124]">Worldwide Practice</span>
                    </div>
                    <span className="text-[11px] text-[#760B16] font-semibold">120+ Countries · Escrow Secured</span>
                  </div>
                </div>
              </div>

              {/* Floating Decorative Pill */}
              <div className="absolute -top-3 -left-2 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-full shadow-md border border-[#E9DAD9] flex items-center gap-1.5 text-[11px] font-bold text-[#760B16]">
                <span className="w-2 h-2 rounded-full bg-[#C8101E] animate-pulse"></span>
                <span>Dream · Travel · Achieve</span>
              </div>
            </div>

            {/* Subtle Scroll Indicator on far right (desktop only) */}
            <div className="hidden xl:flex absolute -right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-2 select-none opacity-60">
              <span className="text-[9px] uppercase tracking-[0.25em] font-semibold text-[#6B7078] [writing-mode:vertical-lr] rotate-180">
                SCROLL
              </span>
              <div className="w-4 h-7 border-2 border-[#6B7078]/60 rounded-full flex justify-center pt-1">
                <div className="w-1 h-2 bg-[#C8101E] rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Distinctive Burgundy / Crimson Destination Panel Under Hero */}
        <div className="mt-10 sm:mt-12 relative rounded-3xl bg-gradient-to-r from-[#760B16] via-[#C8101E] to-[#760B16] p-6 sm:p-8 text-white shadow-xl overflow-hidden border border-[#C8101E]/40">
          {/* Subtle World Map watermark or radial effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_70%)] pointer-events-none"></div>

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Panel Heading */}
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-serif-brand font-bold text-white tracking-wide">
                Explore Your Possibilities
              </h2>
              <p className="text-white/85 text-xs sm:text-sm">
                Find the right visa pathway for your goals.
              </p>
            </div>

            {/* Destination Badges */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {[
                { name: 'UK', flag: '🇬🇧', subtitle: 'Study & Visit' },
                { name: 'Canada', flag: '🇨🇦', subtitle: 'Permits & PR' },
                { name: 'USA', flag: '🇺🇸', subtitle: 'F1 & B1/B2' },
                { name: 'Australia', flag: '🇦🇺', subtitle: 'Subclass 500' },
                { name: 'Europe', flag: '🇪🇺', subtitle: 'Schengen & D' },
              ].map((dest) => (
                <button
                  key={dest.name}
                  onClick={() => onSelectDestination(dest.name)}
                  className="group flex flex-col items-center justify-center p-2.5 sm:p-3 bg-white/10 hover:bg-white text-white hover:text-[#760B16] rounded-2xl border border-white/20 hover:border-white transition-all duration-200 transform hover:-translate-y-1 w-20 sm:w-24 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 group-hover:bg-[#FAF8F6] flex items-center justify-center text-xl shadow-xs transition-colors mb-1">
                    {dest.flag}
                  </div>
                  <span className="text-xs font-bold leading-tight">{dest.name}</span>
                  <span className="text-[9px] text-white/70 group-hover:text-[#760B16]/80 leading-none mt-0.5">
                    {dest.subtitle}
                  </span>
                </button>
              ))}
            </div>

            {/* Start Your Journey CTA */}
            <button
              onClick={onCheckEligibility}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#760B16] hover:bg-[#FAF8F6] text-xs sm:text-sm font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 shrink-0 cursor-pointer"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-4 h-4 text-[#C8101E]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
