"use client";

import { useState, useEffect, useCallback } from "react";
import PrakritiAILayout from "@/components/PrakritiAILayout";
import { Search, Filter, ShieldCheck, ShieldAlert, CheckCircle, XCircle, Trash2, Eye, Clock, Pencil, Camera } from "lucide-react";
import { useMedicalMode } from "@/context/ModeContext";

export default function AdminUserManagement() {
    const { themeColor } = useMedicalMode();
    const [users, setUsers] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState("Doctors");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedKycUser, setSelectedKycUser] = useState<any>(null);

    const fetchUsers = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setUsers(await res.json());
            }
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to completely delete this user?")) return;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) fetchUsers(); // Refresh
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditUser = async (user: any) => {
        const newName = prompt(`Enter a new name for ${user.name}:`, user.name);
        if (!newName || newName === user.name) return;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${user.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: newName })
            });
            if (res.ok) fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggleStatus = async (user: any) => {
        const newStatus = user.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
        if (!confirm(`Are you sure you want to ${newStatus === 'SUSPENDED' ? 'SUSPEND' : 'ACTIVATE'} ${user.name}?`)) return;

        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${user.id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const handleVerifyDoctor = async (doctorId: string) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/practitioners/${doctorId}/verify`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                fetchUsers(); // Refresh
                setSelectedKycUser(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddUser = async () => {
        const email = prompt(`Enter new ${activeTab.slice(0, -1).toLowerCase()}'s email:`);
        if (!email) return;
        const name = prompt("Enter name:");
        if (!name) return;
        const password = prompt("Enter a starting password:");
        if (!password) return;
        const role = activeTab === "Doctors" ? "PRACTITIONER" : "PATIENT";

        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ email, name, password, role })
            });
            if (res.ok) fetchUsers();
            else {
                const data = await res.json();
                alert(data.message || "Failed to create user.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Derived states
    const filteredUsers = users.filter(u =>
    (u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const doctors = filteredUsers.filter(u => u.role === "PRACTITIONER");
    const patients = filteredUsers.filter(u => u.role === "PATIENT");
    const displayList = activeTab === "Doctors" ? doctors : patients;
    return (
        <PrakritiAILayout>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-[#2A3B47] tracking-tight">
                        User Management
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Oversee platform patients, doctors, and their verification statuses.
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
                <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1">
                    <button
                        onClick={() => setActiveTab("Doctors")}
                        className={`px-8 py-2.5 rounded-lg font-bold text-sm transition-colors ${activeTab === 'Doctors' ? 'bg-[#2A3B47] text-white shadow-sm' : 'text-gray-500 hover:text-[#2A3B47]'}`}
                    >
                        Doctors
                    </button>
                    <button
                        onClick={() => setActiveTab("Patients")}
                        className={`px-8 py-2.5 rounded-lg font-bold text-sm transition-colors ${activeTab === 'Patients' ? 'bg-[#2A3B47] text-white shadow-sm' : 'text-gray-500 hover:text-[#2A3B47]'}`}
                    >
                        Patients
                    </button>
                </div>

                <div className="flex-1 max-w-md relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={`Search ${activeTab.toLowerCase()} by name, email, or ID...`}
                        className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-1 transition-shadow shadow-sm"
                        style={{ '--tw-ring-color': themeColor } as any}
                    />
                </div>

                <div className="flex gap-3">
                    <button onClick={() => alert("Advanced filtering metrics coming soon.")} className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                    <button
                        onClick={handleAddUser}
                        className="flex items-center gap-2 px-6 py-3 text-white rounded-xl text-sm font-bold shadow-sm transition-all hover:opacity-90 cursor-pointer"
                        style={{ backgroundColor: themeColor }}
                    >
                        + New {activeTab.slice(0, -1)}
                    </button>
                </div>
            </div>

            {/* List Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100/60 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest pl-8">User Info</th>
                                {activeTab === "Doctors" && (
                                    <>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">KYC Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Performance</th>
                                    </>
                                )}
                                {activeTab === "Patients" && (
                                    <>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Subscription Plan</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Engagement</th>
                                    </>
                                )}
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Account Status</th>
                                <th className="px-6 py-4 text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {displayList.map((user: any, idx: number) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 pl-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-gray-100 text-gray-600">
                                                {user.name?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <div className="font-bold text-[#2A3B47]">{user.name}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>

                                    {activeTab === "Doctors" && (
                                        <>
                                            <td className="px-6 py-4">
                                                {user.kyc === 'Verified' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                                                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                                                    </span>
                                                ) : user.kyc === 'Pending' ? (
                                                    <span
                                                        onClick={() => setSelectedKycUser(user)}
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100 cursor-pointer hover:bg-amber-100 transition-colors"
                                                    >
                                                        <Clock className="w-3.5 h-3.5" /> Review Pending
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 text-red-700 border border-red-100">
                                                        <ShieldAlert className="w-3.5 h-3.5" /> Unregistered/Rejected
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-700">{user.consultations || 0} Consults</div>
                                                <div className="text-xs text-amber-500 font-bold mt-0.5">★ {user.rating || 0} Avg Rating</div>
                                            </td>
                                        </>
                                    )}

                                    {activeTab === "Patients" && (
                                        <>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${user.plan === 'Premium' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                                    {user.plan || "Free"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-700">{user.orders || 0} Orders</div>
                                                <div className="text-xs text-blue-500 font-bold mt-0.5">High Activity</div>
                                            </td>
                                        </>
                                    )}

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {user.status === 'ACTIVE' || !user.status ? (
                                                <><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-sm font-bold text-gray-700">Active</span></>
                                            ) : (
                                                <><XCircle className="w-4 h-4 text-red-500" /><span className="text-sm font-bold text-red-600">Suspended</span></>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-right pr-6">
                                        <div className="flex justify-end gap-2">
                                            {activeTab === "Doctors" && user.kyc !== 'Verified' && (
                                                <button onClick={() => setSelectedKycUser(user)} className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-lg transition-colors border border-blue-100 cursor-pointer">
                                                    Verify KYC
                                                </button>
                                            )}
                                            <button onClick={() => alert("Detailed Profile view requires a dedicated routing page.")} className="p-2 text-gray-400 hover:text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm transition-colors cursor-pointer" title="View Profile">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleEditUser(user)} className="p-2 text-gray-400 hover:text-blue-600 bg-white border border-gray-200 rounded-lg shadow-sm transition-colors cursor-pointer" title="Edit Name">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleToggleStatus(user)} className={`p-2 bg-white border border-gray-200 rounded-lg shadow-sm transition-colors cursor-pointer ${user.status === 'SUSPENDED' ? 'text-green-500 hover:bg-green-50' : 'text-orange-400 hover:text-orange-500 hover:bg-orange-50'}`} title={user.status === 'SUSPENDED' ? "Activate User" : "Suspend User"}>
                                                {user.status === 'SUSPENDED' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                            </button>
                                            <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-gray-400 hover:text-white hover:bg-red-500 bg-white border border-gray-200 rounded-lg shadow-sm transition-colors cursor-pointer" title="Delete User">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* KYC Review Modal */}
            {selectedKycUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100/20">
                        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                            <div className="p-2 border border-gray-200 rounded-lg shadow-sm">
                                <ShieldCheck className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#2A3B47] tracking-tight">KYC Verification</h3>
                                <p className="text-xs font-bold text-gray-400">Review Identity For: {selectedKycUser.name}</p>
                            </div>
                        </div>

                        <div className="p-8 bg-gray-50/50 flex flex-col items-center justify-center border-b border-gray-100 min-h-[300px]">
                            {selectedKycUser.kycPhoto ? (
                                <div className="w-[200px] h-[200px] rounded-full overflow-hidden border-4 border-white shadow-xl relative bg-black">
                                    <img src={selectedKycUser.kycPhoto} alt="Doctor Selfie KYC" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="text-center text-gray-400">
                                    <Camera className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p className="text-sm font-bold">No Photo Submitted</p>
                                    <p className="text-xs mt-1 max-w-[250px] mx-auto opacity-70">
                                        This doctor has not completed the webcam selfie verification process yet.
                                        You can force-verify them manually, but it is not recommended.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-white flex justify-end gap-3 rounded-b-3xl">
                            <button
                                onClick={() => setSelectedKycUser(null)}
                                className="px-6 py-2.5 rounded-xl font-bold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleVerifyDoctor(selectedKycUser.id)}
                                className="px-6 py-2.5 rounded-xl font-bold bg-green-500 hover:bg-green-600 text-white transition-colors shadow-lg shadow-green-500/20"
                            >
                                Approve & Verify
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PrakritiAILayout>
    );
}
