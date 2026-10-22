import React, { useState, useEffect } from 'react';
import {
  api,
  AdminCounselor,
  CounselorApplication,
  Booking,
  Payment,
  SiteContent,
  AdminMetrics,
  ContactEnquiry,
  AuditLog,
  BlogPost,
  SupabaseConfig,
  setToken,
  removeToken,
} from '../lib/api';
import { BrandLogo } from './BrandLogo';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Users,
  Calendar,
  CreditCard,
  MessageSquare,
  FileEdit,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Building,
  Download,
  BookOpen,
  Database,
  KeyRound,
  Copy,
  Check,
  Bell,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Upload,
  UserCheck,
  Globe,
  FileText,
  Printer,
  Edit3,
  Camera,
  AlertTriangle,
  UserPlus,
} from 'lucide-react';
import { EditDossierModal, PrintDossierModal } from './AdminDossierModals';

interface AdminPortalProps {
  onClose: () => void;
  onRefreshPublicData?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onClose,
  onRefreshPublicData,
}) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'counselors' | 'applications' | 'bookings' | 'payments' | 'blogs' | 'supabase' | 'security' | 'enquiries' | 'cms' | 'audit'
  >('overview');

  // Login Passcode State (No email or demo password visible!)
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Data State
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [counselors, setCounselors] = useState<AdminCounselor[]>([]);
  const [counselorApplications, setCounselorApplications] = useState<CounselorApplication[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>({
    projectUrl: '',
    anonKey: '',
    serviceRoleKey: '',
    isLiveSyncEnabled: false,
  });
  const [loadingData, setLoadingData] = useState(false);

  // Counselor Form State
  const [showAddCounselor, setShowAddCounselor] = useState(false);
  const [editingCounselor, setEditingCounselor] = useState<AdminCounselor | null>(null);
  const [viewingProof, setViewingProof] = useState<Payment | null>(null);
  const [deletingCounselorId, setDeletingCounselorId] = useState<string | null>(null);

  const [counselorForm, setCounselorForm] = useState({
    fullName: '',
    displayName: '',
    title: '',
    email: '',
    phone: '',
    bio: '',
    photoUrl: '',
    expertise: 'Study Visa, University Selection, Bank Holding Audit',
    destinations: 'UK, Canada, USA',
    visaCategories: 'Study Visa, Visit Visa',
    languages: 'English, Urdu',
    experienceYears: 4,
    consultationDuration: 45,
    consultationFee: 12000,
    isActive: true,
    isPublic: true, // Default to true so newly created counselor is published immediately!
    isFeatured: false,
  });

  // Blog Form State
  const [showAddBlog, setShowAddBlog] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    category: 'Study Visa',
    excerpt: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    author: 'Ghulam Mujtaba',
    readTime: '4 min read',
    tags: 'UKVI, Study Visa, CAS',
    isPublished: true,
  });

  // Change Password Form State
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  // Supabase Status State
  const [supabaseTestStatus, setSupabaseTestStatus] = useState<{ testing: boolean; result: string | null; isError: boolean }>({
    testing: false,
    result: null,
    isError: false,
  });
  const [sqlCopied, setSqlCopied] = useState(false);

  // Require master passcode entry every time console is opened
  useEffect(() => {
    setCurrentUser(null);
  }, []);

  const loadAdminData = async () => {
    setLoadingData(true);
    try {
      const [m, c, b, p, e, a, s, bl, sc, apps] = await Promise.all([
        api.getAdminMetrics(),
        api.getAdminCounselors(),
        api.getAdminBookings(),
        api.getAdminPayments(),
        api.getAdminEnquiries(),
        api.getAuditLogs(),
        api.getSiteContent(),
        api.getAdminBlogs(),
        api.getSupabaseConfig(),
        api.getAdminCounselorApplications(),
      ]);
      setMetrics(m);
      setCounselors(c);
      setBookings(b);
      setPayments(p);
      setEnquiries(e);
      setAuditLogs(a);
      setSiteContent(s);
      setBlogs(bl);
      setSupabaseConfig(sc);
      setCounselorApplications(apps || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  // Handle Login with Master Passcode (default 14112001)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await api.login({
        email: 'mujtabaqureshi3829@gmail.com',
        password: passcode.trim(),
      });
      setToken(res.token);
      setCurrentUser(res.user);
      loadAdminData();
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please enter the correct master passcode.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    setCurrentUser(null);
    setPasscode('');
  };

  // Photo Upload Handler for Counselors
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (isEditing && editingCounselor) {
        setEditingCounselor({ ...editingCounselor, photoUrl: dataUrl });
      } else {
        setCounselorForm((prev) => ({ ...prev, photoUrl: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Counselor Creation
  const handleCreateCounselor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createCounselor({
        fullName: counselorForm.fullName,
        displayName: counselorForm.displayName || counselorForm.fullName,
        title: counselorForm.title,
        email: counselorForm.email,
        phone: counselorForm.phone,
        bio: counselorForm.bio,
        photoUrl: counselorForm.photoUrl,
        expertise: counselorForm.expertise.split(',').map((s) => s.trim()),
        destinations: counselorForm.destinations.split(',').map((s) => s.trim()),
        visaCategories: counselorForm.visaCategories.split(',').map((s) => s.trim()),
        languages: counselorForm.languages.split(',').map((s) => s.trim()),
        experienceYears: Number(counselorForm.experienceYears),
        consultationDuration: Number(counselorForm.consultationDuration),
        consultationFee: Number(counselorForm.consultationFee),
        isActive: counselorForm.isActive,
        isPublic: counselorForm.isPublic,
        isFeatured: counselorForm.isFeatured,
      });

      setShowAddCounselor(false);
      setCounselorForm({
        fullName: '',
        displayName: '',
        title: '',
        email: '',
        phone: '',
        bio: '',
        photoUrl: '',
        expertise: 'Study Visa, University Selection, Bank Holding Audit',
        destinations: 'UK, Canada, USA',
        visaCategories: 'Study Visa, Visit Visa',
        languages: 'English, Urdu',
        experienceYears: 4,
        consultationDuration: 45,
        consultationFee: 12000,
        isActive: true,
        isPublic: true,
        isFeatured: false,
      });
      loadAdminData();
      if (onRefreshPublicData) onRefreshPublicData();
    } catch (err: any) {
      alert(err.message || 'Failed to create counselor');
    }
  };

  // Counselor Update
  const handleUpdateCounselorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCounselor) return;
    try {
      await api.updateCounselor(editingCounselor.id, editingCounselor);
      setEditingCounselor(null);
      loadAdminData();
      if (onRefreshPublicData) onRefreshPublicData();
    } catch (err: any) {
      alert(err.message || 'Failed to update counselor profile');
    }
  };

  // Toggle Visibility
  const handleToggleVisibility = async (id: string) => {
    try {
      await api.toggleCounselorVisibility(id);
      loadAdminData();
      if (onRefreshPublicData) onRefreshPublicData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Toggle Active
  const handleToggleActive = async (id: string) => {
    try {
      await api.toggleCounselorActive(id);
      loadAdminData();
      if (onRefreshPublicData) onRefreshPublicData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // COMPLETELY FIXED COUNSELOR DELETION:
  // Instant optimistic UI update without window.confirm blocking in iframe
  const handleConfirmDeleteCounselor = async (id: string) => {
    setCounselors((prev) => prev.filter((c) => c.id !== id));
    setDeletingCounselorId(null);
    try {
      await api.deleteCounselor(id);
      loadAdminData();
      if (onRefreshPublicData) onRefreshPublicData();
    } catch (err: any) {
      console.error('Counselor deletion sync error:', err);
    }
  };

  // Payment Verification Actions
  const handleVerifyPayment = async (id: string, action: 'verify' | 'reject') => {
    try {
      await api.verifyPayment(id, action, action === 'verify' ? 'Verified by Master Admin' : 'Rejected');
      loadAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Booking Status Actions
  const handleUpdateBookingStatus = async (id: string, newStatus: string) => {
    try {
      await api.updateBookingStatus(id, newStatus);
      loadAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Counselor Applications & Anti-Fraud Vetting
  const handleUpdateApplicationStatus = async (
    id: string,
    status: 'pending_review' | 'verified_approved' | 'rejected' | 'suspended',
    adminNotes?: string
  ) => {
    try {
      await api.updateCounselorApplicationStatus(id, status, adminNotes);
      loadAdminData();
      if (onRefreshPublicData) onRefreshPublicData();
    } catch (err: any) {
      alert(err.message || 'Failed to update application');
    }
  };

  const handleDeleteApplication = async (id: string) => {
    setCounselorApplications((prev) => prev.filter((a) => a.id !== id));
    try {
      await api.deleteCounselorApplication(id);
      loadAdminData();
    } catch (err: any) {
      console.error(err);
    }
  };

  // Statutory Tracking & Legal Case Dossier State
  const [editingDossier, setEditingDossier] = useState<CounselorApplication | null>(null);
  const [showCreateDossierModal, setShowCreateDossierModal] = useState(false);
  const [dossierPrintView, setDossierPrintView] = useState<CounselorApplication | null>(null);
  const [savingDossier, setSavingDossier] = useState(false);

  const handleSaveDossier = async (dossierUpdates: Partial<CounselorApplication>) => {
    if (!editingDossier) return;
    setSavingDossier(true);
    try {
      await api.updateCounselorApplicationDossier(editingDossier.id, dossierUpdates);
      setEditingDossier(null);
      loadAdminData();
      if (onRefreshPublicData) onRefreshPublicData();
    } catch (err: any) {
      alert(err.message || 'Failed to update counselor tracking dossier');
    } finally {
      setSavingDossier(false);
    }
  };

  const handleCreateManualDossier = async (newDossier: any) => {
    setSavingDossier(true);
    try {
      const token = localStorage.getItem('visa_syndicate_token');
      const res = await fetch('/api/admin/counselor-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDossier),
      });
      if (res.ok) {
        setShowCreateDossierModal(false);
        loadAdminData();
        if (onRefreshPublicData) onRefreshPublicData();
      } else {
        const data = await res.json().catch(() => null);
        alert(data?.error || 'Failed to create dossier');
      }
    } catch (err: any) {
      alert(err.message || 'Error creating counselor dossier');
    } finally {
      setSavingDossier(false);
    }
  };

  // Hero Image & CMS Branding state
  const [heroFormStatus, setHeroFormStatus] = useState<{ message: string; type: 'success' | 'error' | '' }>({ message: '', type: '' });
  const handleSaveHeroBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteContent) return;
    try {
      await api.updateSiteContent({
        heroImageUrl: siteContent.heroImageUrl,
        heroImageCrop: siteContent.heroImageCrop,
        heroShowWatermark: siteContent.heroShowWatermark,
        heroWatermarkText: siteContent.heroWatermarkText,
        worldwideTagline: siteContent.worldwideTagline,
        heroHeadline1: siteContent.heroHeadline1,
        heroHeadline2: siteContent.heroHeadline2,
        heroSubtitle: siteContent.heroSubtitle,
      });
      setHeroFormStatus({ message: 'Homepage Hero & Branding saved successfully!', type: 'success' });
      loadAdminData();
      if (onRefreshPublicData) onRefreshPublicData();
      setTimeout(() => setHeroFormStatus({ message: '', type: '' }), 4000);
    } catch (err: any) {
      setHeroFormStatus({ message: err.message || 'Failed to save', type: 'error' });
    }
  };

  // Blog Management Actions
  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createBlog({
        title: blogForm.title,
        category: blogForm.category,
        excerpt: blogForm.excerpt,
        content: blogForm.content,
        coverImage: blogForm.coverImage,
        author: blogForm.author,
        readTime: blogForm.readTime,
        tags: blogForm.tags.split(',').map((t) => t.trim()),
        isPublished: blogForm.isPublished,
      });
      setShowAddBlog(false);
      setBlogForm({
        title: '',
        category: 'Study Visa',
        excerpt: '',
        content: '',
        coverImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
        author: 'Ghulam Mujtaba',
        readTime: '4 min read',
        tags: 'UKVI, Study Visa, CAS',
        isPublished: true,
      });
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to create article');
    }
  };

  const handleUpdateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;
    try {
      await api.updateBlog(editingBlog.id, editingBlog);
      setEditingBlog(null);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update article');
    }
  };

  const handleDeleteBlog = async (id: string) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    try {
      await api.deleteBlog(id);
      loadAdminData();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleToggleBlogPublished = async (blog: BlogPost) => {
    try {
      await api.updateBlog(blog.id, { isPublished: !blog.isPublished });
      loadAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Change Password Action
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeStatus({ type: 'idle', message: '' });

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeStatus({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    if (newPasswordInput.length < 6) {
      setPasswordChangeStatus({ type: 'error', message: 'New password must be at least 6 characters long.' });
      return;
    }

    try {
      const res = await api.changePassword(currentPasswordInput, newPasswordInput);
      setPasswordChangeStatus({ type: 'success', message: res.message || 'Master password changed successfully!' });
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
    } catch (err: any) {
      setPasswordChangeStatus({ type: 'error', message: err.message || 'Failed to change password.' });
    }
  };

  // Supabase Configuration Action
  const handleSaveSupabaseConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.saveSupabaseConfig(supabaseConfig);
      alert('Supabase configuration saved successfully!');
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to save Supabase config');
    }
  };

  const handleTestSupabase = async () => {
    if (!supabaseConfig.projectUrl || !supabaseConfig.anonKey) {
      setSupabaseTestStatus({
        testing: false,
        result: 'Please enter both Supabase Project URL and Anon Public Key first.',
        isError: true,
      });
      return;
    }

    setSupabaseTestStatus({ testing: true, result: null, isError: false });
    try {
      const res = await api.testSupabaseConnection(supabaseConfig.projectUrl, supabaseConfig.anonKey);
      setSupabaseTestStatus({
        testing: false,
        result: res.message,
        isError: !res.success,
      });
    } catch (err: any) {
      setSupabaseTestStatus({
        testing: false,
        result: err.message || 'Connection test failed',
        isError: true,
      });
    }
  };

  const handleCopySqlSchema = () => {
    const sql = `-- THE VISA SYNDICATE: SUPABASE POSTGRESQL SCHEMA
-- Paste this script into your Supabase SQL Editor (supabase.com/dashboard/project/sql)

-- 1. Counselors Table
CREATE TABLE IF NOT EXISTS public.counselors (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    display_name TEXT,
    title TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    bio TEXT,
    photo_url TEXT,
    expertise TEXT[] DEFAULT '{}',
    destinations TEXT[] DEFAULT '{}',
    visa_categories TEXT[] DEFAULT '{}',
    languages TEXT[] DEFAULT '{}',
    experience_years INTEGER DEFAULT 4,
    consultation_duration INTEGER DEFAULT 45,
    consultation_fee INTEGER DEFAULT 12000,
    currency TEXT DEFAULT 'PKR',
    availability_days TEXT[] DEFAULT '{}',
    time_slots TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    is_public BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    reference_code TEXT UNIQUE NOT NULL,
    counselor_id TEXT REFERENCES public.counselors(id) ON DELETE SET NULL,
    counselor_name TEXT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    country_of_residence TEXT,
    destination TEXT NOT NULL,
    visa_category TEXT NOT NULL,
    consultation_type TEXT,
    preferred_date TEXT NOT NULL,
    preferred_time_slot TEXT NOT NULL,
    reason TEXT,
    language TEXT,
    status TEXT DEFAULT 'pending_payment',
    fee INTEGER DEFAULT 12000,
    currency TEXT DEFAULT 'PKR',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY,
    booking_id TEXT REFERENCES public.bookings(id) ON DELETE CASCADE,
    booking_reference TEXT NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'PKR',
    method TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    transaction_reference TEXT,
    sender_account TEXT,
    proof_note TEXT,
    verified_by TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Blog Posts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    author TEXT DEFAULT 'Ghulam Mujtaba',
    read_time TEXT DEFAULT '4 min read',
    tags TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Contact Enquiries Table
CREATE TABLE IF NOT EXISTS public.enquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    visa_category TEXT,
    destination TEXT,
    message TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.counselors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Public read access policies for website visitors
CREATE POLICY "Public can view active published counselors" ON public.counselors FOR SELECT USING (is_active = true AND is_public = true);
CREATE POLICY "Public can view published blogs" ON public.blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Public can insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view booking by reference" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Public can insert payments" ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);
`;
    navigator.clipboard.writeText(sql);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 3000);
  };

  // ==========================================
  // RENDER: RED GLASS LOGIN (APPLE27 STYLE)
  // No Gmail or password hints displayed anywhere!
  // ==========================================
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0A0102]/95 backdrop-blur-3xl flex items-center justify-center p-4 selection:bg-red-600 selection:text-white">
        {/* Ambient Crimson Light Blobs */}
        <div className="fixed top-1/4 left-1/3 w-96 h-96 bg-red-600/20 rounded-full blur-[130px] pointer-events-none" />
        <div className="fixed bottom-1/4 right-1/3 w-96 h-96 bg-[#760B16]/25 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-md bg-gradient-to-b from-[#1C0507]/90 via-[#140305]/95 to-[#0D0103]/98 rounded-3xl p-8 border border-red-500/25 shadow-[0_25px_60px_-15px_rgba(200,16,30,0.4)] backdrop-blur-2xl space-y-6 relative overflow-hidden">
          {/* Subtle Top Glass Reflection */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-red-400/40 to-transparent pointer-events-none" />

          <div className="text-center space-y-2.5">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-950 to-red-800/80 p-0.5 shadow-[0_0_25px_rgba(200,16,30,0.35)] flex items-center justify-center border border-red-500/30">
                <Lock className="w-6 h-6 text-red-200" />
              </div>
            </div>
            <div className="pt-1">
              <span className="inline-block px-3 py-1 rounded-full bg-red-500/15 border border-red-500/20 text-red-300 text-[10px] font-bold uppercase tracking-widest">
                Master Security Gateway
              </span>
            </div>
            <h3 className="text-xl font-bold font-serif-brand text-white tracking-wide">
              Administrator Console
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Authorized personnel authentication required.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/60 border border-red-500/30 text-red-200 rounded-2xl text-xs flex items-center gap-2">
              <XCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">Master Passcode</label>
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  required
                  autoFocus
                  placeholder="Enter passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full pl-4 pr-11 py-3 rounded-2xl bg-white/[0.04] border border-red-500/25 text-white placeholder-stone-500 text-sm focus:border-red-500 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setPasscode('');
                  onClose();
                }}
                className="w-1/3 py-3 text-xs font-semibold text-stone-400 hover:text-white rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] transition-all cursor-pointer"
              >
                Exit
              </button>
              <button
                type="submit"
                disabled={authLoading}
                className="w-2/3 py-3 bg-gradient-to-r from-[#C8101E] to-[#8C0C16] hover:from-[#E01424] hover:to-[#A30E1A] text-white text-xs font-bold rounded-2xl shadow-[0_0_25px_rgba(200,16,30,0.4)] flex items-center justify-center gap-2 cursor-pointer transition-all border border-red-400/30 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{authLoading ? 'Verifying...' : 'Authenticate Access'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: LOGGED IN MASTER CONSOLE (RED GLASS APPLE27 UI)
  // ==========================================
  return (
    <div className="fixed inset-0 z-50 bg-[#0B0102] text-stone-100 overflow-y-auto flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Ambient Crimson Light Blobs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-rose-950/20 rounded-full blur-[170px] pointer-events-none" />

      {/* Frosted Glass Top Navbar */}
      <header className="sticky top-0 z-30 bg-[#160406]/80 backdrop-blur-2xl border-b border-red-500/20 px-6 py-3.5 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <BrandLogo size="sm" />
            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-red-950/70 border border-red-500/30 text-red-200 text-[10px] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(200,16,30,0.3)]">
              Master Admin · Ghulam Mujtaba
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* PRIVATE NETLIFY ZIP DOWNLOAD BUTTON (Restricted to logged-in master admin only) */}
          <a
            href="/the-visa-syndicate-netlify-deploy.zip"
            download="the-visa-syndicate-netlify-deploy.zip"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-red-900/60 to-red-800/60 hover:from-red-800 hover:to-red-700 text-white border border-red-400/40 rounded-xl text-xs font-semibold shadow-[0_0_20px_rgba(200,16,30,0.35)] transition-all cursor-pointer"
            title="Private production Netlify deployment package (exclusive to master admin)"
          >
            <Download className="w-3.5 h-3.5 text-red-200" />
            <span>Netlify ZIP (Private)</span>
          </a>

          <button
            onClick={loadAdminData}
            className="p-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            title="Refresh database"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin text-red-400' : ''}`} />
          </button>

          <button
            onClick={handleLogout}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/60 rounded-xl transition-colors cursor-pointer"
            title="Lock Console"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              removeToken();
              setCurrentUser(null);
              setPasscode('');
              onClose();
            }}
            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/10 transition-all cursor-pointer"
          >
            Exit Console
          </button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col space-y-6 relative z-10">
        {/* Navigation Tabs (Apple Frosted Glass Pill Bar) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-black/40 backdrop-blur-2xl rounded-2xl border border-red-500/20 shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
          {[
            { id: 'overview', label: 'Overview', icon: Building },
            { id: 'counselors', label: 'Counselors', icon: Users },
            {
              id: 'applications',
              label: `Join Dossiers ${
                counselorApplications.filter((a) => a.status === 'pending_review').length > 0
                  ? `(${counselorApplications.filter((a) => a.status === 'pending_review').length})`
                  : ''
              }`,
              icon: UserCheck,
            },
            { id: 'bookings', label: 'Consultations', icon: Calendar },
            { id: 'payments', label: 'Payments', icon: CreditCard },
            { id: 'blogs', label: 'Blogs & Articles', icon: BookOpen },
            { id: 'supabase', label: 'Supabase Database', icon: Database },
            { id: 'security', label: 'Change Password', icon: KeyRound },
            { id: 'enquiries', label: 'Inquiries', icon: MessageSquare },
            { id: 'cms', label: 'CMS & Branding', icon: FileEdit },
            { id: 'audit', label: 'Audit Logs', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#C8101E] to-[#8C0C16] text-white shadow-[0_0_20px_rgba(200,16,30,0.45)] border border-red-400/30'
                    : 'text-stone-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && metrics && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-red-950/20 backdrop-blur-2xl p-5 rounded-3xl border border-red-500/20 shadow-[0_8px_32px_0_rgba(180,10,25,0.2)] space-y-1">
                <span className="text-[11px] font-bold text-stone-400 uppercase">Verified Revenue</span>
                <div className="text-2xl font-bold font-mono text-red-400">
                  PKR {metrics.totalVerifiedRevenue.toLocaleString()}
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold block">From Verified Bank/TID Receipts</span>
              </div>

              <div className="bg-red-950/20 backdrop-blur-2xl p-5 rounded-3xl border border-red-500/20 shadow-[0_8px_32px_0_rgba(180,10,25,0.2)] space-y-1">
                <span className="text-[11px] font-bold text-stone-400 uppercase">Active Counselors</span>
                <div className="text-2xl font-bold font-mono text-white">
                  {metrics.totalCounselors}
                </div>
                <span className="text-[10px] text-stone-400 block">
                  {metrics.publishedCounselors} Published · {metrics.draftCounselors} Drafts
                </span>
              </div>

              <div className="bg-red-950/20 backdrop-blur-2xl p-5 rounded-3xl border border-red-500/20 shadow-[0_8px_32px_0_rgba(180,10,25,0.2)] space-y-1">
                <span className="text-[11px] font-bold text-stone-400 uppercase">Consultations</span>
                <div className="text-2xl font-bold font-mono text-white">
                  {metrics.newBookings}
                </div>
                <span className="text-[10px] text-amber-400 block">
                  {metrics.pendingPaymentReviews} Pending Verification
                </span>
              </div>

              <div className="bg-red-950/20 backdrop-blur-2xl p-5 rounded-3xl border border-red-500/20 shadow-[0_8px_32px_0_rgba(180,10,25,0.2)] space-y-1">
                <span className="text-[11px] font-bold text-stone-400 uppercase">Published Articles</span>
                <div className="text-2xl font-bold font-mono text-white">
                  {blogs.length}
                </div>
                <span className="text-[10px] text-stone-400 block">
                  {blogs.filter((b) => b.isPublished).length} Active Live on Site
                </span>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-950/20 backdrop-blur-2xl p-6 rounded-3xl border border-red-500/20 space-y-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-red-400" />
                  <span>Counselor Profiles</span>
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Add immigration advisors, set consultation fees, upload pictures, and toggle public visibility.
                </p>
                <button
                  onClick={() => {
                    setActiveTab('counselors');
                    setShowAddCounselor(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-[#C8101E] to-[#8C0C16] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(200,16,30,0.3)]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Counselor Profile</span>
                </button>
              </div>

              <div className="bg-red-950/20 backdrop-blur-2xl p-6 rounded-3xl border border-red-500/20 space-y-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-red-400" />
                  <span>Publish Article</span>
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Publish visa policies and guidelines. Publishing automatically triggers instant notifications for visitors!
                </p>
                <button
                  onClick={() => {
                    setActiveTab('blogs');
                    setShowAddBlog(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-[#C8101E] to-[#8C0C16] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(200,16,30,0.3)]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publish New Article</span>
                </button>
              </div>

              <div className="bg-red-950/20 backdrop-blur-2xl p-6 rounded-3xl border border-red-500/20 space-y-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-red-400" />
                  <span>Supabase Integration</span>
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Connect your Supabase project URL and anon keys, test connection, or copy the SQL schema.
                </p>
                <button
                  onClick={() => setActiveTab('supabase')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer border border-white/15"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Manage Supabase</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COUNSELOR ROSTER (With Fixed Delete & Instant Update) */}
        {activeTab === 'counselors' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-serif-brand text-white">Counselor Roster</h3>
                <p className="text-xs text-stone-400">
                  Manage immigration advisors, consultation durations, fees, photos, and public visibility.
                </p>
              </div>
              <button
                onClick={() => setShowAddCounselor(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#C8101E] to-[#8C0C16] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(200,16,30,0.3)]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Counselor</span>
              </button>
            </div>

            {/* Modal to Add Counselor */}
            {showAddCounselor && (
              <div className="bg-red-950/30 backdrop-blur-2xl p-6 rounded-3xl border border-red-500/30 shadow-[0_8px_32px_0_rgba(180,10,25,0.3)] space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h4 className="text-sm font-bold text-white">Create Counselor Profile</h4>
                  <button onClick={() => setShowAddCounselor(false)} className="text-stone-400 hover:text-white">
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleCreateCounselor} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-300">Full Legal Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Barrister Hammad Qureshi"
                        value={counselorForm.fullName}
                        onChange={(e) => setCounselorForm({ ...counselorForm, fullName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-red-500/25 text-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-300">Public Display Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Hammad Qureshi"
                        value={counselorForm.displayName}
                        onChange={(e) => setCounselorForm({ ...counselorForm, displayName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-red-500/25 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-300">Professional Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Senior UK & Canada Specialist"
                        value={counselorForm.title}
                        onChange={(e) => setCounselorForm({ ...counselorForm, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-red-500/25 text-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-300">Consultation Fee (PKR)</label>
                      <input
                        type="number"
                        value={counselorForm.consultationFee}
                        onChange={(e) => setCounselorForm({ ...counselorForm, consultationFee: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-red-500/25 text-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-300">Duration (Minutes)</label>
                      <input
                        type="number"
                        value={counselorForm.consultationDuration}
                        onChange={(e) => setCounselorForm({ ...counselorForm, consultationDuration: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-red-500/25 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">Advisor Biography</label>
                    <textarea
                      rows={2}
                      placeholder="Brief professional background, expertise and qualifications..."
                      value={counselorForm.bio}
                      onChange={(e) => setCounselorForm({ ...counselorForm, bio: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-red-500/25 text-white text-xs"
                    />
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">Profile Photo</label>
                    <div className="flex items-center gap-4">
                      {counselorForm.photoUrl ? (
                        <img
                          src={counselorForm.photoUrl}
                          alt="Preview"
                          className="w-12 h-12 rounded-xl object-cover border border-red-500/40"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-dashed border-red-500/40 flex items-center justify-center text-stone-400">
                          <Users className="w-5 h-5" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e, false)}
                        className="text-xs text-stone-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red-950 file:text-red-200 hover:file:bg-red-900 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-300">
                      <input
                        type="checkbox"
                        checked={counselorForm.isPublic}
                        onChange={(e) => setCounselorForm({ ...counselorForm, isPublic: e.target.checked })}
                        className="rounded accent-red-600"
                      />
                      <span>Publish profile to website immediately</span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCounselor(false)}
                      className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-stone-300 hover:bg-white/5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-gradient-to-r from-[#C8101E] to-[#8C0C16] text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                    >
                      Create Profile
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Counselors Table */}
            <div className="bg-red-950/20 backdrop-blur-2xl rounded-3xl border border-red-500/20 overflow-hidden shadow-[0_8px_32px_0_rgba(180,10,25,0.2)]">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/30 border-b border-red-500/20 text-stone-400 font-semibold">
                  <tr>
                    <th className="p-4">Advisor</th>
                    <th className="p-4">Title & Expertise</th>
                    <th className="p-4">Fee / Slot</th>
                    <th className="p-4">Public Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {counselors.map((c) => (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {c.photoUrl ? (
                            <img src={c.photoUrl} alt={c.fullName} className="w-10 h-10 rounded-xl object-cover border border-red-500/30" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-red-950/50 flex items-center justify-center text-red-300 font-bold border border-red-500/20">
                              {c.fullName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-white block">{c.fullName}</span>
                            <span className="text-[11px] text-stone-400">{c.displayName}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-white font-medium block">{c.title}</span>
                        <span className="text-[11px] text-stone-400">
                          {c.destinations.join(', ')} · {c.experienceYears} yrs exp
                        </span>
                      </td>
                      <td className="p-4 font-mono">
                        <span className="font-bold text-red-400 block">PKR {c.consultationFee.toLocaleString()}</span>
                        <span className="text-[10px] text-stone-400">{c.consultationDuration} mins</span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleVisibility(c.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                            c.isPublic
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {c.isPublic ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{c.isPublic ? 'Published' : 'Draft / Private'}</span>
                        </button>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setEditingCounselor(c)}
                          className="px-2.5 py-1.5 text-xs font-bold bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <FileEdit className="w-3.5 h-3.5 text-red-400" />
                          <span>Edit</span>
                        </button>

                        {/* DELETE BUTTON WITH CONFIRMATION POPUP */}
                        {deletingCounselorId === c.id ? (
                          <div className="inline-flex items-center gap-1 bg-red-950/90 border border-red-500 p-1 rounded-xl">
                            <span className="text-[10px] text-red-200 px-1">Delete?</span>
                            <button
                              onClick={() => handleConfirmDeleteCounselor(c.id)}
                              className="px-2 py-0.5 bg-red-600 text-white rounded-lg text-[10px] font-bold"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeletingCounselorId(null)}
                              className="px-2 py-0.5 bg-stone-800 text-stone-300 rounded-lg text-[10px]"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeletingCounselorId(c.id)}
                            className="p-1.5 text-red-400 hover:bg-red-950/60 rounded-xl cursor-pointer transition-colors"
                            title="Delete counselor"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {counselors.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-stone-400">
                        Zero counselors registered. Click "Add Counselor" to create the first advisor.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* EDIT COUNSELOR MODAL */}
            {editingCounselor && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="bg-[#140305] rounded-3xl p-6 border border-red-500/30 shadow-2xl max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <h4 className="text-sm font-bold text-white">Edit Profile & Photo</h4>
                    <button onClick={() => setEditingCounselor(null)} className="text-stone-400 hover:text-white">
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleUpdateCounselorSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-300">Advisor Full Name</label>
                      <input
                        type="text"
                        required
                        value={editingCounselor.fullName}
                        onChange={(e) => setEditingCounselor({ ...editingCounselor, fullName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-red-500/25 text-white text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-300">Professional Title</label>
                      <input
                        type="text"
                        required
                        value={editingCounselor.title}
                        onChange={(e) => setEditingCounselor({ ...editingCounselor, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-red-500/25 text-white text-xs"
                      />
                    </div>

                    {/* Photo Upload in Edit */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-300">Advisor Picture</label>
                      <div className="flex items-center gap-4">
                        {editingCounselor.photoUrl ? (
                          <img
                            src={editingCounselor.photoUrl}
                            alt="Current"
                            className="w-14 h-14 rounded-xl object-cover border border-red-500/40"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-white/5 border border-dashed border-red-500/40 flex items-center justify-center text-stone-400">
                            <Users className="w-6 h-6" />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(e, true)}
                          className="text-xs text-stone-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red-950 file:text-red-200 hover:file:bg-red-900 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-300">Consultation Fee (PKR)</label>
                        <input
                          type="number"
                          value={editingCounselor.consultationFee}
                          onChange={(e) => setEditingCounselor({ ...editingCounselor, consultationFee: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-red-500/25 text-white text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-300">Duration (Mins)</label>
                        <input
                          type="number"
                          value={editingCounselor.consultationDuration}
                          onChange={(e) => setEditingCounselor({ ...editingCounselor, consultationDuration: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-red-500/25 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-300">Biography</label>
                      <textarea
                        rows={3}
                        value={editingCounselor.bio}
                        onChange={(e) => setEditingCounselor({ ...editingCounselor, bio: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-red-500/25 text-white text-xs"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingCounselor(null)}
                        className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-stone-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-gradient-to-r from-[#C8101E] to-[#8C0C16] text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                      >
                        Save Profile
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: COUNSELOR APPLICATIONS & ANTI-FRAUD DOSSIERS */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold font-serif-brand text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-red-400" />
                  <span>Counselor Vetting & Anti-Fraud Dossiers</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Full statutory tracking dossiers with CNIC/Passport, bar licenses, physical addresses, emergency contacts, and banking IBANs.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-red-950/80 border border-red-500/30 rounded-full text-xs font-bold text-red-300">
                  {counselorApplications.length} Registered Dossiers
                </span>
              </div>
            </div>

            {/* Dossier Grid */}
            <div className="grid grid-cols-1 gap-4">
              {counselorApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-red-950/20 backdrop-blur-2xl rounded-3xl p-5 border border-red-500/20 shadow-[0_8px_32px_0_rgba(180,10,25,0.2)] space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center font-bold text-white text-sm shadow">
                        {app.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{app.fullName}</h4>
                          <span className="text-[10px] text-stone-400">({app.displayName})</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-400">
                          <span className="font-mono text-amber-300 font-bold">{app.trackingId}</span>
                          <span>·</span>
                          <span>{app.email}</span>
                          <span>·</span>
                          <span>{app.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                          app.legalCaseStatus === 'police_dossier_filed' || app.legalCaseStatus === 'blacklisted'
                            ? 'bg-red-950 border-red-500 text-red-300'
                            : app.legalCaseStatus === 'notice_dispatched' || app.legalCaseStatus === 'under_review'
                            ? 'bg-amber-950 border-amber-500 text-amber-300'
                            : 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300'
                        }`}
                      >
                        LEGAL: {(app.legalCaseStatus || 'In Good Standing').toUpperCase().replace('_', ' ')}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          app.status === 'verified_approved'
                            ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
                            : app.status === 'suspended'
                            ? 'bg-red-950 border border-red-500 text-red-300'
                            : 'bg-amber-950 border border-amber-500/50 text-amber-300'
                        }`}
                      >
                        {app.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* 4-Box Deep Statutory Traceability Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    {/* Statutory ID */}
                    <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/5 space-y-1">
                      <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                        Government Identity & License
                      </span>
                      <div className="font-mono font-bold text-white text-[11px]">
                        {app.nationalIdType}: {app.nationalIdNumber}
                      </div>
                      <div className="text-[10.5px] text-stone-300">
                        License: {app.licenseNumber}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        Authority: {app.issuingAuthority}
                      </div>
                    </div>

                    {/* Physical Address & Traceability */}
                    <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/5 space-y-1">
                      <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                        Physical Location & Trace
                      </span>
                      <div className="text-white text-[11px] leading-tight">
                        {app.physicalAddress}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {app.city}, {app.country} {app.postalCode}
                      </div>
                      <div className="text-[10px] text-amber-300 font-mono">
                        IP/GPS: {app.gpsLocationOrIp || 'Verified Domestic'}
                      </div>
                    </div>

                    {/* Banking & Financial Trace */}
                    <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/5 space-y-1">
                      <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                        Banking & Payout IBAN
                      </span>
                      <div className="text-white text-[11px] font-semibold">
                        {app.bankName} ({app.bankAccountTitle})
                      </div>
                      <div className="font-mono text-[10px] text-red-300 truncate" title={app.iban}>
                        IBAN: {app.iban}
                      </div>
                      {app.taxIdOrNtn && (
                        <div className="text-[10px] text-stone-400 font-mono">NTN: {app.taxIdOrNtn}</div>
                      )}
                    </div>

                    {/* Emergency Contact & Anti-Fraud */}
                    <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/5 space-y-1">
                      <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                        Emergency & Fraud Clearance
                      </span>
                      <div className="text-white text-[11px]">
                        Emergency: {app.emergencyContactName || 'N/A'} ({app.emergencyContactPhone || 'N/A'})
                      </div>
                      <div className="text-[10px] text-emerald-400 font-bold">
                        Fraud Risk Score: {app.fraudRiskScore}% (Clean)
                      </div>
                      <div className="text-[10px] text-stone-400">
                        Affidavit: {app.antiFraudAgreementAccepted ? 'Affirmed & Guaranteed' : 'Pending'}
                      </div>
                    </div>
                  </div>

                  {/* ID Card Photographic Records Strip (if attached) */}
                  {(app.idCardFrontUrl || app.idCardBackUrl) && (
                    <div className="p-3 bg-black/40 rounded-2xl border border-red-500/20 flex flex-wrap items-center gap-4 text-xs">
                      <span className="text-[10px] font-bold text-amber-300 uppercase flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5" />
                        <span>ID Photos on Record:</span>
                      </span>
                      {app.idCardFrontUrl && (
                        <a
                          href={app.idCardFrontUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 text-[11px] border border-white/10"
                        >
                          <img src={app.idCardFrontUrl} alt="CNIC Front" className="w-6 h-4 object-cover rounded" />
                          <span>CNIC Front Photo</span>
                          <ExternalLink className="w-3 h-3 text-stone-400" />
                        </a>
                      )}
                      {app.idCardBackUrl && (
                        <a
                          href={app.idCardBackUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 text-[11px] border border-white/10"
                        >
                          <img src={app.idCardBackUrl} alt="CNIC Back" className="w-6 h-4 object-cover rounded" />
                          <span>CNIC Back Photo</span>
                          <ExternalLink className="w-3 h-3 text-stone-400" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Legal Case / Investigation Notes (if recorded) */}
                  {app.legalNotes && (
                    <div className="p-3 bg-red-950/40 rounded-2xl border border-red-500/30 text-xs space-y-1">
                      <span className="text-[10px] font-bold text-red-300 uppercase flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Statutory Investigation & Legal Case Notes:</span>
                      </span>
                      <p className="text-stone-300 font-mono text-[11px] whitespace-pre-wrap">{app.legalNotes}</p>
                    </div>
                  )}

                  {/* Practice, Fee & Bio */}
                  <div className="p-3 bg-white/[0.02] rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-white">Coverage:</span>
                        <span className="text-stone-300">{app.destinations?.join(', ')}</span>
                        <span>·</span>
                        <span className="font-bold text-white">Experience:</span>
                        <span className="text-stone-300">{app.experienceYears} Years</span>
                      </div>
                      <p className="text-[11px] text-stone-400 line-clamp-2">{app.bio}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-stone-400 block">Requested Fee:</span>
                      <span className="text-base font-mono font-bold text-red-400">
                        {app.consultationFee} {app.preferredCurrency}
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
                    <span className="text-[10px] text-stone-500">
                      Submitted on {new Date(app.submittedAt).toLocaleString()}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingDossier(app)}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Edit Full Statutory Dossier & ID Photos"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                        <span>Manage Legal Dossier</span>
                      </button>

                      <button
                        onClick={() => setDossierPrintView(app)}
                        className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl border border-stone-600 flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Print or Export for Court / Police"
                      >
                        <Printer className="w-3.5 h-3.5 text-red-300" />
                        <span>Legal Extract</span>
                      </button>

                      {app.status !== 'verified_approved' && (
                        <button
                          onClick={() => handleUpdateApplicationStatus(app.id, 'verified_approved')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-colors"
                        >
                          Approve & Publish
                        </button>
                      )}
                      {app.status !== 'suspended' && (
                        <button
                          onClick={() => handleUpdateApplicationStatus(app.id, 'suspended', 'Flagged for further audit')}
                          className="px-3 py-1.5 bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/30 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                        >
                          Suspend
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteApplication(app.id)}
                        className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/30 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {counselorApplications.length === 0 && (
                <div className="p-12 text-center text-stone-400 bg-red-950/10 rounded-3xl border border-red-500/20">
                  <UserCheck className="w-8 h-8 mx-auto text-stone-500 mb-2" />
                  <p className="text-sm font-semibold text-white">No Counselor Applications Yet</p>
                  <p className="text-xs text-stone-400 mt-1">
                    When licensed advisors submit the "Join Us as Counselor" form on the public site, their complete statutory tracking dossier will appear here for review.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: CONSULTATIONS */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold font-serif-brand text-white">Client Consultation Schedule</h3>
            <div className="bg-red-950/20 backdrop-blur-2xl rounded-3xl border border-red-500/20 overflow-hidden shadow-[0_8px_32px_0_rgba(180,10,25,0.2)]">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/30 border-b border-red-500/20 text-stone-400 font-semibold">
                  <tr>
                    <th className="p-4">Reference</th>
                    <th className="p-4">Applicant</th>
                    <th className="p-4">Category / Dest</th>
                    <th className="p-4">Date & Slot</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-white/[0.02]">
                      <td className="p-4 font-mono font-bold text-red-400">{b.referenceCode}</td>
                      <td className="p-4">
                        <span className="font-bold text-white block">{b.customerName}</span>
                        <span className="text-[11px] text-stone-400">{b.customerEmail} · {b.customerPhone}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-white block">{b.visaCategory}</span>
                        <span className="text-[11px] text-stone-400">{b.destination}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-white block">{b.preferredDate}</span>
                        <span className="text-[11px] text-stone-400">{b.preferredTimeSlot}</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 text-stone-300">
                          {b.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={b.status}
                          onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                          className="bg-black/40 border border-red-500/30 text-white rounded-lg px-2 py-1 text-xs"
                        >
                          <option value="pending_payment">Pending Payment</option>
                          <option value="payment_under_review">Payment Review</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-stone-400">
                        Zero bookings recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PAYMENT VERIFICATION */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold font-serif-brand text-white">Payment Verification Queue</h3>
            <div className="bg-red-950/20 backdrop-blur-2xl rounded-3xl border border-red-500/20 overflow-hidden shadow-[0_8px_32px_0_rgba(180,10,25,0.2)]">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/30 border-b border-red-500/20 text-stone-400 font-semibold">
                  <tr>
                    <th className="p-4">Booking Ref</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Method / TID</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02]">
                      <td className="p-4 font-mono font-bold text-red-400">{p.bookingReference}</td>
                      <td className="p-4 font-mono font-bold text-white">PKR {p.amount.toLocaleString()}</td>
                      <td className="p-4">
                        <span className="text-white block uppercase">{p.method}</span>
                        <span className="text-[11px] text-stone-400 font-mono">TID: {p.transactionReference || 'N/A'}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          p.status === 'verified'
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                            : p.status === 'rejected'
                            ? 'bg-red-950/60 text-red-300 border border-red-500/30'
                            : 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                        }`}>
                          {p.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {p.status !== 'verified' && (
                          <button
                            onClick={() => handleVerifyPayment(p.id, 'verify')}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        {p.status !== 'rejected' && (
                          <button
                            onClick={() => handleVerifyPayment(p.id, 'reject')}
                            className="px-3 py-1 bg-red-600/70 hover:bg-red-600 text-white rounded-lg font-bold text-xs cursor-pointer"
                          >
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-stone-400">
                        Zero payments waiting for review.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: BLOGS & EDITORIAL MANAGEMENT */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-serif-brand text-white">Articles & Advisories</h3>
                <p className="text-xs text-stone-400">
                  Publish visa guides, updates, and policy alerts. Publishing automatically alerts website visitors.
                </p>
              </div>
              <button
                onClick={() => setShowAddBlog(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#C8101E] to-[#8C0C16] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(200,16,30,0.3)]"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Article</span>
              </button>
            </div>

            {/* CREATE BLOG MODAL */}
            {showAddBlog && (
              <div className="bg-red-950/30 backdrop-blur-2xl p-6 rounded-3xl border border-red-500/30 shadow-[0_8px_32px_0_rgba(180,10,25,0.3)] space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-red-400" />
                    <span>Create & Publish Article</span>
                  </h4>
                  <button onClick={() => setShowAddBlog(false)} className="text-stone-400 hover:text-white">
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleCreateBlog} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-stone-300">Article Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. UK Student Visa 2024-2025: New Maintenance Funds & CAS Rules"
                        value={blogForm.title}
                        onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-red-500/25 text-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-300">Category</label>
                      <select
                        value={blogForm.category}
                        onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#1A0305] border border-red-500/25 text-white text-xs"
                      >
                        <option value="Study Visa">Study Visa</option>
                        <option value="Visit Visa">Visit Visa</option>
                        <option value="Business Visa">Business Visa</option>
                        <option value="Immigration Policies">Immigration Policies</option>
                        <option value="Case Audits">Case Audits</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-300">Cover Image URL</label>
                      <input
                        type="url"
                        value={blogForm.coverImage}
                        onChange={(e) => setBlogForm({ ...blogForm, coverImage: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-red-500/25 text-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-300">Author Name</label>
                      <input
                        type="text"
                        value={blogForm.author}
                        onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-red-500/25 text-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-300">Estimated Read Time</label>
                      <input
                        type="text"
                        value={blogForm.readTime}
                        onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-red-500/25 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">Short Summary / Excerpt *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Brief overview explaining what applicants will learn in this post..."
                      value={blogForm.excerpt}
                      onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-red-500/25 text-white text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">Article Content * (Supports Multi-paragraph & Headings)</label>
                    <textarea
                      rows={8}
                      required
                      placeholder="Write comprehensive guidance, statutory sections, tips..."
                      value={blogForm.content}
                      onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-red-500/25 text-white text-xs font-sans leading-relaxed"
                    />
                  </div>

                  <div className="p-3 bg-red-950/50 rounded-2xl border border-red-500/30 flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-white">
                      <input
                        type="checkbox"
                        checked={blogForm.isPublished}
                        onChange={(e) => setBlogForm({ ...blogForm, isPublished: e.target.checked })}
                        className="rounded accent-red-600 w-4 h-4"
                      />
                      <span className="flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-red-400" />
                        <span>Publish immediately & notify website visitors</span>
                      </span>
                    </label>
                    <span className="text-[10px] text-stone-400">Triggers live broadcast banner</span>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddBlog(false)}
                      className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-stone-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-[#C8101E] to-[#8C0C16] text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                    >
                      Publish Article
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* BLOGS LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blogs.map((b) => (
                <div
                  key={b.id}
                  className="bg-red-950/20 backdrop-blur-2xl rounded-3xl border border-red-500/20 overflow-hidden shadow-[0_8px_32px_0_rgba(180,10,25,0.2)] flex flex-col justify-between"
                >
                  {b.coverImage && (
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-red-300 border border-red-500/30">
                        {b.category}
                      </div>
                    </div>
                  )}
                  <div className="p-5 space-y-2 flex-1">
                    <div className="flex items-center justify-between text-[11px] text-stone-400">
                      <span>{b.author}</span>
                      <span>{b.readTime}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                      {b.title}
                    </h4>
                    <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                      {b.excerpt}
                    </p>
                  </div>
                  <div className="p-4 bg-black/30 border-t border-white/5 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleBlogPublished(b)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer ${
                        b.isPublished
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                          : 'bg-stone-800 text-stone-400 border border-white/10'
                      }`}
                    >
                      {b.isPublished ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{b.isPublished ? 'Published' : 'Draft'}</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteBlog(b.id)}
                        className="p-1.5 text-red-400 hover:bg-red-950/60 rounded-xl cursor-pointer"
                        title="Delete article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {blogs.length === 0 && (
                <div className="col-span-full p-12 text-center text-stone-400">
                  Zero articles in database. Click "Create New Article" to post your first insight.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: SUPABASE INTEGRATION */}
        {activeTab === 'supabase' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-serif-brand text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-red-400" />
                  <span>Supabase Database Management</span>
                </h3>
                <p className="text-xs text-stone-400">
                  Configure your project URL and keys to synchronize The Visa Syndicate with Supabase cloud database.
                </p>
              </div>
              <button
                onClick={handleCopySqlSchema}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer border border-white/15"
              >
                {sqlCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{sqlCopied ? 'SQL Copied!' : 'Copy Supabase SQL Schema'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Supabase Credentials Form */}
              <div className="lg:col-span-7 bg-red-950/20 backdrop-blur-2xl p-6 rounded-3xl border border-red-500/20 shadow-[0_8px_32px_0_rgba(180,10,25,0.2)] space-y-5">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Connection Parameters</span>
                </h4>

                <form onSubmit={handleSaveSupabaseConfig} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-300">Supabase Project URL</label>
                    <input
                      type="url"
                      placeholder="https://xyzabcdefg.supabase.co"
                      value={supabaseConfig.projectUrl}
                      onChange={(e) => setSupabaseConfig({ ...supabaseConfig, projectUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-red-500/25 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
                    />
                    <p className="text-[11px] text-stone-400">Found in Project Settings &gt; API &gt; Project URL</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-300">Anon Public Key</label>
                    <input
                      type="password"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                      value={supabaseConfig.anonKey}
                      onChange={(e) => setSupabaseConfig({ ...supabaseConfig, anonKey: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-red-500/25 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
                    />
                    <p className="text-[11px] text-stone-400">Found in Project Settings &gt; API &gt; anon / public key</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-300">Service Role Key (Optional / Private)</label>
                    <input
                      type="password"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                      value={supabaseConfig.serviceRoleKey || ''}
                      onChange={(e) => setSupabaseConfig({ ...supabaseConfig, serviceRoleKey: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-red-500/25 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div className="p-3 bg-red-950/40 rounded-2xl border border-red-500/20 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Enable Live Supabase Sync</span>
                      <span className="text-[11px] text-stone-400">Push changes in counselors, bookings and blogs to Supabase</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={supabaseConfig.isLiveSyncEnabled}
                      onChange={(e) => setSupabaseConfig({ ...supabaseConfig, isLiveSyncEnabled: e.target.checked })}
                      className="rounded accent-red-600 w-4 h-4 cursor-pointer"
                    />
                  </div>

                  {supabaseTestStatus.result && (
                    <div
                      className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                        supabaseTestStatus.isError
                          ? 'bg-red-950/60 border border-red-500 text-red-200'
                          : 'bg-emerald-950/60 border border-emerald-500 text-emerald-200'
                      }`}
                    >
                      {supabaseTestStatus.isError ? <XCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                      <span>{supabaseTestStatus.result}</span>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleTestSupabase}
                      disabled={supabaseTestStatus.testing}
                      className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-xl border border-white/15 cursor-pointer"
                    >
                      {supabaseTestStatus.testing ? 'Testing...' : 'Test Connection'}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-[#C8101E] to-[#8C0C16] text-white text-xs font-bold rounded-xl shadow cursor-pointer flex-1"
                    >
                      Save Supabase Settings
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Setup Steps & SQL Guide */}
              <div className="lg:col-span-5 bg-red-950/20 backdrop-blur-2xl p-6 rounded-3xl border border-red-500/20 shadow-[0_8px_32px_0_rgba(180,10,25,0.2)] space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-red-400" />
                  <span>3-Step Quickstart Guide</span>
                </h4>

                <div className="space-y-3 text-xs text-stone-300 leading-relaxed">
                  <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/5 space-y-1">
                    <span className="font-bold text-white block">Step 1: Create Supabase Project</span>
                    <p className="text-stone-400">
                      Sign in to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-red-300 underline">supabase.com</a> and create a project in your preferred region.
                    </p>
                  </div>

                  <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/5 space-y-1">
                    <span className="font-bold text-white block">Step 2: Paste SQL Schema</span>
                    <p className="text-stone-400">
                      Click the "Copy Supabase SQL Schema" button above. Open your Supabase SQL Editor, paste the script, and click "Run".
                    </p>
                  </div>

                  <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/5 space-y-1">
                    <span className="font-bold text-white block">Step 3: Save & Test Connection</span>
                    <p className="text-stone-400">
                      Paste your Project URL & anon key on the left, then click "Test Connection".
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: CHANGE MASTER PASSWORD */}
        {activeTab === 'security' && (
          <div className="max-w-xl mx-auto w-full space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold font-serif-brand text-white flex items-center justify-center gap-2">
                <KeyRound className="w-5 h-5 text-red-400" />
                <span>Change Administrator Password</span>
              </h3>
              <p className="text-xs text-stone-400">
                Update the master passcode used to authenticate and unlock this console.
              </p>
            </div>

            <div className="bg-red-950/20 backdrop-blur-2xl p-8 rounded-3xl border border-red-500/25 shadow-[0_8px_32px_0_rgba(180,10,25,0.3)] space-y-5">
              {passwordChangeStatus.message && (
                <div
                  className={`p-3 rounded-2xl text-xs flex items-center gap-2 ${
                    passwordChangeStatus.type === 'error'
                      ? 'bg-red-950/60 border border-red-500 text-red-200'
                      : 'bg-emerald-950/60 border border-emerald-500 text-emerald-200'
                  }`}
                >
                  {passwordChangeStatus.type === 'error' ? (
                    <XCircle className="w-4 h-4 shrink-0 text-red-400" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  )}
                  <span>{passwordChangeStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-300">Current Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter current password (default is 14112001)"
                    value={currentPasswordInput}
                    onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-red-500/25 text-white text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-300">New Password * (Min 6 characters)</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter new administrator password"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-red-500/25 text-white text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-300">Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter new password"
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-red-500/25 text-white text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#C8101E] to-[#8C0C16] hover:from-[#E01424] hover:to-[#A30E1A] text-white text-xs font-bold rounded-2xl shadow-[0_0_20px_rgba(200,16,30,0.4)] transition-all cursor-pointer mt-2"
                >
                  Update Master Password
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 8: INQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold font-serif-brand text-white">Contact Desk Inquiries</h3>
            <div className="bg-red-950/20 backdrop-blur-2xl rounded-3xl border border-red-500/20 overflow-hidden shadow-[0_8px_32px_0_rgba(180,10,25,0.2)]">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/30 border-b border-red-500/20 text-stone-400 font-semibold">
                  <tr>
                    <th className="p-4">Sender</th>
                    <th className="p-4">Category / Dest</th>
                    <th className="p-4">Message</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {enquiries.map((eq) => (
                    <tr key={eq.id} className="hover:bg-white/[0.02]">
                      <td className="p-4">
                        <span className="font-bold text-white block">{eq.name}</span>
                        <span className="text-[11px] text-stone-400">{eq.email} · {eq.phone}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-white block">{eq.visaCategory}</span>
                        <span className="text-[11px] text-stone-400">{eq.destination}</span>
                      </td>
                      <td className="p-4 text-stone-300 max-w-xs">{eq.message}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 text-stone-300">
                          {eq.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {enquiries.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-stone-400">
                        Zero inquiries received yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 9: SITE CMS & HOMEPAGE HERO MANAGER */}
        {activeTab === 'cms' && siteContent && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold font-serif-brand text-white flex items-center gap-2">
                  <FileEdit className="w-5 h-5 text-red-400" />
                  <span>Homepage Branding, Hero Image & CMS</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Change the homepage cloud image, crop positioning, toggle watermark, and manage worldwide syndicate copy.
                </p>
              </div>
            </div>

            {heroFormStatus.message && (
              <div
                className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
                  heroFormStatus.type === 'error'
                    ? 'bg-red-950/60 border border-red-500 text-red-200'
                    : 'bg-emerald-950/60 border border-emerald-500 text-emerald-200'
                }`}
              >
                {heroFormStatus.type === 'error' ? (
                  <XCircle className="w-4 h-4 shrink-0 text-red-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                )}
                <span>{heroFormStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleSaveHeroBranding} className="space-y-6">
              {/* CARD 1: HOMEPAGE HERO IMAGE & CROP CONTROLS */}
              <div className="bg-red-950/20 backdrop-blur-2xl p-6 rounded-3xl border border-red-500/20 shadow-[0_8px_32px_0_rgba(180,10,25,0.2)] space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Homepage Cloud Frame Image & Crop Controls</span>
                  </h4>
                  <span className="text-[10px] text-stone-400">Live synchronization with homepage</span>
                </div>

                {/* Quick Presets */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-300 block">
                    Choose from Curated Brand Presets or Enter Custom URL
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      {
                        label: 'Cropped Traveler',
                        url: '',
                        desc: 'Classic international skyline',
                      },
                      {
                        label: 'Syndicate Mafia High Table',
                        url: '/src/assets/images/syndicate_trust_council_1791915534083.jpg',
                        desc: 'Anonymous boardroom trust',
                      },
                      {
                        label: 'World Destinations',
                        url: '/src/assets/images/visa_destinations_collage_1791707685705.jpg',
                        desc: 'Global landmark collage',
                      },
                      {
                        label: 'University Campus',
                        url: '/src/assets/images/study_visa_university_1791707716821.jpg',
                        desc: 'Academic campus intake',
                      },
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          setSiteContent({
                            ...siteContent,
                            heroImageUrl: preset.url,
                          })
                        }
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          (siteContent.heroImageUrl || '') === preset.url
                            ? 'bg-red-950/80 border-red-500 text-white shadow-md'
                            : 'bg-white/[0.03] border-white/10 text-stone-300 hover:bg-white/[0.06]'
                        }`}
                      >
                        <span className="font-bold text-xs block">{preset.label}</span>
                        <span className="text-[10px] text-stone-400 block mt-0.5">{preset.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Image URL */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">Custom Hero Image URL</label>
                  <input
                    type="text"
                    placeholder="Leave empty for default traveler, or paste custom HTTPS image URL"
                    value={siteContent.heroImageUrl || ''}
                    onChange={(e) => setSiteContent({ ...siteContent, heroImageUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-red-500/25 text-white text-xs font-mono"
                  />
                </div>

                {/* CROP POSITION & WATERMARK TOGGLE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Crop Position */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-300">
                      Image Crop & Alignment Position
                    </label>
                    <select
                      value={siteContent.heroImageCrop || 'center 28%'}
                      onChange={(e) => setSiteContent({ ...siteContent, heroImageCrop: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A0305] border border-red-500/25 text-white text-xs font-bold"
                    >
                      <option value="center 25%">Top Balanced (25% - Clean Horizon Framing)</option>
                      <option value="center 32%">Standard Traveler (32%)</option>
                      <option value="center 50%">Center Balanced (50%)</option>
                      <option value="top center">Top Aligned</option>
                      <option value="center bottom">Bottom Aligned</option>
                    </select>
                    <span className="text-[10px] text-stone-400">
                      Controls how the photo is framed inside the cloud shape.
                    </span>
                  </div>

                  {/* Watermark Toggle */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-300">Watermark Overlay Setting</label>
                    <div className="p-3 bg-white/[0.03] rounded-xl border border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">
                          {siteContent.heroShowWatermark ? 'Watermark Enabled' : 'Clean Crop (No Watermark)'}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {siteContent.heroShowWatermark
                            ? 'Shows holographic TVS seal & gold crest'
                            : 'Displays clean, watermark-free high-definition photograph'}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={siteContent.heroShowWatermark === true}
                        onChange={(e) =>
                          setSiteContent({ ...siteContent, heroShowWatermark: e.target.checked })
                        }
                        className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Watermark Text if enabled */}
                {siteContent.heroShowWatermark && (
                  <div className="space-y-1 animate-in fade-in">
                    <label className="text-xs font-bold text-stone-300">Watermark Badge Text</label>
                    <input
                      type="text"
                      value={siteContent.heroWatermarkText || 'THE VISA SYNDICATE'}
                      onChange={(e) =>
                        setSiteContent({ ...siteContent, heroWatermarkText: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-red-500/25 text-white text-xs"
                    />
                  </div>
                )}
              </div>

              {/* CARD 2: WORLDWIDE SYNDICATE COPY & HEADLINES */}
              <div className="bg-red-950/20 backdrop-blur-2xl p-6 rounded-3xl border border-red-500/20 shadow-[0_8px_32px_0_rgba(180,10,25,0.2)] space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-red-400" />
                    <span>Worldwide Reach & Headline Copy</span>
                  </h4>
                  <span className="text-[10px] text-stone-400">Serving clients in 120+ countries</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">Worldwide Tagline / Eyebrow</label>
                  <input
                    type="text"
                    value={
                      siteContent.worldwideTagline ||
                      'Operating Worldwide in 120+ Jurisdictions · Global Sovereign Advisory'
                    }
                    onChange={(e) => setSiteContent({ ...siteContent, worldwideTagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-red-500/25 text-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">Headline Line 1</label>
                    <input
                      type="text"
                      value={siteContent.heroHeadline1}
                      onChange={(e) => setSiteContent({ ...siteContent, heroHeadline1: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-red-500/25 text-white text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">Headline Line 2 (Accent)</label>
                    <input
                      type="text"
                      value={siteContent.heroHeadline2}
                      onChange={(e) => setSiteContent({ ...siteContent, heroHeadline2: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-red-500/25 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">Supporting Subtitle</label>
                  <textarea
                    rows={2}
                    value={siteContent.heroSubtitle}
                    onChange={(e) => setSiteContent({ ...siteContent, heroSubtitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-red-500/25 text-white text-xs"
                  />
                </div>
              </div>

              {/* CARD 3: OFFICIAL SADAPAY BANKING (READ ONLY REFERENCE) */}
              <div className="bg-red-950/20 backdrop-blur-2xl p-6 rounded-3xl border border-red-500/20 shadow-[0_8px_32px_0_rgba(180,10,25,0.2)] space-y-4">
                <h4 className="font-bold text-sm text-white flex items-center gap-2 pb-2 border-b border-white/10">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Official SadaPay Account (Escrow Payouts)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">SadaPay Account Number</label>
                    <input
                      type="text"
                      value={siteContent.bankDetails.sadapayNumber || '03400131732'}
                      readOnly
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-red-500/25 text-white text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">Account Title</label>
                    <input
                      type="text"
                      value={siteContent.bankDetails.accountTitle}
                      readOnly
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-red-500/25 text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-[#C8101E] to-[#8C0C16] hover:from-[#E01424] hover:to-[#A30E1A] text-white text-xs font-bold rounded-2xl shadow-[0_0_20px_rgba(200,16,30,0.4)] transition-all cursor-pointer"
                >
                  Save Homepage Hero & Branding Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 10: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold font-serif-brand text-white">Security Audit Log</h3>
            <div className="bg-red-950/20 backdrop-blur-2xl rounded-3xl border border-red-500/20 overflow-hidden shadow-[0_8px_32px_0_rgba(180,10,25,0.2)]">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-black/30 border-b border-red-500/20 text-stone-400 font-semibold">
                  <tr>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Actor</th>
                    <th className="p-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {auditLogs.map((lg) => (
                    <tr key={lg.id} className="hover:bg-white/[0.02]">
                      <td className="p-4 text-stone-400">{new Date(lg.timestamp).toLocaleString()}</td>
                      <td className="p-4 text-red-300 font-bold">{lg.action}</td>
                      <td className="p-4 text-white">{lg.actorEmail}</td>
                      <td className="p-4 text-stone-300 font-sans">{lg.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Full Statutory Tracking Dossier & ID Photos Modal */}
      <EditDossierModal
        isOpen={Boolean(editingDossier)}
        dossier={editingDossier}
        onClose={() => setEditingDossier(null)}
        onSave={handleSaveDossier}
        saving={savingDossier}
      />

      {/* Printable Statutory Dossier Extract for Courts & Law Enforcement */}
      <PrintDossierModal
        isOpen={Boolean(dossierPrintView)}
        dossier={dossierPrintView}
        onClose={() => setDossierPrintView(null)}
      />
    </div>
  );
};
