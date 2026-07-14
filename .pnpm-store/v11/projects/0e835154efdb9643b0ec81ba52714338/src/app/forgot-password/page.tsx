"use client";

import { useState } from "react";
import { Leaf, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus("idle");
        setMessage("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.message || "Failed to request reset link.");
            }

            setStatus("success");
            setMessage(data.message || "Reset link sent! Please check your email.");
            setEmail("");
        } catch (err: any) {
            setStatus("error");
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50 font-sans">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-green-900/5 overflow-hidden">
                <div className="p-10">
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center gap-2">
                            <Leaf className="w-8 h-8 text-[#4ade80]" />
                            <h2 className="text-2xl font-serif font-bold tracking-tight text-[#1A2F25]">PrakritiAI</h2>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-serif font-bold text-[#2A3B47] mb-2">Reset Password</h1>
                        <p className="text-gray-500 font-medium text-sm">Enter your email and we'll send you a link to reset your password.</p>
                    </div>

                    {status === "success" ? (
                        <div className="text-center animate-in fade-in slide-in-from-bottom-4">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✓</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Check your email</h3>
                            <p className="text-gray-500 text-sm mb-8">{message}</p>
                            <Link href="/login" className="block w-full py-4 bg-[#2D7A5D] text-white rounded-xl font-bold hover:bg-[#24614A] transition-colors shadow-lg shadow-green-900/20 text-center">
                                Return to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {status === "error" && (
                                <div className="p-4 bg-red-50 text-red-700 text-sm font-medium rounded-xl border border-red-100 flex items-start gap-2">
                                    <span className="text-lg leading-none mt-0.5">⚠️</span>
                                    <span>{message}</span>
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

                            <button
                                type="submit"
                                disabled={loading || !email}
                                className="w-full py-4 bg-[#2D7A5D] text-white rounded-xl font-bold hover:bg-[#24614A] transition-colors shadow-lg shadow-green-900/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                            >
                                {loading ? "Sending link..." : "Send Reset Link"} <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    )}

                    {!status || status !== "success" ? (
                        <div className="mt-8 text-center bg-gray-50 -mx-10 -mb-10 py-6 border-t border-gray-100">
                             <Link href="/login" className="text-sm font-bold text-gray-500 hover:text-[#2D7A5D] transition-colors">
                                 ← Back to login
                             </Link>
                         </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
