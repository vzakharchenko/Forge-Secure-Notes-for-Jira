// libs
import React from "react";

// styles
import "./App.css";

// components
import {
  Accomplishments,
  Accordion,
  CallToAction,
  Features,
  Footer,
  Hero,
  HowItWorks,
  Screenshots,
  Security,
} from "./components";

const App = () => {
  // @ts-ignore
  return (
    <div className="min-h-screen bg-white">
      <Hero />
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
