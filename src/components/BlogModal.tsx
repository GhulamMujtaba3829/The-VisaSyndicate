import React, { useState, useEffect } from 'react';
import { BlogPost, api } from '../lib/api';
import { BrandLogo } from './BrandLogo';
import {
  X,
  Calendar,
  Clock,
  User,
  Tag,
  Share2,
  BookOpen,
  ArrowRight,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPostId?: string | null;
  onOpenBooking?: () => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({
  isOpen,
  onClose,
  initialPostId,
  onOpenBooking,
}) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPosts();
    }
  }, [isOpen, initialPostId]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await api.getPublicBlogs();
      setPosts(data);
      if (initialPostId) {
        const found = data.find((p) => p.id === initialPostId || p.slug === initialPostId);
        if (found) setSelectedPost(found);
      } else if (data.length > 0 && !selectedPost) {
        setSelectedPost(data[0]);
      }
    } catch (err) {
      console.error('Failed to load blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const categories = ['all', ...Array.from(new Set(posts.map((p) => p.category)))];
  const filteredPosts =
    selectedCategory === 'all'
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-in fade-in">
      <div className="bg-[#FAF8F6] w-full max-w-5xl h-[92vh] rounded-3xl shadow-2xl border border-[#E9DAD9] flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="bg-white px-6 py-4 border-b border-[#E9DAD9] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C8101E]/10 text-[#C8101E] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif-brand font-bold text-[#202124] leading-tight">
                Immigration Intelligence & Advisory
              </h3>
              <p className="text-[11px] text-[#6B7078]">
                Official policy analyses, case audits & High Commission insights
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedPost && (
              <button
                onClick={handleShare}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E9DAD9] text-xs font-semibold text-[#6B7078] hover:text-[#202124] hover:bg-[#FAF8F6] transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-[#6B7078] hover:text-[#202124] hover:bg-[#F1EEEC] rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Sidebar list + Reader */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: Post Directory */}
          <div className="w-full md:w-80 lg:w-96 bg-white border-r border-[#E9DAD9] flex flex-col shrink-0 overflow-hidden">
            {/* Category Filter Pills */}
            <div className="p-3 border-b border-[#F1EEEC] flex gap-1.5 overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#C8101E] text-white shadow-2xs'
                      : 'bg-[#FAF8F6] text-[#6B7078] hover:text-[#202124]'
                  }`}
                >
                  {cat === 'all' ? 'All Articles' : cat}
                </button>
              ))}
            </div>

            {/* Post List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#F1EEEC] p-2 space-y-1">
              {loading && (
                <div className="p-6 text-center text-xs text-[#6B7078]">
                  Loading editorial publications...
                </div>
              )}
              {!loading && filteredPosts.length === 0 && (
                <div className="p-6 text-center text-xs text-[#6B7078]">
                  No articles found in this category.
                </div>
              )}
              {filteredPosts.map((post) => {
                const isSelected = selectedPost?.id === post.id;
                return (
                  <button
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-[#FAF8F6] border border-[#E9DAD9] shadow-2xs'
                        : 'hover:bg-[#FAF8F6]/70'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-[#6B7078]">
                      <span className="font-bold text-[#760B16] uppercase tracking-wider">
                        {post.category}
                      </span>
                      <span>{post.readTime}</span>
                    </div>
                    <h4 className="text-xs font-bold text-[#202124] line-clamp-2 leading-snug">
                      {post.title}
                    </h4>
                    <p className="text-[11px] text-[#6B7078] line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Full Article Reader */}
          <div className="flex-1 bg-[#FAF8F6] overflow-y-auto p-4 sm:p-8">
            {selectedPost ? (
              <article className="max-w-2xl mx-auto space-y-6">
                {/* Cover Image */}
                {selectedPost.coverImage && (
                  <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-md border border-[#E9DAD9]">
                    <img
                      src={selectedPost.coverImage}
                      alt={selectedPost.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#760B16] uppercase tracking-wider">
                      {selectedPost.category}
                    </div>
                  </div>
                )}

                {/* Article Meta */}
                <div className="space-y-3 pb-4 border-b border-[#E9DAD9]">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B7078]">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#C8101E]" />
                      <span className="font-semibold text-[#202124]">{selectedPost.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#6B7078]" />
                      <span>{new Date(selectedPost.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#6B7078]" />
                      <span>{selectedPost.readTime}</span>
                    </div>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#202124] leading-tight">
                    {selectedPost.title}
                  </h1>

                  <p className="text-sm text-[#474B52] font-medium leading-relaxed italic bg-white p-4 rounded-2xl border border-[#E9DAD9]/70">
                    "{selectedPost.excerpt}"
                  </p>
                </div>

                {/* Article Content */}
                <div className="prose prose-sm max-w-none text-xs sm:text-sm text-[#202124] leading-relaxed space-y-4 whitespace-pre-line">
                  {selectedPost.content}
                </div>

                {/* Tags */}
                {selectedPost.tags && selectedPost.tags.length > 0 && (
                  <div className="pt-4 border-t border-[#E9DAD9] flex flex-wrap items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-[#6B7078]" />
                    {selectedPost.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white border border-[#E9DAD9] text-[11px] font-medium text-[#6B7078]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Call to Action Box */}
                {onOpenBooking && (
                  <div className="p-6 bg-gradient-to-r from-[#760B16] to-[#C8101E] rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-left">
                      <h4 className="text-base font-bold font-serif-brand">
                        Need Custom Case Evaluation?
                      </h4>
                      <p className="text-xs text-white/80">
                        Book a 1-on-1 confidential assessment with our accredited specialists.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenBooking();
                      }}
                      className="px-6 py-2.5 bg-white text-[#760B16] font-bold text-xs rounded-full shadow hover:bg-[#FAF8F6] transition-transform hover:scale-105 cursor-pointer whitespace-nowrap"
                    >
                      Book Consultation
                    </button>
                  </div>
                )}
              </article>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#6B7078] space-y-2">
                <BookOpen className="w-10 h-10 stroke-1 text-[#C8101E]" />
                <p className="text-sm font-semibold text-[#202124]">Select an article from the directory</p>
                <p className="text-xs max-w-xs">Explore expert visa guides, financial audit protocols, and embassy policies.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
