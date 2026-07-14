"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Clock, Settings, RefreshCw, Bell, AlertCircle, MapPin, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useMedicalMode } from "@/context/ModeContext";

export default function CalendarTab() {
    const { themeColor, themeBgHover, themeBgLight } = useMedicalMode();
    const [view, setView] = useState("Week"); // Day, Week, Month

    // Mock slots for the week view
    const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];
    const days = ["Mon 23", "Tue 24", "Wed 25", "Thu 26", "Fri 27"];

    return (
        <div className="animate-in fade-in flex flex-col lg:flex-row gap-6">

            {/* Left Column - Main Calendar Area */}
            <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100/60 flex flex-col min-h-[600px] overflow-hidden">
                {/* Header controls */}
                <div className="p-6 border-b border-gray-100/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-100">
                            <button className="p-1.5 hover:bg-white rounded-lg shadow-sm transition-all text-gray-400 hover:text-gray-900"><ChevronLeft className="w-5 h-5" /></button>
                            <span className="font-bold text-sm px-2 text-[#2A3B47]">October 2023</span>
                            <button className="p-1.5 hover:bg-white rounded-lg shadow-sm transition-all text-gray-400 hover:text-gray-900"><ChevronRight className="w-5 h-5" /></button>
                        </div>
                        <button
                            className="px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm border"
                            style={{ backgroundColor: "white", color: themeColor, borderColor: themeBgLight }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = themeBgLight}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "white"}
                        >
                            Today
                        </button>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
                        {["Day", "Week", "Month"].map(v => (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${view === v ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Calendar Grid (Week View Mock) */}
                <div className="flex-1 overflow-x-auto bg-gray-50/30">
                    <div className="min-w-[700px] h-full flex flex-col">
                        {/* Day Headers */}
                        <div className="grid grid-cols-6 border-b border-gray-100 bg-white">
                            <div className="p-4 border-r border-gray-100 text-center text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center">Time</div>
                            {days.map(d => (
                                <div key={d} className={`p-4 border-r border-gray-100 text-center ${d === 'Tue 24' ? 'bg-blue-50/30' : ''}`}>
                                    <span className={`text-sm font-bold ${d === 'Tue 24' ? 'text-blue-600' : 'text-[#2A3B47]'}`}>{d}</span>
                                </div>
                            ))}
                        </div>

                        {/* Time Grid */}
                        <div className="flex-1 overflow-y-auto max-h-[500px] relative">
                            {timeSlots.map(time => (
                                <div key={time} className="grid grid-cols-6 border-b border-gray-100/50 min-h-[80px]">
                                    <div className="border-r border-gray-100 p-2 text-right text-xs text-gray-400 font-medium bg-white">{time}</div>
                                    <div className="border-r border-gray-100/50 p-1 group relative cursor-pointer hover:bg-gray-100/50 transition-colors"></div>
                                    <div className="border-r border-gray-100/50 p-1 group relative cursor-pointer hover:bg-gray-100/50 transition-colors bg-blue-50/10">

                                    </div>
                                    <div className="border-r border-gray-100/50 p-1 group relative cursor-pointer hover:bg-gray-100/50 transition-colors"></div>
                                    <div className="border-r border-gray-100/50 p-1 group relative cursor-pointer hover:bg-gray-100/50 transition-colors">
                                        {/* Blocked Slot */}
                                        {time === "01:00 PM" && (
                                            <div className="absolute inset-1 rounded-lg p-2 bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-400 opacity-70">
                                                Lunch Break
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-1 group relative cursor-pointer hover:bg-gray-100/50 transition-colors"></div>
                                </div>
                            ))}

                            {/* Current Time Indicator Line (Mock) */}
                            <div className="absolute left-0 right-0 top-[180px] h-0 border-b-2 border-red-500 z-20 pointer-events-none">
                                <div className="absolute -left-1 -top-1.5 w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="absolute left-2 -top-4 text-[10px] font-bold text-red-500 bg-white px-1">11:15 AM</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column - Controls & Settings */}
            <div className="w-full lg:w-80 flex flex-col gap-6">

                {/* Availability Rules box */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100/60 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-[#2A3B47] flex items-center gap-2">
                            <Settings className="w-4 h-4 text-gray-400" />
                            Slot Availability
                        </h3>
                        <button className="text-[10px] uppercase tracking-widest font-bold" style={{ color: themeColor }}>Edit</button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 font-medium">Monday - Friday</span>
                            <span className="font-bold text-[#2A3B47]">09:00 - 17:00</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 font-medium">Saturday</span>
                            <span className="font-bold text-[#2A3B47]">10:00 - 14:00</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400 font-medium line-through">Sunday</span>
                            <span className="font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded text-xs">OFF</span>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                            <p className="text-xs text-gray-500 font-medium">Time Zone: <span className="font-bold text-[#2A3B47]">Asia/Kolkata (IST)</span></p>
                        </div>
                    </div>
                </div>

                {/* Automation & Reminders */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100/60 p-5">
                    <h3 className="text-sm font-bold text-[#2A3B47] flex items-center gap-2 mb-4">
                        <Bell className="w-4 h-4 text-blue-500" />
                        Automations
                    </h3>

                    <div className="space-y-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <div className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full bg-blue-500">
                                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition border border-black/10 translate-x-4" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-[#2A3B47]">Auto-Reminders</p>
                                <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">Send WhatsApp/SMS to patients 24h & 1h prior.</p>
                            </div>
                        </label>

                        <div className="pt-2"></div>

                        <label className="flex items-start gap-3 cursor-pointer">
                            <div className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full bg-blue-500">
                                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition border border-black/10 translate-x-4" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-[#2A3B47]">Recurring Rules</p>
                                <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">Map availability automatically week-to-week.</p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Cancellation & Policies */}
                <div className="bg-red-50/50 rounded-2xl shadow-sm border border-red-100 p-5 flex-1">
                    <h3 className="text-sm font-bold text-red-900 flex items-center gap-2 mb-3">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        Cancellation Rules
                    </h3>
                    <p className="text-xs text-red-700 leading-relaxed font-medium mb-4">
                        Patients cannot cancel or reschedule within <span className="font-bold underline">12 hours</span> of the appointment start time without penalty.
                    </p>
                    <button className="w-full py-2 bg-white text-red-600 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors shadow-sm">
                        Configure Policy
                    </button>
                </div>
            </div>
        </div>
    );
}
