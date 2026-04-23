"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight, Clock, Calendar, Phone, Leaf,
  ChevronUp, BookOpen, Share2, Check, Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Section {
  id: string;
  heading: string;
  content: string[];
  tip?: string;
  image?: string;
  imageAlt?: string;
  list?: string[];
}

interface GuideArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryHref: string;
  readTime: number;
  date: string;
  author: string;
  authorRole: string;
  heroImage: string;
  intro: string;
  sections: Section[];
  relatedSlugs: string[];
}

// Related articles fetched separately
interface RelatedArticle {
  slug: string; title: string; category: string; readTime: number; image?: string;
}

// ─── Share Button ─────────────────────────────────────────────────────────────

const ShareButton = ({ title }: { title: string }) => {
  const [copied, setCopied] = useState(false);
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 text-sm font-semibold text-[#5a5a48] hover:text-[#3d6b35] bg-white border border-[#e8e0d0] hover:border-[#3d6b35] px-4 py-2 rounded-xl transition-all"
    >
      {copied ? <Check size={15} className="text-[#3d6b35]" /> : <Share2 size={15} />}
      {copied ? "Link copied!" : "Share"}
    </button>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const ArticleSkeleton = () => (
  <div className="min-h-screen bg-[#faf7f2] animate-pulse">
    <div className="w-full bg-[#f0ece4]" style={{ height: "clamp(240px, 38vw, 420px)" }} />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex gap-12">
        <div className="hidden lg:flex flex-col gap-3 w-60">
          {[1,2,3,4,5].map((i) => <div key={i} className="h-8 bg-[#f0ece4] rounded-xl" />)}
        </div>
        <div className="flex-1 flex flex-col gap-5">
          <div className="h-6 bg-[#f0ece4] rounded-xl w-3/4" />
          <div className="h-4 bg-[#f0ece4] rounded-xl w-full" />
          <div className="h-4 bg-[#f0ece4] rounded-xl w-5/6" />
        </div>
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GuideArticlePage({ slug }: { slug: string }) {
  const [article,  setArticle]  = useState<GuideArticle | null>(null);
  const [related,  setRelated]  = useState<RelatedArticle[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);

    fetch(`/api/guides/${slug}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null; }
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setArticle(data);
        setLoading(false);

        // Fetch related articles
        if (data.relatedSlugs?.length) {
          Promise.all(
            data.relatedSlugs.slice(0, 4).map((s: string) =>
              fetch(`/api/guides/${s}`)
                .then((r) => r.ok ? r.json() : null)
                .then((d) => d ? ({ slug: d.slug, title: d.title, category: d.category, readTime: d.readTime, image: d.heroImage }) : null)
                .catch(() => null)
            )
          ).then((results) => {
            setRelated(results.filter(Boolean) as RelatedArticle[]);
          });
        }
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  if (loading) return <ArticleSkeleton />;

  if (notFound || !article) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center px-4 text-center py-20">
        <div className="text-6xl mb-5">🌱</div>
        <h2 className="text-2xl font-bold text-[#2a2a1e] mb-3">Article not found</h2>
        <p className="text-[#7a7a68] mb-6">This guide may not be available yet.</p>
        <Link href="/guides" className="inline-flex items-center gap-2 bg-[#3d6b35] hover:bg-[#335c2c] text-white font-bold text-base px-6 py-3 rounded-xl transition-colors">
          Browse All Guides
        </Link>
      </div>
    );
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-[#faf7f2]">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#e8e0d0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm flex-wrap">
          <Link href="/" className="text-[#7a7a68] hover:text-[#3d6b35] transition-colors">Home</Link>
          <ChevronRight size={14} className="text-[#b0a890]" />
          <Link href="/guides" className="text-[#7a7a68] hover:text-[#3d6b35] transition-colors">Guides</Link>
          <ChevronRight size={14} className="text-[#b0a890]" />
          <span className="text-[#2a2a1e] font-medium truncate max-w-[200px]">{article.title}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative w-full overflow-hidden" style={{ height: "clamp(240px, 38vw, 420px)" }}>
        <Image src={article.heroImage} alt={article.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="absolute inset-0 flex flex-col justify-end pb-8 sm:pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
            <Link
              href={article.categoryHref}
              className="inline-flex items-center gap-1.5 bg-[#3d6b35] text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 hover:bg-[#335c2c] transition-colors"
            >
              <Leaf size={12} />{article.category}
            </Link>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-outfit text-white leading-tight">{article.title}</h1>
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <span className="flex items-center gap-1.5 text-white/75 text-sm"><Clock size={14} />{article.readTime} min read</span>
              <span className="flex items-center gap-1.5 text-white/75 text-sm"><Calendar size={14} />{article.date}</span>
              <span className="text-white/75 text-sm">By {article.author}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">

          {/* Table of Contents */}
          {article.sections.length > 0 && (
            <aside className="w-full lg:w-60 shrink-0 lg:sticky lg:top-28 order-2 lg:order-1">
              <div className="bg-white rounded-2xl border border-[#e8e0d0] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen size={16} className="text-[#3d6b35]" />
                  <p className="text-sm font-bold text-[#2a2a1e] uppercase tracking-wide">In This Guide</p>
                </div>
                <div className="flex flex-col gap-1">
                  {article.sections.map((s) => (
                    <a key={s.id} href={`#${s.id}`}
                      className="text-sm text-[#5a5a48] hover:text-[#3d6b35] py-2 px-3 rounded-lg hover:bg-[#eef5ea] transition-all leading-snug"
                    >
                      {s.heading}
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-4 bg-[#eef5ea] border border-[#b8d4a0] rounded-2xl p-4">
                <p className="text-sm font-bold text-[#2a2a1e] mb-1">Questions?</p>
                <p className="text-xs text-[#5a5a48] mb-3 leading-snug">Our garden experts are happy to help you over the phone.</p>
                <a href="tel:+919876543210" className="flex items-center justify-center gap-2 bg-[#3d6b35] hover:bg-[#335c2c] text-white font-bold text-sm py-2.5 rounded-xl transition-colors">
                  <Phone size={15} />Call Us Free
                </a>
              </div>
            </aside>
          )}

          {/* Article body */}
          <div className="flex-1 min-w-0 order-1 lg:order-2">
            {/* Author + share */}
            <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-[#e8e0d0] flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#eef5ea] border-2 border-[#b8d4a0] flex items-center justify-center shrink-0">
                  <Leaf size={18} className="text-[#3d6b35]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#2a2a1e]">{article.author}</p>
                  <p className="text-xs text-[#7a7a68]">{article.authorRole}</p>
                </div>
              </div>
              <ShareButton title={article.title} />
            </div>

            {/* Intro */}
            <p className="text-lg sm:text-xl text-[#3a3a2e] leading-relaxed mb-10 font-medium">{article.intro}</p>

            {/* Sections */}
            {article.sections.length > 0 ? (
              <div className="flex flex-col gap-10 sm:gap-14">
                {article.sections.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-32">
                    <h2 className="text-2xl sm:text-3xl font-bold font-outfit text-[#2a2a1e] mb-5 leading-snug">{section.heading}</h2>
                    {section.content.map((para, i) => (
                      <p key={i} className="text-base sm:text-lg text-[#3a3a2e] leading-relaxed mb-4">{para}</p>
                    ))}
                    {section.image && (
                      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden my-6 border border-[#e8e0d0]">
                        <Image src={section.image} alt={section.imageAlt ?? section.heading} fill className="object-cover" />
                      </div>
                    )}
                    {section.list && section.list.length > 0 && (
                      <ul className="flex flex-col gap-3 my-5">
                        {section.list.map((item) => (
                          <li key={item} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-[#eef5ea] border border-[#b8d4a0] flex items-center justify-center shrink-0 mt-0.5">
                              <Leaf size={12} className="text-[#3d6b35]" />
                            </div>
                            <span className="text-base sm:text-lg text-[#3a3a2e] leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {section.tip && (
                      <div className="bg-[#fff8ee] border-l-4 border-[#d4a017] rounded-r-2xl px-5 py-4 mt-5">
                        <p className="text-sm font-bold text-[#7a5c1e] mb-1">💡 Tip</p>
                        <p className="text-base sm:text-lg text-[#7a5c1e] leading-relaxed">{section.tip}</p>
                      </div>
                    )}
                  </section>
                ))}
              </div>
            ) : (
              <div className="bg-[#eef5ea] border border-[#b8d4a0] rounded-2xl p-8 text-center">
                <p className="text-base text-[#3d6b35] font-semibold">Full article content coming soon.</p>
                <p className="text-sm text-[#5a7a50] mt-2">Call us for gardening advice in the meantime!</p>
                <a href="tel:+919876543210" className="inline-flex items-center gap-2 mt-4 bg-[#3d6b35] text-white font-bold text-sm px-5 py-2.5 rounded-xl">
                  <Phone size={15} />+91 98765 43210
                </a>
              </div>
            )}

            {/* End CTA */}
            <div className="mt-12 pt-8 border-t border-[#e8e0d0]">
              <div className="bg-[#3d6b35] rounded-2xl p-6 sm:p-8 text-white">
                <p className="text-xl font-bold mb-2">Ready to start your garden?</p>
                <p className="text-white/75 text-base mb-5 leading-relaxed max-w-xl">Browse our range of quality seeds, cocopeat, organic fertilizers, pots and more.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/shop" className="flex items-center justify-center gap-2 bg-white text-[#3d6b35] font-bold text-base px-6 py-3.5 rounded-xl hover:bg-[#f0f0f0] transition-colors">
                    <Leaf size={18} />Shop Garden Supplies
                  </Link>
                  <a href="tel:+919876543210" className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-base px-6 py-3.5 rounded-xl transition-colors">
                    <Phone size={18} />Call for Advice
                  </a>
                </div>
              </div>
              <button onClick={scrollToTop} className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#5a5a48] hover:text-[#3d6b35] transition-colors">
                <ChevronUp size={16} />Back to top
              </button>
            </div>
          </div>
        </div>

        {/* Related guides */}
        {related.length > 0 && (
          <div className="mt-14 sm:mt-20 border-t border-[#e8e0d0] pt-10 sm:pt-14">
            <div className="mb-7">
              <p className="text-sm font-bold text-[#7a9e5f] uppercase tracking-wider mb-2">Keep Learning</p>
              <h2 className="text-2xl sm:text-3xl font-bold font-outfit text-[#2a2a1e]">More Guides You Might Like</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((r) => (
                <Link key={r.slug} href={`/guides/${r.slug}`}
                  className="flex flex-col bg-white rounded-2xl border border-[#e8e0d0] overflow-hidden hover:border-[#a8c890] hover:shadow-md transition-all group"
                >
                  {r.image && (
                    <div className="relative aspect-[16/9] overflow-hidden bg-[#f0ece4]">
                      <Image src={r.image} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <span className="text-xs font-bold text-[#3d6b35] bg-[#eef5ea] px-2.5 py-1 rounded-full w-fit">{r.category}</span>
                    <h3 className="text-sm sm:text-base font-bold text-[#2a2a1e] leading-snug group-hover:text-[#3d6b35] transition-colors line-clamp-2">{r.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#a8a090] mt-auto pt-1">
                      <Clock size={12} /><span>{r.readTime} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/guides" className="inline-flex items-center gap-2 bg-white border-2 border-[#3d6b35] text-[#3d6b35] hover:bg-[#3d6b35] hover:text-white font-bold text-base px-8 py-4 rounded-xl transition-all">
                <BookOpen size={18} />Browse All Guides →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}