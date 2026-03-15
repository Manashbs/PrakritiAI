import React from "react";

interface PasswordStrengthMeterProps {
  password: string;
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (!pwd) return { score: 0, label: "Too Weak", color: "bg-red-500" };

    if (pwd.length > 5) score += 1;
    if (pwd.length > 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score < 2) return { score, label: "Weak", color: "bg-red-500" };
    if (score < 4) return { score, label: "Fair", color: "bg-yellow-500" };
    if (score === 4) return { score, label: "Good", color: "bg-blue-500" };
    return { score, label: "Strong", color: "bg-green-500" };
  };

  const { score, label, color } = calculateStrength(password);

  return (
    <div className="w-full mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-gray-500">Password Strength</span>
        <span className={`text-xs font-bold ${password ? color.replace('bg-', 'text-') : 'text-gray-400'}`}>
          {password ? label : ""}
        </span>
      </div>
      <div className="flex gap-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`h-full flex-1 transition-colors duration-300 ${
              index < score ? color : "bg-transparent"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
