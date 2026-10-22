import React, { useState } from 'react';
import { api, CounselorApplication } from '../lib/api';
import {
  X,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Globe2,
  Copy,
  Check,
  MessageSquare,
  Download,
  ExternalLink,
} from 'lucide-react';
import {
  generateCounselorWhatsAppLink,
  openCounselorWhatsApp,
  ADMIN_WHATSAPP_NUMBER,
} from '../lib/whatsapp';
import { downloadDossierImage } from '../lib/dossierCanvas';

interface CounselorJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplicationSubmitted?: (app: CounselorApplication) => void;
}

export const CounselorJoinModal: React.FC<CounselorJoinModalProps> = ({
  isOpen,
  onClose,
  onApplicationSubmitted,
}) => {
  const [fullName, setFullName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Pakistan');
  const [nationalIdNumber, setNationalIdNumber] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [experienceYears, setExperienceYears] = useState(3);
  const [bio, setBio] = useState('');

  // Selected categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Study Visa']);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(['UK', 'Canada']);

  const [antiFraudAgreed, setAntiFraudAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedApp, setSubmittedApp] = useState<CounselorApplication | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? (prev.length > 1 ? prev.filter((c) => c !== cat) : prev) : [...prev, cat]
    );
  };

  const toggleDestination = (dest: string) => {
    setSelectedDestinations((prev) =>
      prev.includes(dest) ? (prev.length > 1 ? prev.filter((d) => d !== dest) : prev) : [...prev, dest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError('Please provide your full name, email address, and phone number.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.applyCounselor({
        fullName: fullName.trim(),
        displayName: displayName.trim() || fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        whatsappNumber: phone.trim(),
        city: city.trim() || 'Unspecified',
        country: country.trim() || 'Pakistan',
        nationalIdNumber: nationalIdNumber.trim() || 'Pending Verification',
        nationalIdType: 'CNIC',
        agencyName: agencyName.trim() || '',
        experienceYears: Number(experienceYears) || 3,
        visaCategories: selectedCategories,
        expertise: selectedCategories,
        destinations: selectedDestinations,
        languages: ['English', 'Urdu'],
        consultationFee: 12000,
        preferredCurrency: 'PKR',
        consultationDuration: 45,
        bio: bio.trim() || 'Accredited visa counselor and document audit specialist.',
        antiFraudAgreementAccepted: antiFraudAgreed,
      });

      if (res.success && res.application) {
        setSubmittedApp(res.application);
        onApplicationSubmitted?.(res.application);
      } else {
        setError(res.message || 'Failed to submit application. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your application.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTrackId = () => {
    if (!submittedApp) return;
    navigator.clipboard.writeText(submittedApp.trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetAndClose = () => {
    setSubmittedApp(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E9DAD9] overflow-hidden my-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#760B16] via-[#A30F1E] to-[#C8101E] text-white p-5 sm:p-6 relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[10px] font-extrabold uppercase tracking-widest text-white flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Counselor Panel Enrollment</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif-brand font-bold text-white">
            Join The Visa Syndicate Advisory Network
          </h2>
          <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-lg leading-relaxed">
            Partner with Pakistan’s premier visa syndicate. We connect vetted, certified consultants with high-intent applicants worldwide with guaranteed escrow payouts.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 max-h-[80vh] overflow-y-auto">
          {submittedApp ? (
            /* SUCCESS CONFIRMATION STATE */
            <div className="text-center py-6 px-4 space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold font-serif-brand text-[#202124]">
                  Application Successfully Received!
                </h3>
                <p className="text-xs text-[#6B7078] max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-[#202124]">{submittedApp.fullName}</strong>. Your preliminary application has been recorded in our Compliance Vetting Registry.
                </p>
              </div>

              {/* Reference ID Card */}
              <div className="max-w-md mx-auto p-4 bg-[#FAF8F6] rounded-2xl border border-[#E9DAD9] space-y-2">
                <span className="text-[10px] font-bold text-[#6B7078] uppercase tracking-wider block">
                  Your Dossier Tracking Reference
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg font-mono font-extrabold text-[#C8101E] tracking-wider">
                    {submittedApp.trackingId}
                  </span>
                  <button
                    onClick={handleCopyTrackId}
                    className="p-1.5 text-[#6B7078] hover:text-[#C8101E] rounded-lg hover:bg-white transition-colors cursor-pointer"
                    title="Copy reference ID"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-[#6B7078]">
                  Keep this tracking code safe. Our compliance officers will contact you via WhatsApp / Phone to complete full document verification.
                </p>
              </div>

              {/* Direct Actions: WhatsApp & Image Download */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
                <a
                  href={generateCounselorWhatsAppLink(submittedApp)}
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
                      referenceId: submittedApp.trackingId,
                      type: 'COUNSELOR_ACCREDITATION',
                      title: 'Official Counselor Panel Registration Pass',
                      fullName: submittedApp.fullName,
                      phone: submittedApp.phone,
                      email: submittedApp.email,
                      category: Array.isArray(submittedApp.visaCategories) ? submittedApp.visaCategories.join(', ') : 'Immigration Law',
                      destination: Array.isArray(submittedApp.destinations) ? submittedApp.destinations.join(', ') : 'Global',
                    }, `Counselor_Enrollment_Pass_${submittedApp.trackingId}.png`);
                  }}
                  className="w-full sm:w-auto py-3 px-5 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Download Pass (Image PNG)</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleResetAndClose}
                  className="px-8 py-2.5 bg-stone-100 hover:bg-stone-200 text-[#202124] text-xs font-bold rounded-full transition-colors cursor-pointer"
                >
                  Return to Website
                </button>
              </div>
            </div>
          ) : (
            /* APPLICATION FORM */
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3.5 bg-red-50 rounded-xl border border-red-200 text-xs text-red-700 font-medium">
                  {error}
                </div>
              )}

              {/* Notice Banner */}
              <div className="p-3 bg-[#FAF8F6] rounded-xl border border-[#E9DAD9] flex items-center gap-2.5 text-xs text-[#6B7078]">
                <ShieldCheck className="w-4 h-4 text-[#C8101E] shrink-0" />
                <span>
                  Please share your basic contact details below. Our compliance desk will reach out to verify your statutory credentials and activate your profile.
                </span>
              </div>

              {/* Personal & Contact Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#202124] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#E9DAD9] pb-1.5">
                  <UserPlus className="w-3.5 h-3.5 text-[#C8101E]" />
                  <span>1. Contact & Identification</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#202124] uppercase">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Barrister Tariq Mahmood"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs focus:outline-none focus:ring-2 focus:ring-[#C8101E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#202124] uppercase">
                      Display / Public Title (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tariq Mahmood (Senior UK Counsel)"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs focus:outline-none focus:ring-2 focus:ring-[#C8101E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#202124] uppercase">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="tariq@counsel.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs focus:outline-none focus:ring-2 focus:ring-[#C8101E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#202124] uppercase">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+92 300 1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs focus:outline-none focus:ring-2 focus:ring-[#C8101E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#202124] uppercase">
                      City & Country *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="City (e.g. Islamabad)"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#E9DAD9] text-xs focus:outline-none focus:ring-2 focus:ring-[#C8101E]"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#E9DAD9] text-xs focus:outline-none focus:ring-2 focus:ring-[#C8101E]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#202124] uppercase">
                      CNIC / Passport Number (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 37405-XXXXXXX-X"
                      value={nationalIdNumber}
                      onChange={(e) => setNationalIdNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs focus:outline-none focus:ring-2 focus:ring-[#C8101E]"
                    />
                  </div>
                </div>
              </div>

              {/* Practice & Specialization */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-[#202124] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#E9DAD9] pb-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#C8101E]" />
                  <span>2. Practice & Specialization</span>
                </h4>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#202124] uppercase">
                    Visa Categories Handled *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Study Visa', 'Visit Visa', 'Business Visa', 'Work & Skilled PR', 'Spouse / Family'].map((cat) => {
                      const active = selectedCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#C8101E] text-white border-[#C8101E]'
                              : 'bg-white text-[#202124] border-[#E9DAD9] hover:bg-[#FAF8F6]'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#202124] uppercase">
                    Target Jurisdictions / Destinations *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['UK', 'Canada', 'USA', 'Australia', 'Europe / Schengen', 'UAE / Middle East', 'Worldwide'].map((dest) => {
                      const active = selectedDestinations.includes(dest);
                      return (
                        <button
                          key={dest}
                          type="button"
                          onClick={() => toggleDestination(dest)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#760B16] text-white border-[#760B16]'
                              : 'bg-white text-[#202124] border-[#E9DAD9] hover:bg-[#FAF8F6]'
                          }`}
                        >
                          {dest}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#202124] uppercase">
                      Years of Experience *
                    </label>
                    <select
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs focus:outline-none focus:ring-2 focus:ring-[#C8101E] bg-white"
                    >
                      <option value={1}>1-2 Years (Associate)</option>
                      <option value={3}>3-5 Years (Practicing Counselor)</option>
                      <option value={6}>6-9 Years (Senior Advisor)</option>
                      <option value={10}>10+ Years (Bar / Master Counsel)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#202124] uppercase">
                      Firm / Chamber / Law Practice (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Global Law Chambers"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] text-xs focus:outline-none focus:ring-2 focus:ring-[#C8101E]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#202124] uppercase">
                    Brief Introduction / Past Success *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Briefly describe your credentials, university admissions record, or visa defense expertise..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E9DAD9] text-xs focus:outline-none focus:ring-2 focus:ring-[#C8101E] resize-none"
                  />
                </div>
              </div>

              {/* Anti-Fraud Acknowledgment */}
              <div className="p-3.5 bg-[#FAF8F6] rounded-2xl border border-[#E9DAD9] space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={antiFraudAgreed}
                    onChange={(e) => setAntiFraudAgreed(e.target.checked)}
                    required
                    className="mt-0.5 w-4 h-4 text-[#C8101E] rounded focus:ring-[#C8101E]"
                  />
                  <span className="text-[11px] text-[#202124] leading-relaxed">
                    <strong>Statutory Integrity & Anti-Fraud Pledge:</strong> I confirm that I am a genuine visa consultant or immigration practitioner. I agree to submit required identity and statutory proof to The Visa Syndicate Compliance Board before profile publication.
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-5 py-2.5 text-xs font-semibold text-[#6B7078] hover:text-[#202124] cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-7 py-3 bg-[#C8101E] hover:bg-[#760B16] text-white text-xs font-bold rounded-full shadow-md flex items-center gap-2 cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <span>Submit Counselor Application</span>
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
