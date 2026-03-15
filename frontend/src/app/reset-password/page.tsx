"use client";

import { useState, useEffect } from "react";
import { Leaf, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import PasswordStrengthMeter from "../../components/PasswordStrengthMeter";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    // Automatically redirect if no token is found
    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid or missing password reset token.");
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setStatus("error");
            setMessage("Passwords do not match.");
            return;
        }

        setLoading(true);
        setStatus("idle");
        setMessage("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.message || "Failed to reset password.");
            }

            setStatus("success");
            setMessage(data.message || "Password successfully reset!");
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err: any) {
            setStatus("error");
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50 font-sans">
                 <div className="p-10 bg-white rounded-3xl shadow-xl max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">!</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Invalid Link</h3>
                    <p className="text-gray-500 text-sm mb-8">The password reset link is missing or malformed. Please request a new one.</p>
                    <Link href="/forgot-password" className="block w-full py-4 bg-[#2D7A5D] text-white rounded-xl font-bold hover:bg-[#24614A]">
                        Request New Link
                    </Link>
                 </div>
            </div>
        )
    }

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
                        <h1 className="text-2xl font-serif font-bold text-[#2A3B47] mb-2">Create New Password</h1>
                        <p className="text-gray-500 font-medium text-sm">Please choose a strong password to secure your account.</p>
                    </div>

                    {status === "success" ? (
                        <div className="text-center animate-in fade-in slide-in-from-bottom-4">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✓</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Password Reset!</h3>
                            <p className="text-gray-500 text-sm mb-8">{message}<br/>Redirecting to login...</p>
                            <Link href="/login" className="block w-full py-4 bg-[#2D7A5D] text-white rounded-xl font-bold hover:bg-[#24614A] transition-colors shadow-lg shadow-green-900/20 text-center">
                                Login Now
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

                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    minLength={6}
                                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-[#2D7A5D] focus:ring-1 focus:ring-[#2D7A5D] outline-none transition-all text-sm bg-gray-50/50 text-gray-900"
                                    placeholder="New Password"
                                />
                                <PasswordStrengthMeter password={password} />
                            </div>

                            <div>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    minLength={6}
                                    className={`w-full px-5 py-4 rounded-xl border outline-none transition-all text-sm bg-gray-50/50 text-gray-900 ${
                                        confirmPassword && password !== confirmPassword 
                                        ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                                        : 'border-gray-200 focus:border-[#2D7A5D] focus:ring-1 focus:ring-[#2D7A5D]'
                                    }`}
                                    placeholder="Confirm New Password"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !password || !confirmPassword || password !== confirmPassword}
                                className="w-full py-4 bg-[#2D7A5D] text-white rounded-xl font-bold hover:bg-[#24614A] transition-colors shadow-lg shadow-green-900/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                            >
                                {loading ? "Resetting..." : "Reset Password"} <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
