"use client";

import { useEffect, useState } from "react";
import PrakritiAILayout from "@/components/PrakritiAILayout";
import { User, Mail, Shield, UploadCloud, FileText, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Practitioner specific state
    const [bio, setBio] = useState("");
    const [fee, setFee] = useState(0);
    const [specialties, setSpecialties] = useState("");

    // Files state
    const [uploadedFiles, setUploadedFiles] = useState<{ name: string, type: string }[]>([]);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error("Failed to fetch profile");
                const data = await res.json();
                setProfile(data);

                if (data.practitionerProfile) {
                    setBio(data.practitionerProfile.bio || "");
                    setFee(data.practitionerProfile.consultationFee || 0);
                    setSpecialties(data.practitionerProfile.specialties?.join(", ") || "");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [router]);

    const handleSavePractitioner = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/practitioner`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    bio,
                    consultationFee: Number(fee),
                    specialties: specialties.split(",").map(s => s.trim()).filter(Boolean)
                })
            });
            if (res.ok) {
                alert("Profile updated successfully!");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            // Mock upload
            setTimeout(() => {
                setUploadedFiles(prev => [...prev, { name: file.name, type: file.type.includes('image') ? 'image' : 'document' }]);
            }, 1000);
        }
    };

    if (loading) {
        return (
            <PrakritiAILayout>
                <div className="flex h-full items-center justify-center text-[#2D7A5D]">Loading Profile...</div>
            </PrakritiAILayout>
        );
    }

    return (
        <PrakritiAILayout>
            <div className="max-w-4xl mx-auto">
                <header className="mb-10 mt-4">
                    <h1 className="text-4xl font-serif font-bold text-[#2A3B47] tracking-tight mb-2">My Profile</h1>
                    <p className="text-gray-500 font-medium text-lg">Manage your account and uploaded documents.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Basic Info */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-[#f0fdf4] text-[#2D7A5D] rounded-full flex items-center justify-center text-3xl font-bold mb-4 border-2 border-green-100">
                                {profile?.name?.charAt(0) || "U"}
                            </div>
                            <h2 className="text-xl font-bold text-[#2A3B47]">{profile?.name}</h2>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1 justify-center">
                                <Mail className="w-3.5 h-3.5" /> {profile?.email}
                            </p>
                            <div className="mt-4 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 w-full flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Account Role</span>
                                <span className="text-xs font-bold text-[#2D7A5D] bg-[#f0fdf4] px-2 py-1 rounded-md border border-green-100 flex items-center gap-1">
                                    <Shield className="w-3 h-3" /> {profile?.role}
                                </span>
                            </div>
                        </div>

                        {/* Document Upload Widget */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-[#2A3B47] mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-[#2D7A5D]" /> Documents & Reports
                            </h3>

                            <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
                                <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-sm font-medium text-[#2A3B47]">Upload Profile Pic or Report</span>
                                <span className="text-xs text-gray-400 mt-1">PNG, JPG, PDF up to 10MB</span>
                                <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,.pdf" />
                            </label>

                            {uploadedFiles.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {uploadedFiles.map((f, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-lg">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            <span className="text-xs font-medium text-gray-700 truncate">{f.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Dynamic Settings */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Preferences (All Users) */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-[#2A3B47] mb-6">Account Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                    <input type="text" disabled value={profile?.name || ""} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                    <input type="email" disabled value={profile?.email || ""} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Practitioner Specific Settings */}
                        {profile?.role === "PRACTITIONER" && (
                            <div className="bg-[#f0fdf4] p-8 rounded-3xl border border-green-100">
                                <h3 className="text-xl font-bold text-[#2A3B47] mb-2">Practitioner Profile</h3>
                                <p className="text-sm text-[#2D7A5D] mb-6">Update how you appear to patients in the Consultations tab.</p>

                                <form onSubmit={handleSavePractitioner} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Specialties (comma separated)</label>
                                        <input
                                            type="text"
                                            value={specialties}
                                            onChange={(e) => setSpecialties(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2D7A5D] focus:ring-1 focus:ring-[#2D7A5D] outline-none text-sm"
                                            placeholder="e.g. Panchakarma, Dietetics"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Consultation Fee (₹)</label>
                                        <input
                                            type="number"
                                            value={fee}
                                            onChange={(e) => setFee(Number(e.target.value))}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2D7A5D] focus:ring-1 focus:ring-[#2D7A5D] outline-none text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Bio</label>
                                        <textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2D7A5D] focus:ring-1 focus:ring-[#2D7A5D] outline-none text-sm resize-none"
                                            placeholder="Describe your experience and approach to holistic health..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="mt-4 px-6 py-3 bg-[#2D7A5D] text-white rounded-xl font-bold hover:bg-[#24614A] transition-colors shadow-sm"
                                    >
                                        {saving ? "Saving..." : "Save Public Profile"}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PrakritiAILayout>
    );
}
