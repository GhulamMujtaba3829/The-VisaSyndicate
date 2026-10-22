import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { CounselorsSection } from './components/CounselorsSection';
import { LearnAndContactSection } from './components/LearnAndContactSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { EligibilityModal } from './components/EligibilityModal';
import { TrackBookingModal } from './components/TrackBookingModal';
import { SearchModal } from './components/SearchModal';
import { DestinationModal } from './components/DestinationModal';
import { AdminPortal } from './components/AdminPortal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { BlogModal } from './components/BlogModal';
import { JoinCounselorModal } from './components/JoinCounselorModal';
import { PublicCounselor, Booking, Payment } from './lib/api';
import { Bell, BookOpen, X, ArrowRight } from 'lucide-react';

export default function App() {
  const [welcomeOpen, setWelcomeOpen] = useState(true);

  // Modals state
  const [eligibilityOpen, setEligibilityOpen] = useState(false);
  const [eligibilityCategory, setEligibilityCategory] = useState<'study' | 'visit' | 'business'>('study');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [trackBookingOpen, setTrackBookingOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [joinCounselorOpen, setJoinCounselorOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);

  // Real-time visitor notification when new blog is published
  const [liveBlogAlert, setLiveBlogAlert] = useState<{ id: string; title: string; category: string } | null>(null);

  // Pre-selection for booking
  const [bookingCounselor, setBookingCounselor] = useState<PublicCounselor | undefined>(undefined);
  const [bookingService, setBookingService] = useState<string>('Study Visa');

  // Key to force refresh public counselor roster after admin edits
  const [rosterRefreshKey, setRosterRefreshKey] = useState(0);

  // Success toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check if there was a recently published blog notification
    try {
      const stored = localStorage.getItem('visa_syndicate_latest_blog_notification');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.read) {
          setLiveBlogAlert(parsed);
        }
      }
    } catch {}

    // Listen for live event when admin publishes an article
    const handleNewBlog = (e: any) => {
      const post = e.detail;
      if (post) {
        setLiveBlogAlert({
          id: post.id,
          title: post.title,
          category: post.category,
        });
      }
    };

    window.addEventListener('visa_syndicate_new_blog_published', handleNewBlog);
    return () => window.removeEventListener('visa_syndicate_new_blog_published', handleNewBlog);
  }, []);

  const handleOpenEligibility = (cat?: 'study' | 'visit' | 'business') => {
    if (cat) {
      setEligibilityCategory(cat);
    }
    setEligibilityOpen(true);
  };

  const handleEnterFromWelcome = (cat?: 'study' | 'visit' | 'business') => {
    setWelcomeOpen(false);
    if (cat) {
      setTimeout(() => {
        handleOpenEligibility(cat);
      }, 300);
    }
  };

  // Handle URL hash or direct /admin lookup
  useEffect(() => {
    if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
      setWelcomeOpen(false);
      setAdminOpen(true);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleNavigate = (sectionId: string) => {
    if (sectionId.startsWith('dest-')) {
      const dest = sectionId.replace('dest-', '').toUpperCase();
      setSelectedDestination(dest === 'UK' ? 'UK' : dest.charAt(0) + dest.slice(1).toLowerCase());
      return;
    }

    if (sectionId === 'study-visa' || sectionId === 'visit-visa' || sectionId === 'business-visa') {
      const target = document.getElementById('services');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBookWithCounselor = (counselor?: PublicCounselor) => {
    setBookingCounselor(counselor);
    if (counselor?.visaCategories?.length) {
      setBookingService(counselor.visaCategories[0]);
    }
    setBookingOpen(true);
  };

  const handleOpenBookingForService = (service: string) => {
    setBookingCounselor(undefined);
    setBookingService(service);
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F6] text-[#202124]">
      {/* Welcome Screen Hook before Site Opens */}
      {welcomeOpen && <WelcomeScreen onEnter={handleEnterFromWelcome} />}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#760B16] text-white px-5 py-3 rounded-2xl shadow-xl border border-[#C8101E] text-xs font-semibold animate-in slide-in-from-bottom-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E31B2F]"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Apple-Style Glass Blog Notification Banner (Live Alert for visitors) */}
      {liveBlogAlert && (
        <div className="fixed top-18 right-4 sm:right-8 z-50 max-w-sm w-full bg-[#1A0306]/95 backdrop-blur-2xl text-white p-4 rounded-3xl shadow-[0_15px_40px_rgba(200,16,30,0.35)] border border-red-500/30 animate-in slide-in-from-top-4 flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-red-600 to-red-900 flex items-center justify-center shrink-0 shadow-md">
            <Bell className="w-4 h-4 text-white animate-bounce" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-red-300 uppercase tracking-wider">
                New Immigration Publication
              </span>
              <button
                onClick={() => setLiveBlogAlert(null)}
                className="text-stone-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <h4 className="text-xs font-bold text-white line-clamp-1 leading-snug">
              {liveBlogAlert.title}
            </h4>
            <div className="pt-1 flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedBlogId(liveBlogAlert.id);
                  setBlogOpen(true);
                  setLiveBlogAlert(null);
                }}
                className="text-[11px] font-bold text-red-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        onOpenEligibility={() => handleOpenEligibility('study')}
        onOpenBooking={() => {
          setBookingCounselor(undefined);
          setBookingOpen(true);
        }}
        onOpenTrackBooking={() => setTrackBookingOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onNavigate={handleNavigate}
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenWelcome={() => setWelcomeOpen(true)}
        onOpenJoinCounselor={() => setJoinCounselorOpen(true)}
        onOpenBlog={(id) => {
          setSelectedBlogId(id || null);
          setBlogOpen(true);
        }}
        unreadBlogCount={liveBlogAlert ? 1 : 0}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section matching the exact design reference with Cloud Frame */}
        <HeroSection
          onCheckEligibility={() => handleOpenEligibility('study')}
          onExploreServices={() => handleNavigate('services')}
          onSelectDestination={(dest) => setSelectedDestination(dest)}
          onSelectServiceType={(svc) => {
            if (svc === 'Visit Visa') handleOpenEligibility('visit');
            else if (svc === 'Business Visa') handleOpenEligibility('business');
            else handleOpenEligibility('study');
          }}
        />

        {/* Strategic Services Section with Raining Cloud & Student Illustration */}
        <ServicesSection
          onSelectService={(svc) => handleOpenBookingForService(svc)}
          onOpenBooking={(svc) => handleOpenBookingForService(svc)}
        />

        {/* Database-backed Counselors Section */}
        <CounselorsSection
          key={rosterRefreshKey}
          onBookWithCounselor={handleBookWithCounselor}
          onOpenEligibility={() => handleOpenEligibility('study')}
          onOpenJoinUs={() => setJoinCounselorOpen(true)}
        />

        {/* Visa Guides Archive, FAQs & Contact Desk */}
        <LearnAndContactSection
          onOpenBooking={() => {
            setBookingCounselor(undefined);
            setBookingOpen(true);
          }}
        />
      </main>

      {/* Site Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenJoinCounselor={() => setJoinCounselorOpen(true)}
      />

      {/* Modals & Dialogs */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        preselectedCounselor={bookingCounselor}
        preselectedService={bookingService}
        onBookingComplete={(booking: Booking) => {
          showToast(`Booking registered! Ref: ${booking.referenceCode}`);
        }}
      />

      <EligibilityModal
        isOpen={eligibilityOpen}
        initialCategory={eligibilityCategory}
        onClose={() => setEligibilityOpen(false)}
        onOpenBooking={() => {
          setEligibilityOpen(false);
          setBookingOpen(true);
        }}
      />

      <TrackBookingModal
        isOpen={trackBookingOpen}
        onClose={() => setTrackBookingOpen(false)}
      />

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleNavigate}
        onSelectService={(svc) => handleOpenBookingForService(svc)}
      />

      <DestinationModal
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
        onBookConsultation={(dest) => {
          setSelectedDestination(null);
          setBookingService('Study Visa');
          setBookingOpen(true);
        }}
        onCheckEligibility={() => {
          setSelectedDestination(null);
          setEligibilityOpen(true);
        }}
      />

      {/* Immigration Intelligence & Blog Reader Modal */}
      <BlogModal
        isOpen={blogOpen}
        onClose={() => setBlogOpen(false)}
        initialPostId={selectedBlogId}
        onOpenBooking={() => {
          setBlogOpen(false);
          setBookingOpen(true);
        }}
      />

      {/* Public Counselor Panel Enrollment Modal */}
      <JoinCounselorModal
        isOpen={joinCounselorOpen}
        onClose={() => setJoinCounselorOpen(false)}
        onApplicationSubmitted={(app) => {
          showToast(`Application registered! Reference: ${app.trackingId}`);
        }}
      />

      {/* Secure Administrator Portal */}
      {adminOpen && (
        <AdminPortal
          onClose={() => setAdminOpen(false)}
          onRefreshPublicData={() => {
            setRosterRefreshKey((prev) => prev + 1);
          }}
        />
      )}
    </div>
  );
}
