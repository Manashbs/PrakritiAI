"use client";

import { useEffect, useState } from "react";
import PrakritiAILayout from "@/components/PrakritiAILayout";
import { Users, Calendar as CalendarIcon, FileText, Clock, FileVideo, CheckCircle, TrendingUp, Star, Activity, Pill, Plus } from "lucide-react";
import { useMedicalMode } from "@/context/ModeContext";
import PatientDirectoryTab from "@/components/PatientDirectoryTab";
import PrescriptionEngineTab from "@/components/PrescriptionEngineTab";
import CalendarTab from "@/components/CalendarTab";

export default function PractitionerDashboard({ profile }: { profile: any }) {
    const { themeColor, themeBgHover, themeBgLight } = useMedicalMode();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Overview");
    const [activePatientForRx, setActivePatientForRx] = useState<any | null>(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/my-appointments`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    setAppointments(await res.json());
                }
            } catch (err) {
                console.error("Failed to fetch appointments:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    // Derived stats
    const today = new Date().toDateString();
    const todaysAppointments = appointments.filter(a => new Date(a.startTime).toDateString() === today);
    const upcomingAppointments = appointments.filter(a => new Date(a.startTime) >= new Date()).slice(0, 5);
    const pastAppointments = appointments.filter(a => new Date(a.startTime) < new Date());

    const tabs = ["Overview", "Calendar", "Patients", "Prescriptions"];

    return (
        <PrakritiAILayout>
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 mt-4">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-[#2A3B47] tracking-tight">
                        Namaste, Dr. {profile?.name?.split(' ')[0] || "Practitioner"}
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Here is an overview of your clinical practice today.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setActiveTab("Prescriptions")}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm border text-sm"
                        style={{ borderColor: themeColor, color: themeColor, backgroundColor: "white" }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = themeBgLight}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "white"}
                    >
                        <Pill className="w-4 h-4" />
                        Write Prescription
                    </button>
                    <button
                        onClick={() => setActiveTab("Calendar")}
                        className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md text-sm"
                        style={{ backgroundColor: themeColor }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = themeBgHover}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = themeColor}
                    >
                        <CalendarIcon className="w-4 h-4" />
                        Manage Schedule
                    </button>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-6 border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 px-1 font-bold text-sm transition-colors whitespace-nowrap border-b-2`}
                        style={{
                            color: activeTab === tab ? themeColor : "#6b7280",
                            borderColor: activeTab === tab ? themeColor : "transparent"
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Overview Tab Content */}
            {activeTab === "Overview" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Extended Quick Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                        {/* Stat 1 */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/60">
                            <div className="flex items-start justify-between">
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Today's Appts</p>
                                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: themeBgLight, color: themeColor }}>
                                    <Clock className="w-4 h-4" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-[#2A3B47] mt-2">{todaysAppointments.length}</h3>
                            <p className="text-xs text-gray-400 font-medium mt-1">2 remaining</p>
                        </div>

                        {/* Stat 2 */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/60">
                            <div className="flex items-start justify-between">
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Pending Consults</p>
                                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: themeBgLight, color: themeColor }}>
                                    <Users className="w-4 h-4" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-[#2A3B47] mt-2">{upcomingAppointments.length}</h3>
                            <p className="text-xs text-gray-400 font-medium mt-1">This week</p>
                        </div>

                        {/* Stat 3 */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/60 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/0 to-amber-100/50 rounded-bl-full pointer-events-none"></div>
                            <div className="flex items-start justify-between relative z-10">
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">AI Cases Waiting</p>
                                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                                    <Activity className="w-4 h-4" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-[#2A3B47] mt-2 relative z-10">0</h3>
                            <p className="text-xs text-amber-600 font-bold mt-1 relative z-10">Requires review</p>
                        </div>

                        {/* Stat 4 */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/60">
                            <div className="flex items-start justify-between">
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Monthly Revenue</p>
                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-50 text-green-600">
                                    <TrendingUp className="w-4 h-4" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-[#2A3B47] mt-2">₹0</h3>
                            <p className="text-xs text-green-600 font-bold mt-1">This month</p>
                        </div>

                        {/* Stat 5 */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/60">
                            <div className="flex items-start justify-between">
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Patient Rating</p>
                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-yellow-50 text-yellow-500">
                                    <Star className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="flex items-end gap-2 mt-2">
                                <h3 className="text-2xl font-serif font-bold text-[#2A3B47]">0.0</h3>
                                <span className="text-xs text-gray-400 font-medium mb-1">/ 5.0</span>
                            </div>
                        </div>

                        {/* Stat 6 */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/60">
                            <div className="flex items-start justify-between">
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Rx Conversion</p>
                                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: themeBgLight, color: themeColor }}>
                                    <Pill className="w-4 h-4" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-[#2A3B47] mt-2">0%</h3>
                            <p className="text-xs text-gray-400 font-medium mt-1">Orders placed</p>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Today's Schedule */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100/60 flex flex-col min-h-[400px]">
                            <div className="p-6 border-b border-gray-100/60 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-[#2A3B47]">Today's Consultations</h3>
                                <span className="text-sm font-bold bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{today}</span>
                            </div>

                            <div className="p-0 flex-1 flex flex-col">
                                {loading ? (
                                    <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Loading schedule...</div>
                                ) : todaysAppointments.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/50 m-6 rounded-xl border border-dashed border-gray-200">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                            <Clock className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-[#2A3B47] font-bold">No Consultations Today</h4>
                                        <p className="text-gray-500 text-sm mt-1">Enjoy your free time or manage your patient records.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-50">
                                        {todaysAppointments.map((apt, i) => (
                                            <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-[#2A3B47]">{new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    <span className="text-xs text-gray-500 font-medium">30 Min Session</span>
                                                </div>

                                                <div className="flex-1 px-8 flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: themeBgLight, color: themeColor }}>
                                                        {apt.patient?.name?.charAt(0) || "P"}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-[#2A3B47] text-sm">{apt.patient?.name || "Unknown Patient"}</h4>
                                                        <p className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate">{apt.notes || "No notes provided"}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setActiveTab("Patients")}
                                                        className="px-4 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-colors shadow-sm"
                                                        style={{ borderColor: themeBgLight, color: themeColor, backgroundColor: "white" }}
                                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = themeBgLight}
                                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "white"}
                                                    >
                                                        <FileText className="w-3.5 h-3.5" />
                                                        Profile
                                                    </button>
                                                    <button
                                                        className="px-4 py-2 text-xs font-bold rounded-xl text-white flex items-center gap-1.5 transition-colors shadow-sm"
                                                        style={{ backgroundColor: themeColor }}
                                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = themeBgHover}
                                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = themeColor}
                                                    >
                                                        <FileVideo className="w-3.5 h-3.5" />
                                                        Join Call
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Recent Patients & Actions */}
                        <div className="flex flex-col gap-6">
                            {/* AI Review Alerts */}
                            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/0 to-amber-200/50 rounded-bl-full pointer-events-none"></div>
                                <h3 className="text-lg font-bold text-amber-900 mb-2 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-amber-600" />
                                    AI Case Reviews (3)
                                </h3>
                                <p className="text-sm text-amber-800 mb-4 leading-relaxed">
                                    Patients have completed AI Triage and are awaiting your clinical verification before proceeding.
                                </p>
                                <button className="w-full bg-white text-amber-700 hover:bg-amber-100 font-bold py-2.5 rounded-xl transition-colors border border-amber-200 text-sm shadow-sm">
                                    Review AI Cases
                                </button>
                            </div>

                            {/* Recent Patients */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/60 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-[#2A3B47] mb-4">Recent Patient Records</h3>

                                <div className="space-y-4">
                                    {pastAppointments.slice(0, 4).map((apt, idx) => (
                                        <div key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50/80 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: themeBgLight, color: themeColor }}>
                                                {apt.patient?.name?.charAt(0) || "P"}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-[#2A3B47] text-sm">{apt.patient?.name || "Unknown Patient"}</h4>
                                                <p className="text-xs text-gray-500 mt-0.5">Last visited: {new Date(apt.startTime).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-gray-400">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                            </div>
                                        </div>
                                    ))}

                                    {pastAppointments.length === 0 && !loading && (
                                        <div className="text-center p-6 text-sm text-gray-400 border border-dashed border-gray-100 rounded-xl">
                                            No recent patient records.
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => setActiveTab("Patients")}
                                    className="w-full mt-auto pt-4 text-sm font-bold transition-colors text-center"
                                    style={{ color: themeColor }}
                                >
                                    View All Patients →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Calendar Tab */}
            {activeTab === "Calendar" && (
                <CalendarTab />
            )}

            {/* Patients Tab */}
            {activeTab === "Patients" && (
                <PatientDirectoryTab
                    appointments={pastAppointments}
                    onNewPrescription={(patient) => {
                        setActivePatientForRx(patient);
                        setActiveTab("Prescriptions");
                    }}
                />
            )}

            {/* Prescriptions Tab */}
            {activeTab === "Prescriptions" && (
                <PrescriptionEngineTab prefilledPatient={activePatientForRx} />
            )}

        </PrakritiAILayout>
    );
}
