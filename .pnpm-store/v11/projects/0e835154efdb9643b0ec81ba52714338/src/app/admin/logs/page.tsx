"use client";

import { useState, useEffect } from "react";
import PrakritiAILayout from "@/components/PrakritiAILayout";
import { Search, Filter, Activity, ShieldAlert, CheckCircle, Info, Download, Trash2 } from "lucide-react";
import { useMedicalMode } from "@/context/ModeContext";

export default function SystemLogs() {
    const { themeColor } = useMedicalMode();
    const [logs, setLogs] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [levelFilter, setLevelFilter] = useState("All Levels");
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/logs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setLogs(await res.json());
            }
        } catch (err) {
            console.error("Failed to fetch logs", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = levelFilter === "All Levels" || log.level === levelFilter;
        return matchesSearch && matchesLevel;
    });

    const getIconForLevel = (level: string) => {
        switch (level) {
            case 'INFO': return <Info className="w-5 h-5 text-blue-500" />;
            case 'WARNING': return <ShieldAlert className="w-5 h-5 text-amber-500" />;
            case 'ERROR': return <ShieldAlert className="w-5 h-5 text-red-500" />;
            case 'CRITICAL': return <Activity className="w-5 h-5 text-purple-600 animate-pulse" />;
            default: return <CheckCircle className="w-5 h-5 text-green-500" />;
        }
    };

    const getBgForLevel = (level: string) => {
        switch (level) {
            case 'INFO': return "bg-blue-50/50 border-blue-100";
            case 'WARNING': return "bg-amber-50/50 border-amber-100";
            case 'ERROR': return "bg-red-50/50 border-red-100";
            case 'CRITICAL': return "bg-purple-50/50 border-purple-200 shadow-sm";
            default: return "bg-gray-50/50 border-gray-100";
        }
    };

    return (
        <PrakritiAILayout>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-[#2A3B47] tracking-tight">
                        System Activity Logs
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Monitor platform events, administrative actions, and critical security alerts.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => alert("Log clearing functionality requires a super-admin password.")}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl font-bold transition-all shadow-sm hover:bg-red-50"
                    >
                        <Trash2 className="w-4 h-4" />
                        Clear Old Logs
                    </button>
                    <button
                        onClick={() => alert("Downloading logs as CSV coming soon.")}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold transition-all shadow-sm"
                        style={{ backgroundColor: themeColor }}
                    >
                        <Download className="w-4 h-4" />
                        Export to CSV
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 max-w-md relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search logs by action or details..."
                        className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-1 transition-shadow shadow-sm"
                        style={{ '--tw-ring-color': themeColor } as any}
                    />
                </div>

                <div className="flex gap-3">
                    <select
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-600 focus:outline-none focus:ring-1 shadow-sm" style={{ '--tw-ring-color': themeColor } as any}
                    >
                        <option>All Levels</option>
                        <option>INFO</option>
                        <option>WARNING</option>
                        <option>ERROR</option>
                        <option>CRITICAL</option>
                    </select>

                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
                        <Filter className="w-4 h-4" />
                        Advanced
                    </button>
                </div>
            </div>

            {/* Logs List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100/60 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest pl-8">Event Level</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Timestamp</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Action</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500 font-medium">Loading system logs...</td>
                                </tr>
                            ) : filteredLogs.length > 0 ? filteredLogs.map((log: any) => (
                                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 pl-8">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getBgForLevel(log.level)}`}>
                                            {getIconForLevel(log.level)}
                                            <span className="text-xs font-bold tracking-wide uppercase">{log.level}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-gray-700">{new Date(log.createdAt).toLocaleDateString()}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{new Date(log.createdAt).toLocaleTimeString()}</div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-[#2A3B47] text-sm">
                                        {log.action}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate" title={log.details}>
                                        {log.details}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500 font-medium">
                                        No logs found matching criteria.
                                        {logs.length === 0 && <span className="block mt-1 text-xs text-gray-400">The system log is currently empty. Activities will appear here as they occur.</span>}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-4 text-center text-xs font-bold text-gray-400">
                Displaying {filteredLogs.length} activity records.
            </div>
        </PrakritiAILayout>
    );
}
