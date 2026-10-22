import React, { useState, useEffect } from 'react';
import { api, PublicCounselor, Booking, Payment } from '../lib/api';
import { SUPPORTED_CURRENCIES, convertPkrFee } from '../lib/currencies';
import { BrandLogo } from './BrandLogo';
import {
  X,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Globe2,
  Smartphone,
  Copy,
  Check,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Upload,
  Image as ImageIcon,
  Trash2,
  Lock,
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCounselor?: PublicCounselor;
  preselectedService?: string;
  onBookingComplete?: (booking: Booking, payment: Payment) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedCounselor,
  preselectedService,
  onBookingComplete,
}) => {
  const [step, setStep] = useState<number>(1);
  const [counselors, setCounselors] = useState<PublicCounselor[]>([]);
  const [loadingCounselors, setLoadingCounselors] = useState(false);
  const [bankDetails, setBankDetails] = useState<any>(null);

  // Form State
  const [selectedService, setSelectedService] = useState<string>(preselectedService || 'Study Visa');
  const [selectedCounselorId, setSelectedCounselorId] = useState<string>(preselectedCounselor?.id || '');
  const [selectedDestination, setSelectedDestination] = useState<string>('UK');
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<string>('02:00 PM');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('PKR');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [countryOfResidence, setCountryOfResidence] = useState<string>('Pakistan');
  const [preferredLanguage, setPreferredLanguage] = useState<string>('English / Urdu');
  const [consultationReason, setConsultationReason] = useState<string>('');
  
  // Payment Proof State (Solely SadaPay 03400131732)
  const paymentMethod = 'sadapay';
  const [transactionReference, setTransactionReference] = useState<string>('');
  const [senderAccount, setSenderAccount] = useState<string>('');
  const [proofImage, setProofImage] = useState<string>('');
  const [proofFileName, setProofFileName] = useState<string>('');
  const [proofNote, setProofNote] = useState<string>('');

  // Submission State
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);
  const [completedPayment, setCompletedPayment] = useState<Payment | null>(null);
  const [copiedBank, setCopiedBank] = useState<boolean>(false);

  // Load counselors and bank details
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCompletedBooking(null);
      setCompletedPayment(null);
      setErrorMessage('');
      setTransactionReference('');
      setSenderAccount('');
      setProofImage('');
      setProofFileName('');
      setProofNote('');

      // Set default tomorrow date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setPreferredDate(tomorrow.toISOString().split('T')[0]);

      if (preselectedCounselor) {
        setSelectedCounselorId(preselectedCounselor.id);
        if (preselectedCounselor.visaCategories?.length) {
          setSelectedService(preselectedCounselor.visaCategories[0]);
        }
      }

      setLoadingCounselors(true);
      Promise.all([api.getPublicCounselors(), api.getSiteContent()])
        .then(([counselorList, siteContent]) => {
          setCounselors(counselorList);
          setBankDetails(siteContent.bankDetails);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoadingCounselors(false));
    }
  }, [isOpen, preselectedCounselor, preselectedService]);

  if (!isOpen) return null;

  const activeCounselor = counselors.find((c) => c.id === selectedCounselorId);
  const fee = activeCounselor ? activeCounselor.consultationFee : 10000;
  const duration = activeCounselor ? activeCounselor.consultationDuration : 45;

  const handleCopySadapay = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 5MB limit. Please upload a smaller image.');
      return;
    }

    setProofFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setProofImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!transactionReference.trim() && !proofImage) {
      setErrorMessage('Payment verification required: Please enter your SadaPay Transaction ID and attach the payment proof screenshot.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        counselorId: selectedCounselorId || null,
        customerName,
        customerEmail,
        customerPhone,
        countryOfResidence,
        destination: selectedDestination,
        visaCategory: selectedService,
        consultationType: `${selectedService} Expert Session`,
        preferredDate,
        preferredTimeSlot,
        reason: consultationReason || `${selectedService} profile evaluation for ${selectedDestination}`,
        language: preferredLanguage,
        paymentMethod: 'sadapay',
        transactionReference: transactionReference.trim(),
        senderAccount: senderAccount.trim(),
        proofImage,
        proofNote,
      };

      const result = await api.createBooking(payload);
      setCompletedBooking(result.booking);
      setCompletedPayment(result.payment);
      setStep(4); // Success step
      if (onBookingComplete) {
        onBookingComplete(result.booking, result.payment);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E9DAD9] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-[#FAF8F6] px-6 py-4.5 border-b border-[#E9DAD9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo variant="emblem" size="sm" />
            <div>
              <h3 className="text-base font-bold text-[#202124]">
                Book Consultation Session
              </h3>
              <p className="text-xs text-[#6B7078]">
                Pakistan Standard Time (PKT) · Verified Direct Session
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6B7078] hover:text-[#202124] hover:bg-[#F1EEEC] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        {step < 4 && (
          <div className="px-6 pt-4 pb-2 bg-white flex items-center justify-between text-xs font-semibold text-[#6B7078] border-b border-[#F1EEEC]">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#C8101E]' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-[#C8101E] text-white' : 'bg-slate-100'}`}>
                1
              </span>
              <span>Pathway</span>
            </div>
            <div className="w-8 h-[1px] bg-slate-200"></div>
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#C8101E]' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-[#C8101E] text-white' : 'bg-slate-100'}`}>
                2
              </span>
              <span>Schedule</span>
            </div>
            <div className="w-8 h-[1px] bg-slate-200"></div>
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#C8101E]' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-[#C8101E] text-white' : 'bg-slate-100'}`}>
                3
              </span>
              <span>Details & Payment</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Select Service & Counselor */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Service Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#202124] uppercase tracking-wide">
                  1. Select Visa Category
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Study Visa', 'Visit Visa', 'Business Visa'].map((svc) => (
                    <button
                      key={svc}
                      type="button"
                      onClick={() => setSelectedService(svc)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedService === svc
                          ? 'border-[#C8101E] bg-[#C8101E]/5 text-[#760B16] font-bold shadow-xs'
                          : 'border-[#E9DAD9] hover:bg-[#FAF8F6] text-[#202124]'
                      }`}
                    >
                      <span className="block text-xs sm:text-sm">{svc}</span>
                      <span className="block text-[10px] text-[#6B7078] font-normal mt-0.5">
                        {svc === 'Study Visa' ? 'Admissions & CAS' : svc === 'Visit Visa' ? 'Tourism & Family' : 'Trade & Investor'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#202124] uppercase tracking-wide">
                  2. Preferred Destination
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {['UK', 'Canada', 'USA', 'Australia', 'Europe'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDestination(d)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedDestination === d
                          ? 'border-[#C8101E] bg-[#C8101E] text-white font-bold'
                          : 'border-[#E9DAD9] hover:bg-[#FAF8F6] text-[#202124] text-xs'
                      }`}
                    >
                      <span className="text-xs font-semibold">{d}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Counselor Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#202124] uppercase tracking-wide flex items-center justify-between">
                  <span>3. Select Counselor / Specialist</span>
                  <span className="text-[11px] text-[#6B7078] font-normal">
                    {counselors.length} Certified Available
                  </span>
                </label>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {/* General Senior Advisory Panel (always available) */}
                  <div
                    onClick={() => setSelectedCounselorId('')}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                      selectedCounselorId === ''
                        ? 'border-[#C8101E] bg-[#C8101E]/5 shadow-xs'
                        : 'border-[#E9DAD9] hover:bg-[#FAF8F6]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#760B16] text-white flex items-center justify-center text-xs font-bold">
                        TVS
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#202124]">
                          General Senior Advisory Panel
                        </h4>
                        <p className="text-[11px] text-[#6B7078]">
                          Assigned to the most qualified specialist for {selectedDestination}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#202124] font-mono">PKR 10,000</span>
                      <span className="block text-[10px] text-[#6B7078]">45 Mins</span>
                    </div>
                  </div>

                  {/* Dynamic Counselors */}
                  {counselors.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCounselorId(c.id)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                        selectedCounselorId === c.id
                          ? 'border-[#C8101E] bg-[#C8101E]/5 shadow-xs'
                          : 'border-[#E9DAD9] hover:bg-[#FAF8F6]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 border border-slate-300">
                          {c.photoUrl ? (
                            <img src={c.photoUrl} alt={c.displayName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-[#C8101E]">
                              {c.displayName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#202124]">{c.displayName}</h4>
                          <p className="text-[11px] text-[#760B16] font-medium">{c.title}</p>
                          <p className="text-[10px] text-[#6B7078]">{c.destinations.join(', ')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#202124] font-mono">
                          PKR {c.consultationFee.toLocaleString()}
                        </span>
                        <span className="block text-[10px] text-[#6B7078]">
                          {c.consultationDuration} Mins
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 bg-[#C8101E] hover:bg-[#760B16] text-white text-xs font-bold rounded-full flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Select Date & Time</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Date & Time Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#202124] uppercase tracking-wide">
                  Preferred Date (Pakistan Time)
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E9DAD9] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C8101E]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#202124] uppercase tracking-wide">
                  Available Consultation Slots (PKT)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    '10:00 AM',
                    '11:30 AM',
                    '02:00 PM',
                    '03:30 PM',
                    '05:00 PM',
                    '06:30 PM',
                  ].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setPreferredTimeSlot(slot)}
                      className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        preferredTimeSlot === slot
                          ? 'border-[#C8101E] bg-[#C8101E] text-white shadow-xs'
                          : 'border-[#E9DAD9] hover:bg-[#FAF8F6] text-[#202124]'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{slot}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Consultation Summary Box */}
              <div className="p-4 bg-[#FAF8F6] rounded-2xl border border-[#E9DAD9] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6B7078]">Consultation Type:</span>
                  <span className="font-semibold text-[#202124]">{selectedService} ({selectedDestination})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7078]">Assigned Counselor:</span>
                  <span className="font-semibold text-[#202124]">
                    {activeCounselor ? activeCounselor.displayName : 'General Senior Advisory Panel'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7078]">Session Duration:</span>
                  <span className="font-semibold text-[#202124]">{duration} Minutes (One-on-One)</span>
                </div>
                {/* Currency Selector */}
                <div className="flex items-center justify-between pt-1 border-t border-[#E9DAD9]">
                  <span className="text-[#6B7078]">Payment Currency:</span>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="px-2 py-1 bg-white border border-[#E9DAD9] rounded-lg text-xs font-bold text-[#202124]"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-[#E9DAD9] font-bold text-sm">
                  <span className="text-[#202124]">Consultation Fee:</span>
                  <div className="text-right">
                    <span className="text-[#C8101E] font-mono text-base block">
                      {convertPkrFee(fee, selectedCurrency).formatted}
                    </span>
                    {selectedCurrency !== 'PKR' && (
                      <span className="text-[10px] text-[#6B7078] font-mono font-normal">
                        Equivalent to PKR {fee.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 text-xs font-semibold text-[#6B7078] hover:text-[#202124] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-[#C8101E] hover:bg-[#760B16] text-white text-xs font-bold rounded-full flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Proceed to Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Applicant Details & Payment Selection */}
          {step === 3 && (
            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#202124] uppercase">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Ali"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E9DAD9] text-xs focus:outline-none focus:ring-2 focus:ring-[#C8101E]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#202124] uppercase">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="applicant@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E9DAD9] text-xs focus:outline-none focus:ring-2 focus:ring-[#C8101E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#202124] uppercase">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E9DAD9] text-xs focus:outline-none focus:ring-2 focus:ring-[#C8101E]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#202124] uppercase">City / Country of Residence</label>
                  <input
                    type="text"
                    value={countryOfResidence}
                    onChange={(e) => setCountryOfResidence(e.target.value)}
                    placeholder="Islamabad, Pakistan"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E9DAD9] text-xs focus:outline-none focus:ring-2 focus:ring-[#C8101E]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#202124] uppercase">
                  Brief Consultation Reason or Profile Summary
                </label>
                <textarea
                  rows={2}
                  value={consultationReason}
                  onChange={(e) => setConsultationReason(e.target.value)}
                  placeholder="e.g. Master's in Data Science in UK, have 3.4 CGPA, need funds review."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E9DAD9] text-xs focus:outline-none focus:ring-2 focus:ring-[#C8101E]"
                />
              </div>

              {/* Exclusive SadaPay Payment Instructions */}
              <div className="space-y-3 pt-3 border-t border-[#F1EEEC]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#202124] uppercase tracking-wide flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-[#C8101E]" />
                    <span>Official Sovereign Payment Channel ({selectedCurrency})</span>
                  </label>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>100% Escrow Guaranteed</span>
                  </span>
                </div>

                {/* SadaPay & International Wire Card */}
                <div className="p-4 bg-gradient-to-br from-[#FAF8F6] to-white rounded-2xl border-2 border-[#C8101E]/20 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-bold text-xs">
                        S
                      </div>
                      <div>
                        <span className="font-bold text-sm text-[#202124] block">SadaPay Digital Escrow</span>
                        <span className="text-[10px] text-[#6B7078]">Ghulam Mujtaba / The Visa Syndicate</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopySadapay('03400131732')}
                      className="px-3 py-1.5 bg-[#C8101E] hover:bg-[#760B16] text-white rounded-lg text-[11px] font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      {copiedBank ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedBank ? 'Copied' : 'Copy Number'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-[#E9DAD9]">
                    <div>
                      <span className="text-[10px] text-[#6B7078] block">SadaPay Account Number:</span>
                      <span className="font-mono font-bold text-sm text-[#C8101E]">03400131732</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#6B7078] block">Account Title:</span>
                      <span className="font-semibold text-xs text-[#202124]">Ghulam Mujtaba</span>
                    </div>
                    <div className="sm:col-span-2 pt-1 border-t border-[#F1EEEC]">
                      <span className="text-[10px] text-[#6B7078] block">International Inward IBAN (For Remitly / Wise / Wire):</span>
                      <span className="font-mono font-bold text-[11px] text-[#202124]">PK36SADA00000003400131732</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-[11px] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Sovereign Client Escrow Protection</span>
                    </div>
                    <p className="text-[10.5px] leading-relaxed">
                      Please transfer <strong>{convertPkrFee(fee, selectedCurrency).formatted}</strong> (equivalent to PKR {fee.toLocaleString()}). Your funds are locked safely in escrow and are only disbursed once your consultation is fulfilled.
                    </p>
                  </div>
                </div>

                {/* Payment Proof Attachment Inputs */}
                <div className="space-y-3 pt-2 bg-amber-50/50 p-4 rounded-2xl border border-amber-200/70">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#C8101E]" />
                    <span>Attach Payment Proof to Confirm Consultation</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#202124]">
                        SadaPay Transaction ID (TRX ID) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 261011987654"
                        value={transactionReference}
                        onChange={(e) => setTransactionReference(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E9DAD9] bg-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#C8101E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#202124]">
                        Sender Account Name / Mobile
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Muhammad Ali (0300...)"
                        value={senderAccount}
                        onChange={(e) => setSenderAccount(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E9DAD9] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#C8101E]"
                      />
                    </div>
                  </div>

                  {/* File Upload for Payment Screenshot */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#202124] flex items-center justify-between">
                      <span>Upload SadaPay Transfer Screenshot / Slip *</span>
                      {proofFileName && (
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Attached
                        </span>
                      )}
                    </label>

                    {proofImage ? (
                      <div className="p-3 bg-white rounded-xl border border-emerald-300 flex items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={proofImage}
                            alt="Payment Proof"
                            className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                          />
                          <div>
                            <span className="text-xs font-bold text-[#202124] block truncate max-w-[200px]">
                              {proofFileName || 'payment_proof.jpg'}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-medium">Ready for verification</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setProofImage('');
                            setProofFileName('');
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove slip"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-[#E9DAD9] hover:border-[#C8101E] bg-white rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors group">
                        <Upload className="w-5 h-5 text-[#6B7078] group-hover:text-[#C8101E] transition-colors" />
                        <span className="text-xs font-semibold text-[#202124]">
                          Click to select receipt screenshot
                        </span>
                        <span className="text-[10px] text-[#6B7078]">JPG, PNG or WebP (Max 5MB)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 text-xs font-semibold text-[#6B7078] hover:text-[#202124] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-7 py-3 bg-[#C8101E] hover:bg-[#760B16] text-white text-xs font-bold rounded-full flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Submitting Proof & Confirming...</span>
                  ) : (
                    <>
                      <span>Attach Proof & Confirm Consultation</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Confirmation & Reference Display */}
          {step === 4 && completedBooking && (
            <div className="text-center space-y-6 py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Consultation Request & Payment Proof Received
                </span>
                <h3 className="text-2xl font-serif-brand font-bold text-[#202124] mt-2">
                  Reference: {completedBooking.referenceCode}
                </h3>
                <p className="text-xs text-[#6B7078] max-w-md mx-auto">
                  Your payment proof has been attached and logged with SadaPay reference.
                </p>
              </div>

              {/* Booking Summary Card */}
              <div className="bg-[#FAF8F6] rounded-2xl p-4 sm:p-5 border border-[#E9DAD9] text-left text-xs space-y-2 max-w-lg mx-auto">
                <div className="flex justify-between">
                  <span className="text-[#6B7078]">Applicant:</span>
                  <span className="font-semibold text-[#202124]">{completedBooking.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7078]">Session:</span>
                  <span className="font-semibold text-[#202124]">
                    {completedBooking.consultationType} ({completedBooking.destination})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7078]">Counselor:</span>
                  <span className="font-semibold text-[#202124]">{completedBooking.counselorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7078]">Scheduled Date & Slot:</span>
                  <span className="font-semibold text-[#202124]">
                    {completedBooking.preferredDate} at {completedBooking.preferredTimeSlot} (PKT)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7078]">Fee (SadaPay):</span>
                  <span className="font-bold text-[#C8101E] font-mono">
                    PKR {completedBooking.fee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#E9DAD9]">
                  <span className="text-[#6B7078]">Current Status:</span>
                  <span className="font-bold text-amber-700 uppercase text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Payment Under Review</span>
                  </span>
                </div>

                {proofImage && (
                  <div className="pt-2 border-t border-[#E9DAD9] flex items-center gap-3">
                    <img
                      src={proofImage}
                      alt="Uploaded SadaPay Receipt"
                      className="w-10 h-10 object-cover rounded-lg border border-slate-300"
                    />
                    <div className="text-[11px]">
                      <span className="font-bold text-[#202124] block">Attached SadaPay Slip</span>
                      <span className="text-[#6B7078]">{transactionReference || 'TRX Logged'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 text-left space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Administrative Verification in Progress</span>
                </div>
                <p className="text-[11px] text-emerald-800/90 leading-relaxed">
                  Master Administrator Ghulam Mujtaba will review your attached SadaPay slip against 03400131732.
                  Once verified, your consultation meeting link will be confirmed. You can monitor progress anytime via "Track Booking".
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#C8101E] hover:bg-[#760B16] text-white text-xs font-bold rounded-full shadow-sm cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
