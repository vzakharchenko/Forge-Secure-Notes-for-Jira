import React from "react";

const steps = [
  {
    id: "create-note",
    number: "1",
    title: "Create Note",
    description:
      "Open any Jira issue and create an encrypted note. Select recipients and set expiration time.",
    icon: "📝",
  },
  {
    id: "generate-key",
    number: "2",
    title: "Generate Key",
    description:
      "Generate a unique encryption key in your browser. Share it securely with recipients out-of-band.",
    icon: "🔑",
  },
  {
    id: "share-securely",
    number: "3",
    title: "Share Securely",
    description:
      "The encrypted note is stored in Jira. Recipients receive email notifications with access links.",
    icon: "📧",
  },
  {
    id: "decrypt-view",
    number: "4",
    title: "Decrypt & View",
    description:
      "Recipients use the key to decrypt and view the note. The note self-destructs after viewing.",
    icon: "👁️",
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Simple, secure, and seamless integration with your Jira workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-200"></div>

          {steps.map((step) => (
            <div key={step.id} className="relative text-center group">
              {/* Step number circle */}
              <div className="relative mx-auto mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300 relative z-10">
                  <span className="absolute -top-2 -right-2 text-2xl">{step.icon}</span>
                  <span className="text-white">{step.number}</span>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              </div>

              <h3 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-blue-600 transition-colors">
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
