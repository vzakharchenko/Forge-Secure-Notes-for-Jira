import React from "react";
import "./App.css";
import {
  CallToAction,
  CodeQuality,
  Features,
  Footer,
  Header,
  Hero,
  HowItWorks,
  JSMIntegration,
  ProductDemo,
  SecurityModel,
} from "./components";

const App = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <JSMIntegration />
        <SecurityModel />
        <ProductDemo />
        <HowItWorks />
        <CodeQuality />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default App;
