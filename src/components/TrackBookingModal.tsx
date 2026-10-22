import React, { useState } from 'react';
import { api, Booking, Payment } from '../lib/api';
import { BrandLogo } from './BrandLogo';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
  Smartphone,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

interface TrackBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrackBookingModal: React.FC<TrackBookingModalProps> = ({ isOpen, onClose }) => {
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<{ booking: Booking; payment: Payment; bankDetails: any } | null>(null);
  const [error, setError] = useState('');

  // Payment proof submission
  const proofMethod = 'sadapay';
  const [transactionRef, setTransactionRef] = useState('');
  const [senderAccount, setSenderAccount] = useState('');
  const [proofNote, setProofNote] = useState('');
  const [proofImage, setProofImage] = useState('');
  const [proofFileName, setProofFileName] = useState('');
  const [submittingProof, setSubmittingProof] = useState(false);
  const [proofSuccess, setProofSuccess] = useState('');

  if (!isOpen) return null;

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setProofSuccess('');
    setLoading(true);

    try {
      const data = await api.lookupBooking(reference);
      setBookingData(data);
    } catch (err: any) {
      setError(err.message || 'Booking reference not found');
      setBookingData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setProofImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData) return;
    setSubmittingProof(true);
    setError('');

    try {
      const updated = await api.submitPayment(bookingData.booking.referenceCode, {
        method: 'sadapay',
        transactionReference: transactionRef,
        senderAccount,
        proofNote,
        proofImage,
      });
      setBookingData({
        ...bookingData,
        booking: updated.booking,
        payment: updated.payment,
      });
      setProofSuccess('Payment proof and SadaPay transaction ID submitted. Admin Ghulam Mujtaba is verifying.');
    } catch (err: any) {
      setError(err.message || 'Failed to submit payment details');
    } finally {
      setSubmittingProof(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs uppercase">Confirmed</span>;
      case 'payment_under_review':
        return <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-xs uppercase">Payment Under Review</span>;
      case 'completed':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-bold text-xs uppercase">Completed</span>;
      case 'cancelled':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full font-bold text-xs uppercase">Cancelled</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full font-bold text-xs uppercase">Pending Payment</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-[#E9DAD9] overflow-hidden">
        {/* Header */}
        <div className="bg-[#FAF8F6] px-6 py-4.5 border-b border-[#E9DAD9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo variant="emblem" size="sm" />
            <div>
              <h3 className="text-base font-bold text-[#202124]">
                Track Consultation Booking
              </h3>
              <p className="text-xs text-[#6B7078]">
                Check Appointment Status & Submit Payment Reference
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

        <div className="p-6 space-y-6">
          {/* Lookup Input Form */}
          <form onSubmit={handleLookup} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Enter Reference (e.g. TVS-2026-12345)"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#E9DAD9] text-xs font-mono uppercase focus:ring-2 focus:ring-[#C8101E] focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#C8101E] hover:bg-[#760B16] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Searching...' : 'Search'}</span>
            </button>
          </form>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Record Display */}
          {bookingData && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 bg-[#FAF8F6] rounded-2xl border border-[#E9DAD9] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E9DAD9]">
                  <div>
                    <span className="text-[10px] text-[#6B7078] uppercase font-bold">Booking Reference</span>
                    <h4 className="text-base font-bold text-[#202124] font-mono">{bookingData.booking.referenceCode}</h4>
                  </div>
                  <div>{getStatusBadge(bookingData.booking.status)}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#6B7078] block text-[11px]">Applicant</span>
                    <span className="font-semibold text-[#202124]">{bookingData.booking.customerName}</span>
                  </div>
                  <div>
                    <span className="text-[#6B7078] block text-[11px]">Pathway</span>
                    <span className="font-semibold text-[#202124]">
                      {bookingData.booking.visaCategory} ({bookingData.booking.destination})
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6B7078] block text-[11px]">Assigned Counselor</span>
                    <span className="font-semibold text-[#202124]">{bookingData.booking.counselorName}</span>
                  </div>
                  <div>
                    <span className="text-[#6B7078] block text-[11px]">Scheduled Slot</span>
                    <span className="font-semibold text-[#202124]">
                      {bookingData.booking.preferredDate} · {bookingData.booking.preferredTimeSlot} (PKT)
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6B7078] block text-[11px]">Consultation Fee</span>
                    <span className="font-bold text-[#C8101E] font-mono">
                      PKR {bookingData.booking.fee.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6B7078] block text-[11px]">Payment Status</span>
                    <span className="font-semibold capitalize text-[#202124]">
                      {bookingData.payment?.status.replace(/_/g, ' ') || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* If status is pending or user wants to submit receipt reference */}
              {['pending_payment', 'payment_under_review'].includes(bookingData.booking.status) && (
                <div className="p-4 bg-white rounded-2xl border border-[#E9DAD9] space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-[#760B16] uppercase">
                      Submit / Update Payment Proof
                    </h5>
                    <span className="text-[11px] text-[#6B7078]">Manual Verification Desk</span>
                  </div>

                  {proofSuccess && (
                    <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-medium">
                      {proofSuccess}
                    </div>
                  )}

                  <form onSubmit={handleSubmitProof} className="space-y-3">
                    <div className="p-3 bg-[#FAF8F6] rounded-xl border border-[#E9DAD9] text-xs">
                      <span className="font-bold text-[#760B16] block">Official SadaPay Account</span>
                      <span className="text-[#202124] block">Account Title: <strong>Ghulam Mujtaba</strong></span>
                      <span className="font-mono text-[#C8101E] font-bold text-sm block">03400131732</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#202124]">
                        SadaPay Transaction ID (TRX ID) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 261011987654"
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#E9DAD9] text-xs font-mono focus:ring-2 focus:ring-[#C8101E] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#202124]">
                        Sender Account Title / Mobile Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 0300-1234567 or Account Title"
                        value={senderAccount}
                        onChange={(e) => setSenderAccount(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#E9DAD9] text-xs focus:ring-2 focus:ring-[#C8101E] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#202124] block">
                        Upload SadaPay Transfer Receipt / Screenshot
                      </label>
                      {proofImage ? (
                        <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                          <img src={proofImage} alt="Receipt" className="w-8 h-8 rounded object-cover" />
                          <span className="text-emerald-800 text-[11px] font-medium truncate flex-1">
                            {proofFileName || 'Receipt selected'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setProofImage('');
                              setProofFileName('');
                            }}
                            className="text-red-500 text-xs hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="w-full text-xs text-[#6B7078] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#C8101E] file:text-white hover:file:bg-[#760B16] cursor-pointer"
                        />
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={submittingProof}
                      className="w-full py-2.5 bg-[#C8101E] hover:bg-[#760B16] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <span>{submittingProof ? 'Updating...' : 'Submit Transaction Reference'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
