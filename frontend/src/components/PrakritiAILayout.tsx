"use client";

import Sidebar from "./Sidebar";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function PrakritiAILayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileAndCheckAccess = async () => {
            const token = localStorage.getItem("token");
            if (!token) return router.push("/login");

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    // Global KYC Verifier Lock
                    if (data.role === "PRACTITIONER") {
                        const verified = data?.practitionerProfile?.kycVerified;
                        // Avoid redirect loops if we are already explicitly trying to view the kyc dashboard
                        if (!verified && pathname !== "/kyc") {
                            return router.push("/kyc");
                        }
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileAndCheckAccess();
    }, [pathname, router]);

    if (loading) {
        return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">Loading platform workspace...</div>;
    }

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#2D7A5D] selection:text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col items-center">
                {/* Standardized inner container for pages */}
                <div className="w-full max-w-[1200px] p-6 md:p-10">
                    {children}
                </div>
            </div>
        </div>
    );
}
