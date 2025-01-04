import React from "react";
import Navbar from "./components/layout/Navbar";
import HeroSection from "./components/home/HeroSection";
import FeatureSection from "./components/home/FeatureSection";
import Footer from "./components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <Navbar />
        <HeroSection />
      </div>
      <FeatureSection />
      <Footer />
    </div>
  );
}
