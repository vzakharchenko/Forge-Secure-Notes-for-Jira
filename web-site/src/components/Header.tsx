import React, { useEffect, useState } from "react";
import { MARKETPLACE_LINK, NAV_LINKS } from "@src/shared/constants";

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = scrolled
    ? "text-slate-600 hover:text-slate-900"
    : "text-white/80 hover:text-white";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-200"
          : "bg-transparent"
      }`}
    >
      {/* Announcement bar */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 py-2 px-4 text-center">
        <p className="text-slate-900 text-sm font-semibold tracking-wide">
          🏆 Winner — Atlassian Codegeist 2025 · Williams Racing Edition
        </p>
      </div>

      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 flex-shrink-0">
            <img
              src="./app.png"
              alt="Secure Notes for Jira"
              className="w-8 h-8 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span
              className={`font-bold text-sm md:text-base transition-colors ${
                scrolled ? "text-slate-900" : "text-white"
              }`}
            >
              Secure Notes for Jira
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors ${linkClass}`}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* CTA + mobile hamburger */}
          <div className="flex items-center gap-3">
            <a
              href={MARKETPLACE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <span className="hidden sm:inline">Install from Marketplace</span>
              <span className="sm:hidden">Install</span>
            </a>

            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                scrolled ? "text-slate-600 hover:bg-slate-100" : "text-white hover:bg-white/10"
              }`}
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 py-3">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-slate-700 font-medium hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
