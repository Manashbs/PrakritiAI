"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PrakritiAILayout from "@/components/PrakritiAILayout";
import { Activity, Moon, Droplet, Heart, Plus, ArrowRight, Leaf, FileSignature, Clock } from "lucide-react";
import Link from "next/link";
import { useMedicalMode } from "@/context/ModeContext";
import PractitionerDashboard from "@/components/PractitionerDashboard";
import AdminDashboard from "@/components/AdminDashboard";

export default function Dashboard() {
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { mode, themeColor, themeBgHover, themeBgLight } = useMedicalMode();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const [profileRes, rxRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/prescriptions/patient`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                if (!profileRes.ok) throw new Error("Failed to fetch profile");
                setProfile(await profileRes.json());

                if (rxRes.ok) {
                    setPrescriptions(await rxRes.json());
                }
            } catch (error) {
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [router]);

    if (loading) {
        return (
            <PrakritiAILayout>
                <div className="flex h-full items-center justify-center">
                    <div className="font-medium" style={{ color: themeColor }}>Loading Overview...</div>
                </div>
            </PrakritiAILayout>
        );
    }

    if (profile?.role === "PRACTITIONER") {
        return <PractitionerDashboard profile={profile} />;
    }

    if (profile?.role === "ADMIN") {
        return <AdminDashboard profile={profile} />;
    }

    return (
        <PrakritiAILayout>
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-[#2A3B47] tracking-tight">
                        Namaste, {profile?.name?.split(' ')[0] || "User"}
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Here's your Prana overview for today.
                    </p>
                </div>
                <button
                    className="flex items-center gap-2 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm text-sm"
                    style={{ backgroundColor: themeColor }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = themeBgHover}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = themeColor}
                >
                    <Plus className="w-4 h-4" />
                    Log Daily Vitals
                </button>
            </header>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Card 1 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/60 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <p className="text-sm text-gray-500 font-medium">Dosha State</p>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: themeBgLight, color: themeColor }}>
                            <Activity className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-[#2A3B47] mt-3">Unknown</h3>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/60 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <p className="text-sm text-gray-500 font-medium">Sleep Quality</p>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: themeBgLight, color: themeColor }}>
                            <Moon className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-[#2A3B47] mt-3">--</h3>
                        <p className="text-xs font-medium mt-1" style={{ color: themeColor }}>-0.5 hrs <span className="text-gray-400 font-normal">vs last week</span></p>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/60 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <p className="text-sm text-gray-500 font-medium">Hydration</p>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: themeBgLight, color: themeColor }}>
                            <Droplet className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-[#2A3B47] mt-3">--</h3>
                    </div>
                </div>

                {/* Card 4 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/60 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <p className="text-sm text-gray-500 font-medium">Mood</p>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: themeBgLight, color: themeColor }}>
                            <Heart className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-[#2A3B47] mt-3">--</h3>
                    </div>
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Digital Prescriptions */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100/60 p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-gray-100/60 pb-3">
                        <h3 className="text-xl font-bold text-[#2A3B47] flex items-center gap-2">
                            <FileSignature className="w-5 h-5 text-gray-400" />
                            Digital Prescriptions
                        </h3>
                    </div>

                    {prescriptions.length === 0 ? (
                        <div className="w-full py-10 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                            <Clock className="w-8 h-8 text-gray-300 mb-3" />
                            <h4 className="font-bold text-[#2A3B47]">No recent prescriptions</h4>
                            <p className="text-gray-500 text-sm mt-1">Consult with a doctor to get your personalized Rx.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {prescriptions.slice(0, 3).map((rx) => (
                                <div key={rx.id} className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h4 className="font-bold text-[#2A3B47] text-base">Dr. {rx.practitioner?.user?.name || "Practitioner"}</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">{new Date(rx.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <button className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-xs font-bold transition-colors border border-gray-200">
                                            View Full Rx
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                                        {rx.medicines?.slice(0, 2).map((med: any) => (
                                            <div key={med.id} className="p-3 bg-gray-50/50 rounded-lg border border-gray-100">
                                                <h5 className="font-bold text-sm text-[#2A3B47]">{med.name}</h5>
                                                <p className="text-xs text-gray-600 mt-1">{med.dosage} • {med.frequency}</p>
                                            </div>
                                        ))}
                                        {rx.medicines?.length > 2 && (
                                            <div className="p-3 bg-gray-50/50 rounded-lg border border-gray-100 flex items-center justify-center">
                                                <p className="text-xs font-bold text-gray-500">+{rx.medicines.length - 2} more medicines</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Action Widgets */}
                <div className="flex flex-col gap-6">
                    {/* AI Analysis Block */}
                    <div
                        className="rounded-2xl p-6 text-white shadow-md relative overflow-hidden transition-colors"
                        style={{ backgroundColor: themeColor }}
                    >
                        {/* Decorative background shape */}
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

                        <h3 className="text-xl font-bold mb-3 relative z-10">AI Health Analysis</h3>
                        <p className="text-white/80 text-sm mb-6 leading-relaxed relative z-10">
                            Get personalized insights based on your symptoms and vitals in {mode.toLowerCase()} mode.
                        </p>
                        <Link
                            href="/triage"
                            className="w-full bg-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors relative z-10"
                            style={{ color: themeColor }}
                        >
                            Start Analysis <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Recommended Products */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/60 p-6 flex-1">
                        <h3 className="text-lg font-bold text-[#2A3B47] mb-4">Recommended Products</h3>
                        <div className="flex flex-col gap-3">
                            {/* Product 1 */}
                            <div className="flex items-center gap-4 p-3 bg-gray-50/50 rounded-xl border border-gray-50 hover:bg-white hover:border-gray-100 hover:shadow-sm transition-all cursor-pointer">
                                <div className="w-12 h-12 bg-white flex items-center justify-center rounded-lg shadow-sm border border-gray-100" style={{ color: themeColor }}>
                                    <Leaf className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-[#2A3B47]">Ashwagandha Root</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">Stress Relief</p>
                                </div>
                            </div>

                            {/* Product 2 */}
                            <div className="flex items-center gap-4 p-3 bg-gray-50/50 rounded-xl border border-gray-50 hover:bg-white hover:border-gray-100 hover:shadow-sm transition-all cursor-pointer">
                                <div className="w-12 h-12 bg-white flex items-center justify-center rounded-lg shadow-sm border border-gray-100" style={{ color: themeColor }}>
                                    <Leaf className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-[#2A3B47]">Tulsi Green Tea</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">Immunity Booster</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PrakritiAILayout >
    );
}
