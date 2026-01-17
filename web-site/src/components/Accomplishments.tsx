import React from "react";

const accomplishments = [
  {
    id: "open-source",
    text: "Open-source project with MIT license",
    icon: "📜",
  },
  {
    id: "test-coverage",
    text: "85% test coverage with Vitest",
    icon: "✅",
  },
  {
    id: "zero-vulnerabilities",
    text: "Zero bugs and vulnerabilities (Snyk & SonarCloud verified)",
    icon: "🛡️",
  },
  {
    id: "typescript",
    text: "98.5% TypeScript codebase",
    icon: "💻",
  },
  {
    id: "e2e-encryption",
    text: "Full end-to-end encrypted system",
    icon: "🔐",
  },
  {
    id: "forge-native",
    text: "Forge-native without external services",
    icon: "⚡",
  },
];

export const Accomplishments: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Production-Ready Quality
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Built for banking and enterprise environments with security and engineering excellence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {accomplishments.map((accomplishment) => (
            <div
              key={accomplishment.id}
              className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500 hover:border-indigo-600"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  {accomplishment.icon}
                </div>
                <p className="text-slate-700 font-medium leading-relaxed pt-1">
                  {accomplishment.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex flex-wrap gap-4 justify-center">
            <a
              href="https://snyk.io/test/github/vzakharchenko/Forge-Secure-Notes-for-Jira"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform font-semibold"
            >
              <span className="flex items-center gap-2">
                View Snyk Report{/* */}
                <span className="text-sm group-hover:translate-x-1 transition-transform inline-block">
                  ↗
                </span>
              </span>
            </a>
            <a
              href="https://sonarcloud.io/summary/new_code?id=vzakharchenko_Forge-Secure-Notes-for-Jira"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform font-semibold"
            >
              <span className="flex items-center gap-2">
                View SonarCloud{/* */}
                <span className="text-sm group-hover:translate-x-1 transition-transform inline-block">
                  ↗
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
