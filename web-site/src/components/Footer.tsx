import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-white font-bold text-xl mb-4">Secure Notes for Jira</h3>
            <p className="text-slate-400 leading-relaxed">
              Zero-trust, burn-after-reading secure notes directly in Jira. Built with Atlassian
              Forge.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold text-xl mb-4">Links</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://github.com/vzakharchenko/Forge-Secure-Notes-for-Jira"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center gap-2 group"
                >
                  <span>GitHub Repository</span>
                  <span className="text-sm group-hover:translate-x-1 transition-transform inline-block">
                    ↗
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://devpost.com/software/secure-notes-for-jira-coegvb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center gap-2 group"
                >
                  <span>Devpost Submission</span>
                  <span className="text-sm group-hover:translate-x-1 transition-transform inline-block">
                    ↗
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://marketplace.atlassian.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center gap-2 group"
                >
                  <span>Atlassian Marketplace</span>
                  <span className="text-sm group-hover:translate-x-1 transition-transform inline-block">
                    ↗
                  </span>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-xl mb-4">Built With</h3>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>React + Vite
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>Atlassian Forge
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>TypeScript
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>Drizzle ORM
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © 2025 Secure Notes for Jira. Open-source project with MIT license.
            </p>
            <p className="text-slate-500 text-sm">
              Submitted to Codegeist 2025: Atlassian Williams Racing Edition
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
