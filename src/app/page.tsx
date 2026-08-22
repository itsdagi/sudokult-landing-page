"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MagicSpellShowcase from "@/components/MagicSpellShowcase";
import AcademyAndSolo from "@/components/AcademyAndSolo";
import DonationSection from "@/components/DonationSection";
import EarlyAccessCTA from "@/components/EarlyAccessCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main>
        <Hero />
        <MagicSpellShowcase />
        <AcademyAndSolo />
        <DonationSection />
        <EarlyAccessCTA />
      </main>
      <Footer />
    </div>
  );
}
