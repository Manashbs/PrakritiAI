"use client";

import { Leaf, Stethoscope, ArrowRight, UserPlus } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* Left Side: Branding / Hero */}
      <div className="hidden lg:flex w-1/2 bg-[#1A2F25] text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1200')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A2F25]/80 via-[#1A2F25]/95 to-[#1c382b]"></div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <Leaf className="w-8 h-8 text-[#4ade80]" />
          <h2 className="text-3xl font-serif font-bold tracking-tight">PrakritiAI</h2>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-lg mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-6xl font-serif font-bold leading-[1.1] mb-6">
            Ancient<br />
            Wisdom,<br />
            Modern Science.
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Experience the harmony of Ayurveda integrated with clinical precision. Your personalized path to holistic wellness starts here.
          </p>
        </div>

        {/* Footer Links */}
        <div className="relative z-10 flex gap-8 text-sm text-[#4ade80] font-medium">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            Ayurvedic Analysis
          </div>
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4" />
            Clinical Consultation
          </div>
        </div>
      </div>

      {/* Right Side: Welcome Action */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md text-center animate-in fade-in zoom-in-95 duration-500 delay-150">
          <div className="mb-12">
            <div className="w-20 h-20 bg-[#f0fdf4] rounded-full mx-auto flex items-center justify-center text-[#2D7A5D] mb-6 shadow-inner border border-green-50">
              <Leaf className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-serif font-bold text-[#2A3B47] mb-3">Begin Your Journey</h2>
            <p className="text-gray-500 text-lg tracking-wide">Enter the realm of holistic healing.</p>
          </div>

          <div className="flex flex-col gap-4">
            <Link
              href="/login"
              className="w-full py-4 bg-[#2D7A5D] text-white rounded-xl font-bold hover:bg-[#24614A] transition-colors shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 text-lg"
            >
              Log In to Dashboard <ArrowRight className="w-5 h-5" />
            </Link>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest text-gray-400 bg-white px-4">
                OR
              </div>
            </div>

            <Link
              href="/register"
              className="w-full py-4 bg-white text-[#2D7A5D] border-2 border-[#2D7A5D] rounded-xl font-bold hover:bg-green-50 transition-colors flex items-center justify-center gap-2 text-lg"
            >
              <UserPlus className="w-5 h-5" /> Create New Account
            </Link>
          </div>

          <p className="text-center text-[11px] text-gray-400 mt-12 leading-relaxed px-6">
            Secure, HIPAA-compliant platform. Your health data is protected.
          </p>
        </div>
      </div>
    </div>
  );
}
