"use client";

import { useEffect, useState } from "react";
import PrakritiAILayout from "@/components/PrakritiAILayout";
import { Star, Clock, Video } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ConsultationsPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [practitioners, setPractitioners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Booking Modal State
    const [bookingDoc, setBookingDoc] = useState<any>(null);
    const [startTime, setStartTime] = useState("");
    const [notes, setNotes] = useState("");
    const [booking, setBooking] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const [apptsRes, docsRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/my-appointments`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/practitioners`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            if (apptsRes.ok) setAppointments(await apptsRes.json());
            if (docsRes.ok) setPractitioners(await docsRes.json());
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ text: "", type: "" });
        setBooking(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/book`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    practitionerId: bookingDoc.id,
                    startTime: new Date(startTime).toISOString(),
                    notes
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to book");

            setMessage({ text: "Appointment booked successfully!", type: "success" });
            fetchData();
            setTimeout(() => {
                setBookingDoc(null);
                setMessage({ text: "", type: "" });
                setStartTime("");
                setNotes("");
            }, 2000);
        } catch (err: any) {
            setMessage({ text: err.message, type: "error" });
        } finally {
            setBooking(false);
        }
    };

    return (
        <PrakritiAILayout>
            {/* Header */}
            <header className="text-center mb-12 mt-4">
                <h1 className="text-4xl font-serif font-bold text-[#2A3B47] tracking-tight mb-3">Expert Consultations</h1>
                <p className="text-gray-500 font-medium text-lg">Connect with certified Ayurvedic practitioners and MBBS doctors.</p>
            </header>

            {/* Upcoming Appointments Banner (If any) */}
            {appointments.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-[#2A3B47] mb-4">Your Upcoming Sessions</h2>
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        {appointments.map(appt => (
                            <div key={appt.id} className="min-w-[300px] bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 shrink-0 flex flex-col justify-between shadow-sm">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-indigo-900">Dr. {appt.practitioner?.user?.name || "Unknown"}</h3>
                                        <span className="bg-indigo-100 text-indigo-700 text-[10px] uppercase tracking-wider font-bold py-1 px-2 rounded-md">
                                            {appt.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-indigo-800/70 flex items-center gap-2 mt-2 font-medium">
                                        <Clock className="w-4 h-4" />
                                        {new Date(appt.startTime).toLocaleString()}
                                    </p>
                                </div>
                                <button className="mt-4 w-full py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2">
                                    <Video className="w-4 h-4" /> Join Call
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {practitioners.map(doc => (
                    <div key={doc.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden group">

                        {/* Top Profile Area */}
                        <div className="flex items-start gap-4 mb-5">
                            <div className="w-16 h-16 rounded-full bg-gray-100 shrink-0 flex items-center justify-center overflow-hidden border border-gray-200">
                                {/* Fallback avatar */}
                                <UserAvatar name={doc.user.name} />
                            </div>
                            <div>
                                <h3 className="text-xl font-serif font-bold text-[#2A3B47]">Dr. {doc.user.name}</h3>
                                <p className="text-sm text-[#2D7A5D] font-semibold mt-0.5">{doc.specialties?.[0] || 'Ayurveda'}</p>
                                <p className="text-xs text-gray-400 mt-0.5">BAMS, MD (Ayurveda)</p>
                                <div className="flex items-center gap-1 mt-2 text-[#d97706] text-xs font-bold">
                                    <Star className="w-3.5 h-3.5 fill-[#d97706]" />
                                    <span>15 Years Exp.</span>
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                            {doc.bio || "Expert in holistic wellness and lifestyle disorders."}
                        </p>

                        {/* Footer / Action */}
                        <div className="border-t border-gray-100 pt-5 mt-auto flex items-center justify-between">
                            <div>
                                <span className="text-xl font-bold text-[#2A3B47]">₹{doc.consultationFee}</span>
                                <span className="text-xs text-gray-400 font-medium ml-1">/ session</span>
                            </div>
                            <button
                                onClick={() => setBookingDoc(doc)}
                                className="px-6 py-2.5 bg-[#2D7A5D] text-white text-sm font-semibold rounded-xl hover:bg-[#24614A] transition-colors shadow-sm"
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                ))}

            </div>

            {/* Booking Modal */}
            {bookingDoc && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setBookingDoc(null); }}>
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-[#f0fdf4] p-6 border-b border-green-100">
                            <h2 className="text-2xl font-serif font-bold text-[#2A3B47]">Book Session</h2>
                            <p className="text-sm text-[#2D7A5D] font-medium mt-1">with Dr. {bookingDoc.user.name}</p>
                        </div>

                        <form onSubmit={handleBook} className="p-6">
                            {message.text && (
                                <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {message.text}
                                </div>
                            )}

                            <label className="block text-sm font-bold text-gray-700 mb-2">Select Date & Time</label>
                            <input
                                required
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2D7A5D] focus:ring-1 focus:ring-[#2D7A5D] outline-none mb-4 text-sm bg-gray-50"
                            />

                            <label className="block text-sm font-bold text-gray-700 mb-2">Health Context (Optional)</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2D7A5D] focus:ring-1 focus:ring-[#2D7A5D] outline-none mb-6 text-sm bg-gray-50 resize-none"
                                placeholder="Any specific symptoms or goals..."
                            />

                            <div className="flex gap-3">
                                <button type="button" onClick={() => setBookingDoc(null)} className="flex-1 py-3 px-4 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={booking || !startTime} className="flex-1 py-3 px-4 rounded-xl bg-[#2D7A5D] text-white font-bold hover:bg-[#24614A] transition-colors disabled:opacity-50">
                                    {booking ? "Confirming..." : `Pay ₹${bookingDoc.consultationFee}`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PrakritiAILayout>
    );
}

// Helpers
function UserAvatar({ name }: { name: string }) {
    return <span className="text-2xl font-bold text-gray-400">{name.charAt(0)}</span>;
}

