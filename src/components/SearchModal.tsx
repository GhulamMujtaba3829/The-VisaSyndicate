import React, { useState } from 'react';
import { Search, X, ArrowRight, FileText, Globe2, GraduationCap, Plane, Briefcase } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
  onSelectService: (serviceName: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectService,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const topics = [
    { title: 'UK Student Visa (CAS & Financial Holding)', type: 'Study Visa', action: () => onSelectService('Study Visa') },
    { title: 'Canada Study Permit & Provincial Attestation Letter (PAL)', type: 'Study Visa', action: () => onSelectService('Study Visa') },
    { title: 'US F-1 Visa Appointment & DS-160 Filing', type: 'Study Visa', action: () => onSelectService('Study Visa') },
    { title: 'Schengen Multi-Entry Tourist Visa Cover Letter', type: 'Visit Visa', action: () => onSelectService('Visit Visa') },
    { title: 'UK Standard 6-Month Visitor Visa Requirements', type: 'Visit Visa', action: () => onSelectService('Visit Visa') },
    { title: 'Business Conference & Corporate Delegation Visas', type: 'Business Visa', action: () => onSelectService('Business Visa') },
    { title: 'Pakistan Bank Statement Verification (28-day rule)', type: 'Guide', action: () => onNavigate('learn') },
    { title: 'Meet Verified Advisory Specialists', type: 'Counselors', action: () => onNavigate('counselors') },
    { title: 'Consultation Fees & Refund Policy', type: 'Policy', action: () => onNavigate('learn') },
  ];

  const filtered = topics.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase()) ||
    t.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 pt-20 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#E9DAD9] overflow-hidden">
        {/* Search Input */}
        <div className="p-4 border-b border-[#E9DAD9] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#C8101E]" />
          <input
            type="text"
            autoFocus
            placeholder="Search visa requirements, countries, bank rules, or guides..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-xs sm:text-sm focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-[#6B7078] hover:text-[#202124] rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 max-h-80 overflow-y-auto space-y-1.5">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  item.action();
                  onClose();
                }}
                className="w-full p-2.5 rounded-xl hover:bg-[#FAF8F6] text-left flex items-center justify-between group transition-colors cursor-pointer"
              >
                <div>
                  <span className="block text-xs font-semibold text-[#202124] group-hover:text-[#C8101E]">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-[#6B7078] uppercase tracking-wider">
                    {item.type}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#C8101E] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))
          ) : (
            <p className="text-center text-xs text-[#6B7078] py-6">
              No matching visa pathways or topics found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
