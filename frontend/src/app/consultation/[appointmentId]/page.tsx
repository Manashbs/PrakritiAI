"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWebRTC } from "@/hooks/useWebRTC";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Send, Pill, Save, Plus, FileText, NotebookPen, CalendarPlus } from "lucide-react";

interface Product { id: string; name: string; price: number; }
interface MedicinePayload { name: string; dosage: string; frequency: string; timing: string; duration: string; }
interface PatientDoc { id: string; label: string; fileType: string; createdAt: string; base64Content: string; }
interface DoctorNote { id: string; content: string; createdAt: string; }

export default function ConsultationRoom() {
    const params = useParams();
    const router = useRouter();
    const appointmentId = params.appointmentId as string;

    const [userId, setUserId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"chat" | "prescription" | "docs" | "notes" | "followup">("chat");

    const { localStream, remoteStream, toggleAudio, toggleVideo, isAudioEnabled, isVideoEnabled, sendMessage, chatMessages, endCall, remoteUserId } = useWebRTC(appointmentId, userId || "");

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [chatInput, setChatInput] = useState("");

    // Prescription state
    const [products, setProducts] = useState<Product[]>([]);
    const [lifestyleNotes, setLifestyleNotes] = useState("");
    const [medicines, setMedicines] = useState<MedicinePayload[]>([]);
    const [builder, setBuilder] = useState<MedicinePayload>({ name: "", dosage: "", frequency: "", timing: "", duration: "" });
    const [isSaving, setIsSaving] = useState(false);

    // Patient docs state (doctor views)
    const [patientDocs, setPatientDocs] = useState<PatientDoc[]>([]);
    const [docsLoading, setDocsLoading] = useState(false);

    // Doctor notes state
    const [notes, setNotes] = useState<DoctorNote[]>([]);
    const [noteContent, setNoteContent] = useState("");
    const [savingNote, setSavingNote] = useState(false);

    // Follow-up scheduling state
    const [followupDate, setFollowupDate] = useState("");
    const [followupNotes, setFollowupNotes] = useState("");
    const [schedulingFollowup, setSchedulingFollowup] = useState(false);
    const [followupSuccess, setFollowupSuccess] = useState("");

    // Auth & role detection
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUserId(payload.sub);
            setUserRole(payload.role);

            if (payload.role === "PRACTITIONER") {
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/ecommerce/products`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(r => r.json()).then(setProducts).catch(console.error);
            }
        } catch (e) { router.push("/login"); }
    }, [router]);

    // Fetch patient docs when doctor switches to docs tab
    useEffect(() => {
        if (activeTab === "docs" && remoteUserId && userRole === "PRACTITIONER" && patientDocs.length === 0) {
            setDocsLoading(true);
            const token = localStorage.getItem("token");
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/patient-documents/patient/${remoteUserId}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(r => r.json()).then(d => { setPatientDocs(d); setDocsLoading(false); }).catch(() => setDocsLoading(false));
        }
    }, [activeTab, remoteUserId, userRole, patientDocs.length]);

    // Fetch previous doctor notes for this patient
    useEffect(() => {
        if (activeTab === "notes" && remoteUserId && userRole === "PRACTITIONER" && notes.length === 0) {
            const token = localStorage.getItem("token");
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctor-notes/patient/${remoteUserId}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(r => r.json()).then(setNotes).catch(console.error);
        }
    }, [activeTab, remoteUserId, userRole, notes.length]);

    // Attach streams
    useEffect(() => { if (localVideoRef.current && localStream) localVideoRef.current.srcObject = localStream; }, [localStream]);
    useEffect(() => { if (remoteVideoRef.current && remoteStream) remoteVideoRef.current.srcObject = remoteStream; }, [remoteStream]);

    const handleEndCall = async () => {
        endCall();
        try {
            const token = localStorage.getItem("token");
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${appointmentId}/complete`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (e) { console.warn("Could not mark appointment as completed:", e); }
        router.push("/dashboard");
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (chatInput.trim()) { sendMessage(chatInput); setChatInput(""); }
    };

    const handleAddMedicine = () => {
        if (!builder.name || !builder.dosage) return;
        setMedicines([...medicines, builder]);
        setBuilder({ name: "", dosage: "", frequency: "", timing: "", duration: "" });
    };

    const handleSubmitPrescription = async () => {
        if (!remoteUserId) { alert("Patient is not connected yet."); return; }
        setIsSaving(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prescriptions`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ patientId: remoteUserId, lifestyle: lifestyleNotes, medicines })
            });
            if (!res.ok) throw new Error("Failed to save prescription.");
            alert("Prescription saved! Patient cart auto-populated.");
            setMedicines([]); setLifestyleNotes("");
        } catch (e: any) { alert(e.message); }
        finally { setIsSaving(false); }
    };

    const handleSaveNote = async () => {
        if (!remoteUserId || !noteContent.trim()) return;
        setSavingNote(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctor-notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ patientId: remoteUserId, content: noteContent })
            });
            if (res.ok) {
                const saved = await res.json();
                setNotes([saved, ...notes]);
                setNoteContent("");
            }
        } finally { setSavingNote(false); }
    };

    const handleScheduleFollowup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!remoteUserId || !followupDate) return;
        setSchedulingFollowup(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/book-for-patient`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    patientId: remoteUserId,
                    startTime: new Date(followupDate).toISOString(),
                    notes: followupNotes || "Follow-up consultation"
                })
            });
            if (!res.ok) throw new Error("Failed to schedule follow-up");
            setFollowupSuccess(`Follow-up scheduled for ${new Date(followupDate).toLocaleString()}`);
            setFollowupDate(""); setFollowupNotes("");
        } catch (e: any) { alert(e.message); }
        finally { setSchedulingFollowup(false); }
    };

    if (!userId) return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Loading Consultation...</div>;

    const tabBtn = (id: typeof activeTab, icon: React.ReactNode, label: string) => (
        <button
            onClick={() => setActiveTab(id)}
            title={label}
            className={`flex-1 flex items-center justify-center gap-1 py-2 text-[11px] font-semibold rounded-lg transition-colors ${activeTab === id ? "bg-[#2D7A5D] text-white shadow-md" : "text-gray-500 hover:text-gray-300"}`}
        >
            {icon} <span className="hidden sm:inline">{label}</span>
        </button>
    );

    return (
        <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
            {/* Left: Video */}
            <div className="flex-1 flex flex-col p-4 relative">
                <div className="flex justify-between items-center mb-4 px-4 py-3 bg-gray-900 rounded-2xl shadow-xl border border-gray-800 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                        <h2 className="font-semibold text-gray-200">Secure Teleconsultation</h2>
                    </div>
                    <div className="text-sm font-mono text-gray-500">ID: {appointmentId}</div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                    <div className="relative rounded-3xl overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl">
                        <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
                        <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg text-sm border border-white/10">You {userRole === "PRACTITIONER" ? "(Doctor)" : ""}</div>
                    </div>
                    <div className="relative rounded-3xl overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl flex items-center justify-center">
                        {remoteStream ? (
                            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center text-gray-500 flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4 border border-gray-700"><VideoOff className="w-6 h-6 text-gray-600" /></div>
                                Waiting for peer...
                            </div>
                        )}
                        <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg text-sm border border-white/10">Patient</div>
                    </div>
                </div>

                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-gray-900/80 backdrop-blur-xl p-3 rounded-full border border-gray-700/50 shadow-2xl z-20">
                    <button onClick={toggleAudio} className={`p-4 rounded-full transition-all ${isAudioEnabled ? "bg-gray-800 hover:bg-gray-700" : "bg-red-500/20 text-red-500 border border-red-500/30"}`}>{isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}</button>
                    <button onClick={toggleVideo} className={`p-4 rounded-full transition-all ${isVideoEnabled ? "bg-gray-800 hover:bg-gray-700" : "bg-red-500/20 text-red-500 border border-red-500/30"}`}>{isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}</button>
                    <button onClick={handleEndCall} className="p-4 rounded-full bg-red-600 hover:bg-red-500 text-white transition-all shadow-lg shadow-red-900/20"><PhoneOff className="w-5 h-5" /></button>
                </div>
            </div>

            {/* Right: Clinical Panel */}
            <div className="w-96 bg-gray-900 border-l border-gray-800 flex flex-col z-10 shadow-2xl">
                {userRole === "PRACTITIONER" ? (
                    <div className="flex border-b border-gray-800 p-2 gap-1 bg-gray-950">
                        {tabBtn("chat", <Send className="w-3 h-3" />, "Chat")}
                        {tabBtn("prescription", <Pill className="w-3 h-3" />, "Rx")}
                        {tabBtn("docs", <FileText className="w-3 h-3" />, "Docs")}
                        {tabBtn("notes", <NotebookPen className="w-3 h-3" />, "Notes")}
                        {tabBtn("followup", <CalendarPlus className="w-3 h-3" />, "Follow-up")}
                    </div>
                ) : (
                    <div className="p-4 border-b border-gray-800"><h3 className="font-bold text-gray-200">Room Chat</h3></div>
                )}

                {/* ── CHAT TAB ── */}
                <div className={`flex flex-col overflow-hidden ${activeTab === "chat" ? "flex-1" : "hidden"}`}>
                    <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
                        {chatMessages.map((msg, i) => (
                            <div key={i} className={`flex flex-col max-w-[85%] ${msg.from === userId ? "self-end items-end" : "self-start items-start"}`}>
                                <span className="text-[10px] text-gray-500 mb-1 px-1">{msg.from === userId ? "You" : "Them"}</span>
                                <div className={`px-4 py-2.5 rounded-2xl text-sm ${msg.from === userId ? "bg-[#2D7A5D] text-white rounded-br-sm" : "bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-sm"}`}>{msg.message}</div>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-800">
                        <div className="relative">
                            <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type a message..." className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-[#2D7A5D]" />
                            <button type="submit" disabled={!chatInput.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-[#4ade80]"><Send className="w-4 h-4" /></button>
                        </div>
                    </form>
                </div>

                {/* ── RX BUILDER TAB ── */}
                {userRole === "PRACTITIONER" && (
                    <div className={`flex-col overflow-y-auto p-4 space-y-4 ${activeTab === "prescription" ? "flex flex-1" : "hidden"}`}>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Lifestyle Notes</label>
                            <textarea value={lifestyleNotes} onChange={e => setLifestyleNotes(e.target.value)} rows={3} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-[#2D7A5D] outline-none" placeholder="Diet, meditation, exercise..." />
                        </div>
                        <div className="space-y-2 bg-gray-950/50 p-3 rounded-xl border border-gray-800/50">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Add Medicine</label>
                            <select value={builder.name} onChange={e => setBuilder({ ...builder, name: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-sm text-white outline-none">
                                <option value="">Select from store...</option>
                                {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                            </select>
                            <div className="grid grid-cols-2 gap-2">
                                <input placeholder="Dosage" value={builder.dosage} onChange={e => setBuilder({ ...builder, dosage: e.target.value })} className="bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm text-white" />
                                <input placeholder="Freq (1-0-1)" value={builder.frequency} onChange={e => setBuilder({ ...builder, frequency: e.target.value })} className="bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm text-white" />
                                <input placeholder="Timing" value={builder.timing} onChange={e => setBuilder({ ...builder, timing: e.target.value })} className="bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm text-white" />
                                <input placeholder="Duration" value={builder.duration} onChange={e => setBuilder({ ...builder, duration: e.target.value })} className="bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm text-white" />
                            </div>
                            <button onClick={handleAddMedicine} className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-semibold border border-gray-700 flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Queue Medicine</button>
                        </div>
                        {medicines.length > 0 && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#4ade80] uppercase tracking-widest">Cart ({medicines.length})</label>
                                {medicines.map((m, i) => (
                                    <div key={i} className="bg-gray-900 border border-gray-800 p-3 rounded-xl text-sm">
                                        <span className="font-semibold text-gray-200 block">{m.name}</span>
                                        <span className="text-gray-500 text-xs">{m.dosage} | {m.frequency} | {m.timing} | {m.duration}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="pt-2 border-t border-gray-800 mt-auto">
                            <button onClick={handleSubmitPrescription} disabled={isSaving || (!lifestyleNotes && medicines.length === 0)} className="w-full py-3 bg-[#2D7A5D] hover:bg-[#24614A] disabled:opacity-50 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                                {isSaving ? "Saving..." : <><Save className="w-4 h-4" /> Issue Prescription</>}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── PATIENT DOCS TAB ── */}
                {userRole === "PRACTITIONER" && (
                    <div className={`flex-col overflow-y-auto p-4 space-y-3 ${activeTab === "docs" ? "flex flex-1" : "hidden"}`}>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Patient Uploaded Reports</h3>
                        {!remoteUserId && <p className="text-sm text-gray-500">Wait for patient to join the room.</p>}
                        {docsLoading && <p className="text-sm text-gray-500">Loading documents...</p>}
                        {!docsLoading && remoteUserId && patientDocs.length === 0 && (
                            <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 text-center text-sm text-gray-500">No documents uploaded by patient.</div>
                        )}
                        {patientDocs.map(doc => (
                            <div key={doc.id} className="bg-gray-950 border border-gray-800 rounded-xl p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-200 text-sm">{doc.label}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{doc.fileType} • {new Date(doc.createdAt).toLocaleDateString()}</p>
                                </div>
                                <a href={`data:application/${doc.fileType.toLowerCase()};base64,${doc.base64Content}`} download={`${doc.label}.${doc.fileType.toLowerCase()}`} className="text-xs font-bold text-[#4ade80] hover:underline">View</a>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── NOTES TAB ── */}
                {userRole === "PRACTITIONER" && (
                    <div className={`flex-col overflow-y-auto p-4 space-y-4 ${activeTab === "notes" ? "flex flex-1" : "hidden"}`}>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Write Clinical Note</label>
                            <textarea value={noteContent} onChange={e => setNoteContent(e.target.value)} rows={4} className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-[#2D7A5D] outline-none" placeholder="Note about this patient's condition, history, allergies..." />
                            <button onClick={handleSaveNote} disabled={savingNote || !noteContent.trim() || !remoteUserId} className="mt-2 w-full py-2.5 bg-[#2D7A5D] hover:bg-[#24614A] disabled:opacity-50 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                                {savingNote ? "Saving..." : <><Save className="w-4 h-4" /> Save Note</>}
                            </button>
                        </div>
                        {notes.length > 0 && (
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Previous Notes ({notes.length})</label>
                                {notes.map(n => (
                                    <div key={n.id} className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                                        <p className="text-sm text-gray-200 leading-relaxed">{n.content}</p>
                                        <p className="text-xs text-gray-500 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── FOLLOW-UP TAB ── */}
                {userRole === "PRACTITIONER" && (
                    <div className={`flex-col overflow-y-auto p-4 space-y-4 ${activeTab === "followup" ? "flex flex-1" : "hidden"}`}>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Schedule Follow-up Visit</h3>
                        {!remoteUserId && <p className="text-sm text-gray-500">Patient must be connected to schedule a follow-up.</p>}
                        {followupSuccess && (
                            <div className="bg-green-900/30 border border-green-700/30 text-green-400 rounded-xl p-4 text-sm font-medium">{followupSuccess}</div>
                        )}
                        <form onSubmit={handleScheduleFollowup} className="space-y-3">
                            <div>
                                <label className="text-xs font-semibold text-gray-400 block mb-1">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={followupDate}
                                    min={new Date(Date.now() + 5 * 60000).toISOString().slice(0, 16)}
                                    onChange={e => setFollowupDate(e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-[#2D7A5D] outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-400 block mb-1">Notes (optional)</label>
                                <input
                                    type="text"
                                    value={followupNotes}
                                    onChange={e => setFollowupNotes(e.target.value)}
                                    placeholder="e.g. Review blood test results"
                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-[#2D7A5D] outline-none"
                                />
                            </div>
                            <button type="submit" disabled={schedulingFollowup || !followupDate || !remoteUserId} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                                <CalendarPlus className="w-4 h-4" /> {schedulingFollowup ? "Scheduling..." : "Confirm Follow-up"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
