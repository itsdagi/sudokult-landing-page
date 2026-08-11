"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Clock, ArrowRight, CheckCircle2, Mail, ArrowUpRight } from "lucide-react";
import { getAllPosts } from "@/lib/blogData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const categories = ["All", "Strategies", "Brain Health", "Mobile App"];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.seoKeywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const getCategoryCount = (cat: string) => {
    if (cat === "All") return posts.length;
    return posts.filter((p) => p.category === cat).length;
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail("");
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#DD5123]/30 selection:text-white">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6" style={{ maxWidth: "1000px" }}>
          
          {/* Minimalist Editorial Header */}
          <div className="mb-14 pb-10 border-b border-white/[0.08]">
            <div className="flex items-center justify-between gap-4 mb-4">
              <span className="label text-[#DD5123] tracking-widest font-mono" style={{ fontSize: "0.65rem" }}>
                SUDOKULT ARCHIVE // CODEX
              </span>
              <span className="text-xs font-mono text-white/30 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08]">
                {filteredPosts.length} {filteredPosts.length === 1 ? "ARTICLE" : "ARTICLES"}
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-4 leading-none">
              Strategy & Thought
            </h1>

            <p className="text-white/40 text-sm sm:text-base leading-relaxed max-w-lg">
              Analytical guides, candidate elimination strategies, and neuro-science insights for Sudoku purists.
            </p>
          </div>

          {/* Search & Category Filter Navigation */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-12">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {categories.map((cat) => {
                const count = getCategoryCount(cat);
                const isSelected = selectedCategory === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono transition-all duration-150 shrink-0 ${
                      isSelected
                        ? "bg-white text-[#0A0A0A] font-bold shadow-sm"
                        : "bg-[#121212] text-white/40 hover:text-white border border-white/[0.06]"
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] ${isSelected ? "text-[#0A0A0A]/60 font-bold" : "text-white/20"}`}>
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Minimal Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-9 pr-3 rounded-lg bg-[#121212] border border-white/[0.08] text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#DD5123] transition-colors font-mono"
              />
            </div>
          </div>

          {/* Minimalist Editorial Article List */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
              <p className="text-xs font-mono text-white/40">No matching articles found in the archive.</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-0 mb-20">
              {filteredPosts.map((post, idx) => (
                <article key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block py-8 border-b border-white/[0.08] transition-colors hover:bg-white/[0.01]"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      
                      <div className="flex-1 max-w-2xl">
                        {/* Meta Row */}
                        <div className="flex items-center gap-3 text-[11px] font-mono text-white/30 mb-2.5">
                          <span className="text-[#DD5123] font-bold uppercase">{post.category}</span>
                          <span>•</span>
                          <span>{post.date}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-white/30" />
                            {post.readTime}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-[#DD5123] transition-colors leading-snug">
                          {post.title}
                        </h2>

                        {/* Excerpt */}
                        <p className="text-xs sm:text-sm text-white/40 leading-relaxed mb-4">
                          {post.excerpt}
                        </p>

                        {/* Author */}
                        <div className="flex items-center gap-2 text-xs font-mono text-white/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#DD5123]" />
                          <span className="text-white/60 font-semibold">{post.author.name}</span>
                          <span>({post.author.role})</span>
                        </div>
                      </div>

                      {/* Right Arrow Action */}
                      <div className="shrink-0 flex items-center gap-1.5 text-xs font-mono text-white/30 group-hover:text-[#DD5123] transition-colors pt-1">
                        <span>Read Entry</span>
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>

                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}

          {/* Minimalist Newsletter Box */}
          <div className="p-8 sm:p-10 rounded-2xl bg-[#111111] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-md">
              <span className="label text-[#DD5123] font-mono block mb-2" style={{ fontSize: "0.6rem" }}>
                NEWSLETTER DISPATCH
              </span>
              <h3 className="text-xl font-bold text-white mb-2">Subscribe to Codex Entries</h3>
              <p className="text-xs text-white/40 leading-relaxed">
                Receive advanced puzzle elimination techniques and monthly game updates directly in your inbox.
              </p>
            </div>

            <div className="w-full md:w-auto">
              {subscribed ? (
                <div className="px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-emerald-400 font-mono text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Subscription confirmed.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-3.5 py-2.5 rounded-lg bg-[#0A0A0A] border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#DD5123] font-mono w-full md:w-64"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-lg bg-[#DD5123] hover:bg-[#B8421C] text-white font-bold font-mono text-xs transition-colors shrink-0"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
