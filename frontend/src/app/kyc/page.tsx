"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";
import { Leaf, Camera, CheckCircle, ShieldCheck, RefreshCw } from "lucide-react";

export default function KycVerificationPage() {
    const router = useRouter();
    const webcamRef = useRef<Webcam>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<"CAPTURE" | "REVIEW" | "PENDING">("CAPTURE");
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) return router.push("/login");
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);

                    // If they are not a practitioner, send them back
                    if (data.role !== 'PRACTITIONER') {
                        router.push("/dashboard");
                    }

                    // If they are already verified, send them to dashboard
                    if (data.practitionerProfile?.kycVerified) {
                        router.push("/dashboard");
                    }

                    // If they have a pending photo already, show pending screen
                    if (data.practitionerProfile?.kycPhoto && !data.practitionerProfile?.kycVerified) {
                        setStatus("PENDING");
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, [router]);

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageBase64 = webcamRef.current.getScreenshot();
            setImageSrc(imageBase64);
            if (imageBase64) setStatus("REVIEW");
        }
    }, [webcamRef]);

    const retake = () => {
        setImageSrc(null);
        setStatus("CAPTURE");
    };

    const submitKyc = async () => {
        if (!imageSrc) return;
        setUploading(true);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/kyc/upload`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ photo: imageSrc })
            });

            if (res.ok) {
                setStatus("PENDING");
            } else {
                alert("Failed to upload KYC photo. Please try again.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    if (status === "PENDING") {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-100">
                    <div className="mx-auto w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-6 border border-amber-100">
                        <ShieldCheck className="w-10 h-10 text-amber-500" />
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-[#2A3B47] tracking-tight mb-3">Verification Pending</h1>
                    <p className="text-gray-500 leading-relaxed mb-8">
                        Your identity verification photo has been successfully submitted to the PrakritiAI administration team.
                        You will be granted access to the platform once your profile is approved.
                    </p>
                    <button
                        onClick={() => { localStorage.removeItem("token"); router.push("/login"); }}
                        className="w-full py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl transition-colors border border-gray-200"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
            {/* Simple Header */}
            <div className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center z-10 relative">
                <div className="flex items-center gap-2">
                    <Leaf className="w-6 h-6 text-[#2D7A5D]" />
                    <h2 className="text-xl font-serif font-bold text-[#1f2937] tracking-tight">PrakritiAI</h2>
                </div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Practitioner Onboarding
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-[#F8FAFC] z-0">
                <div className="max-w-xl w-full text-center mb-12">
                    <div className="mx-auto w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-6">
                        <CheckCircle className="w-8 h-8 text-[#2D7A5D]" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-[#2A3B47] tracking-tight mb-3">
                        {status === "CAPTURE" ? "Identity Verification" : "Review Verification"}
                    </h1>
                    <p className="text-gray-500">
                        {status === "CAPTURE"
                            ? "Please position your face securely within the frame and capture a clear photo for administrative approval."
                            : "Ensure your face is clearly visible. This photo will be used to securely verify your medical profile."}
                    </p>
                </div>

                <div className="relative mb-24 group">
                    {/* The Circular Frame */}
                    <div className="w-[320px] h-[320px] rounded-full overflow-hidden border-8 border-white shadow-2xl relative bg-gray-100 mx-auto">

                        {status === "CAPTURE" ? (
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={{ facingMode: "user", width: 400, height: 400 }}
                                className="w-full h-full object-cover transform scale-x-[-1]"
                            />
                        ) : (
                            <img src={imageSrc!} alt="Captured KYC" className="w-full h-full object-cover transform scale-x-[-1]" />
                        )}

                        {/* Guide Overlay Ring */}
                        {status === "CAPTURE" && (
                            <div className="absolute inset-0 pointer-events-none p-4">
                                <div className="w-full h-full rounded-full border-4 border-dashed border-white/50 animate-[spin_10s_linear_infinite]" />
                            </div>
                        )}
                    </div>

                    {/* Action Buttons Container */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
                        {status === "CAPTURE" ? (
                            <button
                                onClick={capture}
                                className="w-16 h-16 rounded-full bg-[#2D7A5D] hover:bg-[#24614A] text-white flex items-center justify-center shadow-xl shadow-[#2D7A5D]/30 transition-transform active:scale-95 border-4 border-white cursor-pointer"
                            >
                                <Camera className="w-6 h-6" />
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={retake}
                                    disabled={uploading}
                                    className="w-14 h-14 rounded-full bg-white text-gray-600 hover:text-gray-900 flex items-center justify-center shadow-lg transition-transform active:scale-95 border border-gray-100 disabled:opacity-50 cursor-pointer"
                                    title="Retake Photo"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={submitKyc}
                                    disabled={uploading}
                                    className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-xl shadow-green-500/30 transition-transform active:scale-95 border-4 border-white disabled:opacity-50 cursor-pointer"
                                    title="Submit for Approval"
                                >
                                    {uploading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <CheckCircle className="w-7 h-7" />}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
