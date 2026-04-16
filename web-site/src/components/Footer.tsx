import React from "react";
import {
  DEVPOST_LINK,
  GITHUB_LINK,
  MARKETPLACE_LINK,
  NAV_LINKS,
  PRIVACY_POLICY_LINK,
  SUPPORT_EMAIL,
  TERMS_OF_USE_LINK,
} from "@src/shared/constants";

const resourceLinks = [
  { label: "Atlassian Marketplace", href: MARKETPLACE_LINK, external: true },
  { label: "GitHub Repository", href: GITHUB_LINK, external: true },
  { label: "Devpost Submission", href: DEVPOST_LINK, external: true },
  { label: "Support", href: `mailto:${SUPPORT_EMAIL}`, external: false },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="md:flex md:justify-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="./app.png"
                  alt="Secure Notes for Jira"
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <span className="text-white font-bold text-lg">Secure Notes for Jira</span>
              </div>
              <p className="text-slate-400 leading-relaxed max-w-xs">
                Zero-trust, burn-after-reading secure notes directly in Jira issues and JSM portals.
                <br />
                Built with Atlassian Forge.
              </p>
            </div>
          </div>

          {/* Navigate */}
          <div className="md:flex md:justify-center">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Navigate</h3>
              <ul className="space-y-3">
                {NAV_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <a href={href} className="hover:text-blue-400 transition-colors">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Resources */}
          <div className="md:flex md:justify-center">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-3">
                {resourceLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="hover:text-blue-400 transition-colors flex items-center gap-2 group"
                    >
                      <span>{link.label}</span>
                      <span className="text-sm group-hover:translate-x-1 transition-transform inline-block">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} Secure Notes for Jira. Source-available under Business
              Source License (BSL 1.1).
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a
                href={PRIVACY_POLICY_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href={TERMS_OF_USE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                Terms of Use
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
