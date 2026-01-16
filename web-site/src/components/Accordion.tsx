import React, { useState } from "react";

interface AccordionItem {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

const accordionItems: AccordionItem[] = [
  {
    id: "1",
    title: "Create Encrypted Notes",
    description:
      "Easily create secure notes directly in Jira issues. Select recipients, set expiration time, and generate encryption keys all in one place.",
    image: "/img/screenshot1.png",
    imageAlt: "Creating secure note interface",
  },
  {
    id: "2",
    title: "Decrypt with Key",
    description:
      "Recipients receive email notifications with access links. Simply enter the encryption key to decrypt and view the secure content.",
    image: "/img/screenshot2.png",
    imageAlt: "Decryption interface",
  },
  {
    id: "3",
    title: "View Content Securely",
    description:
      "View your secure content with burn-after-reading protection. The note automatically self-destructs after viewing or when expired.",
    image: "/img/screenshot3.png",
    imageAlt: "Viewing secure note content",
  },
  {
    id: "4",
    title: "Audit Dashboard",
    description:
      "Comprehensive audit trail and compliance reporting. Track all activity, export to CSV, and get insights with Rovo AI analytics.",
    image: "/img/screenshot4.png",
    imageAlt: "Audit dashboard interface",
  },
  {
    id: "5",
    title: "Multiple Recipients",
    description:
      "Share secure notes with multiple users simultaneously. Each recipient has independent access tracking and viewing history.",
    image: "/img/screenshot5.png",
    imageAlt: "Multiple recipients interface",
  },
];

export const Accordion: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set([accordionItems[0].id]));

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Features in Detail
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Explore the powerful features of Secure Notes for Jira
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Accordion Items */}
          <div className="space-y-4">
            {accordionItems.map((item) => {
              const isOpen = openItems.has(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between group hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      {isOpen && <p className="text-sm text-slate-600 mt-2">{item.description}</p>}
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <svg
                        className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
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
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6">
                      <div className="mt-4 rounded-lg overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 aspect-video flex items-center justify-center relative">
                        <img
                          src={item.image}
                          alt={item.imageAlt}
                          className="w-full h-full object-cover absolute inset-0 z-10"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-slate-500 z-0">
                          <div className="text-center">
                            <div className="text-6xl mb-4">📸</div>
                            <div className="text-lg font-semibold text-slate-700">{item.title}</div>
                            <div className="text-sm mt-2 text-slate-400">Placeholder Image</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Preview Image */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
              <div className="aspect-video bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-lg overflow-hidden flex items-center justify-center relative">
                {openItems.size > 0 ? (
                  <>
                    <img
                      src={accordionItems.find((item) => openItems.has(item.id))?.image || ""}
                      alt={accordionItems.find((item) => openItems.has(item.id))?.imageAlt || ""}
                      className="w-full h-full object-cover absolute inset-0 z-10"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500 z-0">
                      <div className="text-center">
                        <div className="text-7xl mb-4">📸</div>
                        <div className="text-xl font-semibold text-slate-700">
                          {accordionItems.find((item) => openItems.has(item.id))?.title}
                        </div>
                        <div className="text-sm mt-2 text-slate-400">Placeholder Image</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-slate-400">
                    <div className="text-7xl mb-4">👆</div>
                    <div className="text-lg">Select a feature to preview</div>
                  </div>
                )}
              </div>
              <div className="mt-4 text-center">
                <p className="text-slate-600 text-sm">
                  {openItems.size > 0
                    ? accordionItems.find((item) => openItems.has(item.id))?.description
                    : "Click on any feature above to see a preview"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
