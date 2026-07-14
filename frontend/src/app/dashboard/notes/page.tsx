"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, NotebookPen, Stethoscope, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface DoctorNote {
    id: string;
    content: string;
    createdAt: string;
    isVisibleToPatient: boolean;
    practitioner: {
        user: { name: string };
    };
}

export default function PatientNotesPage() {
    const router = useRouter();
    const [notes, setNotes] = useState<DoctorNote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctor-notes/my-notes`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => { setNotes(data); setLoading(false); })
        .catch(() => setLoading(false));
    }, [router]);

    if (loading) return <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900">Doctor's Notes</h1>
                        <p className="text-gray-500">Clinical notes left by your practitioners after each consultation</p>
                    </div>
                </div>

                {notes.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                        <NotebookPen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900">No Notes Yet</h3>
                        <p className="text-gray-500">Your doctor hasn't written any notes for you yet.</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {notes.map(note => (
                            <div key={note.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-[#1A2F25] p-4 flex items-center justify-between text-white">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/10 rounded-xl">
                                            <Stethoscope className="w-5 h-5 text-[#4ade80]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm">Dr. {note.practitioner.user.name}</h3>
                                            <p className="text-gray-400 text-xs mt-0.5">{new Date(note.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                        {note.isVisibleToPatient ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                        {note.isVisibleToPatient ? "Visible" : "Private"}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{note.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
