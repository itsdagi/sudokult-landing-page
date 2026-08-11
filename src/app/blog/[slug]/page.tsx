import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock, Calendar, ArrowUpRight, BookOpen } from "lucide-react";
import { getPostBySlug, getRelatedPosts, getAllPosts } from "@/lib/blogData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CandidatePracticeLab from "@/components/CandidatePracticeLab";
import ShareButton from "./ShareButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return {
      title: "Entry Not Found — Sudokult Archive",
    };
  }
  return {
    title: `${post.title} — Sudokult Archive`,
    description: post.excerpt,
    keywords: post.seoKeywords,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const related = getRelatedPosts(slug);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#DD5123]/30 selection:text-white">
      <Navbar />

      <main className="pt-32 pb-24 max-w-3xl mx-auto px-6">
        
        {/* Navigation & Share Row */}
        <div className="flex items-center justify-between gap-4 mb-10 pb-6 border-b border-white/[0.08]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-white/40 hover:text-[#DD5123] transition-colors group"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Archive</span>
          </Link>

          <ShareButton title={post.title} />
        </div>

        {/* Article Metadata Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 text-xs font-mono text-white/30 mb-4">
            <span className="text-[#DD5123] font-bold uppercase">{post.category}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-white/30" />
              {post.readTime}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-white/30" />
              {post.date}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-8">
            {post.title}
          </h1>

          {/* Author info */}
          <div className="flex items-center justify-between py-4 border-y border-white/[0.08] text-xs font-mono">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono font-bold text-[#DD5123]">
                {post.author.avatar}
              </div>
              <div>
                <div className="text-white font-bold">{post.author.name}</div>
                <div className="text-[11px] text-white/40">{post.author.role}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Tags Header Box (Zero Gradient) */}
        <div className="p-4 rounded-xl bg-[#121212] border border-white/[0.08] mb-12 font-mono text-xs text-white/40">
          <span className="text-white/60 font-bold mr-2">KEYWORDS:</span>
          {post.seoKeywords.join(" // ")}
        </div>

        {/* Article Content Body */}
        <article
          className="prose prose-invert max-w-none text-white/80 leading-relaxed space-y-6 text-base sm:text-lg mb-16"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* Interactive Skill Practice Lab */}
        <CandidatePracticeLab />

        {/* Related Articles Section */}
        {related.length > 0 && (
          <div className="pt-10 border-t border-white/[0.08]">
            <span className="label text-white/30 font-mono block mb-6" style={{ fontSize: "0.65rem" }}>
              RELATED ARCHIVE ENTRIES
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="p-5 rounded-xl bg-[#121212] border border-white/[0.06] hover:border-white/20 transition-all group"
                >
                  <span className="text-[10px] font-mono text-[#DD5123] font-bold uppercase block mb-1.5">
                    {rel.category}
                  </span>
                  <h4 className="text-sm font-bold text-white mb-3 group-hover:text-[#DD5123] transition-colors leading-snug">
                    {rel.title}
                  </h4>
                  <span className="text-xs font-mono text-white/40 flex items-center gap-1 group-hover:text-white">
                    <span>Read Entry</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#DD5123] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
