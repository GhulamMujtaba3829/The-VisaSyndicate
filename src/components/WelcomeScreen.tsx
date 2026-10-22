import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { BrandAssets } from '../assets/images';
import {
  ArrowRight,
  GraduationCap,
  Plane,
  Briefcase,
  ShieldCheck,
  Compass,
  Sparkles,
  CheckCircle2,
  Globe2,
} from 'lucide-react';

interface WelcomeScreenProps {
  onEnter: (category?: 'study' | 'visit' | 'business') => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  const [selectedPathway, setSelectedPathway] = useState<'study' | 'visit' | 'business' | null>(null);
  const [isEntering, setIsEntering] = useState(false);

  const handleStart = (pathway?: 'study' | 'visit' | 'business') => {
    setIsEntering(true);
    setTimeout(() => {
      onEnter(pathway || selectedPathway || undefined);
    }, 450);
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto text-white flex flex-col justify-between transition-all duration-500 bg-[#0E0204] ${
        isEntering ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Image: Syndicate Council Picture without face */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={BrandAssets.syndicateTrustCouncil}
          alt="The Visa Syndicate Background"
          className="w-full h-full object-cover object-center scale-100 filter brightness-[0.62] contrast-[1.12]"
        />
        {/* Cinematic dark vignettes allowing the boardroom and faceless council to be clearly visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/80"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,0.6)_100%)]"></div>
      </div>

      {/* Ambient Radial Glows */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C8101E]/15 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>

      {/* Top Bar */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-5 flex items-center justify-between border-b border-white/10 backdrop-blur-md bg-black/30">
        <div className="flex items-center gap-3">
          <BrandLogo variant="light" size="sm" />
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/60 border border-red-500/30 text-[10px] font-bold tracking-widest text-red-300 uppercase">
            <Globe2 className="w-3 h-3 text-red-400" />
            <span>Worldwide Advisory Network</span>
          </span>
        </div>
        <button
          onClick={() => handleStart()}
          className="text-xs uppercase tracking-widest text-white/80 hover:text-white px-4 py-2 rounded-full border border-white/20 hover:border-white/50 transition-all cursor-pointer bg-white/5 hover:bg-white/15 flex items-center gap-1.5 backdrop-blur-sm"
        >
          <span>Enter Portal</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </header>

      {/* Main Content: Clean Original Layout with Background Image */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-6 py-8 text-center my-auto flex flex-col items-center">
        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif-brand font-bold tracking-tight text-white leading-[1.1] max-w-4xl">
          Step Beyond Borders With <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-amber-200">Absolute Clarity</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-xl font-serif-brand italic text-rose-200/90 font-light max-w-2xl">
          Welcome to The Visa Syndicate — Elite Consultation for Study, Visit & Global Mobility.
        </p>

        <p className="mt-3 text-xs sm:text-sm text-white/75 max-w-2xl leading-relaxed">
          Navigate international visa & embassy requirements with statutory confidence. Meticulously audited financial holdings, genuine university admissions, and expert counselor backing for the UK, Canada, USA, Australia, and Schengen.
        </p>

        {/* 3 Pathway Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-2xl mt-8">
          {[
            {
              id: 'study' as const,
              title: 'Study Visa',
              desc: 'Admissions, CAS/I-20 & 28-Day Bank Vetting',
              icon: GraduationCap,
            },
            {
              id: 'visit' as const,
              title: 'Visit Visa',
              desc: 'Tourism, Family Ties & Solid Return Incentives',
              icon: Plane,
            },
            {
              id: 'business' as const,
              title: 'Business Visa',
              desc: 'Trade Delegations & Commercial Sponsorship',
              icon: Briefcase,
            },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = selectedPathway === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedPathway(item.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer backdrop-blur-md relative overflow-hidden group ${
                  isSelected
                    ? 'border-[#C8101E] bg-[#C8101E]/40 ring-2 ring-[#C8101E]/60 shadow-lg scale-102'
                    : 'border-white/15 hover:border-white/35 bg-black/40 hover:bg-black/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-rose-300 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <h3 className="font-bold text-sm text-white">{item.title}</h3>
                <p className="text-[11px] text-white/70 mt-1 leading-snug">{item.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Enter CTA Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => handleStart()}
            className="px-9 py-4 bg-gradient-to-r from-[#C8101E] to-[#E31B2F] hover:from-[#760B16] hover:to-[#C8101E] text-white text-sm font-bold rounded-full shadow-2xl hover:shadow-[0_0_35px_rgba(200,16,30,0.6)] transition-all duration-300 flex items-center gap-3 cursor-pointer transform hover:-translate-y-0.5"
          >
            <span>{selectedPathway ? `Explore ${selectedPathway.toUpperCase()} Pathway` : 'Enter The Experience'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[11px] text-white/60">
          <div className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-300" />
            <span>UK · Canada · USA · Aus · Schengen</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-rose-300" />
            <span>Certified Legal Counselors</span>
          </div>
        </div>
      </main>

      {/* Footer Strip */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/40 border-t border-white/10 backdrop-blur-sm bg-black/20">
        <span>© {new Date().getFullYear()} The Visa Syndicate. All rights reserved.</span>
        <span>Secure Consultation Desk · SadaPay Verified</span>
      </footer>
    </div>
  );
};
