import React from 'react';
import { X, CheckCircle2, Clock, Globe2, ArrowRight, ShieldCheck, FileCheck } from 'lucide-react';

interface DestinationModalProps {
  destination: string | null;
  onClose: () => void;
  onBookConsultation: (dest: string) => void;
  onCheckEligibility: () => void;
}

export const DestinationModal: React.FC<DestinationModalProps> = ({
  destination,
  onClose,
  onBookConsultation,
  onCheckEligibility,
}) => {
  if (!destination) return null;

  const getDestinationData = (dest: string) => {
    switch (dest.toUpperCase()) {
      case 'UK':
        return {
          name: 'United Kingdom',
          flag: '🇬🇧',
          tagline: 'World-Class Higher Education & Commercial Pathways',
          pathways: [
            'Student Visa (Subcategory CAS-based) with 2-year Graduate Route work permit',
            'Standard Visitor Visa (6 Months, 2 Years, 5 Years) for tourism, conferences, family',
            'Skilled Worker Visa & Health and Care Worker Sponsorship',
            'High Potential Individual (HPI) & Global Talent pathways',
          ],
          financialRule: '28 consecutive days minimum bank statement holding ending within 31 days of application. Funds must be in cash savings or current account under applicant or parent names.',
          processing: '3 to 6 weeks standard. Priority (5 working days) and Super Priority (24 hours) available at Gerry’s/VFS Islamabad, Lahore, Karachi.',
        };
      case 'CANADA':
        return {
          name: 'Canada',
          flag: '🇨🇦',
          tagline: 'Study Permits, Temporary Resident Visas & Express Entry',
          pathways: [
            'Study Permit with Provincial Attestation Letter (PAL) & Post-Graduation Work Permit (PGWP)',
            'Temporary Resident Visa (TRV) / Visitor Visa (up to 10-year multiple entry)',
            'Super Visa for Parents & Grandparents',
            'Express Entry Federal Skilled Worker & Provincial Nominee Programs (PNP)',
          ],
          financialRule: 'CAD 20,635 minimum cost of living requirement + first year tuition fee. GIC and audited tax returns (FBR) strongly recommended for Pakistani nationals.',
          processing: '6 to 12 weeks for study permits. Biometrics conducted at VFS Canada VAC in Islamabad, Lahore, Karachi.',
        };
      case 'USA':
        return {
          name: 'United States of America',
          flag: '🇺🇸',
          tagline: 'F-1 Academic Study & B1/B2 Visitor Interviews',
          pathways: [
            'F-1 Student Visa (SEVIS & I-20 documentation with OPT opportunities)',
            'B1/B2 Business & Tourism (up to 5-year multiple entry for Pakistani passport holders)',
            'J-1 Exchange Visitor & Research Scholar',
            'H-1B Specialty Occupation & L-1 Intracompany Transfer',
          ],
          financialRule: 'Demonstrable liquid assets covering full first-year I-20 estimate plus reliable ongoing family or institutional sponsorship. I-134 affidavit where applicable.',
          processing: 'Interview appointment wait times vary. Mandatory consular interview at US Embassy Islamabad or US Consulate General Karachi.',
        };
      case 'AUSTRALIA':
        return {
          name: 'Australia',
          flag: '🇦🇺',
          tagline: 'Subclass 500 Student Visa & Subclass 600 Visitor Permits',
          pathways: [
            'Subclass 500 Student Visa with Confirmation of Enrolment (CoE) & Genuine Student (GS) criteria',
            'Subclass 600 Visitor Visa (Tourist & Business Visitor Stream)',
            'Temporary Graduate Visa (Subclass 485) post-study work rights',
            'General Skilled Migration (Subclass 189, 190, 491)',
          ],
          financialRule: 'AUD 29,710 annual living cost requirement + 1 year tuition + travel expenses. Funds must be verified in genuine banking institutions recognized by DHA.',
          processing: '4 to 8 weeks average. Biometrics and health examinations through Bupa/IOM clinics in Pakistan.',
        };
      case 'EUROPE':
      default:
        return {
          name: 'Europe & Schengen Area',
          flag: '🇪🇺',
          tagline: '29 European Countries Under One Unified Framework',
          pathways: [
            'Uniform Schengen Short-Stay Type C Visa (90 days in any 180-day period)',
            'National Long-Stay Type D Visa (Germany, Italy, France, Spain, Sweden)',
            'German Opportunity Card (Chancenkarte) points-based job search visa',
            'European Higher Education with low/free tuition options',
          ],
          financialRule: 'Country-specific blocked bank accounts (e.g. Sperrkonto for Germany ~€11,904) or minimum daily spending balance + travel medical insurance of minimum €30,000.',
          processing: '15 to 45 calendar days. Applications submitted through respective embassy outsourcing centres (VFS, Gerry’s, BLS).',
        };
    }
  };

  const data = getDestinationData(destination);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E9DAD9] overflow-hidden">
        {/* Header */}
        <div className="bg-[#FAF8F6] px-6 py-5 border-b border-[#E9DAD9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{data.flag}</span>
            <div>
              <h3 className="text-xl font-bold font-serif-brand text-[#202124]">{data.name}</h3>
              <p className="text-xs text-[#6B7078]">{data.tagline}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6B7078] hover:text-[#202124] hover:bg-[#F1EEEC] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Key Pathways */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#760B16] uppercase tracking-wide flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-[#C8101E]" />
              <span>Available Visa Categories</span>
            </h4>
            <div className="space-y-2">
              {data.pathways.map((p, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#202124] p-2 rounded-xl bg-[#FAF8F6]">
                  <CheckCircle2 className="w-4 h-4 text-[#C8101E] shrink-0 mt-0.5" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Holding Rules */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#760B16] uppercase tracking-wide flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#C8101E]" />
              <span>Financial & Bank Holding Requirements (Pakistan)</span>
            </h4>
            <div className="p-3.5 bg-amber-50/60 border border-amber-200/60 rounded-2xl text-xs text-[#202124] leading-relaxed">
              {data.financialRule}
            </div>
          </div>

          {/* Processing and Biometrics */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#760B16] uppercase tracking-wide flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C8101E]" />
              <span>Processing Timeline & Biometric Centres</span>
            </h4>
            <p className="text-xs text-[#6B7078] leading-relaxed pl-1">
              {data.processing}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-[#E9DAD9]">
            <button
              onClick={() => {
                onClose();
                onCheckEligibility();
              }}
              className="px-5 py-2.5 bg-white border border-[#E9DAD9] hover:bg-[#FAF8F6] text-[#202124] text-xs font-semibold rounded-full cursor-pointer"
            >
              Check My Eligibility
            </button>
            <button
              onClick={() => {
                onClose();
                onBookConsultation(destination);
              }}
              className="px-6 py-2.5 bg-[#C8101E] hover:bg-[#760B16] text-white text-xs font-bold rounded-full flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Book {data.name} Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
