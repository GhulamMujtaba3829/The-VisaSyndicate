import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import { Search, ChevronDown, Menu, X, ArrowRight, ShieldCheck, CalendarCheck, Bell, BookOpen } from 'lucide-react';

interface NavbarProps {
  onOpenEligibility: () => void;
  onOpenBooking: () => void;
  onOpenTrackBooking: () => void;
  onOpenSearch: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
  onOpenWelcome?: () => void;
  onOpenBlog?: (postId?: string) => void;
  onOpenJoinCounselor?: () => void;
  onOpenTrustModal?: () => void;
  unreadBlogCount?: number;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenEligibility,
  onOpenBooking,
  onOpenTrackBooking,
  onOpenSearch,
  onNavigate,
  onOpenAdmin,
  onOpenWelcome,
  onOpenBlog,
  onOpenJoinCounselor,
  onOpenTrustModal,
  unreadBlogCount = 1,
  activeSection = 'home',
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [destinationsDropdown, setDestinationsDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Advisory Notice */}
      <div className="bg-[#760B16] text-white text-[11px] font-medium py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2 flex-wrap">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E31B2F] shrink-0"></span>
        <span>Premium Global Visa Advisory & International Case Audits · Dedicated Study, Visit & Business Specialists</span>
        {onOpenWelcome && (
          <button
            onClick={onOpenWelcome}
            className="ml-2 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] font-semibold tracking-wide transition-colors"
          >
            Welcome Tour
          </button>
        )}
        <button
          onClick={onOpenAdmin}
          className="ml-2 underline opacity-85 hover:opacity-100 text-[10px] uppercase tracking-wider font-bold"
        >
          Admin Console
        </button>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E9DAD9] py-3.5'
            : 'bg-white py-4.5 border-b border-[#F1EEEC]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => {
              onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8101E] rounded-md transition-transform hover:scale-[1.01]"
          >
            <BrandLogo size="md" />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[13.5px] font-medium text-[#202124]">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-[#C8101E] transition-colors whitespace-nowrap cursor-pointer ${
                activeSection === 'home' ? 'text-[#C8101E] font-semibold' : 'text-[#202124]'
              }`}
            >
              Home
            </button>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdown(true)}
              onMouseLeave={() => setServicesDropdown(false)}
            >
              <button
                onClick={() => onNavigate('services')}
                className="flex items-center gap-1 hover:text-[#C8101E] transition-colors whitespace-nowrap py-1"
              >
                <span>Services</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#6B7078] transition-transform duration-200 group-hover:rotate-180" />
              </button>
              {servicesDropdown && (
                <div className="absolute top-full left-0 w-60 bg-white rounded-xl shadow-xl border border-[#E9DAD9] py-2 animate-in fade-in slide-in-from-top-1 duration-200 z-50">
                  <button
                    onClick={() => {
                      onNavigate('study-visa');
                      setServicesDropdown(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-medium text-[#202124] hover:bg-[#FAF8F6] hover:text-[#C8101E] flex flex-col gap-0.5"
                  >
                    <span className="font-semibold text-[13px]">Study Visa</span>
                    <span className="text-[11px] text-[#6B7078]">Admissions, CAS/I-20, Financial Prep</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('visit-visa');
                      setServicesDropdown(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-medium text-[#202124] hover:bg-[#FAF8F6] hover:text-[#C8101E] flex flex-col gap-0.5 border-t border-[#F1EEEC]"
                  >
                    <span className="font-semibold text-[13px]">Visit & Tourist Visa</span>
                    <span className="text-[11px] text-[#6B7078]">Schengen, UK, USA & Canadian Tourism</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('business-visa');
                      setServicesDropdown(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-medium text-[#202124] hover:bg-[#FAF8F6] hover:text-[#C8101E] flex flex-col gap-0.5 border-t border-[#F1EEEC]"
                  >
                    <span className="font-semibold text-[13px]">Business & Investor Visa</span>
                    <span className="text-[11px] text-[#6B7078]">Trade delegations & corporate travel</span>
                  </button>
                </div>
              )}
            </div>

            {/* Destinations Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDestinationsDropdown(true)}
              onMouseLeave={() => setDestinationsDropdown(false)}
            >
              <button
                onClick={() => onNavigate('destinations')}
                className="flex items-center gap-1 hover:text-[#C8101E] transition-colors whitespace-nowrap py-1"
              >
                <span>Destinations</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#6B7078]" />
              </button>
              {destinationsDropdown && (
                <div className="absolute top-full left-0 w-56 bg-white rounded-xl shadow-xl border border-[#E9DAD9] py-2 animate-in fade-in slide-in-from-top-1 duration-200 z-50">
                  {['UK', 'Canada', 'USA', 'Australia', 'Europe'].map((dest) => (
                    <button
                      key={dest}
                      onClick={() => {
                        onNavigate(`dest-${dest.toLowerCase()}`);
                        setDestinationsDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-[13px] font-medium text-[#202124] hover:bg-[#FAF8F6] hover:text-[#C8101E] flex items-center justify-between"
                    >
                      <span>{dest}</span>
                      <span className="text-[11px] text-[#6B7078]">
                        {dest === 'Europe' ? 'Schengen & National' : 'Pathways'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('counselors')}
              className="hover:text-[#C8101E] transition-colors whitespace-nowrap"
            >
              Counselors
            </button>

            <button
              onClick={() => onNavigate('learn')}
              className="hover:text-[#C8101E] transition-colors whitespace-nowrap cursor-pointer"
            >
              Learn
            </button>

            {/* Articles / Blog Link */}
            {onOpenBlog && (
              <button
                onClick={() => onOpenBlog()}
                className="hover:text-[#C8101E] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
              >
                <span>Articles</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8101E]"></span>
              </button>
            )}

            <button
              onClick={() => onNavigate('about')}
              className="hover:text-[#C8101E] transition-colors whitespace-nowrap cursor-pointer"
            >
              About
            </button>

            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-[#C8101E] transition-colors whitespace-nowrap cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Right Action Zone */}
          <div className="flex items-center gap-3">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              aria-label="Search visa requirements"
              className="p-2 text-[#202124] hover:text-[#C8101E] hover:bg-[#FAF8F6] rounded-full transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notification Bell Trigger */}
            {onOpenBlog && (
              <button
                onClick={() => onOpenBlog()}
                aria-label="View latest publications"
                className="relative p-2 text-[#202124] hover:text-[#C8101E] hover:bg-[#FAF8F6] rounded-full transition-colors cursor-pointer"
                title="Latest Visa Advisories"
              >
                <Bell className="w-4 h-4" />
                {unreadBlogCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C8101E] animate-pulse ring-2 ring-white"></span>
                )}
              </button>
            )}

            {/* Join Us as Counselor Trigger */}
            {onOpenJoinCounselor && (
              <button
                onClick={onOpenJoinCounselor}
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-[#C8101E] hover:text-white bg-[#C8101E]/10 hover:bg-[#C8101E] rounded-full transition-all cursor-pointer border border-[#C8101E]/20"
                title="Join as Counselor"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Join Us</span>
              </button>
            )}

            {/* Track Booking Button */}
            <button
              onClick={onOpenTrackBooking}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#760B16] bg-[#F1EEEC] hover:bg-[#E9DAD9] rounded-full transition-colors cursor-pointer"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Track Booking</span>
            </button>

            {/* Primary Action Button - Check Your Eligibility */}
            <button
              onClick={onOpenEligibility}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C8101E] hover:bg-[#760B16] text-white text-xs sm:text-[13px] font-semibold rounded-full shadow-sm hover:shadow transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shrink-0"
            >
              <span>Check Your Eligibility</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#202124] hover:text-[#C8101E] rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#F1EEEC]">
                <BrandLogo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#6B7078] hover:text-[#202124]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-1">
                <button
                  onClick={() => {
                    onNavigate('home');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2.5 px-3 text-sm font-semibold text-[#202124] hover:text-[#C8101E] rounded-lg hover:bg-[#FAF8F6]"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    onNavigate('services');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2.5 px-3 text-sm font-semibold text-[#202124] hover:text-[#C8101E] rounded-lg hover:bg-[#FAF8F6]"
                >
                  Services (Study, Visit, Business)
                </button>
                <button
                  onClick={() => {
                    onNavigate('destinations');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2.5 px-3 text-sm font-semibold text-[#202124] hover:text-[#C8101E] rounded-lg hover:bg-[#FAF8F6]"
                >
                  Destinations (UK, Canada, USA, Australia, Europe)
                </button>
                <button
                  onClick={() => {
                    onNavigate('counselors');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2.5 px-3 text-sm font-semibold text-[#202124] hover:text-[#C8101E] rounded-lg hover:bg-[#FAF8F6]"
                >
                  Counselors & Specialists
                </button>
                <button
                  onClick={() => {
                    onNavigate('learn');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2.5 px-3 text-sm font-semibold text-[#202124] hover:text-[#C8101E] rounded-lg hover:bg-[#FAF8F6]"
                >
                  Visa Guides & FAQs
                </button>
                {onOpenBlog && (
                  <button
                    onClick={() => {
                      onOpenBlog();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2.5 px-3 text-sm font-semibold text-[#760B16] hover:text-[#C8101E] rounded-lg hover:bg-[#FAF8F6] flex items-center justify-between"
                  >
                    <span>Articles & Advisories</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#C8101E] text-white text-[10px] font-bold">New</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    onNavigate('about');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2.5 px-3 text-sm font-semibold text-[#202124] hover:text-[#C8101E] rounded-lg hover:bg-[#FAF8F6]"
                >
                  About The Syndicate
                </button>
                <button
                  onClick={() => {
                    onNavigate('contact');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2.5 px-3 text-sm font-semibold text-[#202124] hover:text-[#C8101E] rounded-lg hover:bg-[#FAF8F6]"
                >
                  Contact & Consultation Desk
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F1EEEC] space-y-2.5">
              <button
                onClick={() => {
                  onOpenTrackBooking();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 text-xs font-semibold text-[#760B16] bg-[#F1EEEC] rounded-xl flex items-center justify-center gap-2"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Track Existing Consultation Booking</span>
              </button>
              <button
                onClick={() => {
                  onOpenEligibility();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 px-4 text-xs font-semibold text-white bg-[#C8101E] rounded-xl flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Check Your Eligibility</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {onOpenJoinCounselor && (
                <button
                  onClick={() => {
                    onOpenJoinCounselor();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-4 text-xs font-bold text-[#C8101E] bg-[#C8101E]/10 rounded-xl flex items-center justify-center gap-2 border border-[#C8101E]/20"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Join Us as Counselor</span>
                </button>
              )}
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-4 text-[11px] font-medium text-[#6B7078] hover:text-[#C8101E] text-center"
              >
                Admin Management Console
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
