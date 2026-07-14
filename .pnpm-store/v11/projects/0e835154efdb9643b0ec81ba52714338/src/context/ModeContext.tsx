"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type MedicalMode = "Ayurveda" | "Allopathy";

interface ModeContextType {
    mode: MedicalMode;
    setMode: (mode: MedicalMode) => void;
    themeColor: string;
    themeBgHover: string;
    themeBgLight: string;
    themeBorder: string;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<MedicalMode>("Ayurveda");

    // Persist mode selection in local storage if desired
    useEffect(() => {
        const savedMode = localStorage.getItem("medicalMode") as MedicalMode;
        if (savedMode === "Ayurveda" || savedMode === "Allopathy") {
            setMode(savedMode);
        }
    }, []);

    const handleSetMode = (newMode: MedicalMode) => {
        setMode(newMode);
        localStorage.setItem("medicalMode", newMode);
    };

    // Return current theme values based on the active mode
    const contextValue: ModeContextType = {
        mode,
        setMode: handleSetMode,
        // Green palette for Ayurveda
        themeColor: mode === "Ayurveda" ? "#2D7A5D" : "#f97316", // orange-500
        themeBgHover: mode === "Ayurveda" ? "#24614A" : "#ea580c", // orange-600
        themeBgLight: mode === "Ayurveda" ? "#f0fdf4" : "#fff7ed", // green-50 / orange-50
        themeBorder: mode === "Ayurveda" ? "border-green-100" : "border-orange-100",
    };

    return (
        <ModeContext.Provider value={contextValue}>
            {children}
        </ModeContext.Provider>
    );
}

export function useMedicalMode() {
    const context = useContext(ModeContext);
    if (context === undefined) {
        throw new Error("useMedicalMode must be used within a ModeProvider");
    }
    return context;
}
