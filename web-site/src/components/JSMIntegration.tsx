import React from "react";

export const JSMIntegration: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, blue 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div>
            <div className="inline-block mb-6 px-4 py-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full">
              <span className="text-blue-700 text-sm font-medium">🎯 Primary Feature</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
              Seamless Jira Service Management Portal Integration
            </h2>

            <p className="text-xl text-slate-700 mb-8 leading-relaxed">
              Share sensitive information securely with your customers directly in JSM portals. The
              same powerful encryption and security features work seamlessly for both portal
              customers and Jira agents.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                  ✨
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900">
                    Automatic Portal Detection
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    The app automatically detects JSM portal context and adapts seamlessly. No
                    configuration needed — it just works whether you're in a standard Jira issue or
                    a customer portal request.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                  🔄
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900">Unified Experience</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Portal customers and Jira agents experience the same powerful secure notes
                    functionality. Customer request keys are automatically mapped to underlying Jira
                    issues for seamless operation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                  🛡️
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900">Enterprise Security</h3>
                  <p className="text-slate-600 leading-relaxed">
                    All security guarantees apply in portal contexts: zero-trust encryption,
                    mandatory authorization, and automatic expiration. Perfect for sharing temporary
                    passwords, access codes, or confidential support information.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 bg-white rounded-lg border border-blue-200 shadow-sm">
                <span className="text-sm font-semibold text-slate-700">✅ Portal Customers</span>
              </div>
              <div className="px-4 py-2 bg-white rounded-lg border border-indigo-200 shadow-sm">
                <span className="text-sm font-semibold text-slate-700">✅ Jira Agents</span>
              </div>
              <div className="px-4 py-2 bg-white rounded-lg border border-purple-200 shadow-sm">
                <span className="text-sm font-semibold text-slate-700">
                  ✅ Auto Context Detection
                </span>
              </div>
            </div>
          </div>

          {/* Right side - Video */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white p-2">
              <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/WbE65Iwv-hE"
                  title="Secure Notes for Jira - JSM Portal Integration"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            {/* Decorative glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-2xl blur-2xl opacity-20 -z-10"></div>
          </div>
        </div>

        {/* Use cases section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">💬</div>
            <h4 className="text-lg font-bold mb-2 text-slate-900">Customer Support</h4>
            <p className="text-slate-600 text-sm">
              Agents can securely share temporary passwords, access codes, or sensitive information
              with customers through portal requests.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">🤝</div>
            <h4 className="text-lg font-bold mb-2 text-slate-900">Internal Communication</h4>
            <p className="text-slate-600 text-sm">
              Team members can exchange confidential information related to customer requests
              without exposing it in public comments.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">📋</div>
            <h4 className="text-lg font-bold mb-2 text-slate-900">Secure Documentation</h4>
            <p className="text-slate-600 text-sm">
              Store sensitive details about customer requests that shouldn't be visible in public
              ticket comments or descriptions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
