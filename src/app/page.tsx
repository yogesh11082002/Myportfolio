"use client";

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      {/* Add other sections here as they're developed */}
      {/* e.g., <Skills />, <Contact />, etc. */}
    </>
  );
}
