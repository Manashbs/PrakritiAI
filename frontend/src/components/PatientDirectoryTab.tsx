"use client";

import { useState } from "react";
import { Users, Search, Filter, Plus, FileText, Activity, Pill, CheckCircle, Clock, UploadCloud, ChevronRight, Share2 } from "lucide-react";
import { useMedicalMode } from "@/context/ModeContext";

export default function PatientDirectoryTab({ appointments = [], onNewPrescription }: { appointments?: any[], onNewPrescription?: (patient: any) => void }) {
    const { themeColor, themeBgHover, themeBgLight } = useMedicalMode();
    const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

    // Derive unique patients from appointments
    const uniquePatientsMap = new Map();
    appointments.forEach(apt => {
        if (apt.patient) {
            uniquePatientsMap.set(apt.patient.email || apt.patient.name, {
                id: apt.patient.id || "N/A",
                name: apt.patient.name,
                email: apt.patient.email,
                lastVisit: new Date(apt.startTime).toLocaleDateString(),
                age: "N/A",
                gender: "Unspecified",
                dosha: "N/A",
                status: apt.patient.status || "Active"
            });
        }
    });

    const patients = Array.from(uniquePatientsMap.values());

    if (selectedPatient) {
        return (
            <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                {/* Back Button */}
                <button
                    onClick={() => setSelectedPatient(null)}
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 mb-6 transition-colors"
                >
                    ← Back to Directory
                </button>

                {/* Patient Header */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/60 mb-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl shadow-inner border-2 border-white" style={{ backgroundColor: themeBgLight, color: themeColor }}>
                            {selectedPatient.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-[#2A3B47] mb-1">{selectedPatient.name}</h2>
                            <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-gray-500">
                                <span>{selectedPatient.age} Yrs, {selectedPatient.gender}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                <span>ID: PRK-{selectedPatient.id}2049</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                <span className="px-2 py-0.5 rounded-md border" style={{ color: themeColor, borderColor: themeBgLight, backgroundColor: themeBgLight }}>
                                    {selectedPatient.dosha} Dominant
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors tooltip-trigger" title="Share Record">
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => onNewPrescription && onNewPrescription(selectedPatient)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold transition-all shadow-sm"
                            style={{ backgroundColor: themeColor }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = themeBgHover}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = themeColor}
                        >
                            <Pill className="w-4 h-4" />
                            New Prescription
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Medical Records & SOAP */}
                    <div className="lg:col-span-2 flex flex-col gap-6">

                        {/* Clinical Notes (SOAP Format) */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/60">
                            <h3 className="text-lg font-bold text-[#2A3B47] mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-gray-400" />
                                Add Clinical Note (SOAP)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">S: Subjective</label>
                                    <textarea className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 transition-all resize-none" style={{ '--tw-ring-color': themeColor } as any} rows={3} placeholder="Patient's complaints..."></textarea>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">O: Objective</label>
                                    <textarea className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 transition-all resize-none" style={{ '--tw-ring-color': themeColor } as any} rows={3} placeholder="Vitals, physical wrap..."></textarea>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">A: Assessment</label>
                                    <textarea className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 transition-all resize-none" style={{ '--tw-ring-color': themeColor } as any} rows={3} placeholder="Diagnosis..."></textarea>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">P: Plan</label>
                                    <textarea className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 transition-all resize-none" style={{ '--tw-ring-color': themeColor } as any} rows={3} placeholder="Treatment plan..."></textarea>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    className="px-6 py-2.5 rounded-xl text-white font-bold text-sm transition-all"
                                    style={{ backgroundColor: themeColor }}
                                >
                                    Save Note
                                </button>
                            </div>
                        </div>

                        {/* AI Diagnosis History & Consults */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/60">
                            <h3 className="text-lg font-bold text-[#2A3B47] mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-amber-500" />
                                AI Diagnosis History
                            </h3>
                            <div className="border border-amber-100 bg-amber-50/30 rounded-2xl p-4 flex gap-4">
                                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-bold text-gray-900 text-sm">Pre-Consultation Triage</h4>
                                        <span className="text-xs font-bold text-gray-500">Oct 24, 2023</span>
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed max-w-2xl mb-3">
                                        Patient reported severe acid reflux and irregular sleep. AI assessed strong Pitta aggravation.
                                        Recommended checking for dietary triggers.
                                    </p>
                                    <div className="flex gap-2">
                                        <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-md border border-amber-200">Confidence: 89%</span>
                                        <span className="text-xs font-bold text-gray-600 bg-white px-2 py-1 rounded-md border border-gray-200">View Sources</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Labs, Progress & Reminders */}
                    <div className="flex flex-col gap-6">

                        {/* Lab Uploads */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100/60 overflow-hidden">
                            <div className="p-5 border-b border-gray-100/60 flex items-center justify-between">
                                <h3 className="text-base font-bold text-[#2A3B47]">Lab Reports</h3>
                                <button className="text-xs font-bold text-gray-500 hover:text-gray-900">View All</button>
                            </div>
                            <div className="p-5">
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors mb-4">
                                    <UploadCloud className="w-6 h-6 text-gray-400 mb-2" />
                                    <p className="text-sm font-bold text-[#2A3B47]">Upload Report</p>
                                    <p className="text-xs text-gray-500 mt-1">PDF, JPG up to 10MB</p>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer">
                                    <div className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm text-[#2A3B47]">Blood Test (CBC)</h4>
                                        <p className="text-xs text-gray-500">Oct 10, 2023 • 2.4 MB</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Follow up Reminders */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100/60 p-5">
                            <h3 className="text-base font-bold text-[#2A3B47] mb-4">Upcoming Reminders</h3>
                            <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                                <Clock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-sm text-[#2A3B47]">Dietary Check-in</h4>
                                    <p className="text-xs text-gray-600 mt-1">Automatic SMS reminder scheduled for Nov 01 to check on strict Pitta-pacifying diet.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in flex flex-col min-h-[500px]">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="relative max-w-md w-full">
                    <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search patients by name, ID, or phone..."
                        className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-1 transition-shadow shadow-sm"
                        style={{ '--tw-ring-color': themeColor } as any}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                    <button
                        className="flex items-center gap-2 px-4 py-3 text-white rounded-xl text-sm font-bold transition-all shadow-sm"
                        style={{ backgroundColor: themeColor }}
                    >
                        <Plus className="w-4 h-4" />
                        New Patient
                    </button>
                </div>
            </div>

            {/* Patients Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100/60 overflow-hidden flex-1">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest pl-8">Patient Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">ID / Demographics</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Prakriti (Dosha)</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Last Visit</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {patients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedPatient(patient)}>
                                    <td className="px-6 py-4 pl-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: themeBgLight, color: themeColor }}>
                                                {patient.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-[#2A3B47]">{patient.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-700">PRK-{patient.id}2049</div>
                                        <div className="text-xs text-gray-500">{patient.age} Yrs • {patient.gender}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 text-xs font-bold rounded-lg border bg-gray-50 border-gray-200 text-gray-700 inline-block">
                                            {patient.dosha}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-700 font-medium">{patient.lastVisit}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-2 h-2 rounded-full ${patient.status === 'Active Treatment' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                            <span className="text-sm text-gray-600 font-medium">{patient.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right pr-8">
                                        <button className="p-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-gray-900 bg-white shadow-sm border border-gray-100 rounded-lg">
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-4 text-center text-xs font-bold text-gray-400">
                Showing {patients.length} of {patients.length} patients
            </div>
        </div>
    );
}
