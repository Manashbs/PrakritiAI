"use client";

import { useState, useEffect } from "react";
import PrakritiAILayout from "@/components/PrakritiAILayout";
import { Search, Filter, Calendar as CalendarIcon, Clock, User, XCircle, ArrowRight, Video, AlertTriangle, Trash2 } from "lucide-react";
import { useMedicalMode } from "@/context/ModeContext";

export default function AdminConsultations() {
    const { themeColor } = useMedicalMode();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Statuses");

    const fetchAppointments = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/consultations`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setAppointments(await res.json());
            }
        } catch (err) {
            console.error("Failed to fetch consultations", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleCancelConsultation = async (id: string) => {
        if (!confirm("Are you sure you want to force cancel this consultation?")) return;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/consultations/${id}/cancel`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) fetchAppointments();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteConsultation = async (id: string) => {
        if (!confirm("Are you sure you want to PERMANENTLY delete this consultation log?")) return;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/consultations/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) fetchAppointments();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredAppointments = appointments.filter(apt => {
        const matchesSearch = apt.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.id?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All Statuses" || apt.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    return (
        <PrakritiAILayout>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-[#2A3B47] tracking-tight">
                        Platform Consultations
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Monitor all scheduled, ongoing, and past appointments.
                    </p>
                </div>
                <button
                    onClick={() => alert("Emergency Override Protocol initiated. (Coming Soon)")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold transition-all shadow-sm cursor-pointer"
                    style={{ backgroundColor: themeColor }}
                >
                    <AlertTriangle className="w-4 h-4" />
                    Emergency Override
                </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 max-w-sm relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by Patient or Doctor ID/Name..."
                        className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-1 transition-shadow shadow-sm"
                        style={{ '--tw-ring-color': themeColor } as any}
                    />
                </div>

                <div className="flex gap-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-600 focus:outline-none focus:ring-1 shadow-sm" style={{ '--tw-ring-color': themeColor } as any}
                    >
                        <option>All Statuses</option>
                        <option>SCHEDULED</option>
                        <option>COMPLETED</option>
                        <option>CANCELLED</option>
                    </select>

                    <button onClick={() => alert("Advanced filtering is currently disabled.")} className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
                        <Filter className="w-4 h-4" />
                        More Filters
                    </button>
                </div>
            </div>

            {/* List Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100/60 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest pl-8">Consultation ID / Time</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Doctor</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Patient</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Type & Fee</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-right pr-6">Admin Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredAppointments.length > 0 ? filteredAppointments.map((apt: any) => (
                                <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 pl-8">
                                        <div className="text-xs font-bold text-gray-400 mb-0.5">APT-2049{apt.id}</div>
                                        <div className="flex items-center gap-1.5 text-sm font-bold text-[#2A3B47]">
                                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                                            {new Date(apt.date).toLocaleDateString()}
                                            <span className="text-gray-300 mx-1">|</span>
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">{apt.doctorName.charAt(4)}</div>
                                            <span className="font-bold text-[#2A3B47] text-sm">{apt.doctorName}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-xs shrink-0">{apt.patientName.charAt(0)}</div>
                                            <span className="font-bold text-[#2A3B47] text-sm">{apt.patientName}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                            {apt.type === 'Video Consult' ? <Video className="w-3.5 h-3.5 text-gray-400" /> : <User className="w-3.5 h-3.5 text-gray-400" />}
                                            {apt.type}
                                        </div>
                                        <div className="text-xs font-bold text-green-600 mt-0.5">{apt.amount}</div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${apt.status === 'SCHEDULED' ? 'bg-blue-50 text-blue-700 border-blue-100' : apt.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                            {apt.status}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-right pr-6 flex justify-end items-center gap-2">
                                        {apt.status === 'SCHEDULED' && (
                                            <button onClick={() => handleCancelConsultation(apt.id)} className="p-2 text-gray-400 hover:text-orange-500 bg-white border border-gray-200 rounded-lg shadow-sm transition-colors cursor-pointer" title="Force Cancel">
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        )}
                                        {apt.status === 'COMPLETED' && (
                                            <button onClick={() => alert("View doctor notes requires a dedicated route.")} className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold rounded-lg transition-colors border border-gray-200 cursor-pointer">
                                                View Notes
                                            </button>
                                        )}
                                        <button onClick={() => handleDeleteConsultation(apt.id)} className="p-2 text-gray-400 hover:text-white hover:bg-red-500 bg-white border border-gray-200 rounded-lg shadow-sm transition-colors cursor-pointer" title="Delete Log">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 font-medium">No consultations found matching your search and filter.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-4 text-center text-xs font-bold text-gray-400">
                Showing {filteredAppointments.length} recent consultations across the platform.
            </div>
        </PrakritiAILayout>
    );
}
