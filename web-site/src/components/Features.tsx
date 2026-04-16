import React from "react";

const features = [
  {
    id: "e2e-encryption",
    icon: "🔐",
    title: "End-to-End Encryption",
    description:
      "AES-GCM encryption runs entirely in the browser. Atlassian stores only ciphertext — they never see the plaintext or the key.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "one-time-access",
    icon: "👁️",
    title: "One-Time Access",
    description:
      "Burn-after-reading protection built in. Once a recipient decrypts a note, it is permanently destroyed — no copy is ever retained.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    id: "automatic-expiration",
    icon: "⏰",
    title: "Automatic Expiration",
    description:
      "Set expiration from 1 hour to a custom date. Notes self-destruct automatically when time elapses — even if the recipient never opened them.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "recipient-verification",
    icon: "🪪",
    title: "Recipient Verification",
    description:
      "Only the designated Atlassian account can decrypt a note. Platform-level identity verification is enforced — there is no way to bypass it or open a note under a different account.",
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    id: "multiple-recipients",
    icon: "👥",
    title: "Multiple Recipients",
    description:
      "Share one encrypted note with multiple recipients simultaneously. Each gets their own access link and independent tracking — burn-after-reading applies per recipient.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "email-notifications",
    icon: "📧",
    title: "Email Notifications",
    description:
      "Recipients are automatically notified by email when a secure note is created for them. No manual outreach needed — they receive a direct link to decrypt their note.",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    id: "jsm-portal",
    icon: "🎯",
    title: "JSM Portal Integration",
    description:
      "Seamlessly works in Jira Service Management portals. Automatic context detection for customer requests and agents. No configuration needed.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    id: "audit-compliance",
    icon: "📊",
    title: "Audit & Compliance",
    description:
      "Four audit views — by note, issue, project, and user. Full status timeline per note, CSV export, and a one-click Rovo AI button on every page.",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    id: "rovo-ai",
    icon: "🤖",
    title: "Rovo AI Analytics",
    description:
      'Ask plain-English questions like "Show notes shared with me last week". Read-only queries with automatic row-level security — encryption keys and sensitive fields are never exposed.',
    gradient: "from-violet-500 to-purple-500",
  },
];

export const Features: React.FC = () => {
  return (
    <section
      id="features"
      className="scroll-mt-28 py-12 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-white to-slate-50"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 pb-1 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
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
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
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
