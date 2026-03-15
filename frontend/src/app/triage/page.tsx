"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PrakritiAILayout from "@/components/PrakritiAILayout";
import { Sparkles, Stethoscope } from "lucide-react";
import { useMedicalMode } from "@/context/ModeContext";

export default function TriagePage() {
    const router = useRouter();
    const [symptoms, setSymptoms] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { mode, setMode, themeColor, themeBgHover, themeBgLight, themeBorder } = useMedicalMode();

    const handleTriage = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);

        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/triage`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ symptoms }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch AI Triage");

            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PrakritiAILayout>
            {/* Header */}
            <header className="text-center mb-10 mt-4">
                <h1 className="text-4xl font-serif font-bold text-[#2A3B47] tracking-tight">AI Health Assistant</h1>
                <p className="text-gray-500 mt-3 font-medium">Describe your symptoms for a personalized assessment.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
                {/* Left Column: Input Details */}
                <div className="lg:col-span-5 bg-white p-8 rounded-3xl shadow-sm border border-gray-100/80">
                    <h2 className="text-lg font-bold text-[#2A3B47] mb-6">Input Details</h2>

                    <form onSubmit={handleTriage} className="flex flex-col h-full">
                        {/* Mode Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-4">Analysis Paradigm</label>
                            <div className="space-y-3">
                                {["Ayurveda", "Allopathy"].map((m) => (
                                    <label key={m} className={`flex items-center gap-3 cursor-pointer p-0`} onClick={() => setMode(m as any)}>
                                        <div
                                            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors`}
                                            style={{ borderColor: mode === m ? themeColor : '#d1d5db' }}
                                        >
                                            {mode === m && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: themeColor }}></div>}
                                        </div>
                                        <span
                                            className={`text-sm ${mode === m ? 'font-medium' : 'text-gray-600'}`}
                                            style={{ color: mode === m ? themeColor : undefined }}
                                        >
                                            {m}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Symptoms Textarea */}
                        <div className="mb-6 flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Describe Symptoms</label>
                            <textarea
                                required
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                rows={6}
                                className="w-full px-4 py-4 rounded-xl border border-gray-200 outline-none transition-all resize-none text-sm text-gray-700 placeholder:text-gray-400 focus:ring-1"
                                style={{ '--tw-ring-color': themeColor, borderColor: 'var(--tw-border-opacity)' } as React.CSSProperties}
                                placeholder="e.g., Headaches in the evening, dry skin, trouble sleeping..."
                            ></textarea>
                        </div>

                        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</div>}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !symptoms.trim()}
                            className="w-full py-3.5 text-white rounded-xl font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-auto shadow-sm"
                            style={{ backgroundColor: loading ? themeBgHover : themeColor }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = themeBgHover}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = themeColor}
                        >
                            {mode === "Ayurveda" ? <Sparkles className="w-4 h-4" /> : <Stethoscope className="w-4 h-4" />}
                            {loading ? "Analyzing..." : "Analyze Now"}
                        </button>
                    </form>
                </div>

                {/* Right Column: Results Area */}
                <div className="lg:col-span-7">
                    {!result && !loading && (
                        /* Empty State */
                        <div className="h-full border-2 border-dashed border-gray-200 rounded-3xl bg-white/50 flex flex-col items-center justify-center p-12 text-center min-h-[500px]">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                                {mode === "Ayurveda" ? <Sparkles className="w-8 h-8" /> : <Stethoscope className="w-8 h-8" />}
                            </div>
                            <h3 className="text-xl font-serif font-bold text-[#2A3B47] mb-2">Ready to Analyze</h3>
                            <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
                                Enter your symptoms on the left to receive a comprehensive health analysis.
                            </p>
                        </div>
                    )}

                    {loading && (
                        /* Loading State */
                        <div className="h-full border border-gray-100 rounded-3xl bg-white shadow-sm flex flex-col items-center justify-center p-12 text-center min-h-[500px]">
                            <div
                                className="animate-spin w-12 h-12 border-4 border-t-transparent rounded-full mb-6"
                                style={{ borderColor: themeBgLight, borderTopColor: themeColor }}
                            ></div>
                            <h3 className="text-lg font-bold text-[#2A3B47]">Analyzing your Health...</h3>
                            <p className="text-gray-500 mt-2 text-sm">Consulting ancient texts and modern knowledge.</p>
                        </div>
                    )}

                    {result && !loading && (
                        /* Result State */
                        <div className={`h-full border rounded-3xl bg-white shadow-sm p-8 min-h-[500px] relative overflow-hidden ${themeBorder}`}>
                            <div
                                className="absolute top-0 right-0 text-xs font-bold px-4 py-2 rounded-bl-xl border-b border-l"
                                style={{ backgroundColor: themeBgLight, color: themeColor, borderColor: themeBorder.replace('border-', '') }}
                            >
                                Confidence Level: {result.confidenceScore}%
                            </div>

                            <h3 className="text-2xl font-serif font-bold text-[#2A3B47] mb-6 pb-4 border-b border-gray-100">AI Assessment</h3>

                            <div className="max-w-none text-gray-700 mb-8 whitespace-pre-line leading-relaxed text-sm">
                                {result.response}
                            </div>

                            {result.citations && result.citations.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <h4 className="text-sm font-bold text-[#2A3B47] mb-3">Classical Sources Cited:</h4>
                                    <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                                        {result.citations.map((cite: string, i: number) => (
                                            <li key={i}>{cite}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {result.requiresHumanReview && (
                                <div className="mt-8 p-5 bg-[#fff8e6] border border-[#fce9bc] rounded-2xl flex items-start gap-4">
                                    <span className="text-[#d97706] text-2xl leading-none">⚠️</span>
                                    <div>
                                        <h4 className="text-sm font-bold text-[#92400e]">Human Verification Recommended</h4>
                                        <p className="text-xs text-[#b45309] mt-1.5 leading-relaxed">This is a preliminary AI assessment. We strongly advise booking a consultation with a verified practitioner for clinical advice.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </PrakritiAILayout>
    );
}
