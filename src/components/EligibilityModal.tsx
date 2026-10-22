import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { api } from '../lib/api';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Plane,
  Briefcase,
  Globe2,
  FileText,
  User,
  Sparkles,
  TrendingUp,
  Building,
  Check,
  RotateCcw,
  MessageSquare,
} from 'lucide-react';
import { generateWhatsAppLink } from '../lib/whatsapp';

interface EligibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
  initialCategory?: 'study' | 'visit' | 'business';
}

export const EligibilityModal: React.FC<EligibilityModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
  initialCategory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'study' | 'visit' | 'business'>('study');
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Questions, 2: Contact, 3: Results

  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
    if (isOpen) {
      setStep(1);
      setEvaluationResult(null);
    }
  }, [initialCategory, isOpen]);

  // Target Destination
  const [destination, setDestination] = useState('UK');

  // ==========================================
  // 1. STUDY VISA SPECIFIC FORM STATE
  // ==========================================
  const [studyTargetLevel, setStudyTargetLevel] = useState("Master's / Postgraduate Degree (1-2 Years)");
  const [studyCurrentEdu, setStudyCurrentEdu] = useState("4-Year Bachelor's Degree (BS / BSc / BBA / BE)");
  const [studyAcademicScore, setStudyAcademicScore] = useState('3.00 – 3.49 CGPA / 70% – 79% (First Division)');
  const [studyGapHistory, setStudyGapHistory] = useState('Zero Gap (Fresh Graduate / Final Year)');
  const [studyEnglishTest, setStudyEnglishTest] = useState('IELTS Academic: 6.5 Overall (Min 6.0 in each band)');
  const [studyFinancialHolding, setStudyFinancialHolding] = useState('Self / Parents Bank Account (28-day holding ready)');
  const [studyRefusalHistory, setStudyRefusalHistory] = useState('No Previous Visa Refusals (Clean Passport)');

  // ==========================================
  // 2. VISIT VISA SPECIFIC FORM STATE
  // ==========================================
  const [visitPurpose, setVisitPurpose] = useState('Tourism, Leisure Sightseeing & Vacation');
  const [visitHomeTies, setVisitHomeTies] = useState('Salaried Corporate Executive (Permanent Job, Salary Slips, NOC)');
  const [visitMonthlyIncome, setVisitMonthlyIncome] = useState('PKR 250,000 – 450,000 / month ($900 – $1,600)');
  const [visitBankBalance, setVisitBankBalance] = useState('PKR 2.5 Million – 4.5 Million ($9,000 – $16,000)');
  const [visitInvitationStatus, setVisitInvitationStatus] = useState('Formal Invitation Letter from Foreign Citizen / PR Holder');
  const [visitTravelHistory, setVisitTravelHistory] = useState('Regional Traveler (UAE, Saudi Arabia/Umrah, Turkey, Malaysia, Thailand)');
  const [visitFamilyTies, setVisitFamilyTies] = useState('Married with Spouse & Children Remaining in Home Country');

  // ==========================================
  // 3. BUSINESS VISA SPECIFIC FORM STATE
  // ==========================================
  const [businessStructure, setBusinessStructure] = useState('Private Limited Company (Pvt Ltd) / Registered Corporation');
  const [businessChamber, setBusinessChamber] = useState('Active Member of Chamber of Commerce & Industry / Trade Body');
  const [businessTurnover, setBusinessTurnover] = useState('PKR 40 Million – 100 Million ($150,000 – $350,000)');
  const [businessTaxAudit, setBusinessTaxAudit] = useState('Active Taxpayer (ATL) with Last 2-3 Years Audited Accounts');
  const [businessObjective, setBusinessObjective] = useState('Attending International Trade Fair / Exhibition (as Exhibitor or Trade Buyer)');
  const [businessBankHistory, setBusinessBankHistory] = useState('5+ Years Established Commercial Account with Consistent Cash Flow');
  const [businessDelegations, setBusinessDelegations] = useState('Frequent Independent Business Traveler (Prior commercial visas)');

  // Contact Information
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Islamabad');

  // Results State
  const [submitting, setSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    pathwayName: string;
    verdictTitle: string;
    strengths: string[];
    criticalNotes: string[];
  } | null>(null);

  if (!isOpen) return null;

  // Calculate detailed profile score
  const handleCalculateScore = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    let score = 55;
    const strengths: string[] = [];
    const criticalNotes: string[] = [];
    let pathwayName = '';

    if (selectedCategory === 'study') {
      pathwayName = `${destination} Higher Education Student Route (CAS / I-20 / LOA)`;
      if (studyAcademicScore.includes('3.50') || studyAcademicScore.includes('80%')) {
        score += 15;
        strengths.push('High academic distinction (qualifies for university scholarships)');
      } else if (studyAcademicScore.includes('3.00')) {
        score += 10;
        strengths.push('Solid first-division academic foundation meeting Tier 1 entry requirements');
      } else {
        score += 5;
        criticalNotes.push('May require pathway program or lower-tier university admission');
      }

      if (studyEnglishTest.includes('7.0') || studyEnglishTest.includes('6.5') || studyEnglishTest.includes('PTE Academic: 65+')) {
        score += 15;
        strengths.push(`Direct unconditional English proficiency verified (${studyEnglishTest})`);
      } else if (studyEnglishTest.includes('Not Taken')) {
        score -= 5;
        criticalNotes.push('English language testing must be scheduled immediately');
      }

      if (studyFinancialHolding.includes('ready')) {
        score += 15;
        strengths.push('28-day bank statement funds readily available without seasoning delay');
      } else {
        criticalNotes.push('Bank statement holding period must be strictly calculated to prevent visa refusal');
      }

      if (studyRefusalHistory.includes('Clean')) {
        score += 5;
        strengths.push('Clean international immigration record');
      } else {
        score -= 10;
        criticalNotes.push(`Prior refusal (${studyRefusalHistory}) requires a comprehensive Letter of Explanation and rebuttal evidence`);
      }
    } else if (selectedCategory === 'visit') {
      pathwayName = `${destination} Visitor Visa (Tourism, Family & Leisure)`;
      if (visitHomeTies.includes('Corporate') || visitHomeTies.includes('Business Owner')) {
        score += 15;
        strengths.push('Verifiable professional ties and continuous employment in home country');
      } else {
        criticalNotes.push('Proof of substantial domestic ties and return incentive must be documented');
      }

      if (visitBankBalance.includes('4.5 Million') || visitBankBalance.includes('2.5 Million')) {
        score += 15;
        strengths.push('Adequate liquid financial holding exceeding statutory visit requirements');
      } else {
        criticalNotes.push('Additional funding or verified co-sponsor affidavit strongly suggested');
      }

      if (visitTravelHistory.includes('OECD') || visitTravelHistory.includes('Regional Traveler')) {
        score += 15;
        strengths.push(`Proven travel compliance history: ${visitTravelHistory}`);
      } else {
        criticalNotes.push('First-time international traveler profile: Detailed day-by-day itinerary and hotel vouchers mandatory');
      }

      if (visitFamilyTies.includes('Spouse & Children')) {
        score += 10;
        strengths.push('Immediate family remaining in home country serves as strong statutory tie under immigration law');
      }
    } else {
      pathwayName = `${destination} Business / Corporate Visitor Route (B1 / Standard Business)`;
      if (businessChamber.includes('Active Member')) {
        score += 15;
        strengths.push('Verified Chamber of Commerce accreditation and trade body standing');
      } else {
        criticalNotes.push('Chamber of Commerce recommendation letter substantially strengthens commercial visa grant');
      }

      if (businessTurnover.includes('100 Million') || businessTurnover.includes('40 Million')) {
        score += 15;
        strengths.push('Solid corporate turnover and commercial balance sheet credibility');
      }

      if (businessTaxAudit.includes('Audited Accounts')) {
        score += 15;
        strengths.push('Tax compliance documented with multi-year audited financial records');
      } else {
        criticalNotes.push('Tax returns and source of commercial revenue must be audited prior to embassy submission');
      }

      if (businessObjective.includes('Exhibitor') || businessObjective.includes('Trade Fair')) {
        score += 10;
        strengths.push('Commercial invitation and exhibition registration confirms bonafide business purpose');
      }
    }

    score = Math.min(Math.max(score, 45), 98);

    let verdictTitle = '';
    if (score >= 85) {
      verdictTitle = 'High Approval Probability (Exceptional Profile)';
    } else if (score >= 70) {
      verdictTitle = 'Viable Profile (Requires Document Structuring)';
    } else {
      verdictTitle = 'Moderate Risk Profile (Comprehensive Advisory Recommended)';
    }

    setEvaluationResult({
      score,
      pathwayName,
      verdictTitle,
      strengths,
      criticalNotes,
    });

    try {
      await api.submitEnquiry({
        name: fullName,
        email,
        phone,
        visaCategory: `${selectedCategory.toUpperCase()} VISA (Score: ${score}/100)`,
        destination,
        message: `Eligibility Assessment: ${verdictTitle} for ${pathwayName}. City: ${city}.`,
      });
    } catch {
      // Non-blocking enquiry log
    }

    setSubmitting(false);
    setStep(3);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-[#E9DAD9] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-[#FAF8F6] px-6 py-4 border-b border-[#E9DAD9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo variant="emblem" size="sm" />
            <div>
              <h3 className="text-base font-bold text-[#202124]">
                Immigration Eligibility Assessment
              </h3>
              <p className="text-xs text-[#6B7078]">
                Statutory Case Audit & Evidentiary Probability Check
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6B7078] hover:text-[#202124] hover:bg-[#F1EEEC] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Pathway Tabs at Top with Distinct Badges */}
        <div className="p-3 bg-white border-b border-[#F1EEEC] flex items-center gap-2">
          {[
            { id: 'study' as const, label: 'Study Visa', icon: GraduationCap, color: 'text-rose-600 bg-rose-50' },
            { id: 'visit' as const, label: 'Visit & Tourist', icon: Plane, color: 'text-amber-600 bg-amber-50' },
            { id: 'business' as const, label: 'Business & Trade', icon: Briefcase, color: 'text-indigo-600 bg-indigo-50' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(tab.id);
                  setStep(1);
                  setEvaluationResult(null);
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#C8101E] text-white shadow-xs'
                    : 'bg-[#FAF8F6] text-[#6B7078] hover:bg-[#F1EEEC] hover:text-[#202124]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: CATEGORY SPECIFIC QUESTIONNAIRE */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Destination Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#202124] uppercase tracking-wide flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-[#C8101E]" />
                  <span>Target Destination Country</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {['UK', 'Canada', 'USA', 'Australia', 'Europe'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDestination(d)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer text-xs font-bold ${
                        destination === d
                          ? 'border-[#C8101E] bg-[#C8101E] text-white shadow-xs'
                          : 'border-[#E9DAD9] hover:bg-[#FAF8F6] text-[#202124]'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* FORM 1: STUDY VISA DETAILED QUESTIONS */}
              {selectedCategory === 'study' && (
                <div className="space-y-4 pt-2 border-t border-[#F1EEEC]">
                  <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100 flex items-center gap-2 text-xs text-[#760B16] font-semibold">
                    <GraduationCap className="w-4 h-4 text-[#C8101E]" />
                    <span>Higher Education Admissions & Visa Vetting Questionnaire</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#202124]">Intended Degree Level</label>
                      <select
                        value={studyTargetLevel}
                        onChange={(e) => setStudyTargetLevel(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs bg-white focus:ring-2 focus:ring-[#C8101E]"
                      >
                        <option value="Master's / Postgraduate Degree (1-2 Years)">Master's / Postgraduate Degree (1-2 Years)</option>
                        <option value="Undergraduate / Bachelor's Degree (3-4 Years)">Undergraduate / Bachelor's Degree (3-4 Years)</option>
                        <option value="PhD / Doctoral Research Degree">PhD / Doctoral Research Degree</option>
                        <option value="International Foundation / Pre-Masters Pathway">International Foundation / Pre-Masters Pathway</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#202124]">Highest Completed Qualification</label>
                      <select
                        value={studyCurrentEdu}
                        onChange={(e) => setStudyCurrentEdu(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs bg-white focus:ring-2 focus:ring-[#C8101E]"
                      >
                        <option value="4-Year Bachelor's Degree (BS / BSc / BBA / BE)">4-Year Bachelor's Degree (BS / BSc / BBA / BE)</option>
                        <option value="2-Year Master's Degree (MS / MPhil)">2-Year Master's Degree (MS / MPhil)</option>
                        <option value="Intermediate / A-Levels / High School">Intermediate / A-Levels / High School</option>
                        <option value="2-Year Traditional BA / BSc Degree">2-Year Traditional BA / BSc Degree</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#202124]">Academic Grades / CGPA</label>
                      <select
                        value={studyAcademicScore}
                        onChange={(e) => setStudyAcademicScore(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs bg-white focus:ring-2 focus:ring-[#C8101E]"
                      >
                        <option value="3.50 – 4.00 CGPA / 80%+ (High Distinction)">3.50 – 4.00 CGPA / 80%+ (High Distinction)</option>
                        <option value="3.00 – 3.49 CGPA / 70% – 79% (First Division)">3.00 – 3.49 CGPA / 70% – 79% (First Division)</option>
                        <option value="2.50 – 2.99 CGPA / 60% – 69% (Second Division)">2.50 – 2.99 CGPA / 60% – 69% (Second Division)</option>
                        <option value="Below 2.50 CGPA / Below 60%">Below 2.50 CGPA / Below 60%</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#202124]">English Language Proficiency</label>
                      <select
                        value={studyEnglishTest}
                        onChange={(e) => setStudyEnglishTest(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs bg-white focus:ring-2 focus:ring-[#C8101E]"
                      >
                        <option value="IELTS Academic: 7.0+ Overall (Direct Top Tier)">IELTS Academic: 7.0+ Overall (Direct Top Tier)</option>
                        <option value="IELTS Academic: 6.5 Overall (Min 6.0 in each band)">IELTS Academic: 6.5 Overall (Min 6.0 in each band)</option>
                        <option value="PTE Academic: 65+ Score">PTE Academic: 65+ Score</option>
                        <option value="Medium of Instruction (MOI) Certificate Only">Medium of Instruction (MOI) Certificate Only</option>
                        <option value="Not Taken Yet (Intending to prepare)">Not Taken Yet (Intending to prepare)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#202124]">28-Day Bank Statement Holding</label>
                      <select
                        value={studyFinancialHolding}
                        onChange={(e) => setStudyFinancialHolding(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs bg-white focus:ring-2 focus:ring-[#C8101E]"
                      >
                        <option value="Self / Parents Bank Account (28-day holding ready)">Self / Parents Bank Account (28-day holding ready)</option>
                        <option value="Funds in Process of 28-day Seasoning">Funds in Process of 28-day Seasoning</option>
                        <option value="Property / Assets Available (Need Liquid Advice)">Property / Assets Available (Need Liquid Advice)</option>
                        <option value="Seeking University Merit Scholarship">Seeking University Merit Scholarship</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#202124]">Study Gap & Work Experience</label>
                      <select
                        value={studyGapHistory}
                        onChange={(e) => setStudyGapHistory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs bg-white focus:ring-2 focus:ring-[#C8101E]"
                      >
                        <option value="Zero Gap (Fresh Graduate / Final Year)">Zero Gap (Fresh Graduate / Final Year)</option>
                        <option value="1-3 Years Gap with Documented Job Experience">1-3 Years Gap with Documented Job Experience</option>
                        <option value="3-6 Years Gap with Professional Tax Filings">3-6 Years Gap with Professional Tax Filings</option>
                        <option value="6+ Years Gap (Seeking Career Pivot)">6+ Years Gap (Seeking Career Pivot)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#202124]">Immigration & Refusal History</label>
                    <select
                      value={studyRefusalHistory}
                      onChange={(e) => setStudyRefusalHistory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs bg-white focus:ring-2 focus:ring-[#C8101E]"
                    >
                      <option value="No Previous Visa Refusals (Clean Passport)">No Previous Visa Refusals (Clean Passport)</option>
                      <option value="Single Student Visa Refusal (UK / Canada / USA)">Single Student Visa Refusal (UK / Canada / USA)</option>
                      <option value="Previous Visit Visa Refusal Only">Previous Visit Visa Refusal Only</option>
                      <option value="Multiple Refusals (Need GCMS / Decision Review)">Multiple Refusals (Need GCMS / Decision Review)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* FORM 2: VISIT VISA DETAILED QUESTIONS */}
              {selectedCategory === 'visit' && (
                <div className="space-y-4 pt-2 border-t border-[#F1EEEC]">
                  <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100 flex items-center gap-2 text-xs text-amber-900 font-semibold">
                    <Plane className="w-4 h-4 text-amber-600" />
                    <span>Tourist, Family Visit & Home Ties Questionnaire</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#202124]">Purpose of Travel</label>
                      <select
                        value={visitPurpose}
                        onChange={(e) => setVisitPurpose(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs bg-white focus:ring-2 focus:ring-[#C8101E]"
                      >
                        <option value="Tourism, Leisure Sightseeing & Vacation">Tourism, Leisure Sightseeing & Vacation</option>
                        <option value="Visiting Immediate Family / Close Relatives">Visiting Immediate Family / Close Relatives</option>
                        <option value="Attending Wedding / Family Milestone Event">Attending Wedding / Family Milestone Event</option>
                        <option value="Medical Consultation / Specialized Treatment">Medical Consultation / Specialized Treatment</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#202124]">Home Ties & Occupation</label>
                      <select
                        value={visitHomeTies}
                        onChange={(e) => setVisitHomeTies(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs bg-white focus:ring-2 focus:ring-[#C8101E]"
                      >
                        <option value="Salaried Corporate Executive (Permanent Job, Salary Slips, NOC)">Salaried Corporate Executive (Permanent Job, Salary Slips, NOC)</option>
                        <option value="Established Registered Business Owner / Self-Employed">Established Registered Business Owner / Self-Employed</option>
                        <option value="Doctor / Engineer / Chartered Accountant / Govt Officer">Doctor / Engineer / Chartered Accountant / Govt Officer</option>
                        <option value="Property Owner / Agricultural Landlord">Property Owner / Agricultural Landlord</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#202124]">Monthly Disposable Income</label>
                      <select
                        value={visitMonthlyIncome}
                        onChange={(e) => setVisitMonthlyIncome(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs bg-white focus:ring-2 focus:ring-[#C8101E]"
                      >
                        <option value="PKR 450,000+ / month ($1,600+)">PKR 450,000+ / month ($1,600+)</option>
                        <option value="PKR 250,000 – 450,000 / month ($900 – $1,600)">PKR 250,000 – 450,000 / month ($900 – $1,600)</option>
                        <option value="PKR 150,000 – 250,000 / month ($550 – $900)">PKR 150,000 – 250,000 / month ($550 – $900)</option>
                        <option value="Below PKR 150,000 / month">Below PKR 150,000 / month</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#202124]">Liquid Bank Balance</label>
                      <select
                        value={visitBankBalance}
                        onChange={(e) => setVisitBankBalance(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs bg-white focus:ring-2 focus:ring-[#C8101E]"
                      >
                        <option value="PKR 4.5 Million+ ($16,000+)">PKR 4.5 Million+ ($16,000+)</option>
                        <option value="PKR 2.5 Million – 4.5 Million ($9,000 – $16,000)">PKR 2.5 Million – 4.5 Million ($9,000 – $16,000)</option>
                        <option value="PKR 1.2 Million – 2.5 Million ($4,500 – $9,000)">PKR 1.2 Million – 2.5 Million ($4,500 – $9,000)</option>
                        <option value="Below PKR 1.2 Million">Below PKR 1.2 Million</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#202124]">Prior Travel History</label>
                      <select
                        value={visitTravelHistory}
                        onChange={(e) => setVisitTravelHistory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs bg-white focus:ring-2 focus:ring-[#C8101E]"
                      >
                        <option value="Strong Travel History (Prior UK, USA, Schengen or Canada visas)">Strong Travel History (Prior UK, USA, Schengen or Canada visas)</option>
                        <option value="Regional Traveler (UAE, Saudi Arabia/Umrah, Turkey, Malaysia, Thailand)">Regional Traveler (UAE, Saudi Arabia/Umrah, Turkey, Malaysia, Thailand)</option>
                        <option value="Single Country Prior Travel">Single Country Prior Travel</option>
                        <option value="Fresh Passport (First time international travel)">Fresh Passport (First time international travel)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#202124]">Family Ties in Home Country</label>
                      <select
                        value={visitFamilyTies}
                        onChange={(e) => setVisitFamilyTies(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs bg-white focus:ring-2 focus:ring-[#C8101E]"
                      >
                        <option value="Married with Spouse & Children Remaining in Home Country">Married with Spouse & Children Remaining in Home Country</option>
                        <option value="Single / Unmarried with Parents & Siblings in Home Country">Single / Unmarried with Parents & Siblings in Home Country</option>
                        <option value="Traveling as Family Unit (Whole family applying together)">Traveling as Family Unit (Whole family applying together)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* FORM 3: BUSINESS VISA DETAILED QUESTIONS */}
              {selectedCategory === 'business' && (
                <div className="space-y-4 pt-2 border-t border-[#F1EEEC]">
                  <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 flex items-center gap-2 text-xs text-indigo-900 font-semibold">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    <span>Commercial & Business Visa Accreditation Questionnaire</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#202124]">Business Legal Structure</label>
                      <select
                        value={businessStructure}
                        onChange={(e) => setBusinessStructure(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs bg-white focus:ring-2 focus:ring-[#C8101E]"
                      >
                        <option value="Private Limited Company (Pvt Ltd) / Registered Corporation">Private Limited Company (Pvt Ltd) / Registered Corporation</option>
                        <option value="Registered Partnership Firm (AOP / Form C)">Registered Partnership Firm (AOP / Form C)</option>
                        <option value="Sole Proprietorship with NTN & Commercial Bank Account">Sole Proprietorship with NTN & Commercial Bank Account</option>
                        <option value="Foreign Subsidiary / Branch Office">Foreign Subsidiary / Branch Office</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#202124]">Chamber of Commerce Standing</label>
                      <select
                        value={businessChamber}
                        onChange={(e) => setBusinessChamber(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs bg-white focus:ring-2 focus:ring-[#C8101E]"
                      >
                        <option value="Active Member of Chamber of Commerce & Industry / Trade Body">Active Member of Chamber of Commerce & Industry / Trade Body</option>
                        <option value="Member of Specialized Export Association (e.g. PRGMEA, PHMA, PASHA)">Member of Specialized Export Association</option>
                        <option value="Registered Taxpayer without Chamber Membership">Registered Taxpayer without Chamber Membership</option>
                        <option value="In Process of Chamber Registration">In Process of Chamber Registration</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#202124]">Annual Documented Turnover</label>
                      <select
                        value={businessTurnover}
                        onChange={(e) => setBusinessTurnover(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs bg-white focus:ring-2 focus:ring-[#C8101E]"
                      >
                        <option value="PKR 100 Million+ ($350,000+)">PKR 100 Million+ ($350,000+)</option>
                        <option value="PKR 40 Million – 100 Million ($150,000 – $350,000)">PKR 40 Million – 100 Million ($150,000 – $350,000)</option>
                        <option value="PKR 15 Million – 40 Million ($55,000 – $150,000)">PKR 15 Million – 40 Million ($55,000 – $150,000)</option>
                        <option value="Below PKR 15 Million">Below PKR 15 Million</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#202124]">International Business Purpose</label>
                      <select
                        value={businessObjective}
                        onChange={(e) => setBusinessObjective(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs bg-white focus:ring-2 focus:ring-[#C8101E]"
                      >
                        <option value="Attending International Trade Fair / Exhibition (as Exhibitor or Trade Buyer)">Attending International Trade Fair / Exhibition</option>
                        <option value="B2B Commercial Negotiations / Contract Signing with Foreign Partner">B2B Commercial Negotiations / Contract Signing</option>
                        <option value="Machinery Inspection, Factory Audit & Vendor Sourcing">Machinery Inspection, Factory Audit & Vendor Sourcing</option>
                        <option value="Exploring Foreign Subsidiary, Branch Office or Franchise">Exploring Foreign Subsidiary, Branch Office or Franchise</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#202124]">Tax Audit & Corporate Account History</label>
                    <select
                      value={businessTaxAudit}
                      onChange={(e) => setBusinessTaxAudit(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs bg-white focus:ring-2 focus:ring-[#C8101E]"
                    >
                      <option value="Active Taxpayer (ATL) with Last 2-3 Years Audited Accounts">Active Taxpayer (ATL) with Last 2-3 Years Audited Accounts</option>
                      <option value="Active Taxpayer with Self-Filed Annual Returns">Active Taxpayer with Self-Filed Annual Returns</option>
                      <option value="Newly Incorporated Commercial Entity (Under 1 Year)">Newly Incorporated Commercial Entity (Under 1 Year)</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-3 border-t border-[#F1EEEC]">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-7 py-3 bg-[#C8101E] hover:bg-[#760B16] text-white text-xs font-bold rounded-full flex items-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <span>Continue to Assessment Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: APPLICANT PROFILE & CONTACT DETAILS */}
          {step === 2 && (
            <form onSubmit={handleCalculateScore} className="space-y-5 animate-in fade-in duration-300">
              <div className="p-4 bg-[#FAF8F6] rounded-2xl border border-[#E9DAD9] space-y-1">
                <span className="text-[10px] text-[#760B16] font-bold uppercase tracking-wider block">
                  Configured Pathway
                </span>
                <h4 className="text-sm font-bold text-[#202124]">
                  {selectedCategory.toUpperCase()} VISA · {destination} Evaluation
                </h4>
                <p className="text-xs text-[#6B7078]">
                  Please enter your contact details to generate your verified statutory readiness score and customized recommendations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#202124]">Applicant Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Ali"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs focus:ring-2 focus:ring-[#C8101E] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#202124]">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="applicant@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs focus:ring-2 focus:ring-[#C8101E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#202124]">WhatsApp / Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs focus:ring-2 focus:ring-[#C8101E] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#202124]">Current City of Residence</label>
                  <input
                    type="text"
                    placeholder="e.g. Islamabad, Lahore, Karachi or London"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs focus:ring-2 focus:ring-[#C8101E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#F1EEEC]">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 text-xs font-semibold text-[#6B7078] hover:text-[#202124] cursor-pointer"
                >
                  Back to Questions
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-7 py-3 bg-[#C8101E] hover:bg-[#760B16] text-white text-xs font-bold rounded-full flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Evaluating Profile...</span>
                  ) : (
                    <>
                      <span>Generate Probability Report</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: INTERACTIVE RESULTS & STATUTORY METRICS */}
          {step === 3 && evaluationResult && (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              {/* Score Display Card */}
              <div className="p-6 bg-gradient-to-br from-[#FAF8F6] via-white to-rose-50/40 rounded-3xl border-2 border-[#E9DAD9] shadow-sm flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                {/* Circular Score Gauge */}
                <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={
                        evaluationResult.score >= 80
                          ? 'text-emerald-600'
                          : evaluationResult.score >= 65
                          ? 'text-amber-500'
                          : 'text-red-500'
                      }
                      strokeDasharray={`${evaluationResult.score}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-bold font-mono text-[#202124]">
                      {evaluationResult.score}%
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7078]">
                      Readiness
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 flex-1">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#760B16]/10 text-[#760B16]">
                    {evaluationResult.pathwayName}
                  </span>
                  <h3 className="text-xl font-bold font-serif-brand text-[#202124]">
                    {evaluationResult.verdictTitle}
                  </h3>
                  <p className="text-xs text-[#6B7078] leading-relaxed">
                    Evaluated for <strong>{fullName}</strong> ({city}) based on high commission statutory standards and evidentiary thresholds.
                  </p>
                </div>
              </div>

              {/* Strengths & Critical Audit Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Identified Case Strengths</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-emerald-950">
                    {evaluationResult.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Critical Advisory Focus Points</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-amber-950">
                    {evaluationResult.criticalNotes.length > 0 ? (
                      evaluationResult.criticalNotes.map((n, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5"></span>
                          <span>{n}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-[#6B7078]">
                        No major red flags identified. Case is ready for document seasoning and CAS/invitation review.
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#F1EEEC]">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setEvaluationResult(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-[#6B7078] hover:text-[#202124] flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-evaluate Another Pathway</span>
                </button>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <a
                    href={generateWhatsAppLink({
                      name: fullName,
                      email,
                      phone,
                      destination,
                      visaCategory: `${selectedCategory.toUpperCase()} VISA (Score: ${evaluationResult.score}%)`,
                      message: `Assessment Result: ${evaluationResult.verdictTitle} (${evaluationResult.pathwayName}). City: ${city}.`,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-full shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send on WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 text-xs font-semibold text-[#6B7078] hover:text-[#202124] rounded-full border border-[#E9DAD9]"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenBooking();
                    }}
                    className="px-5 py-2.5 bg-[#C8101E] hover:bg-[#760B16] text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Book Verified Counselor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
