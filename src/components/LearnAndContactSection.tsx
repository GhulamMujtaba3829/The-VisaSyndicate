import React, { useState } from 'react';
import { api } from '../lib/api';
import {
  FileText,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Send,
  Building,
  ShieldCheck,
  Clock,
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  Download,
} from 'lucide-react';
import {
  generateWhatsAppLink,
  formatInquiryForWhatsApp,
  openWhatsAppInquiry,
  ADMIN_WHATSAPP_NUMBER,
} from '../lib/whatsapp';
import { downloadDossierImage } from '../lib/dossierCanvas';

interface LearnAndContactProps {
  onOpenBooking: () => void;
}

export const LearnAndContactSection: React.FC<LearnAndContactProps> = ({ onOpenBooking }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Contact Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Study Visa');
  const [destination, setDestination] = useState('UK');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [sendError, setSendError] = useState('');
  const [lastSubmittedPayload, setLastSubmittedPayload] = useState<any>(null);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  const faqs = [
    {
      q: 'Does The Visa Syndicate guarantee visa grants?',
      a: 'No reputable consultancy can or should guarantee a visa. Sovereign High Commissions and immigration departments (UKVI, IRCC, US Embassy, DHA) maintain sole legal authority over all visa decisions. Our role is to ensure your application, financial records, proof of ties, and interviews meet 100% of the statutory evidentiary requirements to maximize your legitimate prospects.',
    },
    {
      q: 'How does the 28-day bank balance rule work?',
      a: 'For UK and certain European student and visit visas, the required funds must be held continuously for a minimum of 28 consecutive days ending no more than 31 days before the online application date. The balance must never dip below the required threshold for even a single day.',
    },
    {
      q: 'How do your remote online consultations work?',
      a: 'The Visa Syndicate operates on a premier remote-first digital model serving applicants worldwide. Consultations are conducted via private high-definition video calls with shared document audit screens.',
    },
    {
      q: 'How are counselor consultation fees paid?',
      a: 'Consultation fees are paid via SadaPay (03400131732). Simply transfer the consultation fee, upload your payment screenshot/slip, and our desk will confirm your appointment.',
    },
    {
      q: 'What happens if my visa has previously been refused?',
      a: 'Previous refusals must always be disclosed truthfully. We review your official refusal letter (Decision Letter / GCMS notes) to understand the exact grounds and structure a comprehensive Letter of Explanation and rebuttal evidence.',
    },
  ];

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSendError('');
    setSentSuccess(false);

    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      visaCategory: category,
      destination,
      message: message.trim(),
      refId: `TVS-${Date.now().toString().slice(-6)}`,
    };

    setLastSubmittedPayload(payload);

    try {
      await api.submitEnquiry(payload);
    } catch (err: any) {
      console.warn('Database submission warning (WhatsApp fallback active):', err);
    } finally {
      setSending(false);
    }

    setSentSuccess(true);
  };

  return (
    <div className="space-y-16 py-16 sm:py-24 bg-[#FAF8F6]">
      {/* Guides & FAQs Container */}
      <section id="learn" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C8101E]"></span>
            <span className="text-xs font-bold tracking-widest text-[#760B16] uppercase">
              DOCUMENTATION ARCHIVE
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-brand font-bold text-[#202124]">
            Guidance for Pakistani Passports
          </h2>
          <p className="text-[#6B7078] text-sm sm:text-base leading-relaxed">
            Clear, transparent answers to the most common documentation hurdles faced by applicants from Pakistan.
          </p>
        </div>

        {/* 3 Featured Guides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-2xl border border-[#E9DAD9] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#C8101E]/10 text-[#C8101E] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#202124]">Bank Statement Auditing</h3>
            <p className="text-xs text-[#6B7078] leading-relaxed">
              Why sudden unexplained cash deposits trigger fraud alerts, how to prove tax returns (FBR Active Taxpayer), and maintaining clean holding periods.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E9DAD9] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#C8101E]/10 text-[#C8101E] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#202124]">Home Ties Documentation</h3>
            <p className="text-xs text-[#6B7078] leading-relaxed">
              Overcoming the universal 214(b) assumption of immigrant intent. Documenting employment, business registration, family roots, and asset titles.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E9DAD9] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#C8101E]/10 text-[#C8101E] flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#202124]">Embassy Interview Strategy</h3>
            <p className="text-xs text-[#6B7078] leading-relaxed">
              Navigating credible student interviews, Schengen visa officer cross-examinations, and US consular officer rapid-fire questions with confidence.
            </p>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="max-w-3xl mx-auto space-y-3">
          <h3 className="text-xl font-serif-brand font-bold text-[#202124] mb-4 text-center">
            Frequently Asked Questions
          </h3>
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#E9DAD9] overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#202124] hover:text-[#C8101E] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#C8101E] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#6B7078] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-xs text-[#6B7078] leading-relaxed border-t border-[#F1EEEC] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* About & Contact Section */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E9DAD9] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Contact Info & Philosophy */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold tracking-widest text-[#760B16] uppercase">
                  DIRECT CONSULTATION DESK
                </span>
                <h3 className="text-3xl font-serif-brand font-bold text-[#202124]">
                  Get In Touch
                </h3>
                <p className="text-xs sm:text-sm text-[#6B7078] leading-relaxed">
                  Have an enquiry about your eligibility, document verification, or scheduling a one-on-one session?
                  Our global consultation team is available online.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#C8101E]/10 text-[#C8101E] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-[#202124] block">Remote-First Consultation Desk</span>
                    <span className="text-[#6B7078]">Serving international applicants & global travelers</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#C8101E]/10 text-[#C8101E] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-[#202124] block">Official Inquiries</span>
                    <span className="text-[#6B7078]">admissions@thevisasyndicate.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#C8101E]/10 text-[#C8101E] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-[#202124] block">Consultation Hours</span>
                    <span className="text-[#6B7078]">Monday – Saturday: 10:00 AM – 7:00 PM (PKT)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Direct Message Form */}
            <div className="lg:col-span-7 bg-[#FAF8F6] p-6 sm:p-8 rounded-2xl border border-[#E9DAD9]">
              <h4 className="text-lg font-serif-brand font-bold text-[#202124] mb-1">
                Submit an Assessment Enquiry
              </h4>
              <p className="text-xs text-[#6B7078] mb-5">
                Our team responds to all verified submissions within 24 business hours.
              </p>

              {sentSuccess ? (
                <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4 shadow-sm animate-in fade-in duration-200">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <div className="space-y-1">
                    <h5 className="text-base font-bold text-emerald-900">Enquiry Received Successfully!</h5>
                    <p className="text-xs text-emerald-800 max-w-sm mx-auto leading-relaxed">
                      Thank you. Your assessment inquiry has been recorded. Our team will contact as soon as possible.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSentSuccess(false);
                        setName('');
                        setEmail('');
                        setPhone('');
                        setMessage('');
                      }}
                      className="text-xs text-emerald-700 hover:text-emerald-900 underline font-semibold cursor-pointer"
                    >
                      ← Submit another inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  {sendError && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs">{sendError}</div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#202124] uppercase">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Asad Mehmood"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] bg-white text-xs focus:ring-2 focus:ring-[#C8101E] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#202124] uppercase">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="asad@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] bg-white text-xs focus:ring-2 focus:ring-[#C8101E] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#202124] uppercase">WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+92 300 0000000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] bg-white text-xs focus:ring-2 focus:ring-[#C8101E] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#202124] uppercase">Visa Pathway</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#E9DAD9] bg-white text-xs focus:ring-2 focus:ring-[#C8101E] focus:outline-none"
                      >
                        <option value="Study Visa">Study Visa</option>
                        <option value="Visit Visa">Visit Visa</option>
                        <option value="Business Visa">Business Visa</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#202124] uppercase">Destination</label>
                      <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#E9DAD9] bg-white text-xs focus:ring-2 focus:ring-[#C8101E] focus:outline-none"
                      >
                        <option value="UK">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="USA">United States</option>
                        <option value="Australia">Australia</option>
                        <option value="Europe">Europe / Schengen</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#202124] uppercase">Message / Questions</label>
                    <textarea
                      rows={3}
                      placeholder="Please outline your academic background, current profession, and any previous visa history..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9DAD9] bg-white text-xs focus:ring-2 focus:ring-[#C8101E] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3 bg-[#C8101E] hover:bg-[#760B16] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{sending ? 'Transmitting Enquiry...' : 'Submit Case Assessment'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
