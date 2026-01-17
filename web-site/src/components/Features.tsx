import React from "react";

const features = [
  {
    id: "e2e-encryption",
    icon: "🔐",
    title: "End-to-End Encryption",
    description:
      "AES-GCM encryption performed entirely in the browser. Your secrets never leave your device unencrypted.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "automatic-expiration",
    icon: "⏰",
    title: "Automatic Expiration",
    description:
      "Set expiration times from 1 hour to custom dates. Notes automatically self-destruct when expired.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "one-time-access",
    icon: "👁️",
    title: "One-Time Access",
    description:
      "Burn-after-reading protection. Notes are permanently destroyed immediately after viewing.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    id: "multiple-recipients",
    icon: "👥",
    title: "Multiple Recipients",
    description:
      "Share secure notes with one or multiple users. Each recipient has independent access tracking.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "audit-compliance",
    icon: "📊",
    title: "Audit & Compliance",
    description:
      "Comprehensive audit dashboard with CSV export. Track all activity without exposing secrets.",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    id: "rovo-ai",
    icon: "🤖",
    title: "Rovo AI Analytics",
    description:
      "Natural language queries about your secure notes. Get insights with AI-powered analytics.",
    gradient: "from-violet-500 to-purple-500",
  },
];

export const Features: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need for secure, confidential communication in Jira
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-transparent overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              ></div>

              {/* Icon */}
              <div className="relative mb-6">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} text-3xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-700 transition-all duration-300">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed relative z-10">{feature.description}</p>

              {/* Decorative element */}
              <div
                className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-tl-full transition-opacity duration-300`}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
