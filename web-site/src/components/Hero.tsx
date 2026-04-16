import React from "react";
import { GITHUB_LINK, MARKETPLACE_LINK } from "@src/shared/constants";
import { CheckIcon } from "@src/shared/components/CheckIcon";
import { SectionBadge } from "@src/shared/components/SectionBadge";

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-800 via-indigo-800 to-purple-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        <div className="text-center pt-32 sm:pt-28 pb-10 sm:pb-12">
          {/* Logo with frosted glass + glow */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
                <img
                  src="./app.png"
                  alt="Secure Notes for Jira"
                  className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-3xl blur-2xl opacity-25 -z-10"></div>
            </div>
          </div>

          <h1 className="mb-6 leading-tight">
            <span className="block pb-1 text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
              Secure Notes
            </span>
            <span className="block pb-1 text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
              for Jira
            </span>
          </h1>

          <SectionBadge label="🔒 Zero-Trust Security" className="mb-6" />

          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed font-light">
            Share sensitive information securely within Jira issues and JSM portals.{/* */}
          </p>
          <p className="text-lg md:text-xl mb-8 md:mb-12 text-blue-100 max-w-2xl mx-auto leading-relaxed font-light">
            <span className="text-white font-medium"> Zero-trust encryption</span> with{/* */}
            <span className="text-white font-medium"> burn-after-reading</span> protection.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 md:mb-12">
            <a
              href={MARKETPLACE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-4 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transform"
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

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-blue-200">
            <div className="flex items-center gap-2">
              <CheckIcon />
              <span>Atlassian Marketplace Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon />
              <span>Zero-Trust Architecture</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon />
              <span>No Data Leaves Atlassian</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
