import React from "react";
import "./App.css";
import {
  CallToAction,
  CodeQuality,
  Features,
  Footer,
  Hero,
  HowItWorks,
  JSMIntegration,
  ProductDemo,
  SecurityModel,
} from "./components";

const App = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <JSMIntegration />
      <Features />
      <SecurityModel />
      <ProductDemo />
      <HowItWorks />
      <CodeQuality />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default App;
