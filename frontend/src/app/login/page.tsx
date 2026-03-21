"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Stethoscope, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");

            localStorage.setItem("token", data.access_token);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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
                <div className="relative z-10 max-w-lg mb-20">
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

            {/* Right Side: Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-serif font-bold text-[#2A3B47] mb-2">Welcome Back</h2>
                        <p className="text-gray-500 font-medium tracking-wide">Sign in to access your health dashboard</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-700 text-sm font-medium rounded-xl border border-red-100 flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
                                <span className="text-lg leading-none mt-0.5">⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-[#2D7A5D] focus:ring-1 focus:ring-[#2D7A5D] outline-none transition-all text-sm bg-gray-50/50 text-gray-900"
                                placeholder="Email Address"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-[#2D7A5D] focus:ring-1 focus:ring-[#2D7A5D] outline-none transition-all text-sm bg-gray-50/50 text-gray-900"
                                placeholder="Password"
                            />
                            <div className="flex justify-end mt-2">
                                <Link href="/forgot-password" className="text-sm font-medium text-[#2D7A5D] hover:underline">
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !email || !password}
                            className="w-full py-4 bg-[#2D7A5D] text-white rounded-xl font-bold hover:bg-[#24614A] transition-colors shadow-lg shadow-green-900/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? "Signing in..." : "Continue to Dashboard"} <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="mt-10 text-center relative">
                        {/* Divider */}
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-gray-400 bg-white px-4">
                            SECURE ACCESS
                        </div>
                    </div>

                    <p className="text-center text-[11px] text-gray-400 mt-8 leading-relaxed px-6">
                        By clicking continue, you agree to our <a href="#" className="underline hover:text-gray-600">Terms of Service</a> and <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>.
                    </p>

                    <p className="text-center text-sm font-medium text-gray-500 mt-6">
                        Don't have an account? <Link href="/register" className="text-[#2D7A5D] font-bold hover:underline">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
