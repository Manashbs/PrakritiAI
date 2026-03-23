"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, FileText, Image, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

interface Document {
    id: string;
    label: string;
    fileType: string;
    createdAt: string;
    appointmentId?: string;
    base64Content: string;
}

export default function PatientDocumentsPage() {
    const router = useRouter();
    const fileRef = useRef<HTMLInputElement>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [label, setLabel] = useState("");
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    const fetchDocuments = async () => {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patient-documents/my-documents`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setDocuments(await res.json());
        setLoading(false);
    };

    useEffect(() => { fetchDocuments(); }, []);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        const file = fileRef.current?.files?.[0];
        if (!file || !label) return;

        setUploading(true);
        const reader = new FileReader();
        reader.onload = async () => {
            const base64Content = (reader.result as string).split(",")[1];
            const fileType = file.type.includes("pdf") ? "PDF" :
                file.type.includes("image") ? file.type.split("/")[1].toUpperCase() : "FILE";

            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patient-documents/upload`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ label, fileType, base64Content })
            });

            if (res.ok) {
                setSuccess(true);
                setLabel("");
                if (fileRef.current) fileRef.current.value = "";
                await fetchDocuments();
                setTimeout(() => setSuccess(false), 3000);
            }
            setUploading(false);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900">Medical Documents</h1>
                        <p className="text-gray-500">Upload your test reports and X-rays — your doctor can view them during consultation</p>
                    </div>
                </div>

                {/* Upload Form */}
                <form onSubmit={handleUpload} className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
                    <h2 className="font-bold text-gray-900 mb-5 text-lg">Upload New Document</h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={label}
                            onChange={e => setLabel(e.target.value)}
                            placeholder="Document label (e.g. Blood Test Report, Chest X-Ray)"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#2D7A5D] focus:ring-1 focus:ring-[#2D7A5D] outline-none"
                            required
                        />
                        <div
                            onClick={() => fileRef.current?.click()}
                            className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#2D7A5D] transition-colors group"
                        >
                            <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-3 group-hover:text-[#2D7A5D] transition-colors" />
                            <p className="text-sm font-medium text-gray-600">Click to select a file</p>
                            <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG, DICOM supported</p>
                            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.dcm" className="hidden" />
                        </div>
                        {success && (
                            <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl p-3 text-sm font-medium">
                                <CheckCircle className="w-4 h-4" /> Document uploaded successfully!
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={uploading || !label}
                            className="w-full py-3 bg-[#2D7A5D] hover:bg-[#24614A] text-white rounded-xl font-bold disabled:opacity-50 transition-colors shadow-md shadow-green-900/10"
                        >
                            {uploading ? "Uploading..." : "Upload Document"}
                        </button>
                    </div>
                </form>

                {/* Documents List */}
                <h2 className="font-bold text-gray-900 mb-4 text-lg">Your Documents ({documents.length})</h2>
                {loading ? (
                    <p className="text-gray-400">Loading...</p>
                ) : documents.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-500">
                        No documents uploaded yet.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {documents.map(doc => (
                            <div key={doc.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-[#1A2F25]/5 rounded-xl">
                                        {doc.fileType === "PDF" ? <FileText className="w-5 h-5 text-[#2D7A5D]" /> : <Image className="w-5 h-5 text-[#2D7A5D]" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{doc.label}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{doc.fileType} • {new Date(doc.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <a
                                    href={`data:application/${doc.fileType.toLowerCase()};base64,${doc.base64Content}`}
                                    download={`${doc.label}.${doc.fileType.toLowerCase()}`}
                                    className="text-sm font-semibold text-[#2D7A5D] hover:underline"
                                >
                                    Download
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
