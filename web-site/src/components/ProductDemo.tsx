import React from "react";
import { PRODUCT_DEMO_YOUTUBE_LINK } from "@src/shared/constants";

export const ProductDemo: React.FC = () => {
  return (
    <section
      id="demo"
      className="scroll-mt-28 py-12 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-slate-50 to-white"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 pb-1 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            See It In Action
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Watch how Secure Notes for Jira works in your daily workflow
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            <iframe
              width="100%"
              height="100%"
              src={PRODUCT_DEMO_YOUTUBE_LINK}
              title="Secure Notes for Jira — Full Product Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
          <div className="mt-6 text-center">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">
              Full Product Walkthrough
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Watch how to create encrypted notes, share encryption keys out-of-band, decrypt
              content as a recipient, and use the compliance audit dashboard — all within your
              existing Jira workflow.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
