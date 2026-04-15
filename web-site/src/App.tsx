import React from "react";
import "./App.css";
import {
  Accomplishments,
  Accordion,
  CallToAction,
  Features,
  Footer,
  Hero,
  HowItWorks,
  JSMIntegration,
  Screenshots,
  Security,
} from "./components";

const App = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <JSMIntegration />
      <Features />
      <Security />
      <HowItWorks />
      <Screenshots />
      <Accordion />
      <Accomplishments />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default App;
