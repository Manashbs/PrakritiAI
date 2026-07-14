"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    Sparkles,
    ShoppingBag,
    Calendar,
    User,
    LogOut,
    Leaf,
    Stethoscope,
    Users,
    Activity,
    Package
} from "lucide-react";
import { useMedicalMode } from "@/context/ModeContext";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const { mode, setMode, themeColor, themeBgLight } = useMedicalMode();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    setProfile(await res.json());
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    const defaultNavLinks = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "AI Analysis", href: "/triage", icon: Sparkles },
        { name: "Consultations", href: "/consultations", icon: Calendar },
        { name: "Wellness Store", href: "/store", icon: ShoppingBag },
        { name: "My Profile", href: "/profile", icon: User },
    ];

    const adminNavLinks = [
        { name: "Executive Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "User Management", href: "/admin/users", icon: Users },
        { name: "Consultations", href: "/admin/consultations", icon: Calendar },
        { name: "E-Commerce Controls", href: "/admin/ecommerce", icon: Package },
        { name: "System Logs", href: "/admin/logs", icon: Activity },
    ];

    const navLinks = profile?.role === "ADMIN" ? adminNavLinks : defaultNavLinks;

    return (
        <aside className="w-[280px] bg-white border-r border-gray-100 flex flex-col hidden md:flex h-screen sticky top-0">
            {/* Logo area */}
            <div className="p-8 pt-10">
                <div className="flex items-center gap-2 mb-1">
                    <Leaf className="w-6 h-6" style={{ color: themeColor }} />
                    <h2 className="text-2xl font-serif font-bold text-[#1f2937] tracking-tight">PrakritiAI</h2>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold ml-8">HOLISTIC WELLNESS</p>
            </div>

            {/* Navigation Navigation */}
            <nav className="flex-1 px-4 py-4 flex flex-col gap-2">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${isActive
                                ? "text-white shadow-md shadow-black/5"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            style={isActive ? { backgroundColor: themeColor } : {}}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`} />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 mb-4">
                {/* Mode toggle - Hide for Admins as it's not relevant to platform management */}
                {profile?.role !== "ADMIN" && (
                    <button
                        onClick={() => setMode(mode === "Ayurveda" ? "Allopathy" : "Ayurveda")}
                        className="w-full mb-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-row items-center justify-between hover:bg-gray-100 transition-colors text-left"
                    >
                        <div>
                            <p className="text-xs font-semibold text-gray-800">Current Mode</p>
                            <p className="text-xs font-medium mt-0.5" style={{ color: themeColor }}>{mode}</p>
                        </div>
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                            style={{ backgroundColor: themeBgLight, color: themeColor }}
                        >
                            {mode === "Ayurveda" ? <Leaf className="w-4 h-4" /> : <Stethoscope className="w-4 h-4" />}
                        </div>
                    </button>
                )}

                {/* Profile Widget */}
                <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                            {profile?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900 leading-none">{profile?.name || "User"}</p>
                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Logged In</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Log Out"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside >
    );
}
