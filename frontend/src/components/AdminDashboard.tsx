"use client";

import { useState, useEffect } from "react";
import PrakritiAILayout from "@/components/PrakritiAILayout";
import { Users, Activity, CheckCircle, Clock, TrendingUp, IndianRupee, Sparkles, Pill, Heart, XCircle, ArrowUp, ArrowDown } from "lucide-react";
import { useMedicalMode } from "@/context/ModeContext";

export default function AdminDashboard({ profile }: { profile: any }) {
    const { themeColor, themeBgLight } = useMedicalMode();
    const [kpis, setKpis] = useState<any>(null);
    const [timeframe, setTimeframe] = useState<string>('all_time');

    useEffect(() => {
        const fetchKpis = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/kpis?timeframe=${timeframe}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    setKpis(await res.json());
                }
            } catch (err) {
                console.error("Failed to fetch KPIs", err);
            }
        };
        fetchKpis();
    }, [timeframe]);

    return (
        <PrakritiAILayout>
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-[#2A3B47] tracking-tight">
                        Executive Overview
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Platform KPIs and performance metrics.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setTimeframe('today')} className={`border px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm transition-colors ${timeframe === 'today' ? 'bg-white border-gray-200 text-[#2A3B47]' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'}`}>Today</button>
                    <button onClick={() => setTimeframe('month')} className={`border px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm transition-colors ${timeframe === 'month' ? 'bg-white border-gray-200 text-[#2A3B47]' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'}`}>This Month</button>
                    <button onClick={() => setTimeframe('all_time')} className={`border px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm transition-colors ${timeframe === 'all_time' ? 'bg-white border-gray-200 text-[#2A3B47]' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'}`}>All Time</button>
                </div>
            </header>

            {/* Core KPIs - Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/60 transition-transform hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50 text-blue-600">
                            <Users className="w-5 h-5" />
                        </div>
                        <span className="flex items-center text-green-600 text-xs font-bold gap-1 bg-green-50 px-2 py-1 rounded-md">
                            <ArrowUp className="w-3 h-3" /> 12%
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Active Users</p>
                    <div className="flex items-end gap-2 mt-1">
                        <h3 className="text-3xl font-serif font-bold text-[#2A3B47]">{kpis?.totalUsers || "0"}</h3>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/60 transition-transform hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-50 text-green-600">
                            <IndianRupee className="w-5 h-5" />
                        </div>
                        <span className="flex items-center text-green-600 text-xs font-bold gap-1 bg-green-50 px-2 py-1 rounded-md">
                            <ArrowUp className="w-3 h-3" /> 8.4%
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Revenue</p>
                    <h3 className="text-3xl font-serif font-bold text-[#2A3B47] mt-1">₹{kpis?.totalRevenue || "0"}</h3>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/60 transition-transform hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-amber-100/50 to-transparent rounded-full pointer-events-none"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-50 text-amber-600">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <span className="flex items-center text-green-600 text-xs font-bold gap-1 bg-green-50 px-2 py-1 rounded-md">
                            <ArrowUp className="w-3 h-3" /> 24%
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider relative z-10">AI Diagnoses</p>
                    <h3 className="text-3xl font-serif font-bold text-[#2A3B47] mt-1 relative z-10">{kpis?.totalAiDiagnoses || "0"}</h3>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/60 transition-transform hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-50 text-purple-600">
                            <Heart className="w-5 h-5" />
                        </div>
                        <span className="flex items-center text-gray-500 text-xs font-bold gap-1 bg-gray-50 px-2 py-1 rounded-md">
                            0%
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Free → Paid Conversion</p>
                    <h3 className="text-3xl font-serif font-bold text-[#2A3B47] mt-1">{kpis?.conversionRate || "0"}%</h3>
                </div>
            </div>

            {/* Core KPIs - Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/60 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 text-gray-600 shrink-0">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Consultations</p>
                        <h4 className="text-xl font-bold text-[#2A3B47]">{kpis?.totalConsultations || "0"}</h4>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/60 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 text-gray-600 shrink-0">
                        <XCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Cancellation Rate</p>
                        <h4 className="text-xl font-bold text-[#2A3B47]">{kpis?.cancellationRate || "0"}%</h4>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/60 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 text-gray-600 shrink-0">
                        <Pill className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Medicine Sales (GMV)</p>
                        <h4 className="text-xl font-bold text-[#2A3B47]">₹{kpis?.medicineSales || "0"}</h4>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/60 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 text-gray-600 shrink-0">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Subscriptions</p>
                        <h4 className="text-xl font-bold text-[#2A3B47]">{kpis?.subscriptions || "0"}</h4>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100/60 p-6 flex flex-col min-h-[400px]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-[#2A3B47]">Revenue & Consultation Trends</h3>
                        <div className="flex gap-2 text-xs font-bold text-gray-500">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></span> Revenue</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border-2" style={{ borderColor: themeColor }}></span> Consults</span>
                        </div>
                    </div>
                    {/* Chart Area */}
                    <div className="flex-1 border-b border-l border-gray-100 relative flex items-end justify-between px-4 pt-10 pb-0 gap-4 mt-8">
                        {kpis?.chartData ? kpis.chartData.map((data: any, i: number) => (
                            <div key={i} className="w-full flex justify-center pb-2 items-end gap-1 relative group h-full">
                                <div className="w-full max-w-[20px] rounded-t-sm transition-all group-hover:opacity-80" style={{ height: `${data.revenuePercent}%`, backgroundColor: themeColor }}></div>
                                <div className="w-full max-w-[20px] rounded-t-sm transition-all opacity-40" style={{ height: `${data.consultsPercent}%`, backgroundColor: themeColor }}></div>
                                {/* Tooltip */}
                                <div className="absolute -top-10 z-20 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap transition-opacity pointer-events-none">
                                    ₹{data.revenue} | {data.consults} Consults
                                </div>
                            </div>
                        )) : (
                            <div className="w-full text-center text-gray-400 text-sm mt-auto mb-10">No chart data available</div>
                        )}
                    </div>
                    <div className="flex justify-between px-4 mt-3 text-[10px] font-bold text-gray-400 uppercase">
                        {kpis?.chartData ? kpis.chartData.map((d: any, i: number) => <span key={i}>{d.label}</span>) : <span></span>}
                    </div>
                </div>

                {/* Right Column Charts */}
                <div className="flex flex-col gap-6">
                    {/* AI Accuracy */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/60 flex-1">
                        <h3 className="text-lg font-bold text-[#2A3B47] mb-2 flex items-center gap-2">
                            AI Diagnostic Accuracy
                        </h3>
                        <p className="text-xs text-gray-400 mb-6">Based on doctor verifications</p>

                        <div className="flex items-center justify-center relative my-4">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle cx="64" cy="64" r="56" stroke="CurrentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                                <circle cx="64" cy="64" r="56" stroke="CurrentColor" strokeWidth="12" fill="transparent" strokeDasharray="351.8" strokeDashoffset={351.8 - (351.8 * 89) / 100} className="text-green-500 rounded-full" />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center">
                                <span className="text-3xl font-serif font-bold text-[#2A3B47]">{kpis?.aiAccuracy || "0"}%</span>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4 text-xs font-bold text-gray-500 mt-4">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Verified</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-200"></span> Corrected</span>
                        </div>
                    </div>

                    {/* Top Diseases */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/60 flex-1">
                        <h3 className="text-lg font-bold text-[#2A3B47] mb-4">Top Diagnoses</h3>
                        <div className="space-y-4">
                            {kpis?.topDiagnoses && kpis.topDiagnoses.length > 0 ? kpis.topDiagnoses.map((diag: any, i: number) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs font-bold mb-1"><span className="text-gray-700">{diag.name}</span> <span className="text-gray-500">{diag.percentage}%</span></div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full"><div className={`h-2 rounded-full ${i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${diag.percentage}%` }}></div></div>
                                </div>
                            )) : (
                                <div className="text-sm text-gray-400">No diagnoses recorded.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Doctor Performance Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100/60 overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-100/60 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#2A3B47]">Top Performing Doctors</h3>
                    <button className="text-sm font-bold" style={{ color: themeColor }}>View All →</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest pl-8">Doctor</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Consultations</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Revenue Generated</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Avg Rating</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">AI Sync Rate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {kpis?.topDoctors && kpis.topDoctors.length > 0 ? kpis.topDoctors.map((doc: any, i: number) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 pl-8 font-bold text-[#2A3B47]">{doc.name}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{doc.consultations}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-green-600">₹{doc.revenue}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                                            {doc.rating} <span className="text-[10px] text-gray-400 font-medium">({doc.reviews} reviews)</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">{doc.aiMatch}% Match</span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">No top doctors data available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </PrakritiAILayout>
    );
}
