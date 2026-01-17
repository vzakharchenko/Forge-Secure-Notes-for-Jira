import React from "react";

const securityFeatures = [
  {
    id: "zero-trust",
    icon: "🛡️",
    title: "Zero-Trust Architecture",
    description:
      "All encryption happens in the user's browser. The server never holds enough data to decrypt anything.",
    color: "blue",
  },
  {
    id: "client-side",
    icon: "🔑",
    title: "Client-Side Encryption",
    description:
      "The encryption key is generated in the browser and is never sent to Atlassian's cloud.",
    color: "indigo",
  },
  {
    id: "no-recovery",
    icon: "🚫",
    title: "No Recovery",
    description:
      "No secret or key material are ever stored, making it cryptographically impossible to restore a note later.",
    color: "red",
  },
  {
    id: "runs-on-atlassian",
    icon: "☁️",
    title: "Runs on Atlassian",
    description: "The note lives fully inside Jira site, with native isolation and governance.",
    color: "purple",
  },
];

export const Security: React.FC = () => {
  return (
    <section className="py-24 px-4 relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full">
            <span className="text-blue-300 text-sm font-medium">🔒 Security First</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Three-Layer Security Model
            </span>
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            Together, these layers ensure confidentiality even if infrastructure or metadata is
            exposed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {securityFeatures.map((feature) => (
            <div
              key={feature.id}
              className="group relative bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:bg-white/10"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-blue-100 leading-relaxed">{feature.description}</p>
                </div>
              </div>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/10 group-hover:to-indigo-500/10 transition-all duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 rounded-xl shadow-2xl border border-blue-400/30">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-left">
              <p className="text-white font-semibold text-lg">PBKDF2-based key derivation</p>
              <p className="text-blue-100 text-sm">~200,000 iterations for maximum security</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
