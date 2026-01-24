import React from "react";

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
              <img
                src="/app.png"
                alt="Secure Notes for Jira Logo"
                className="w-20 h-20 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="text-5xl">🔐</div>
                    `;
                  }
                }}
              />
            </div>
          </div>

          <div className="inline-block mb-6 px-4 py-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full">
            <span className="text-blue-300 text-sm font-medium">🔒 Zero-Trust Security</span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
              Secure Notes
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
              for Jira
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed font-light">
            Share sensitive information securely within Jira issues and JSM portals.{/* */}
            <span className="text-white font-medium"> Zero-trust encryption</span> with{/* */}
            <span className="text-white font-medium"> burn-after-reading</span> protection.{/* */}
            <br />
            <span className="text-lg text-blue-200 mt-2 block">
              ✨{" "}
              <span className="text-white font-medium">
                Fully integrated with Jira Service Management portals
              </span>{" "}
              — seamless experience for customers and agents
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a
              href="https://marketplace.atlassian.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-4 bg-white text-blue-900 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transform"
            >
              <span className="flex items-center gap-2">
                Get it on Marketplace{/* */}
                <span className="text-xl group-hover:translate-x-1 transition-transform inline-block">
                  →
                </span>
              </span>
            </a>
            <a
              href="https://github.com/vzakharchenko/Forge-Secure-Notes-for-Jira"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-transparent text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 border-2 border-white/30 hover:border-white/60 backdrop-blur-sm"
            >
              View on GitHub
            </a>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-blue-200">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Open Source</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Zero Vulnerabilities</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>85% Test Coverage</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
