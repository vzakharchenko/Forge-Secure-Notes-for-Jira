import React from "react";

export const CallToAction: React.FC = () => {
  return (
    <section className="py-24 px-4 relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="container mx-auto max-w-5xl text-center relative z-10">
        <div className="inline-block mb-6 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full">
          <span className="text-white text-sm font-medium">🚀 Ready to Get Started?</span>
        </div>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
          <span className="block">Ready to Secure Your</span>
          <span className="block bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
            Jira Communication?
          </span>
        </h2>

        <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed">
          Start sharing sensitive information securely today.{/* */}
          <span className="text-white font-semibold"> Zero-trust encryption</span>,{/* */}
          <span className="text-white font-semibold"> burn-after-reading</span>, and{/* */}
          <span className="text-white font-semibold"> comprehensive audit trails</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <a
            href="https://marketplace.atlassian.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group px-10 py-5 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-white/50 hover:scale-105 transform text-lg"
          >
            <span className="flex items-center gap-2">
              Install from Marketplace{/* */}
              <span className="text-xl group-hover:translate-x-1 transition-transform inline-block">
                →
              </span>
            </span>
          </a>
          <a
            href="https://github.com/vzakharchenko/Forge-Secure-Notes-for-Jira"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-5 bg-transparent text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300 border-2 border-white/40 hover:border-white backdrop-blur-sm text-lg"
          >
            View Source Code
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-blue-100">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Source-available with Business Source License</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Built for Codegeist 2025</span>
          </div>
        </div>
      </div>
    </section>
  );
};
