import React from "react";

interface SectionBadgeProps {
  label: string;
  variant?: "dark" | "light" | "cta";
}

const variantClasses: Record<NonNullable<SectionBadgeProps["variant"]>, string> = {
  dark: "bg-blue-500/20 border-blue-400/30 text-blue-300",
  light: "bg-blue-500/20 border-blue-400/30 text-blue-700",
  cta: "bg-white/20 border-white/30 text-white",
};

export const SectionBadge: React.FC<SectionBadgeProps> = ({ label, variant = "dark" }) => (
  <div
    className={`inline-block mb-6 px-4 py-2 backdrop-blur-sm border rounded-full ${variantClasses[variant]}`}
  >
    <span className="text-sm font-medium">{label}</span>
  </div>
);
