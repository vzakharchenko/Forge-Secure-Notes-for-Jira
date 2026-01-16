import React from "react";

const screenshots = [
  {
    src: "/img/screenshot1.png",
    alt: "Creating secure note",
    title: "Create Encrypted Notes",
    description: "Easy-to-use interface for creating secure notes directly in Jira issues",
  },
  {
    src: "/img/screenshot2.png",
    alt: "Decrypting secure note",
    title: "Decrypt with Key",
    description: "Simple decryption process with your unique key",
  },
  {
    src: "/img/screenshot3.png",
    alt: "Secure note decrypted",
    title: "View Content",
    description: "View your secure content with burn-after-reading protection",
  },
  {
    src: "/img/screenshot4.png",
    alt: "Secret notes history",
    title: "Audit Dashboard",
    description: "Comprehensive audit trail and compliance reporting",
  },
];

export const Screenshots: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            See It In Action
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Watch how Secure Notes for Jira works in your daily workflow
          </p>
        </div>

        {/* Video Section */}
        <div className="mb-20">
          <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl overflow-hidden shadow-2xl max-w-5xl mx-auto border-4 border-white">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/1FOlNEBFGfY"
              title="Secure Notes for Jira Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>

        {/* Screenshots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {screenshots.map((screenshot, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100"
            >
              <div className="aspect-video bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 flex items-center justify-center relative overflow-hidden">
                <img
                  src={screenshot.src}
                  alt={screenshot.alt}
                  className="w-full h-full object-cover absolute inset-0 z-10 group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 z-0">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📸</div>
                    <div className="text-lg font-semibold text-slate-700">{screenshot.title}</div>
                    <div className="text-sm mt-2 text-slate-400">Placeholder</div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white">
                <h3 className="font-bold text-xl mb-2 text-slate-900">{screenshot.title}</h3>
                <p className="text-slate-600">{screenshot.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
