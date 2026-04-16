import React, { useState } from "react";

interface Step {
  id: string;
  number: string;
  icon: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

const steps: Step[] = [
  {
    id: "1",
    number: "01",
    icon: "📝",
    title: "Create Secure Note",
    description:
      "Open any Jira issue or JSM portal request. The 'Secure Notes' panel appears in the issue view — it lists existing notes and provides a 'Create secure note' button to get started.",
    image: "/img/screenshot1.png",
    imageAlt: "Secure Notes panel inside a Jira issue",
  },
  {
    id: "2",
    number: "02",
    icon: "🔑",
    title: "Copy & Share Decryption Key",
    description:
      "Fill in the form: choose recipients, write your secret, set expiration. A decryption key is auto-generated in your browser — it is shown only once and never sent to Atlassian's servers. Copy it immediately and share it with the recipient via Slack, Teams, email, or phone. ⚠️ Never share the key through Jira comments or any Atlassian channel — that would violate Zero Trust.",
    image: "/img/screenshot2.png",
    imageAlt: "Create secure note form with auto-generated decryption key",
  },
  {
    id: "3",
    number: "03",
    icon: "📧",
    title: "Decrypt the Note",
    description:
      "The recipient opens the link from their email notification, enters the decryption key received out-of-band, and clicks 'Decrypt note'. The app verifies their identity — only the designated recipient's Atlassian account can complete decryption. The app itself never has access to the key.",
    image: "/img/screenshot3.png",
    imageAlt: "Secure note decryption page where recipient enters the key",
  },
  {
    id: "4",
    number: "04",
    icon: "👁️",
    title: "View Decrypted Note",
    description:
      "The decrypted content appears with a countdown timer. The note is available only once — click 'Copy and Close' to copy the content and permanently destroy the note. Closing without copying also destroys it. If an expiration was set, the note auto-deletes when the time elapses even if never viewed.",
    image: "/img/screenshot4.png",
    imageAlt: "Decrypted secure note with countdown timer and Copy and Close button",
  },
  {
    id: "5",
    number: "05",
    icon: "📊",
    title: "Track & Audit",
    description:
      "The Audit Dashboard gives full visibility into all note activity — browse by note, issue, or project; expand rows to see the full status timeline (Created → Viewed → Deleted/Expired); export any view to CSV. Admins can see all users. Click 'Ask Rovo' on any audit page to run natural language queries on your data with the built-in Rovo AI agent.",
    image: "/img/screenshot5.png",
    imageAlt: "Audit dashboard showing note activity history",
  },
];

export const HowItWorks: React.FC = () => {
  const [openId, setOpenId] = useState<string>(steps[0].id);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? "" : id));
  };

  const activeStep = steps.find((s) => s.id === openId);

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Five simple steps to share sensitive information securely inside Jira
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step) => {
              const isOpen = openId === step.id;
              return (
                <div
                  key={step.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden"
                >
                  <button
                    onClick={() => toggle(step.id)}
                    className="w-full px-6 py-5 text-left flex items-center gap-4 group hover:bg-slate-50 transition-colors"
                    aria-expanded={isOpen}
                  >
                    {/* Step number badge */}
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all duration-300 ${
                        isOpen
                          ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg"
                          : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600"
                      }`}
                    >
                      <span className="text-base leading-none">{step.icon}</span>
                      <span className="mt-0.5">{step.number}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-xl font-bold transition-colors ${
                          isOpen ? "text-blue-600" : "text-slate-900 group-hover:text-blue-600"
                        }`}
                      >
                        {step.title}
                      </h3>
                      {isOpen && (
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                          {step.description}
                        </p>
                      )}
                    </div>

                    <svg
                      className={`flex-shrink-0 w-5 h-5 text-slate-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-blue-500" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 lg:hidden">
                      <StepPreview step={step} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sticky preview — desktop */}
          <div className="hidden lg:block lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
              {activeStep ? (
                <>
                  <StepPreview step={activeStep} />
                  <div className="mt-4 text-center">
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {activeStep.description}
                    </p>
                  </div>
                </>
              ) : (
                <div className="aspect-video flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <div className="text-6xl mb-3">👆</div>
                    <div className="text-sm">Select a step to preview</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StepPreview: React.FC<{ step: Step }> = ({ step }) => (
  <div className="aspect-video bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl overflow-hidden relative">
    <img
      src={step.image}
      alt={step.imageAlt}
      className="w-full h-full object-cover absolute inset-0 z-10"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
    <div className="absolute inset-0 flex items-center justify-center z-0">
      <div className="text-center">
        <div className="text-7xl mb-3">{step.icon}</div>
        <div className="text-lg font-semibold text-slate-700">{step.title}</div>
        <div className="text-xs mt-1 text-slate-400">Step {step.number}</div>
      </div>
    </div>
  </div>
);
