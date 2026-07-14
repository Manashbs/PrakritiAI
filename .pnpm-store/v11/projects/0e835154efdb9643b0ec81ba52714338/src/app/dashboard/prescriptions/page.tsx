"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, FileText, Pill, Stethoscope, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Prescription {
    id: string;
    createdAt: string;
    lifestyle: string;
    practitioner: {
        user: { name: string };
    };
    medicines: {
        id: string;
        name: string;
        dosage: string;
        frequency: string;
        timing: string;
        duration: string;
    }[];
}

export default function PatientPrescriptions() {
    const router = useRouter();
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/prescriptions/patient`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            setPrescriptions(data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Failed to load prescriptions", err);
            setLoading(false);
        });
    }, [router]);

    if (loading) {
        return <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500">Loading Prescriptions...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900">My Medical Records</h1>
                        <p className="text-gray-500">View your historical teleconsultation notes and digital prescriptions</p>
                    </div>
                </div>

                {prescriptions.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900">No Prescriptions Found</h3>
                        <p className="text-gray-500">You haven't had any teleconsultations resulting in a prescription yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {prescriptions.map((px) => (
                            <div key={px.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-[#1A2F25] p-5 text-white flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/10 rounded-lg">
                                            <Stethoscope className="w-5 h-5 text-[#4ade80]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold">Dr. {px.practitioner.user.name}</h3>
                                            <div className="flex items-center gap-1 text-sm text-gray-300 mt-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(px.createdAt).toLocaleDateString()} at {new Date(px.createdAt).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 bg-[#2D7A5D] text-[10px] font-bold uppercase tracking-widest rounded-full">
                                        Verified
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    {px.lifestyle && (
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <FileText className="w-4 h-4" />
                                                Clinical Notes & Lifestyle
                                            </h4>
                                            <p className="text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm leading-relaxed">
                                                {px.lifestyle}
                                            </p>
                                        </div>
                                    )}

                                    {px.medicines.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <Pill className="w-4 h-4" />
                                                Prescribed Payload
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {px.medicines.map((med) => (
                                                    <div key={med.id} className="border border-gray-100 rounded-xl p-4 flex flex-col hover:border-[#2D7A5D]/30 transition-colors">
                                                        <span className="font-bold text-gray-900 mb-1">{med.name}</span>
                                                        <div className="flex flex-col gap-1 text-xs text-gray-500 font-medium">
                                                            <span>• Dosage: {med.dosage}</span>
                                                            <span>• Freq: {med.frequency}</span>
                                                            <span>• Timing: {med.timing}</span>
                                                            <span>• Duration: {med.duration}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
