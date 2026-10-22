import React from 'react';
import { BrandAssets } from '../assets/images';
import {
  GraduationCap,
  Plane,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileText,
  Building2,
  Clock,
} from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
  onOpenBooking: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectService,
  onOpenBooking,
}) => {
  return (
    <section id="services" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C8101E]"></span>
            <span className="text-xs font-bold tracking-widest text-[#760B16] uppercase">
              STRATEGIC VISA PATHWAYS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-brand font-bold text-[#202124]">
            End-to-End Guidance Tailored for International Applicants
          </h2>
          <p className="text-[#6B7078] text-base leading-relaxed">
            Navigating international immigration requirements requires precision. We audit your documentation,
            structure your source of funds, and ensure complete compliance with foreign High Commissions.
          </p>
        </div>

        {/* Featured Visual Graphic: Student Under Raining Cloud Pathway */}
        <div className="mb-14 rounded-3xl overflow-hidden border border-[#E9DAD9] shadow-lg bg-[#FAF8F6] relative group">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Graphic Illustration Column */}
            <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] overflow-hidden bg-slate-100">
              <img
                src={BrandAssets.studentUnderRainCloud}
                alt="Student with backpack standing under raining cloud looking toward global horizon"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
              />

              {/* Rain Droplets Animation Overlay */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/3 w-[1px] h-4 bg-sky-200/60 animate-ping"></div>
                <div className="absolute top-1/3 left-1/2 w-[1px] h-5 bg-sky-200/50 animate-pulse"></div>
                <div className="absolute top-1/2 left-2/5 w-[1px] h-3 bg-white/40 animate-bounce"></div>
              </div>

              {/* Overlaid Badge */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-[#760B16] flex items-center gap-2 shadow-sm border border-white">
                <span className="w-2 h-2 rounded-full bg-[#C8101E] animate-ping"></span>
                <span>Visa Roadmap Clarity</span>
              </div>
            </div>

            {/* Explanatory Context Column */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8101E]/10 text-[#760B16] text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C8101E]" />
                <span>Overcoming Visa Storms</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#202124] leading-snug">
                From Documentation Clouds to Global Sunrises
              </h3>
              <p className="text-xs sm:text-sm text-[#6B7078] leading-relaxed">
                Applying abroad can often feel like standing under a storm of complex paperwork, strict embassy thresholds, and sudden refusal risks.
                With <strong>The Visa Syndicate</strong>, you get an unwavering strategic shield: meticulously audited funds, authentic Statements of Purpose, and verified counselor backing.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onOpenBooking('Study Visa')}
                  className="px-5 py-2.5 bg-[#C8101E] hover:bg-[#760B16] text-white text-xs font-bold rounded-full transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>Book Pathway Session</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onSelectService('study-visa')}
                  className="px-4 py-2.5 bg-white hover:bg-[#F1EEEC] text-[#202124] border border-[#E9DAD9] text-xs font-semibold rounded-full transition-colors cursor-pointer"
                >
                  Explore Admissions
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Main Services Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 1. Study Visa */}
          <div className="bg-[#FAF8F6] rounded-3xl p-8 border border-[#E9DAD9] flex flex-col justify-between hover:shadow-lg transition-all duration-300 group">
            <div className="space-y-6">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-200">
                <img
                  src={BrandAssets.studyUniversity}
                  alt="Prestigious university campus and study visa pathways"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#C8101E] flex items-center gap-1.5 shadow-2xs">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Higher Education</span>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-serif-brand font-bold text-[#202124] group-hover:text-[#C8101E] transition-colors">
                  Study Visa Advisory
                </h3>
                <p className="text-xs sm:text-sm text-[#6B7078] mt-2 leading-relaxed">
                  Complete support from university admissions and CAS/I-20 issuance to genuine student interviews
                  and verified financial holding periods.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-[#E9DAD9]">
                {[
                  'Course & University matching for UK, Canada, USA & Australia',
                  'Statement of Purpose (SOP) & Letter of Explanation auditing',
                  '28-day bank balance & source of funds vetting',
                  'Embassy mock interview drills & biometric guidance',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[#202124]">
                    <CheckCircle2 className="w-4 h-4 text-[#C8101E] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#E9DAD9] flex items-center justify-between">
              <span className="text-xs font-semibold text-[#760B16]">Intakes: Sep & Jan</span>
              <button
                onClick={() => onOpenBooking('Study Visa')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C8101E] hover:bg-[#760B16] text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
              >
                <span>Book Study Consult</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 2. Visit Visa */}
          <div className="bg-[#FAF8F6] rounded-3xl p-8 border border-[#E9DAD9] flex flex-col justify-between hover:shadow-lg transition-all duration-300 group">
            <div className="space-y-6">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-200">
                <img
                  src={BrandAssets.destinationsCollage}
                  alt="International tourist destinations"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#C8101E] flex items-center gap-1.5 shadow-2xs">
                  <Plane className="w-3.5 h-3.5" />
                  <span>Tourism & Family</span>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-serif-brand font-bold text-[#202124] group-hover:text-[#C8101E] transition-colors">
                  Visit & Tourist Visa
                </h3>
                <p className="text-xs sm:text-sm text-[#6B7078] mt-2 leading-relaxed">
                  Establish rock-solid domestic ties and return incentives. We structure comprehensive travel itineraries, employment
                  affidavits, and tax proofs for high-scrutiny embassies.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-[#E9DAD9]">
                {[
                  'Schengen Multi-Entry Visa cover letters & flight reserves',
                  'UK Standard Visitor Visa (6-month, 2-year, 5-year)',
                  'US B1/B2 DS-160 filing & appointment scheduling',
                  'Canada Temporary Resident Visa (TRV) documentation',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[#202124]">
                    <CheckCircle2 className="w-4 h-4 text-[#C8101E] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#E9DAD9] flex items-center justify-between">
              <span className="text-xs font-semibold text-[#760B16]">Processing: 3 to 8 Wks</span>
              <button
                onClick={() => onOpenBooking('Visit Visa')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C8101E] hover:bg-[#760B16] text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
              >
                <span>Book Visit Consult</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3. Business Visa */}
          <div className="bg-[#FAF8F6] rounded-3xl p-8 border border-[#E9DAD9] flex flex-col justify-between hover:shadow-lg transition-all duration-300 group">
            <div className="space-y-6">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-200">
                <img
                  src={BrandAssets.counselingConsultation}
                  alt="Business and corporate immigration consultancy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#C8101E] flex items-center gap-1.5 shadow-2xs">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Corporate & Trade</span>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-serif-brand font-bold text-[#202124] group-hover:text-[#C8101E] transition-colors">
                  Business & Investor Visa
                </h3>
                <p className="text-xs sm:text-sm text-[#6B7078] mt-2 leading-relaxed">
                  Facilitating corporate leaders, exporters, and entrepreneurs expanding into Europe, North America,
                  and Australia with institutional verification.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-[#E9DAD9]">
                {[
                  'Chamber of Commerce & corporate business validation dossiers',
                  'Trade exhibition & corporate invitation verification',
                  'Entrepreneur and innovation visa assessments',
                  'Company bank account & tax audit compliance (FBR)',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[#202124]">
                    <CheckCircle2 className="w-4 h-4 text-[#C8101E] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#E9DAD9] flex items-center justify-between">
              <span className="text-xs font-semibold text-[#760B16]">High Net Worth & Trade</span>
              <button
                onClick={() => onOpenBooking('Business Visa')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C8101E] hover:bg-[#760B16] text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
              >
                <span>Book Business Consult</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Why The Visa Syndicate Trust Matrix */}
        <div className="mt-16 bg-[#FAF8F6] rounded-3xl p-8 sm:p-10 border border-[#E9DAD9]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#C8101E]/10 text-[#C8101E] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#202124]">Zero Fake Document Policy</h4>
                <p className="text-xs text-[#6B7078] mt-1 leading-relaxed">
                  We never encourage fraudulent documentation or deceptive claims. All applications are presented
                  strictly on genuine merits, preventing permanent immigration bans.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#C8101E]/10 text-[#C8101E] flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#202124]">Nationwide Remote Consultation</h4>
                <p className="text-xs text-[#6B7078] mt-1 leading-relaxed">
                  Book from Karachi, Lahore, Islamabad, Peshawar, or Quetta. Complete consultation delivered
                  securely via encrypted video call with documented case roadmaps.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#C8101E]/10 text-[#C8101E] flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#202124]">Transparent Fee Schedule</h4>
                <p className="text-xs text-[#6B7078] mt-1 leading-relaxed">
                  No surprise commissions or hidden surcharges. Consultation fees and service scopes are published
                  upfront and verified directly through domestic banking channels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
