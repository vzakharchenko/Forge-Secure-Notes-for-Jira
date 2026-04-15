import React from "react";
import { GITHUB_LINK, MARKETPLACE_LINK } from "@src/shared/constants";
import { CheckIcon } from "@src/shared/components/CheckIcon";
import { SectionBadge } from "@src/shared/components/SectionBadge";

export const CallToAction: React.FC = () => {
  return (
    <section className="py-24 px-4 relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden">
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

      <div className="container mx-auto max-w-7xl text-center relative z-10">
        <SectionBadge label="🚀 Ready to Get Started?" variant="cta" />

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
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
            href={MARKETPLACE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group px-8 py-4 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-white/50 hover:scale-105 transform"
          >
            <span className="flex items-center gap-2">
              Install from Marketplace{/* */}
              <span className="text-xl group-hover:translate-x-1 transition-transform inline-block">
                →
              </span>
            </span>
          </a>
          <a
            href={GITHUB_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-transparent text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 border-2 border-white/40 hover:border-white backdrop-blur-sm"
          >
            View Source Code
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-blue-100">
          <div className="flex items-center gap-2">
            <CheckIcon />
            <span>Source-available with Business Source License</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon />
            <span>Built for Codegeist 2025</span>
          </div>
        </div>
      </div>
    </section>
  );
};
