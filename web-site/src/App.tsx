// libs
import React from "react";

// styles
import "./App.css";

// components
import { Hero } from "./components";
import { Features } from "./components";
import { Security } from "./components";
import { HowItWorks } from "./components";
import { Screenshots } from "./components";
import { Accordion } from "./components";
import { Accomplishments } from "./components";
import { CTA } from "./components";
import { Footer } from "./components";

const App = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Features />
      <Security />
      <HowItWorks />
      <Screenshots />
      <Accordion />
      <Accomplishments />
      <CTA />
      <Footer />
    </div>
  );
};

export default App;
