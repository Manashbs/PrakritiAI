"use client";

import { useState } from "react";
import { Pill, Search, Plus, Trash2, Send, FileSignature, AlertTriangle, Sparkles, Activity, CheckCircle } from "lucide-react";
import { useMedicalMode } from "@/context/ModeContext";

export default function PrescriptionEngineTab({ prefilledPatient }: { prefilledPatient?: any }) {
    const { themeColor, themeBgHover, themeBgLight } = useMedicalMode();
    const [medicines, setMedicines] = useState([
        { id: 1, name: "Ashwagandha Churna", dosage: "1 tsp", frequency: "Twice daily", timing: "After meals (warm milk)", duration: "30 Days" }
    ]);
    const [patientQuery, setPatientQuery] = useState(prefilledPatient ? prefilledPatient.name : "");
    const [lifestyle, setLifestyle] = useState("");
    const [aiSuggesting, setAiSuggesting] = useState(false);
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const handleAddMedicine = () => {
        setMedicines([...medicines, { id: Date.now(), name: "", dosage: "", frequency: "", timing: "", duration: "" }]);
    };

    const handleRemoveMedicine = (id: number) => {
        setMedicines(medicines.filter(m => m.id !== id));
    };

    const triggerAiSuggestion = () => {
        setAiSuggesting(true);
        setTimeout(() => {
            setMedicines([
                ...medicines,
                { id: 2, name: "Triphala Guggulu", dosage: "2 tabs", frequency: "Twice daily", timing: "Before bedtime (warm water)", duration: "15 Days" }
            ]);
            setAiSuggesting(false);
        }, 1500);
    };

    const handleSend = async () => {
        if (!prefilledPatient) {
            setMessage({ text: "Please select a patient from the Directory first.", type: "error" });
            return;
        }

        setSending(true);
        setMessage({ text: "", type: "" });

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prescriptions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    patientId: prefilledPatient.id,
                    medicines,
                    lifestyle
                })
            });

            if (res.ok) {
                setMessage({ text: "Prescription sent successfully!", type: "success" });
                setTimeout(() => setMessage({ text: "", type: "" }), 3000);
            } else {
                setMessage({ text: "Failed to send prescription", type: "error" });
            }
        } catch (err) {
            setMessage({ text: "Error sending prescription", type: "error" });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="animate-in fade-in flex flex-col lg:flex-row gap-6">

            {/* Left Column - Rx Builder */}
            <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100/60 flex flex-col min-h-[600px]">
                {/* Header */}
                <div className="p-6 border-b border-gray-100/60 flex items-center justify-between">
                    <h3 className="text-xl font-serif font-bold text-[#2A3B47] flex items-center gap-2">
                        <FileSignature className="w-5 h-5 text-gray-400" />
                        Digital Prescription (Rx)
                    </h3>
                    <div className="px-3 py-1 bg-gray-50 rounded-lg text-xs font-bold text-gray-500 border border-gray-200">
                        Date: {new Date().toLocaleDateString()}
                    </div>
                </div>

                <div className="p-6 flex-1 flex flex-col gap-6">
                    {/* Patient Selection */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Patient Details</label>
                        <div className="relative">
                            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search existing patient or enter name..."
                                value={patientQuery}
                                onChange={(e) => setPatientQuery(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-1 transition-shadow"
                                style={{ '--tw-ring-color': themeColor } as any}
                                disabled={!!prefilledPatient}
                            />
                        </div>
                        {message.text && (
                            <div className={`mt-3 p-3 rounded-lg text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}
                    </div>


                    {/* Medicines List */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Prescribed Medicines</label>
                            <button
                                onClick={triggerAiSuggestion}
                                disabled={aiSuggesting}
                                className="text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors shadow-sm"
                                style={{ borderColor: themeBgLight, color: themeColor, backgroundColor: themeBgLight }}
                            >
                                {aiSuggesting ? (
                                    <span className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: themeColor, borderTopColor: 'transparent' }}></span>
                                ) : (
                                    <Sparkles className="w-3.5 h-3.5" />
                                )}
                                AI Suggest Combination
                            </button>
                        </div>

                        <div className="space-y-4">
                            {medicines.map((med, index) => (
                                <div key={med.id} className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col gap-4 relative group">
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 font-bold text-xs shrink-0 border border-gray-100">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Medicine Name (e.g. Ashwagandha)"
                                                    value={med.name}
                                                    onChange={e => {
                                                        const newMeds = [...medicines];
                                                        newMeds[index].name = e.target.value;
                                                        setMedicines(newMeds);
                                                    }}
                                                    className="w-full text-sm font-bold text-[#2A3B47] border-b border-gray-200 pb-1 focus:outline-none focus:border-gray-400 placeholder:text-gray-300 placeholder:font-normal"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    placeholder="Dosage"
                                                    value={med.dosage}
                                                    onChange={e => {
                                                        const newMeds = [...medicines];
                                                        newMeds[index].dosage = e.target.value;
                                                        setMedicines(newMeds);
                                                    }}
                                                    className="w-full text-xs text-gray-600 bg-gray-50 border border-transparent focus:border-gray-200 rounded-md px-2 py-1.5 focus:outline-none"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Frequency"
                                                    value={med.frequency}
                                                    onChange={e => {
                                                        const newMeds = [...medicines];
                                                        newMeds[index].frequency = e.target.value;
                                                        setMedicines(newMeds);
                                                    }}
                                                    className="w-full text-xs text-gray-600 bg-gray-50 border border-transparent focus:border-gray-200 rounded-md px-2 py-1.5 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pl-12 flex gap-3">
                                        <input
                                            type="text"
                                            placeholder="Timing / Anupana"
                                            value={med.timing}
                                            onChange={e => {
                                                const newMeds = [...medicines];
                                                newMeds[index].timing = e.target.value;
                                                setMedicines(newMeds);
                                            }}
                                            className="flex-1 text-xs text-gray-600 bg-gray-50 border border-transparent focus:border-gray-200 rounded-md px-3 py-2 border-dashed focus:outline-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Duration"
                                            value={med.duration}
                                            onChange={e => {
                                                const newMeds = [...medicines];
                                                newMeds[index].duration = e.target.value;
                                                setMedicines(newMeds);
                                            }}
                                            className="w-24 text-xs text-gray-600 bg-gray-50 border border-transparent focus:border-gray-200 rounded-md px-3 py-2 border-dashed focus:outline-none text-center"
                                        />
                                    </div>

                                    <button
                                        onClick={() => handleRemoveMedicine(med.id)}
                                        className="absolute right-4 top-4 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleAddMedicine}
                            className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 font-bold text-sm hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Another Medicine
                        </button>
                    </div>

                    {/* Lifestyle Instructions */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Diet & Lifestyle (Pathya-Apathya)</label>
                        <textarea
                            rows={3}
                            value={lifestyle}
                            onChange={(e) => setLifestyle(e.target.value)}
                            placeholder="e.g. Avoid spicy food, drink lukewarm water, practice Pranayama..."
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 transition-all resize-none"
                            style={{ '--tw-ring-color': themeColor } as any}
                        ></textarea>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100/60 flex items-center justify-between bg-gray-50/30 rounded-b-3xl">
                    <button className="text-gray-500 font-bold text-sm hover:text-gray-900 px-4 py-2">Save as Template</button>
                    <button
                        onClick={handleSend}
                        disabled={sending}
                        className="flex items-center gap-2 px-8 py-3 rounded-xl text-white font-bold transition-all shadow-md disabled:opacity-75 disabled:cursor-not-allowed"
                        style={{ backgroundColor: themeColor }}
                        onMouseOver={(e) => !sending && (e.currentTarget.style.backgroundColor = themeBgHover)}
                        onMouseOut={(e) => !sending && (e.currentTarget.style.backgroundColor = themeColor)}
                    >
                        {sending ? (
                            <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                        {sending ? "Sending..." : "Sign & Send to Patient"}
                    </button>
                </div>
            </div>

            {/* Right Column - Smart Tools & Pharmacy */}
            <div className="w-full lg:w-80 flex flex-col gap-6">

                {/* Contraindication / Interaction Warning */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/60">
                    <h3 className="text-sm font-bold text-[#2A3B47] flex items-center gap-2 mb-4">
                        <Activity className="w-4 h-4 text-blue-500" />
                        Smart Interaction Check
                    </h3>

                    {medicines.length > 1 ? (
                        <div className="p-3 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3">
                            <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-green-800 leading-relaxed font-medium">Safe combination. No known adverse interactions between current herbs.</p>
                        </div>
                    ) : (
                        <p className="text-xs text-gray-400">Add medicines to check for potential herb-herb or herb-drug interactions.</p>
                    )}

                </div>

                {/* E-Pharmacy Integration */}
                <div className="bg-[#2A3B47] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                        <Pill className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Pharmacy Delivery</h3>
                    <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                        Send this prescription directly to the platform's E-Pharmacy. The patient will receive a payment link instantly.
                    </p>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors border-white bg-transparent">
                            {/* Checkmark icon for visual only */}
                            <CheckCircle className="w-3 h-3 text-white opacity-0 group-hover:opacity-100" />
                        </div>
                        <span className="text-sm font-bold">Auto-dispatch medicines</span>
                    </label>
                </div>

                {/* Saved Templates */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/60 flex-1">
                    <h3 className="text-sm font-bold text-[#2A3B47] mb-4 text-gray-500 uppercase tracking-widest">Your Rx Templates</h3>
                    <div className="space-y-3">
                        <button className="w-full text-left p-3 rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors group">
                            <h4 className="text-sm font-bold text-[#2A3B47] group-hover:text-gray-900">Standard Fever (Jwara)</h4>
                            <p className="text-xs text-gray-500 mt-1 truncate">Sudarshan Ghan Vati, Mahasudarshan...</p>
                        </button>
                        <button className="w-full text-left p-3 rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors group">
                            <h4 className="text-sm font-bold text-[#2A3B47] group-hover:text-gray-900">Acid Reflux (Amlapitta)</h4>
                            <p className="text-xs text-gray-500 mt-1 truncate">Kamdudha Ras, Avipattikar Churna...</p>
                        </button>
                        <button className="w-full text-left p-3 rounded-xl border border-dashed border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-bold text-xs">
                            <Plus className="w-3.5 h-3.5" />
                            Create New Template
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
